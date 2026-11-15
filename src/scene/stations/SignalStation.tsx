import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { frame } from '../../lib/store';
import { ACCENT } from '../palette';
import { ANCHORS } from '../rig';
import { applyPresence, presence } from '../presence';

const PULSES = 5;

/** A machined signal gate: a titanium ring that emits pulses toward the viewer. */
export function SignalStation() {
  const root = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const pulses = useRef<THREE.Group>(null);
  const titanium = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#7d858d', metalness: 1, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1 }),
    [],
  );
  const dark = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0d0f12', metalness: 1, roughness: 0.12, clearcoat: 1 }), []);
  const pulseMats = useMemo(
    () =>
      Array.from({ length: PULSES }, () => new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0, toneMapped: false, depthWrite: false })),
    [],
  );

  useFrame((state, dt) => {
    if (!root.current) return;
    const k = presence(5, 0.3, 0.9);
    applyPresence(root.current, k, 0.8);
    root.current.position.x = ANCHORS.signal.x;
    root.current.position.z = ANCHORS.signal.z;
    root.current.position.y = ANCHORS.signal.y + (1 - k) * -0.8;
    if (k <= 0.002) return;
    const t = state.clock.elapsedTime;
    if (ring.current) {
      ring.current.rotation.z += dt * 0.08;
      ring.current.rotation.y = frame.pointer.x * 0.25;
      ring.current.rotation.x = -frame.pointer.y * 0.15;
    }
    pulses.current?.children.forEach((c, i) => {
      const p = (t * 0.22 + i / PULSES) % 1;
      c.scale.setScalar(0.4 + p * 2.6);
      c.position.z = p * 6;
      pulseMats[i].opacity = (1 - p) * 0.55 * Math.min(1, p * 6);
    });
  });

  return (
    <group position={ANCHORS.signal} ref={root}>
      <group ref={ring}>
        <mesh material={titanium}>
          <torusGeometry args={[2.7, 0.22, 48, 160]} />
        </mesh>
        <mesh material={dark}>
          <torusGeometry args={[2.38, 0.07, 24, 160]} />
        </mesh>
        {/* Segmented machined teeth */}
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 3.05, Math.sin(a) * 3.05, 0]} rotation-z={a} material={i % 6 === 0 ? undefined : dark}>
              <boxGeometry args={[i % 6 === 0 ? 0.32 : 0.18, 0.05, 0.12]} />
              {i % 6 === 0 && <meshBasicMaterial color={new THREE.Color(ACCENT).multiplyScalar(2.2)} toneMapped={false} />}
            </mesh>
          );
        })}
        {/* Emitter core */}
        <mesh>
          <sphereGeometry args={[0.42, 64, 32]} />
          <meshPhysicalMaterial color="#d9e4ec" transmission={1} thickness={0.6} roughness={0.03} ior={1.5} clearcoat={1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.16, 32, 16]} />
          <meshBasicMaterial color={new THREE.Color(ACCENT).multiplyScalar(3)} toneMapped={false} />
        </mesh>
      </group>
      <group ref={pulses}>
        {pulseMats.map((m, i) => (
          <mesh key={i} material={m}>
            <torusGeometry args={[1, 0.006, 6, 128]} />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 0, 2]} intensity={8} distance={10} color={ACCENT} />
      <pointLight position={[-4, 4, 4]} intensity={14} distance={16} color="#eef2f6" />
    </group>
  );
}
