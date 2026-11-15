import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SpotLight, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import antonUrl from '@fontsource/anton/files/anton-latin-400-normal.woff?url';
import { frame } from '../../lib/store';
import { ACCENT } from '../palette';
import { ANCHORS } from '../rig';

/**
 * The AI core: a clear glass orb holding a slowly turning neural lattice
 * (icosphere edges with glowing nodes) around a softly pulsing heart.
 */
function AICore() {
  const lattice = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const heart = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);

  const { edges, nodes, innerEdges } = useMemo(() => {
    const outer = new THREE.IcosahedronGeometry(0.82, 1);
    const pos = outer.getAttribute('position');
    const seen = new Map<string, THREE.Vector3>();
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      seen.set(v.toArray().map((n) => n.toFixed(3)).join(','), v);
    }
    return {
      edges: new THREE.EdgesGeometry(outer),
      nodes: [...seen.values()],
      innerEdges: new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.42, 0)),
    };
  }, []);

  const mats = useMemo(
    () => ({
      // Thin clear shell: reflections and a fresnel rim without hiding the lattice inside.
      glass: new THREE.MeshPhysicalMaterial({
        color: '#dff1ff',
        roughness: 0.04,
        metalness: 0,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        iridescence: 0.5,
        iridescenceIOR: 1.3,
        envMapIntensity: 2.4,
        specularIntensity: 1,
      }),
      line: new THREE.LineBasicMaterial({ color: new THREE.Color(ACCENT).multiplyScalar(1.4), transparent: true, opacity: 0.8, toneMapped: false }),
      lineSoft: new THREE.LineBasicMaterial({ color: '#dbe8f2', transparent: true, opacity: 0.6, toneMapped: false }),
      node: new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT).multiplyScalar(2.2), toneMapped: false }),
      heart: new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT).multiplyScalar(3), toneMapped: false }),
      steel: new THREE.MeshPhysicalMaterial({ color: '#c9d0d6', metalness: 1, roughness: 0.18, clearcoat: 1 }),
    }),
    [],
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (lattice.current) {
      lattice.current.rotation.y += dt * 0.12;
      lattice.current.rotation.x = THREE.MathUtils.damp(lattice.current.rotation.x, 0.25 - frame.pointer.y * 0.3, 2, dt);
      lattice.current.rotation.z = THREE.MathUtils.damp(lattice.current.rotation.z, -frame.pointer.x * 0.3, 2, dt);
    }
    if (inner.current) {
      inner.current.rotation.y -= dt * 0.35;
      inner.current.rotation.x += dt * 0.2;
    }
    const pulse = 1 + Math.sin(t * 1.6) * 0.08;
    heart.current?.scale.setScalar(pulse);
    if (halo.current) halo.current.opacity = 0.1 + Math.sin(t * 1.6) * 0.04;
  });

  return (
    <group>
      {/* Glass shell */}
      <mesh material={mats.glass}>
        <sphereGeometry args={[1.3, 96, 64]} />
      </mesh>
      {/* Machined equator ring */}
      <mesh material={mats.steel} rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.36, 0.035, 16, 160]} />
      </mesh>
      {/* Neural lattice */}
      <group ref={lattice}>
        <lineSegments geometry={edges} material={mats.line} />
        {nodes.map((p, i) => (
          <mesh key={i} position={p} material={mats.node}>
            <sphereGeometry args={[0.028, 12, 8]} />
          </mesh>
        ))}
        <group ref={inner}>
          <lineSegments geometry={innerEdges} material={mats.lineSoft} />
        </group>
      </group>
      {/* Heart */}
      <mesh ref={heart} material={mats.heart}>
        <sphereGeometry args={[0.16, 32, 16]} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.45, 32, 16]} />
        <meshBasicMaterial ref={halo} color={ACCENT} transparent opacity={0.1} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Thin orbital data streams with travelling light pulses. */
function DataStreams() {
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
        <mesh key={i} rotation={r.tilt as [number, number, number]} material={material}>
          <torusGeometry args={[r.r, 0.005, 6, 256]} />
        </mesh>
      ))}
    </group>
  );
}


const AVATAR_URL = '/images/sahithi-avatar.webp';
useTexture.preload(AVATAR_URL);

// Avatar plane in world units (image is 626×1400). Palm measured on the image at u≈0.536, v≈0.552 from the top.
const AVATAR_H = 5.5;
const AVATAR_W = AVATAR_H * (626 / 1400);
const AVATAR_Y = -0.25;
const PALM = new THREE.Vector3((0.536 - 0.5) * AVATAR_W, AVATAR_Y + AVATAR_H / 2 - 0.552 * AVATAR_H, 0);

/** Sahithi's avatar, standing in front of the wordmark; fades at the bottom edge and as the camera departs. */
function Avatar({ fade }: { fade: React.RefObject<number> }) {
  const tex = useTexture(AVATAR_URL);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        uniforms: { uMap: { value: tex }, uOpacity: { value: 1 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `
          uniform sampler2D uMap; uniform float uOpacity; varying vec2 vUv;
          void main(){
            vec4 c = texture2D(uMap, vUv);
            // Soft fade into the floor so the cropped legs never show a hard edge.
            float floorFade = smoothstep(0.0, 0.2, vUv.y);
            gl_FragColor = vec4(c.rgb, c.a * floorFade * uOpacity);
            #include <colorspace_fragment>
          }`,
      }),
    [tex],
  );
  useFrame(() => {
    mat.uniforms.uOpacity.value = fade.current ?? 1;
  });
  return (
    <mesh material={mat} position={[0, AVATAR_Y, 0]} renderOrder={2}>
      <planeGeometry args={[AVATAR_W, AVATAR_H]} />
    </mesh>
  );
}

export function CoreStation({ tier }: { tier: 'high' | 'low' }) {
  const core = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  const word = useRef<THREE.Mesh>(null);
  const veil = useRef<THREE.ShaderMaterial>(null);
  const avatarFade = useRef(1);

  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, 0, 0);
    return o;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // As the camera departs, the wordmark dissolves and the core sinks into the floor.
    const leave = THREE.MathUtils.smoothstep(frame.t, 0.04, 0.4);
    // The core hovers just above her open palm.
    if (core.current) core.current.position.y = PALM.y + 0.42 + Math.sin(t * 1.1) * 0.05 - leave * 6;
    avatarFade.current = 1 - THREE.MathUtils.smoothstep(frame.t, 0.04, 0.3);
    const wm = word.current?.material as (THREE.Material & { opacity: number }) | undefined;
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

      <Avatar fade={avatarFade} />
      <group ref={core} position={[PALM.x, PALM.y + 0.42, 0.45]} scale={0.22}>
        <AICore />
        <DataStreams />
      </group>

      <primitive object={target} />
      {tier === 'high' && (
        <SpotLight
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
