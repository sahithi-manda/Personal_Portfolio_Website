import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import antonUrl from '@fontsource/anton/files/anton-latin-400-normal.woff?url';
import monoUrl from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff?url';
import { frame } from '../../lib/store';
import { ACCENT } from '../palette';
import { ANCHORS, GATES, GATE_X } from '../rig';
import { presence } from '../presence';


function Gate({ g, i, compact }: { g: (typeof GATES)[number]; i: number; compact: boolean }) {
  const w = g.major ? 5.2 : 4.2;
  const hgt = g.major ? 3.4 : 2.8;
  const frameMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#8d959d', metalness: 1, roughness: 0.25, clearcoat: 0.8 }),
    [],
  );
  const t = 0.16;
  const edges = useRef<THREE.MeshBasicMaterial[]>([]);
  const title = useRef<THREE.Mesh>(null);
  useFrame(() => {
    // The gate for the card being read lights up; the others rest dim.
    const k = THREE.MathUtils.clamp(1 - Math.abs(frame.roleCam - i), 0, 1);
    edges.current.forEach((m) => m && m.color.setStyle(ACCENT).multiplyScalar(0.2 + k * 2.6));
    const tm = title.current?.material as (THREE.Material & { opacity: number }) | undefined;
    if (tm) {
      tm.transparent = true;
      tm.opacity = 0.35 + 0.65 * k;
    }
  });
  const bars: [number, number, number, number][] = [
    [0, hgt / 2, w + t, t],
    [0, -hgt / 2, w + t, t],
    [-w / 2, 0, t, hgt],
    [w / 2, 0, t, hgt],
  ];
  return (
    <group position={[GATE_X(compact), 0, g.z]} rotation-y={compact ? 0 : -0.18}>
      {bars.map(([x, y, w, h], k) => (
        <mesh key={k} position={[x, y, 0]} material={frameMat}>
          <boxGeometry args={[w, h, 0.35]} />
        </mesh>
      ))}
      {/* Inner light edge */}
      {bars.map(([x, y, w, h], k) => (
        <mesh key={`e${k}`} position={[x * 0.94, y * 0.92, 0.18]}>
          <boxGeometry args={[k < 2 ? w * 0.92 : 0.02, k < 2 ? 0.02 : h * 0.9, 0.02]} />
          <meshBasicMaterial ref={(m) => { if (m) edges.current[k] = m; }} color={ACCENT} toneMapped={false} />
        </mesh>
      ))}
      <Text ref={title} font={antonUrl} fontSize={g.major ? 1.05 : 0.8} position={[w / 2 + 0.1, hgt / 2 + 0.75, 0]} anchorX="right" color="#e9edf0" material-toneMapped={false}>
        {g.title}
      </Text>
      <Text font={monoUrl} fontSize={0.16} letterSpacing={0.12} position={[w / 2 + 0.1, hgt / 2 + 0.2, 0]} anchorX="right" color={ACCENT} material-toneMapped={false}>
        {g.sub}
      </Text>
    </group>
  );
}

/** Light gates, one per experience card; the camera glides to the gate of the card being read. */
export function TimelineStation({ compact = false }: { compact?: boolean }) {
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
        <Gate key={g.title} g={g} i={i} compact={compact} />
      ))}
      {/* Guide rail of light on the floor */}
      <mesh position={[GATE_X(compact), -3.38, -14]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.03, 44]} />
        <meshBasicMaterial color={new THREE.Color(ACCENT).multiplyScalar(1.6)} toneMapped={false} />
      </mesh>
      <pointLight position={[GATE_X(compact), 2.5, -2]} intensity={10} distance={16} color="#e3eaf0" />
      <pointLight position={[GATE_X(compact), 2.5, -18]} intensity={10} distance={16} color="#e3eaf0" />
    </group>
  );
}
