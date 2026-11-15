export type Tier = 'high' | 'low';

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function isSmallScreen(): boolean {
  return window.matchMedia?.('(max-width: 767px)').matches ?? false;
}

export function detectTier(): Tier {
  const forced = new URLSearchParams(window.location.search).get('tier');
  if (forced === 'high' || forced === 'low') return forced;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (coarse || isSmallScreen() || cores <= 4 || mem <= 4) return 'low';
  return 'high';
}

const KEY = 'sr-3d-mode';
export type Mode = '3d' | 'static';

export function readSavedMode(): Mode | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === '3d' || v === 'static' ? v : null;
  } catch {
    return null;
  }
}

export function saveMode(m: Mode) {
  try {
    localStorage.setItem(KEY, m);
  } catch {
    /* storage unavailable */
  }
}
