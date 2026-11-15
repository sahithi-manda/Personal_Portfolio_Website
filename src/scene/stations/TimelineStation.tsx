import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import antonUrl from '@fontsource/anton/files/anton-latin-400-normal.woff?url';
import monoUrl from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff?url';
import { frame } from '../../lib/store';
import { ACCENT } from '../palette';
import { ANCHORS } from '../rig';
import { presence } from '../presence';

const GATES = [
  { z: -8, w: 5.6, h: 3.6, year: '2026', title: 'ISTUDIO', sub: 'AI/ML INTERN · MAR 2026 — PRESENT', major: true },
  { z: -18, w: 5.6, h: 3.6, year: '2025', title: 'LABMENTIX', sub: 'AI/ML INTERN · AUG 2025 — FEB 2026', major: true },
  { z: -27, w: 4.2, h: 2.8, year: '2024', title: 'B.TECH', sub: 'CSE (AI & ML) · SREYAS · 2024 — 2028', major: false },
];

function Gate({ g, i }: { g: (typeof GATES)[number]; i: number }) {
  const edge = useRef<THREE.MeshBasicMaterial>(null);
  const frameMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#8d959d', metalness: 1, roughness: 0.25, clearcoat: 0.8 }),
    [],
  );
  const t = 0.16;
  useFrame((state) => {
    if (!edge.current) return;
    // Gates ignite as the camera approaches them.
    const camZ = state.camera.position.z;
    const d = Math.abs(camZ - (ANCHORS.timeline.z + g.z + 4));
    const k = THREE.MathUtils.clamp(1 - d / 14, 0, 1);
    edge.current.color.setStyle(ACCENT).multiplyScalar(0.25 + k * 2.4);
  });
  const bars: [number, number, number, number][] = [
    [0, g.h / 2, g.w + t, t],
    [0, -g.h / 2, g.w + t, t],
    [-g.w / 2, 0, t, g.h],
    [g.w / 2, 0, t, g.h],
  ];
  return (
    <group position={[[-1.9, 1.9, -1.2][i], 0, g.z]}>
      {bars.map(([x, y, w, h], k) => (
        <mesh key={k} position={[x, y, 0]} material={frameMat}>
          <boxGeometry args={[w, h, 0.35]} />
        </mesh>
      ))}
      {/* Inner light edge */}
      {bars.map(([x, y, w, h], k) => (
        <mesh key={`e${k}`} position={[x * 0.94, y * 0.92, 0.18]}>
          <boxGeometry args={[k < 2 ? w * 0.92 : 0.02, k < 2 ? 0.02 : h * 0.9, 0.02]} />
          <meshBasicMaterial ref={k === 0 ? edge : undefined} color={ACCENT} toneMapped={false} />
        </mesh>
      ))}
      <Text font={antonUrl} fontSize={g.major ? 1.05 : 0.7} position={[-g.w / 2 + 0.35, g.h / 2 + 0.75, 0]} anchorX="left" color="#e9edf0" material-toneMapped={false}>
        {g.title}
      </Text>
      <Text font={monoUrl} fontSize={0.16} letterSpacing={0.12} position={[-g.w / 2 + 0.38, g.h / 2 + 0.2, 0]} anchorX="left" color={ACCENT} material-toneMapped={false}>
        {g.sub}
      </Text>
    </group>
  );
}

/** A corridor of light gates the camera flies through: present → past. */
export function TimelineStation() {
  const root = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!root.current) return;
    const k = Math.max(presence(4, 0.6, 1.0), frame.camT > 4 && frame.camT < 4.6 ? 1 : 0);
    root.current.visible = k > 0.002;
    root.current.scale.setScalar(0.85 + 0.15 * k);
  });
  return (
    <group position={ANCHORS.timeline} ref={root}>
      {GATES.map((g, i) => (
        <Gate key={g.title} g={g} i={i} />
      ))}
      {/* Guide rail of light on the floor */}
      <mesh position={[0, -3.38, -14]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.03, 44]} />
        <meshBasicMaterial color={new THREE.Color(ACCENT).multiplyScalar(1.6)} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 2.5, -6]} intensity={10} distance={16} color="#e3eaf0" />
      <pointLight position={[0, 2.5, -20]} intensity={10} distance={16} color="#e3eaf0" />
    </group>
  );
}
