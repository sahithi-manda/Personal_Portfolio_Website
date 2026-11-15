import { useSyncExternalStore } from 'react';

/**
 * Tiny external store shared by the DOM tree and the WebGL scene.
 * High-frequency values (scroll, pointer) live in `frame` and are read
 * inside useFrame without causing React renders.
 */

export const STATIONS = ['core', 'identity', 'galaxy', 'lab', 'timeline', 'signal'] as const;
export type StationId = (typeof STATIONS)[number];

export const frame = {
  /** Continuous station position: 0 = core … 5 = signal. */
  t: 0,
  /** Camera's smoothed station position (what is actually on screen). */
  camT: 0,
  /** Experience: continuous index of the card being read (0 = IStudio, 1 = Labmentix, 2 = B.Tech). */
  roleT: 0,
  /** Camera-smoothed roleT. */
  roleCam: 0,
  /** Progress within the current station's hold (0..1), for slow dollies. */
  hold: 0,
  pointer: { x: 0, y: 0 },
  /** Camera speed, used for motion-reactive effects. */
  velocity: 0,
};

interface UIState {
  station: number;
  activeLab: number;
  activeRole: number;
  selectedSkill: string | null;
  hoveredSkill: string | null;
  sceneReady: boolean;
  loadProgress: number;
  introDone: boolean;
}

let state: UIState = {
  station: 0,
  activeLab: 0,
  activeRole: 0,
  selectedSkill: 'python',
  hoveredSkill: null,
  sceneReady: false,
  loadProgress: 0,
  introDone: false,
};

const listeners = new Set<() => void>();

export const ui = {
  get: () => state,
  set(partial: Partial<UIState>) {
    let changed = false;
    for (const k in partial) {
      const key = k as keyof UIState;
      if (state[key] !== partial[key]) changed = true;
    }
    if (!changed) return;
    state = { ...state, ...partial };
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useUI<T>(selector: (s: UIState) => T): T {
  return useSyncExternalStore(ui.subscribe, () => selector(state), () => selector(state));
}
