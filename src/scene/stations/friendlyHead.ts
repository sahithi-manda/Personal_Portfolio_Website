import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const smooth01 = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/**
 * Turns the realistic head scan into a friendlier, sculpted android:
 * lifts the mouth corners into a soft smile, then relaxes fine skin detail
 * (wrinkles, creases) with a few passes of Laplacian smoothing.
 * Coordinates are model units; the mouth line sits at y ≈ −0.2, corners at x ≈ ±0.45.
 */
export function makeFriendlyHead(source: THREE.BufferGeometry): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', source.getAttribute('position').clone());
  g.setIndex(source.getIndex()!.clone());
  const geo = mergeVertices(g, 1e-4);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const n = pos.count;

  // 1) Gentle smile: raise and slightly widen the mouth corners and cheeks.
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (z < 1.2) continue;
    const ax = Math.abs(x);
    const corner = smooth01(0.08, 0.45, ax) * (1 - smooth01(0.6, 0.85, ax));
    const lip = Math.exp(-Math.pow((y + 0.22) / 0.2, 2));
    const cheek = smooth01(0.3, 0.6, ax) * (1 - smooth01(0.95, 1.25, ax)) * Math.exp(-Math.pow((y - 0.35) / 0.3, 2));
    pos.setY(i, y + corner * lip * 0.26 + cheek * 0.08);
    pos.setX(i, x + Math.sign(x) * corner * lip * 0.05);
  }

  // 2) Laplacian smoothing (uniform weights) to soften scan detail.
  const index = geo.getIndex()!;
  const neighbours: Set<number>[] = Array.from({ length: n }, () => new Set<number>());
  for (let f = 0; f < index.count; f += 3) {
    const a = index.getX(f);
    const b = index.getX(f + 1);
    const c = index.getX(f + 2);
    neighbours[a].add(b).add(c);
    neighbours[b].add(a).add(c);
    neighbours[c].add(a).add(b);
  }
  const arr = pos.array as Float32Array;
  const tmp = new Float32Array(arr.length);
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < n; i++) {
      const nb = neighbours[i];
      if (!nb.size) {
        tmp[i * 3] = arr[i * 3];
        tmp[i * 3 + 1] = arr[i * 3 + 1];
        tmp[i * 3 + 2] = arr[i * 3 + 2];
        continue;
      }
      let sx = 0;
      let sy = 0;
      let sz = 0;
      nb.forEach((j) => {
        sx += arr[j * 3];
        sy += arr[j * 3 + 1];
        sz += arr[j * 3 + 2];
      });
      const k = 0.45;
      tmp[i * 3] = arr[i * 3] + k * (sx / nb.size - arr[i * 3]);
      tmp[i * 3 + 1] = arr[i * 3 + 1] + k * (sy / nb.size - arr[i * 3 + 1]);
      tmp[i * 3 + 2] = arr[i * 3 + 2] + k * (sz / nb.size - arr[i * 3 + 2]);
    }
    arr.set(tmp);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}
