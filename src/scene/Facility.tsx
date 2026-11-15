import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { Tier } from '../lib/quality';
import { ACCENT } from './palette';

const FLOOR_Y = -3.4;

/** Studio-grade image-based lighting built from area-light "Lightformers" (no external HDRI). */
export function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1} environmentIntensity={0.85}>
      <color attach="background" args={['#050608']} />
      {/* Key softbox, overhead and slightly left */}
      <Lightformer form="rect" intensity={3.2} color="#f2f4f7" position={[-4, 6, 3]} rotation-x={Math.PI / 2.4} scale={[10, 4, 1]} />
      {/* Long rim strips that draw crisp lines on chrome */}
      <Lightformer form="rect" intensity={4} color={ACCENT} position={[7, 0.5, -1]} rotation-y={-Math.PI / 2} scale={[0.35, 10, 1]} />
      <Lightformer form="rect" intensity={2.2} color="#dfe7ef" position={[-7, 1, -2]} rotation-y={Math.PI / 2} scale={[0.25, 10, 1]} />
      {/* Back ring for edge separation */}
      <Lightformer form="ring" intensity={1.6} color="#c8d3de" position={[0, 2, -9]} scale={4} />
      {/* Faint warm floor bounce */}
      <Lightformer form="rect" intensity={0.5} color="#b89a7a" position={[0, -6, 0]} rotation-x={-Math.PI / 2} scale={[12, 12, 1]} />
    </Environment>
  );
}

/** Architectural ribs along the flight path, floor, and ceiling light strips. */
export function Facility({ tier }: { tier: Tier }) {
  const count = 30;
  const pillars = useRef<THREE.InstancedMesh>(null);
  const beams = useRef<THREE.InstancedMesh>(null);
  const strips = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < count; i++) {
      const z = 14 - i * 6.6;
      const half = 11 + Math.sin(i * 0.7) * 0.6;
      pillars.current!.setMatrixAt(i * 2, m.compose(new THREE.Vector3(-half, 2.6, z), q, s));
      pillars.current!.setMatrixAt(i * 2 + 1, m.compose(new THREE.Vector3(half, 2.6, z), q, s));
      beams.current!.setMatrixAt(i, m.compose(new THREE.Vector3(0, 8.6, z), q, new THREE.Vector3(half * 2 + 1.2, 1, 1)));
      strips.current!.setMatrixAt(i * 2, m.compose(new THREE.Vector3(-half + 0.62, 2.6, z), q, s));
      strips.current!.setMatrixAt(i * 2 + 1, m.compose(new THREE.Vector3(half - 0.62, 2.6, z), q, s));
    }
    [pillars, beams, strips].forEach((r) => (r.current!.instanceMatrix.needsUpdate = true));
  }, []);

  const metal = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#15181c', metalness: 0.85, roughness: 0.42, clearcoat: 0.4, clearcoatRoughness: 0.4 }),
    [],
  );
  const strip = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#000', emissive: new THREE.Color('#dce8f2'), emissiveIntensity: 1.6, toneMapped: false }),
    [],
  );

  return (
    <group>
      <instancedMesh ref={pillars} args={[undefined, undefined, count * 2]} material={metal} castShadow={false}>
        <boxGeometry args={[1.1, 12, 1.1]} />
      </instancedMesh>
      <instancedMesh ref={beams} args={[undefined, undefined, count]} material={metal}>
        <boxGeometry args={[1, 0.9, 1.4]} />
      </instancedMesh>
      <instancedMesh ref={strips} args={[undefined, undefined, count * 2]} material={strip}>
        <boxGeometry args={[0.05, 9, 0.06]} />
      </instancedMesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y, -80]} receiveShadow>
        <planeGeometry args={[40, 220]} />
        {tier === 'high' ? (
          <MeshReflectorMaterial
            resolution={512}
            blur={[400, 120]}
            mixBlur={1.2}
            mixStrength={1.6}
            mirror={0.6}
            roughness={0.9}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#0a0b0d"
            metalness={0.6}
          />
        ) : (
          <meshStandardMaterial color="#0b0c0e" metalness={0.7} roughness={0.5} />
        )}
      </mesh>
      {/* Floor guide lines */}
      <mesh rotation-x={-Math.PI / 2} position={[-2.6, FLOOR_Y + 0.01, -80]}>
        <planeGeometry args={[0.02, 220]} />
        <meshBasicMaterial color="#2a3036" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[2.6, FLOOR_Y + 0.01, -80]}>
        <planeGeometry args={[0.02, 220]} />
        <meshBasicMaterial color="#2a3036" />
      </mesh>
    </group>
  );
}

/** GPU-animated atmospheric dust that catches the light. */
export function Dust({ count }: { count: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    let seed = 11;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    const r = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (rand() - 0.5) * 24;
      p[i * 3 + 1] = rand() * 11 - 3.2;
      p[i * 3 + 2] = 16 - rand() * 196;
      r[i] = rand();
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(r, 1));
    return g;
  }, [count]);

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color('#cfdbe6') } }}
        vertexShader={/* glsl */ `
          uniform float uTime;
          attribute float aRand;
          varying float vAlpha;
          void main() {
            vec3 p = position;
            float t = uTime * (0.05 + aRand * 0.08);
            p.x += sin(t + aRand * 31.0) * 0.6;
            p.y += mod(t * 0.9 + aRand * 11.0, 11.0) - 5.5 + sin(t * 2.0 + aRand * 7.0) * 0.2;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            float d = -mv.z;
            gl_PointSize = (0.8 + aRand * 2.2) * (24.0 / d);
            vAlpha = smoothstep(42.0, 6.0, d) * smoothstep(0.4, 2.5, d) * (0.25 + aRand * 0.55);
          }`}
        fragmentShader={/* glsl */ `
          uniform vec3 uColor;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(uColor, a * vAlpha);
          }`}
      />
    </points>
  );
}
