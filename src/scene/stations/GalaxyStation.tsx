import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import monoUrl from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff?url';
import { frame, ui, useUI } from '../../lib/store';
import { skills, systems, type Skill, type SkillSystem } from '../../content/skills';
import { ACCENT } from '../palette';
import { ANCHORS } from '../rig';

const SYSTEM_ORDER = Object.keys(systems) as SkillSystem[];

interface Placed {
  skill: Skill;
  pos: THREE.Vector3;
}

function layout(): { placed: Placed[]; hubs: Record<SkillSystem, THREE.Vector3> } {
  const hubs = {} as Record<SkillSystem, THREE.Vector3>;
  SYSTEM_ORDER.forEach((s, i) => {
    const a = (i / SYSTEM_ORDER.length) * Math.PI * 2 + 0.3;
    hubs[s] = new THREE.Vector3(Math.cos(a) * 3.6, Math.sin(i * 1.7) * 0.9, Math.sin(a) * 2.6);
  });
  const placed: Placed[] = [];
  SYSTEM_ORDER.forEach((s) => {
    const members = skills.filter((k) => k.system === s);
    members.forEach((skill, j) => {
      const a = (j / members.length) * Math.PI * 2 + s.length;
      const r = 0.75 + (skill.weight - 1) * 0.28;
      const pos = hubs[s].clone().add(new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 1.3) * 0.55, Math.sin(a) * r));
      placed.push({ skill, pos });
    });
  });
  return { placed, hubs };
}

function Star({ p, glass, focusSystem }: { p: Placed; glass: THREE.Material; focusSystem?: SkillSystem }) {
  const selected = useUI((s) => s.selectedSkill === p.skill.id);
  const hovered = useUI((s) => s.hoveredSkill === p.skill.id);
  const inFocus = focusSystem === p.skill.system;
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const label = useRef<THREE.Mesh>(null);
  const base = 0.2 - (p.skill.weight - 1) * 0.045;
  const accent = useMemo(() => new THREE.Color(ACCENT), []);
  const white = useMemo(() => new THREE.Color('#cfd6dd'), []);

  useFrame((state, dt) => {
    if (!group.current || !core.current) return;
    const on = selected || hovered;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + p.pos.x) * 0.04;
    const s = THREE.MathUtils.damp(group.current.scale.x, (on ? 1.6 : 1) * pulse, 6, dt);
    group.current.scale.setScalar(s);
    core.current.color.lerp(on ? accent : white, 0.12);
    core.current.color.multiplyScalar(1);
    const lm = label.current?.material as THREE.MeshBasicMaterial | undefined;
    if (lm) lm.opacity = THREE.MathUtils.damp(lm.opacity, on ? 1 : inFocus ? 0.65 : 0, 6, dt);
  });

  return (
    <group position={p.pos}>
      <group
        ref={group}
        onPointerOver={(e) => {
          e.stopPropagation();
          ui.set({ hoveredSkill: p.skill.id });
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (ui.get().hoveredSkill === p.skill.id) ui.set({ hoveredSkill: null });
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          ui.set({ selectedSkill: p.skill.id });
        }}
      >
        <mesh material={glass}>
          <sphereGeometry args={[base, 32, 24]} />
        </mesh>
        <mesh>
          <sphereGeometry args={[base * 0.42, 16, 12]} />
          <meshBasicMaterial ref={core} toneMapped={false} color="#cfd6dd" />
        </mesh>
        {selected && (
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[base * 1.9, 0.006, 6, 64]} />
            <meshBasicMaterial color={ACCENT} toneMapped={false} />
          </mesh>
        )}
      </group>
      <Billboard>
        <Text
          ref={label}
          font={monoUrl}
          fontSize={0.13}
          position={[0, -base - 0.2, 0]}
          color={selected ? ACCENT : '#dfe5ea'}
          anchorX="center"
          anchorY="top"
          material-transparent
          material-toneMapped={false}
          fillOpacity={1}
        >
          {p.skill.name.toUpperCase()}
        </Text>
      </Billboard>
    </group>
  );
}

/** Interactive constellation of technologies, grouped into systems. */
export function GalaxyStation() {
  const group = useRef<THREE.Group>(null);
  const { placed, hubs } = useMemo(() => layout(), []);
  const selectedId = useUI((s) => s.selectedSkill);
  const selectedSystem = skills.find((s) => s.id === selectedId)?.system;

  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#dbe4ec',
        metalness: 0,
        roughness: 0.04,
        transmission: 1,
        thickness: 0.35,
        ior: 1.52,
        clearcoat: 1,
        envMapIntensity: 1.8,
        attenuationColor: new THREE.Color(ACCENT),
        attenuationDistance: 0.6,
      }),
    [],
  );

  const lines = useMemo(() => {
    const out: { sys: SkillSystem; geo: THREE.BufferGeometry }[] = [];
    SYSTEM_ORDER.forEach((s) => {
      const pts = [hubs[s].clone()];
      placed.filter((p) => p.skill.system === s).forEach((p) => pts.push(p.pos.clone(), hubs[s].clone()));
      out.push({ sys: s, geo: new THREE.BufferGeometry().setFromPoints(pts) });
    });
    return out;
  }, [placed, hubs]);

  const spine = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    SYSTEM_ORDER.forEach((s) => pts.push(new THREE.Vector3(0, 0, 0), hubs[s].clone()));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [hubs]);

  useFrame((state, dt) => {
    if (!group.current) return;
    const near = Math.abs(frame.t - 2) < 0.92;
    group.current.visible = near;
    if (!near) return;
    group.current.rotation.y += dt * 0.03;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.18 + frame.pointer.y * 0.1, 2, dt);
    void state;
  });

  return (
    <group position={ANCHORS.galaxy}>
      <group ref={group}>
        {/* Galactic core */}
        <mesh>
          <icosahedronGeometry args={[0.32, 3]} />
          <meshPhysicalMaterial color="#0c0e11" metalness={1} roughness={0.15} clearcoat={1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.5, 32, 16]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.05} toneMapped={false} />
        </mesh>
        <lineSegments geometry={spine}>
          <lineBasicMaterial color="#39424b" transparent opacity={0.6} />
        </lineSegments>
        {lines.map(({ sys, geo }) => (
          <line key={sys}>
            <primitive object={geo} attach="geometry" />
            <lineBasicMaterial
              color={sys === selectedSystem ? ACCENT : '#4a545e'}
              transparent
              opacity={sys === selectedSystem ? 0.9 : 0.45}
              toneMapped={false}
            />
          </line>
        ))}
        {SYSTEM_ORDER.map((s) => (
          <Billboard key={s} position={hubs[s].clone().add(new THREE.Vector3(0, 1.35, 0))}>
            <Text font={monoUrl} fontSize={0.11} letterSpacing={0.2} color={s === selectedSystem ? ACCENT : '#7d8893'} material-toneMapped={false}>
              {systems[s].label.toUpperCase()}
            </Text>
          </Billboard>
        ))}
        {placed.map((p) => (
          <Star key={p.skill.id} p={p} glass={glass} focusSystem={selectedSystem} />
        ))}
      </group>
      <pointLight position={[0, 2, 4]} intensity={10} distance={14} color="#e7eef4" />
    </group>
  );
}
