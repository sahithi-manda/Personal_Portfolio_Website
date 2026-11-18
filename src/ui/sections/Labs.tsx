import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { labs, type Lab } from '../../content/labs';
import { ui, useUI } from '../../lib/store';
import { ScrollTrigger, scrollToY } from '../../lib/scroll';
import { isSmallScreen, prefersReducedMotion } from '../../lib/quality';
import { Arrow, ArrowUpRight, SectionLabel, Shell } from './common';
import { Dossier } from './Dossier';
import { Archive } from './Archive';
import { LabMotif } from './LabMotif';

/** Share of the section's scroll used for the cards' fly-in assembly. */
const INTRO = 0.12;
const N = labs.length;
const EASE = [0.2, 0.8, 0.2, 1] as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Deterministic "scattered in deep space" pose for each card before assembly. */
function scatterPose(i: number) {
  const r = (k: number) => {
    const x = Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  return { x: (r(1) - 0.5) * 2.8, y: (r(2) - 0.5) * 1.6, z: -1500 - r(3) * 1700, rx: (r(4) - 0.5) * 110, ry: (r(5) - 0.5) * 150, rz: (r(6) - 0.5) * 70 };
}

export function Labs({ is3D }: { is3D: boolean }) {
  void is3D; // reel works identically with and without the WebGL scene
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const target = useRef({ pos: 0, assemble: 0 });
  const current = useRef({ pos: 0, assemble: 0 });
  const raf = useRef(0);
  const loop = useRef<() => void>(() => {});
  const lastT = useRef(0);
  const inView = useRef(false);
  const active = useUI((s) => s.activeLab);
  const [open, setOpen] = useState<Lab | null>(null);
  const [launching, setLaunching] = useState<number | null>(null);
  const lab = labs[active];
  const scatter = useMemo(() => labs.map((_, i) => scatterPose(i)), []);

  /** Write every card's transform for a reel position and assembly amount. */
  const apply = useCallback(
    (pos: number, assemble: number) => {
      const st = stage.current;
      const first = cards.current[0];
      if (!st || !first) return;
      const W = first.offsetWidth;
      const H = st.offsetHeight;
      const small = isSmallScreen();
      const spread = small ? 0.78 : 0.62;
      for (let i = 0; i < N; i++) {
        const el = cards.current[i];
        if (!el) continue;
        const d = i - pos;
        const ad = Math.abs(d);
        const sgn = Math.sign(d);
        // Arc ("reel") pose: neighbours swing back on Y and recede in depth.
        const ax = sgn * (Math.min(ad, 1) * spread + Math.max(ad - 1, 0) * 0.3) * W;
        const az = -ad * 230;
        const ary = -clamp(d, -3, 3) * 26;
        const as = 1 - Math.min(ad, 3) * 0.05;
        // Fully opaque near the centre so nothing ghosts through the focused card mid-transition.
        const aop = ad > 3.4 ? 0 : clamp(1 - Math.max(ad - 0.6, 0) * 0.34, 0, 1);
        // Assembly: each card flies in from its scattered pose, slightly staggered.
        const t = easeOut(clamp(assemble * 1.45 - (i / Math.max(N - 1, 1)) * 0.45));
        const s = scatter[i];
        const x = lerp(s.x * W, ax, t);
        const y = lerp(s.y * H, 0, t);
        const z = lerp(s.z, az, t);
        const rx = lerp(s.rx, 0, t);
        const ry = lerp(s.ry, ary, t);
        const rz = lerp(s.rz, 0, t);
        const op = aop * clamp(t * 1.6);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${as.toFixed(3)})`;
        el.style.opacity = op.toFixed(3);
        el.style.zIndex = String(1000 - Math.round(ad * 100));
        el.style.filter = !small && ad > 1.4 && t > 0.95 ? `blur(${Math.min((ad - 1.4) * 2, 4).toFixed(1)}px)` : 'none';
        el.style.pointerEvents = op < 0.15 ? 'none' : 'auto';
        el.dataset.active = String(Math.round(pos) === i && t > 0.9);
      }
    },
    [scatter],
  );

  /** Damped animation loop: gives scroll a little cinematic inertia. Runs only while needed. */
  const tick = useCallback(() => {
    const c = current.current;
    const tg = target.current;
    // Time-based damping: the same feel at 30, 60 or 120 fps.
    const now = performance.now();
    const dt = Math.min((now - (lastT.current || now - 16)) / 1000, 0.1);
    lastT.current = now;
    const k = prefersReducedMotion() ? 1 : 1 - Math.exp(-dt * 9);
    c.pos = lerp(c.pos, tg.pos, k);
    c.assemble = lerp(c.assemble, tg.assemble, k);
    apply(c.pos, c.assemble);
    const settled = Math.abs(c.pos - tg.pos) < 0.001 && Math.abs(c.assemble - tg.assemble) < 0.001;
    raf.current = settled && !inView.current ? 0 : requestAnimationFrame(() => loop.current());
    if (!raf.current) lastT.current = 0;
    if (settled) {
      c.pos = tg.pos;
      c.assemble = tg.assemble;
    }
  }, [apply]);

  useEffect(() => {
    loop.current = tick;
  }, [tick]);

  const kick = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(() => loop.current());
  }, []);

  useEffect(() => {
    if (!track.current) return;
    const reduced = prefersReducedMotion();
    const st = ScrollTrigger.create({
      trigger: track.current,
      start: 'top top',
      end: 'bottom bottom',
      onToggle: (self) => {
        inView.current = self.isActive;
        kick();
      },
      onUpdate: (self) => {
        const p = self.progress;
        target.current.assemble = reduced ? 1 : clamp(p / INTRO);
        target.current.pos = clamp((p - INTRO) / (1 - INTRO)) * (N - 1);
        const idx = Math.round(target.current.pos);
        if (idx !== ui.get().activeLab) ui.set({ activeLab: idx });
        kick();
      },
    });
    // Initial pose (e.g. when the page loads mid-section).
    target.current.assemble = reduced ? 1 : clamp(st.progress / INTRO);
    current.current = { ...target.current };
    apply(current.current.pos, current.current.assemble);
    const onResize = () => apply(current.current.pos, current.current.assemble);
    window.addEventListener('resize', onResize);
    return () => {
      st.kill();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      window.removeEventListener('resize', onResize);
    };
  }, [apply, kick]);

  const jump = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const idx = clamp(i, 0, N - 1);
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    scrollToY(top + (INTRO + (idx / Math.max(N - 1, 1)) * (1 - INTRO)) * span);
  }, []);

  /** Active card zooms toward the camera, then the dossier opens. */
  const launch = (i: number) => {
    if (prefersReducedMotion()) return setOpen(labs[i]);
    setLaunching(i);
    window.setTimeout(() => setOpen(labs[i]), 380);
    window.setTimeout(() => setLaunching(null), 700);
  };

  // Keyboard: ← / → step through projects while the reel is on screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inView.current || open) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); jump(ui.get().activeLab + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); jump(ui.get().activeLab - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [jump, open]);

  // Touch: horizontal swipe on the reel.
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(e.clientY - s.y)) jump(ui.get().activeLab + (dx < 0 ? 1 : -1));
  };

  // Subtle pointer tilt on the active card (fine pointers only).
  const onTilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--tilt-y', `${(((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--tilt-x', `${(-((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(2)}deg`);
  };
  const resetTilt = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg');
    e.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <section id="lab" data-station="lab" className="relative" aria-labelledby="lab-title">
      <div ref={track} style={{ height: `${N * 70 + 130}svh` }} className="relative">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden lg:flex-row lg:items-center">
          <div className="scrim-left pointer-events-none absolute inset-0 hidden lg:block" aria-hidden />
          <Shell className="relative flex h-full w-full flex-col justify-center py-16 lg:py-0">
            <div className="grid h-full items-center gap-4 lg:grid-cols-12 lg:gap-10">
              {/* Copy */}
              <div className="order-2 lg:order-1 lg:col-span-5">
                <SectionLabel index={4}>Digital laboratory</SectionLabel>
                <h2 id="lab-title" className="sr-only">
                  Selected projects
                </h2>

                <AnimatePresence mode="wait">
                  <motion.article
                    key={lab.id}
                    initial="hide"
                    animate="show"
                    exit="out"
                    variants={{ hide: {}, show: { transition: { staggerChildren: 0.05 } }, out: { opacity: 0, y: -12, transition: { duration: 0.22 } } }}
                    className="mt-5 lg:mt-8"
                    aria-live="polite"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="display inline-flex overflow-hidden text-4xl text-accent sm:text-7xl">
                        <motion.span variants={{ hide: { y: '100%' }, show: { y: 0, transition: { duration: 0.55, ease: EASE } } }}>
                          {String(active + 1).padStart(2, '0')}
                        </motion.span>
                      </span>
                      <motion.span className="eyebrow" variants={{ hide: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
                        {lab.code} · {lab.kicker}
                      </motion.span>
                    </div>

                    <h3 className="display mt-2 text-3xl sm:mt-4 sm:text-6xl">
                      {lab.title.split(' ').map((w, wi) => (
                        <span key={wi} className="mr-[0.22em] inline-flex overflow-hidden pb-[0.06em]">
                          <motion.span variants={{ hide: { y: '110%' }, show: { y: 0, transition: { duration: 0.6, ease: EASE } } }}>{w}</motion.span>
                        </span>
                      ))}
                    </h3>
                    <motion.div
                      className="mt-3 h-px origin-left bg-accent"
                      variants={{ hide: { scaleX: 0, opacity: 1 }, show: { scaleX: [0, 1, 1], opacity: [1, 1, 0.25], transition: { duration: 1.1, ease: EASE } } }}
                      aria-hidden
                    />

                    <motion.p
                      variants={{ hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                      className="mt-4 line-clamp-2 max-w-lg text-sm leading-relaxed text-bone/80 sm:line-clamp-none sm:text-[15px]"
                    >
                      {lab.overview}
                    </motion.p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {lab.stack.map((t, ti) => (
                        <motion.span
                          key={t}
                          variants={{ hide: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                          className={`chip ${ti >= 4 ? 'hidden sm:inline-flex' : ''}`}
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>
                    {lab.results && (
                      <motion.dl variants={{ hide: { opacity: 0 }, show: { opacity: 1 } }} className="mt-5 hidden flex-wrap gap-x-8 gap-y-3 sm:flex">
                        {lab.results.map((r) => (
                          <div key={r.label}>
                            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{r.label}</dt>
                            <dd className="display mt-1 text-3xl">{r.value}</dd>
                          </div>
                        ))}
                      </motion.dl>
                    )}
                    <motion.div variants={{ hide: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="mt-5 flex flex-wrap gap-3 sm:mt-7">
                      <button className="btn-primary" onClick={() => launch(active)}>
                        Open dossier <Arrow />
                      </button>
                      <a className="btn-ghost" href={lab.github} target="_blank" rel="noopener noreferrer">
                        GitHub <ArrowUpRight />
                      </a>
                      {lab.live && (
                        <a className="btn-ghost" href={lab.live} target="_blank" rel="noopener noreferrer">
                          Live demo <ArrowUpRight />
                        </a>
                      )}
                    </motion.div>
                  </motion.article>
                </AnimatePresence>
              </div>

              {/* Reel */}
              <div className="order-1 flex flex-col lg:order-2 lg:col-span-7">
                <div
                  ref={stage}
                  className="reel-stage relative h-[34svh] w-full sm:h-[42svh] lg:h-[58svh]"
                  onPointerDown={onPointerDown}
                  onPointerUp={onPointerUp}
                  role="group"
                  aria-label="Project reel. Use left and right arrow keys to browse."
                >
                  <div className="reel-plane">
                    {labs.map((l, i) => (
                      <div
                        key={l.id}
                        ref={(el) => {
                          cards.current[i] = el;
                        }}
                        className="reel-card"
                        data-launch={launching === i}
                        style={{ opacity: 0 }}
                      >
                        <div
                          className="reel-inner"
                          role="button"
                          tabIndex={Math.abs(i - active) <= 1 ? 0 : -1}
                          aria-label={i === active ? `Open ${l.title} dossier` : `Show ${l.title}`}
                          onClick={() => (i === active ? launch(i) : jump(i))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              if (i === active) launch(i);
                              else jump(i);
                            }
                          }}
                          onPointerMove={i === active ? onTilt : undefined}
                          onPointerLeave={resetTilt}
                        >
                          <LabMotif kind={l.specimen} seed={i + 1} />
                          <span className="reel-ghost" aria-hidden>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
                            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent sm:text-[10px]">{l.code}</span>
                            <div>
                              <p className="display max-w-[70%] text-xl leading-[0.95] sm:text-2xl">{l.title}</p>
                              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-mute sm:text-[10px]">
                                {l.results?.[0] ? `${l.results[0].label} · ${l.results[0].value}` : l.kicker}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rail */}
                <div className="mt-3 flex items-center justify-center gap-1 lg:mt-6" role="tablist" aria-label="Projects">
                  {labs.map((l, i) => (
                    <button
                      key={l.id}
                      role="tab"
                      aria-selected={i === active}
                      aria-label={`${String(i + 1).padStart(2, '0')} ${l.title}`}
                      onClick={() => jump(i)}
                      className="group flex h-8 items-center px-1"
                    >
                      <span className={`block h-0.5 transition-all duration-500 ${i === active ? 'w-8 bg-accent' : 'w-3 bg-line group-hover:bg-bone/50'}`} />
                    </button>
                  ))}
                  <span className="ml-3 font-mono text-[10px] tracking-[0.18em] text-dim">
                    {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </Shell>
        </div>
      </div>

      <AnimatePresence>
        {launching !== null && (
          <motion.div
            className="reel-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <Archive />
      <Dossier lab={open} onClose={() => setOpen(null)} />
    </section>
  );
}
