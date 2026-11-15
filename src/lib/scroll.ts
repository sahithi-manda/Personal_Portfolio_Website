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
 * While a section fills the viewport the camera "holds" at its station
 * (with a slow dolly), then flies to the next one as the section leaves.
 */
export function initStationTracking() {
  let sections: HTMLElement[] = [];
  let tops: number[] = [];
  let heights: number[] = [];

  const measure = () => {
    sections = STATIONS.map((id) => document.querySelector<HTMLElement>(`[data-station="${id}"]`)).filter(
      (el): el is HTMLElement => !!el,
    );
    tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
    heights = sections.map((s) => s.offsetHeight);
  };

  const update = () => {
    if (!sections.length) return;
    const vh = window.innerHeight;
    const probe = window.scrollY + vh * 0.5;
    let i = 0;
    while (i < sections.length - 1 && probe >= tops[i + 1]) i++;
    const frac = clamp01((probe - tops[i]) / Math.max(1, heights[i]));
    // Travel window: the last part of a section (scaled so short sections still travel smoothly).
    // Fly over roughly the last screen of each section (at least 45% of it), so travel is unhurried.
    const travelStart = Math.min(0.55, Math.max(0.2, 1 - vh / heights[i]));
    const move = i < sections.length - 1 ? ease(clamp01((frac - travelStart) / (1 - travelStart))) : 0;
    frame.t = i + move;
    frame.hold = clamp01(frac / Math.max(0.01, travelStart));
    ui.set({ station: Math.round(frame.t) });
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
