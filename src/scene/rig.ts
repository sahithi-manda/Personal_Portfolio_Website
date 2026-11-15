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
    { pos: v(0, 0.3, -103 + back), look: v(0, 0.1, -140), dolly: v(0, 0, -36), fov: 44 },
    { pos: v(0, 0.4, -154 + back), look: v(0, 0.2, -168), dolly: v(0, 0, -1.2), fov: 38 },
  ];
  // Compact: face each object head-on so it sits centred behind the copy.
  if (compact) {
    keys.forEach((key) => (key.pos.x = key.look.x));
    // Lift the hero avatar's face above the stacked name block.
    keys[0].look.y = -0.7;
    keys[0].pos.y = -0.5;
  }
  return keys;
}
