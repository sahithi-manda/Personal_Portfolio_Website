import * as THREE from 'three';

/** World anchor for each station, in order: core, identity, galaxy, lab, timeline, signal. */
export const ANCHORS = {
  core: new THREE.Vector3(0, 0, 0),
  identity: new THREE.Vector3(5.2, 0.2, -30),
  galaxy: new THREE.Vector3(3.8, 0.6, -62),
  lab: new THREE.Vector3(3.0, -1.1, -92),
  timeline: new THREE.Vector3(0, 0, -118),
  signal: new THREE.Vector3(0, 0.2, -168),
};

/** Experience gates, relative to the timeline anchor; one per card, in reading order. */
export const GATES = [
  { z: -6, title: 'ISTUDIO', sub: 'AI/ML INTERN · MAR 2026 — PRESENT', major: true },
  { z: -17, title: 'LABMENTIX', sub: 'AI/ML INTERN · AUG 2025 — FEB 2026', major: true },
  { z: -28, title: 'B.TECH', sub: 'CSE (AI & ML) · SREYAS', major: false },
];
export const GATE_X = (compact: boolean) => (compact ? 0 : 3.4);

/** Camera pose in front of the gate for the card being read (continuous between gates). */
export function timelinePose(roleT: number, compact: boolean, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  const i = Math.min(Math.floor(roleT), GATES.length - 2);
  const f = THREE.MathUtils.clamp(roleT - i, 0, 1);
  const z = THREE.MathUtils.lerp(GATES[i].z, GATES[i + 1].z, f) + ANCHORS.timeline.z;
  const gx = GATE_X(compact);
  outPos.set(compact ? 0 : 0.2, compact ? 0.2 : 0.6, z + (compact ? 14 : 11));
  outLook.set(gx * 0.3, compact ? -1.6 : 0.4, z);
}

export interface CamKey {
  pos: THREE.Vector3;
  look: THREE.Vector3;
  /** Camera drift applied over the station's hold. */
  dolly: THREE.Vector3;
  fov: number;
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export function buildKeys(compact: boolean): CamKey[] {
  // On narrow screens objects are centred behind the text and the camera sits further back.
  const k = compact ? 0 : 1;
  const back = compact ? 3.5 : 0;
  const keys: CamKey[] = [
    { pos: v(0, 0.1, 10 + back), look: v(0, -0.05, 0), dolly: v(0, -0.15, -1.6), fov: 32 },
    { pos: v(1.2 * k, 0.6, -20 + back), look: v(2.6 * k + (1 - k) * 5.2, 0.1, -30), dolly: v(0.6, 0, -1.4), fov: 38 },
    { pos: v(0.3 * k, 1.1, -48 + back), look: v(1.7 * k + (1 - k) * 3.8, 0.5, -62), dolly: v(0, 0, -1.2), fov: 40 },
    { pos: v(0.2 * k, 0.6, -84 + back), look: v(1.4 * k + (1 - k) * 3.0, -0.4, -92), dolly: v(0, -0.2, -0.8), fov: 36 },
    { pos: v(0, 0, 0), look: v(0, 0, 0), dolly: v(0, 0, 0), fov: 42 }, // timeline: pose follows the card being read
    { pos: v(0, 0.4, -154 + back), look: v(0, 0.2, -168), dolly: v(0, 0, -1.2), fov: 38 },
  ];
  // Compact: face each object head-on so it sits centred behind the copy.
  if (compact) {
    // Phones: each object sits centred in the upper half of the screen, above the copy,
    // with the camera pulled back far enough to frame it whole.
    const extraBack = [0, 1.5, 6, 1.5, 0, 2.5];
    keys.forEach((key, i) => {
      key.pos.x = key.look.x;
      key.pos.z += extraBack[i];
      key.look.y -= 1.5;
    });
    // Lift the hero avatar's face above the stacked name block.
    keys[0].look.y = -0.7;
    keys[0].pos.y = -0.5;
  }
  timelinePose(0, compact, keys[4].pos, keys[4].look);
  return keys;
}
