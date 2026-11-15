import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { frame } from '../../lib/store';
import { ACCENT } from '../palette';
import { ANCHORS } from '../rig';

const LAYERS = [6, 10, 14, 10, 6];
const SPACING = 1.55;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** A layered neural network in 3D: glass-capped nodes, synapses with travelling signals. */
export function IdentityStation() {
  const group = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const shells = useRef<THREE.InstancedMesh>(null);

  const { points, layerOf, edgeGeo, total } = useMemo(() => {
    const rand = rng(7);
    const pts: THREE.Vector3[] = [];
    const layerOf: number[] = [];
    const layerStart: number[] = [];
    LAYERS.forEach((n, li) => {
      layerStart.push(pts.length);
      const x = (li - (LAYERS.length - 1) / 2) * SPACING;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + li * 0.4;
        const r = 0.55 + n * 0.11 + (rand() - 0.5) * 0.25;
        pts.push(new THREE.Vector3(x + (rand() - 0.5) * 0.25, Math.sin(a) * r * 0.85, Math.cos(a) * r));
        layerOf.push(li);
      }
    });
    const pos: number[] = [];
    const t: number[] = [];
    const seed: number[] = [];
    const layerAttr: number[] = [];
    for (let li = 0; li < LAYERS.length - 1; li++) {
      for (let a = 0; a < LAYERS[li]; a++) {
        const ia = layerStart[li] + a;
        for (let c = 0; c < 4; c++) {
          const ib = layerStart[li + 1] + Math.floor(rand() * LAYERS[li + 1]);
          const s = rand();
          pos.push(pts[ia].x, pts[ia].y, pts[ia].z, pts[ib].x, pts[ib].y, pts[ib].z);
          t.push(0, 1);
          seed.push(s, s);
          layerAttr.push(li, li);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aT', new THREE.Float32BufferAttribute(t, 1));
    g.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1));
    g.setAttribute('aLayer', new THREE.Float32BufferAttribute(layerAttr, 1));
    return { points: pts, layerOf, edgeGeo: g, total: pts.length };
  }, []);

  const edgeMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uActive: { value: 0 }, uColor: { value: new THREE.Color(ACCENT) } },
        vertexShader: `
          attribute float aT; attribute float aSeed; attribute float aLayer;
          varying float vT; varying float vSeed; varying float vLayer;
          void main(){ vT=aT; vSeed=aSeed; vLayer=aLayer; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `
          uniform float uTime; uniform float uActive; uniform vec3 uColor;
          varying float vT; varying float vSeed; varying float vLayer;
          void main(){
            float lit = smoothstep(0.0, 1.0, uActive - vLayer);
            float p = fract(uTime * (0.25 + vSeed * 0.35) + vSeed * 9.0);
            float pulse = smoothstep(0.08, 0.0, abs(vT - p));
            vec3 base = mix(vec3(0.16,0.18,0.2), uColor * 0.5, lit);
            float a = 0.10 + lit * 0.2 + pulse * (0.35 + lit * 0.9);
            gl_FragColor = vec4(base + uColor * pulse * (0.6 + lit * 1.8), a);
          }`,
      }),
    [],
  );

  const shellMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#c9d2da',
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.9,
        thickness: 0.2,
        ior: 1.45,
        clearcoat: 1,
        envMapIntensity: 1.6,
      }),
    [],
  );

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    points.forEach((p, i) => {
      m.makeTranslation(p.x, p.y, p.z);
      nodes.current!.setMatrixAt(i, m);
      shells.current!.setMatrixAt(i, m);
    });
    nodes.current!.instanceMatrix.needsUpdate = true;
    shells.current!.instanceMatrix.needsUpdate = true;
  }, [points]);

  const col = useMemo(() => new THREE.Color(), []);
  const accent = useMemo(() => new THREE.Color(ACCENT).multiplyScalar(3), []);
  const dim = useMemo(() => new THREE.Color('#3a4148'), []);
  const active = useRef(0);

  useFrame((state, dt) => {
    const near = Math.abs(frame.t - 1) < 1.2;
    if (group.current) group.current.visible = near;
    if (!near) return;
    edgeMat.uniforms.uTime.value += dt;
    // Layers light up as the identity section is read.
    const target = Math.abs(frame.t - 1) < 0.5 ? 0.6 + frame.hold * LAYERS.length : frame.t < 1 ? 0 : LAYERS.length;
    active.current = THREE.MathUtils.damp(active.current, target, 2.5, dt);
    edgeMat.uniforms.uActive.value = active.current;
    for (let i = 0; i < total; i++) {
      const lit = THREE.MathUtils.clamp(active.current - layerOf[i], 0, 1);
      col.copy(dim).lerp(accent, lit);
      nodes.current!.setColorAt(i, col);
    }
    if (nodes.current!.instanceColor) nodes.current!.instanceColor.needsUpdate = true;
    if (group.current) {
      group.current.rotation.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.12) * 0.25 + frame.pointer.x * 0.15;
      group.current.rotation.x = 0.12 + frame.pointer.y * 0.08;
    }
  });

  return (
    <group position={ANCHORS.identity}>
      <group ref={group}>
        <lineSegments geometry={edgeGeo} material={edgeMat} frustumCulled={false} />
        <instancedMesh ref={nodes} args={[undefined, undefined, total]}>
          <sphereGeometry args={[0.045, 16, 12]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
        <instancedMesh ref={shells} args={[undefined, undefined, total]} material={shellMat}>
          <sphereGeometry args={[0.11, 24, 16]} />
        </instancedMesh>
      </group>
      <pointLight position={[0, 3, 3]} intensity={8} distance={12} color="#dfe8f0" />
    </group>
  );
}
