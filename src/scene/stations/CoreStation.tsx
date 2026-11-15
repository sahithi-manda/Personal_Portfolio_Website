import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SpotLight, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import antonUrl from '@fontsource/anton/files/anton-latin-400-normal.woff?url';
import { frame } from '../../lib/store';
import { ACCENT } from '../palette';
import { ANCHORS } from '../rig';

useGLTF.preload('/models/head.glb');

// Measured from the scan (model units): eyes at x≈±0.78, y≈1.4; neck spans y −1…−2.
const NECK_CUT = -1.55;
const HEAD_SCALE = 0.62;

/** Black-chrome physical material with a travelling ice-blue scan band injected into the shader. */
function useAndroidMaterial() {
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uAccent: { value: new THREE.Color(ACCENT) } }), []);
  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
      color: '#0a0c0f',
      metalness: 1,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.25,
    });
    m.onBeforeCompile = (shader) => {
      shader.defines = { ...(shader.defines ?? {}), NECK_CUT: NECK_CUT.toFixed(2) };
      shader.uniforms.uTime = uniforms.uTime;
      shader.uniforms.uAccent = uniforms.uAccent;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vObjPos;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = position;');
      // Cut the scan at the neck so it reads as a sculpted android head, not a bust.
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        'void main() {\n  if (vObjPos.y < NECK_CUT) discard;',
      );
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;\nuniform vec3 uAccent;\nvarying vec3 vObjPos;')
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
          float scanY = mod(uTime * 1.1, 11.0) - 5.0;
          float band = exp(-pow((vObjPos.y - scanY) * 7.0, 2.0));
          totalEmissiveRadiance += uAccent * band * 0.35;`,
        );
    };
    return m;
  }, [uniforms]);
  return { material, uniforms };
}

function Goggles() {
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: ACCENT,
        metalness: 0.2,
        roughness: 0.04,
        transmission: 0.35,
        thickness: 0.3,
        ior: 1.5,
        iridescence: 0.9,
        iridescenceIOR: 1.7,
        iridescenceThicknessRange: [200, 600],
        emissive: new THREE.Color(ACCENT),
        emissiveIntensity: 0.9,
        clearcoat: 1,
        envMapIntensity: 2.2,
      }),
    [],
  );
  const chrome = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#d5dade', metalness: 1, roughness: 0.1, clearcoat: 1 }),
    [],
  );
  const rubber = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#08090a', metalness: 0.3, roughness: 0.55, clearcoat: 0.3 }), []);
  const strap = useMemo(() => {
    const gap = 0.9; // radians either side of the face
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = gap + (i / 64) * (Math.PI * 2 - gap * 2);
      pts.push(new THREE.Vector3(Math.sin(a) * 1.9, 1.5, 0.15 + Math.cos(a) * 2.1));
    }
    // Run the ends forward into the lens housings.
    pts.unshift(new THREE.Vector3(1.38, 1.47, 1.86));
    pts.push(new THREE.Vector3(-1.38, 1.47, 1.86));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 96, 0.075, 10, false);
  }, []);
  const lens = (x: number) => (
    <group position={[x, 1.45, 1.98]} rotation={[-0.06, x > 0 ? 0.28 : -0.28, 0]}>
      <mesh material={chrome}>
        <torusGeometry args={[0.6, 0.1, 32, 96]} />
      </mesh>
      <mesh material={chrome} position-z={-0.12} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.62, 0.66, 0.24, 64, 1, true]} />
      </mesh>
      <mesh material={glass} scale={[1, 1, 0.32]} position-z={-0.04}>
        <sphereGeometry args={[0.56, 64, 32]} />
      </mesh>
    </group>
  );
  return (
    <group>
      {lens(-0.8)}
      {lens(0.8)}
      <mesh material={chrome} position={[0, 1.5, 2.22]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.06, 0.06, 0.42, 16]} />
      </mesh>
      {/* Head strap: wraps the back of the head and meets the lenses at the temples */}
      <mesh material={rubber} geometry={strap} />
    </group>
  );
}

/** Machined collar where the neck is cut. */
function Collar() {
  const steel = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#9aa1a8', metalness: 1, roughness: 0.22, clearcoat: 0.6 }),
    [],
  );
  const ring = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#000', emissive: new THREE.Color(ACCENT), emissiveIntensity: 2.2, toneMapped: false }),
    [],
  );
  return (
    <group position={[0, NECK_CUT, -0.42]} scale={[1.06, 1, 1]}>
      <mesh material={steel} rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.5, 0.09, 20, 96]} />
      </mesh>
      <mesh material={ring} position-y={-0.16} rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.42, 0.022, 8, 128]} />
      </mesh>
      <mesh material={steel} position-y={-0.55}>
        <cylinderGeometry args={[1.38, 1.1, 0.75, 64, 1, true]} />
      </mesh>
    </group>
  );
}

/** Thin orbital data streams with travelling light pulses. */
function DataStreams() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const rings = useMemo(
    () => [
      { r: 2.35, tilt: [Math.PI / 2 - 0.22, 0, 0.12], speed: 0.6, phase: 0 },
      { r: 2.75, tilt: [Math.PI / 2 + 0.18, 0, -0.1], speed: -0.45, phase: 2 },
    ],
    [],
  );
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(ACCENT) } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `
          uniform float uTime; uniform vec3 uColor; varying vec2 vUv;
          void main(){
            float x = vUv.x;
            float pulse = 0.0;
            for (int i = 0; i < 3; i++) {
              float p = fract(uTime * 0.07 + float(i) * 0.333);
              float d = fract(x - p + 1.0);
              pulse += smoothstep(0.12, 0.0, d) * smoothstep(0.0, 0.004, d);
            }
            float base = 0.07;
            gl_FragColor = vec4(uColor * (base + pulse * 2.2), base + pulse);
          }`,
      }),
    [],
  );
  useFrame((_, dt) => {
    material.uniforms.uTime.value += dt;
  });
  return (
    <group>
      {rings.map((r, i) => (
        <mesh key={i} rotation={r.tilt as [number, number, number]} material={material} ref={i === 0 ? (mat as never) : undefined}>
          <torusGeometry args={[r.r, 0.005, 6, 256]} />
        </mesh>
      ))}
    </group>
  );
}

export function CoreStation({ tier }: { tier: 'high' | 'low' }) {
  const { scene } = useGLTF('/models/head.glb');
  const { material, uniforms } = useAndroidMaterial();
  const head = useRef<THREE.Group>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const root = useRef<THREE.Group>(null);
  const word = useRef<THREE.Mesh>(null);
  const veil = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    let g: THREE.BufferGeometry | null = null;
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && !g) g = (o as THREE.Mesh).geometry;
    });
    return g as unknown as THREE.BufferGeometry;
  }, [scene]);

  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, 0, 0);
    return o;
  }, []);

  useFrame((state, dt) => {
    uniforms.uTime.value += dt;
    if (!head.current) return;
    const t = state.clock.elapsedTime;
    const px = frame.pointer.x;
    const py = frame.pointer.y;
    head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, -0.38 + px * 0.42, 2.2, dt);
    head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, -py * 0.16 + 0.03, 2.2, dt);
    // As the camera departs, the wordmark dissolves and the head sinks into the floor.
    const leave = THREE.MathUtils.smoothstep(frame.t, 0.04, 0.4);
    head.current.position.y = Math.sin(t * 0.6) * 0.06 - leave * 6;
    const wm = word.current?.material as THREE.Material & { opacity: number } | undefined;
    if (wm) {
      wm.transparent = true;
      wm.opacity = 1 - THREE.MathUtils.smoothstep(frame.t, 0.02, 0.22);
    }
    if (veil.current) veil.current.uniforms.uFade.value = 1 - THREE.MathUtils.smoothstep(frame.t, 0.02, 0.22);
    if (root.current) root.current.visible = frame.t < 0.6;
  });

  return (
    <group position={ANCHORS.core} ref={root}>
      <Text
        ref={word}
        font={antonUrl}
        fontSize={5.2}
        letterSpacing={0.01}
        position={[0, 1.15, -5.2]}
        anchorX="center"
        anchorY="middle"
        material-toneMapped={false}
        color="#1d86c8"
        fillOpacity={1}
      >
        SAHITHI
      </Text>
      {/* Gradient veil that fades the lower half of the wordmark into the dark, as in an editorial cover */}
      <mesh position={[0, -0.6, -5.0]}>
        <planeGeometry args={[30, 6]} />
        <shaderMaterial
          ref={veil}
          transparent
          depthWrite={false}
          uniforms={{ uFade: { value: 1 } }}
          vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `}
          fragmentShader={`uniform float uFade; varying vec2 vUv; void main(){ float a = smoothstep(0.98, 0.2, vUv.y); gl_FragColor = vec4(0.02,0.024,0.03, a * uFade);} `}
        />
      </mesh>

      <group ref={head}>
        <group scale={HEAD_SCALE} position-y={-1.2 * HEAD_SCALE}>
          <mesh geometry={geometry} material={material} castShadow />
          <Goggles />
          <Collar />
        </group>
      </group>
      <DataStreams />

      <primitive object={target} />
      {tier === 'high' && (
        <SpotLight
          ref={spot}
          position={[-2.5, 7.5, 2]}
          target={target}
          angle={0.42}
          penumbra={0.8}
          distance={16}
          attenuation={11}
          anglePower={4.5}
          intensity={60}
          color="#e6eef5"
          opacity={0.12}
        />
      )}
      <pointLight position={[3.5, 0.6, 2.4]} intensity={6} distance={9} color={ACCENT} />
    </group>
  );
}
