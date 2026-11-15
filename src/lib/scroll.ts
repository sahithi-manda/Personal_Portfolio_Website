import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { frame, ui, STATIONS } from './store';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function initSmoothScroll(enabled: boolean) {
  if (!enabled || lenis) return () => {};
  // Lerp-based smoothing feels softer and more continuous than fixed-duration wheel tweens.
  lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9, touchMultiplier: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Pause smooth scrolling while a modal owns the scroll. */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 2.2, easing: easeInOutCubic });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.4, easing: easeInOutCubic });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

// Gentle S-curve: flights start and land softly.
const ease = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * Maps document scroll to a continuous station coordinate.
 * Each section has an "arrive" point (its top reaches the middle of the screen)
 * and a "hold until" point (by default about a screen before its end, or the
 * centre of the element named in data-hold-until). The camera holds between
 * the two, then flies on an S-curve to the next section's arrive point, so a
 * flight can carry across the boundary instead of being squeezed into it.
 */
export function initStationTracking() {
  let arrive: number[] = [];
  let holdEnd: number[] = [];

  const measure = () => {
    const vh = window.innerHeight;
    const sections = STATIONS.map((id) => document.querySelector<HTMLElement>(`[data-station="${id}"]`)).filter(
      (el): el is HTMLElement => !!el,
    );
    const abs = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
    arrive = sections.map((s, i) => (i === 0 ? -Infinity : abs(s) + vh * 0.25));
    holdEnd = sections.map((s, i) => {
      const top = abs(s);
      const bottom = top + s.offsetHeight;
      const sel = s.dataset.holdUntil;
      const anchor = sel ? s.querySelector<HTMLElement>(sel) : null;
      if (anchor) {
        const r = anchor.getBoundingClientRect();
        return abs(anchor) + Math.min(r.height, vh) * 0.5 + vh * 0.1;
      }
      // Hero holds for the first ~10% of a screen of scrolling.
      return i === 0 ? top + vh * 0.6 : Math.max(top + vh * 0.5, bottom - vh * 0.6);
    });
    // Leave at least ~0.9 of a screen of scrolling for every flight.
    const maxProbe = document.documentElement.scrollHeight - vh * 0.5 - 2;
    for (let i = 0; i < arrive.length - 1; i++) {
      if (arrive[i + 1] - holdEnd[i] < vh * 0.9) arrive[i + 1] = holdEnd[i] + vh * 0.9;
      // Every station must be reachable, even at the very bottom of the page.
      arrive[i + 1] = Math.min(arrive[i + 1], maxProbe);
      holdEnd[i] = Math.min(holdEnd[i], arrive[i + 1] - vh * 0.3);
    }
  };

  const update = () => {
    if (!arrive.length) return;
    const probe = window.scrollY + window.innerHeight * 0.5;
    let i = 0;
    while (i < arrive.length - 1 && probe >= arrive[i + 1]) i++;
    let t = i;
    let hold = 1;
    if (probe < holdEnd[i]) {
      const from = Number.isFinite(arrive[i]) ? arrive[i] : holdEnd[i] - window.innerHeight;
      hold = clamp01((probe - from) / Math.max(1, holdEnd[i] - from));
    } else if (i < arrive.length - 1) {
      t = i + ease(clamp01((probe - holdEnd[i]) / Math.max(1, arrive[i + 1] - holdEnd[i])));
    }
    frame.t = t;
    frame.hold = hold;
    ui.set({ station: Math.round(t) });
  };

  measure();
  update();
  const onResize = () => {
    measure();
    update();
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', onResize);
  const ro = new ResizeObserver(onResize);
  ro.observe(document.body);
  return () => {
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', onResize);
    ro.disconnect();
  };
}

export { gsap, ScrollTrigger };
