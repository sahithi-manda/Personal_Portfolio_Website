import * as THREE from 'three';
import { frame } from '../lib/store';

const ease = (x: number) => 1 - Math.pow(1 - x, 3);

/**
 * 0…1 visibility for a station, driven by the camera's smoothed position so
 * objects materialise as the camera arrives and dissolve as it leaves,
 * instead of popping in and out.
 */
export function presence(center: number, inner = 0.45, outer = 0.98): number {
  const d = Math.abs(frame.camT - center);
  return ease(1 - THREE.MathUtils.smoothstep(d, inner, outer));
}

/** Applies a presence value to a group: scales it in with a slight rise, hides it when gone. */
export function applyPresence(group: THREE.Object3D | null, k: number, rise = 0.6) {
  if (!group) return;
  group.visible = k > 0.002;
  group.scale.setScalar(0.6 + 0.4 * k);
  group.position.y = (1 - k) * -rise;
}
