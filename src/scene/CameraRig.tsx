import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { frame, ui } from '../lib/store';
import { buildKeys } from './rig';

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpLookA = new THREE.Vector3();
const tmpLookB = new THREE.Vector3();

/** Flies the camera between station keys, adds hold-dolly, crane arc and pointer parallax. */
export function CameraRig({ compact }: { compact: boolean }) {
  const keys = useMemo(() => buildKeys(compact), [compact]);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const pos = useRef(new THREE.Vector3().copy(keys[0].pos).add(new THREE.Vector3(0, 0.6, 9)));
  const look = useRef(new THREE.Vector3().copy(keys[0].look));
  const smoothT = useRef(0);
  const pointer = useRef(new THREE.Vector2());
  const intro = useRef(0);
  const last = useRef(new THREE.Vector3());

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    // Intro push-in once the scene is ready.
    if (ui.get().sceneReady) intro.current = Math.min(1, intro.current + dt / 3.2);
    const introE = 1 - Math.pow(1 - intro.current, 4);

    smoothT.current = (window as Window & { __snapCamera?: boolean }).__snapCamera
      ? frame.t
      : THREE.MathUtils.damp(smoothT.current, frame.t, 3.2, dt);
    const t = THREE.MathUtils.clamp(smoothT.current, 0, keys.length - 1);
    const i = Math.min(Math.floor(t), keys.length - 2);
    const f = t - i;
    const a = keys[i];
    const b = keys[i + 1];
    const holdA = f > 0.001 ? 1 : frame.hold;

    tmpA.copy(a.pos).addScaledVector(a.dolly, holdA);
    tmpB.copy(b.pos);
    tmpA.lerp(tmpB, f);
    // Crane arc during transit.
    tmpA.y += Math.sin(f * Math.PI) * 1.4;
    tmpA.x += Math.sin(f * Math.PI) * (i % 2 === 0 ? -1.2 : 1.2);

    tmpLookA.copy(a.look).addScaledVector(a.dolly, a.dolly.z < -10 ? holdA : 0);
    tmpLookB.copy(b.look);
    tmpLookA.lerp(tmpLookB, f);

    // Intro: start further back and higher.
    tmpA.z += (1 - introE) * 9;
    tmpA.y += (1 - introE) * 1.2;

    pointer.current.x = THREE.MathUtils.damp(pointer.current.x, frame.pointer.x, 2.5, dt);
    pointer.current.y = THREE.MathUtils.damp(pointer.current.y, frame.pointer.y, 2.5, dt);
    tmpA.x += pointer.current.x * 0.45;
    tmpA.y += pointer.current.y * 0.25;

    pos.current.copy(tmpA);
    look.current.copy(tmpLookA);
    camera.position.copy(pos.current);
    camera.lookAt(look.current);

    const fov = THREE.MathUtils.lerp(a.fov, b.fov, f) + (1 - introE) * -6;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    frame.velocity = last.current.distanceTo(camera.position) / Math.max(dt, 1e-3);
    last.current.copy(camera.position);
  });

  return null;
}
