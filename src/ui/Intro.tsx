import { useEffect, useRef, useState } from 'react';
import { lockScroll } from '../lib/scroll';
import { INTRO_SESSION_KEY as SESSION_KEY } from '../lib/quality';

/**
 * Entry sequence: each phrase is rasterised to particles, fades in, then
 * "vaporises" left to right into drifting dust tinted with the accent.
 * Plays once per browser session; click, tap or any key skips it.
 */

const PHRASES = ['Hello, World.', 'Intelligence · Vision · Language.', 'Sahithi Reddy.'];
const FADE_IN = 0.35; // s
const HOLD = 0.55; // s
const SWEEP = 0.9; // s for the vapor front to cross the text
const ACCENT: [number, number, number] = [92, 200, 255];

interface P {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  a0: number;
  live: boolean;
  quick: boolean;
  tint: number;
}

export function Intro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    lockScroll(true);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: P[] = [];
    let left = 0;
    let width = 0;
    let idx = 0;
    let phase: 'in' | 'hold' | 'vapor' = 'in';
    let clock = 0;
    let raf = 0;
    let last = 0;
    let img: ImageData | null = null;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      cancelAnimationFrame(raf);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* storage unavailable */
      }
      setLeaving(true);
      window.setTimeout(() => {
        lockScroll(false);
        onDone();
      }, 750);
    };

    const build = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const size = w < 600 ? 34 : w < 1000 ? 56 : 80;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = `600 ${size * dpr}px "Inter Tight Variable", "Inter Tight", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const text = PHRASES[idx];
      // Shrink long phrases to fit narrow screens.
      const maxW = canvas.width * 0.88;
      const measured = ctx.measureText(text).width;
      if (measured > maxW) ctx.font = `600 ${Math.floor((size * dpr * maxW) / measured)}px "Inter Tight Variable", "Inter Tight", system-ui, sans-serif`;
      const tw = ctx.measureText(text).width;
      left = canvas.width / 2 - tw / 2;
      width = tw;
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const step = Math.max(1, Math.round(dpr));
      particles = [];
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const a = data[(y * canvas.width + x) * 4 + 3];
          if (a > 24) {
            const a0 = a / 255;
            particles.push({ ox: x, oy: y, x, y, vx: 0, vy: 0, a: a0, a0, live: false, quick: Math.random() > 0.8, tint: 0 });
          }
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      img = ctx.createImageData(canvas.width, canvas.height);
      phase = 'in';
      clock = 0;
    };

    const draw = (alphaScale: number) => {
      if (!img) return;
      const buf = img.data;
      buf.fill(0);
      const W = canvas.width;
      const H = canvas.height;
      for (const p of particles) {
        const a = p.a * alphaScale;
        if (a <= 0.01) continue;
        const px = p.x | 0;
        const py = p.y | 0;
        if (px < 0 || py < 0 || px >= W || py >= H) continue;
        const i = (py * W + px) * 4;
        const t = p.tint;
        buf[i] = 255 + (ACCENT[0] - 255) * t;
        buf[i + 1] = 255 + (ACCENT[1] - 255) * t;
        buf[i + 2] = 255 + (ACCENT[2] - 255) * t;
        buf[i + 3] = Math.min(255, buf[i + 3] + a * 255);
      }
      ctx.putImageData(img, 0, 0);
    };

    const tick = (ts: number) => {
      const dt = Math.min((ts - (last || ts)) / 1000, 0.05);
      last = ts;
      clock += dt;

      if (phase === 'in') {
        draw(Math.min(1, clock / FADE_IN));
        if (clock >= FADE_IN) {
          phase = 'hold';
          clock = 0;
        }
      } else if (phase === 'hold') {
        draw(1);
        if (clock >= HOLD) {
          phase = 'vapor';
          clock = 0;
        }
      } else {
        const front = left + width * Math.min(1, clock / SWEEP);
        const spread = 2.2 * dpr;
        let alive = false;
        for (const p of particles) {
          if (p.ox <= front) {
            if (!p.live) {
              p.live = true;
              const ang = Math.random() * Math.PI * 2;
              const sp = (Math.random() + 0.5) * spread;
              p.vx = Math.cos(ang) * sp + spread * 0.6; // drift with the sweep
              p.vy = Math.sin(ang) * sp - spread * 0.4; // and slightly upward
            }
            p.tint = Math.min(1, p.tint + dt * 3);
            if (p.quick) p.a = Math.max(0, p.a - dt * 2.5);
            else {
              p.vx += (Math.random() - 0.5) * spread * 0.6;
              p.vy += (Math.random() - 0.5) * spread * 0.6;
              p.vx *= 0.96;
              p.vy *= 0.96;
              p.x += p.vx * dt * 22;
              p.y += p.vy * dt * 14;
              p.a = Math.max(0, p.a - dt * 0.9);
            }
          }
          if (p.a > 0.01) alive = true;
        }
        draw(1);
        if (clock >= SWEEP && !alive) {
          idx++;
          if (idx >= PHRASES.length) {
            finish();
            return;
          }
          build();
        }
      }
      raf = requestAnimationFrame(tick);
    };

    let cancelled = false;
    // Wait for the web font so the particles take the right letterforms.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      build();
      raf = requestAnimationFrame(tick);
    });

    const skip = () => finish();
    window.addEventListener('keydown', skip);
    const onResize = () => !doneRef.current && build();
    window.addEventListener('resize', onResize);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('resize', onResize);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[120] cursor-pointer bg-ink transition-opacity duration-700 ${leaving ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      onClick={() => {
        if (!doneRef.current) window.dispatchEvent(new KeyboardEvent('keydown'));
      }}
      role="presentation"
      aria-hidden
    >
      <canvas ref={canvasRef} className="absolute inset-0 block" />
      <p className="absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.24em] text-bone/25">
        Click anywhere to skip
      </p>
    </div>
  );
}
