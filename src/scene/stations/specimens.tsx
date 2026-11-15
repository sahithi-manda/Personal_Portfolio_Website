import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ACCENT } from '../palette';

import type { Mats } from './materials';

/* LAB-01: face scan point cloud ----------------------------------------- */

export function FaceScan({ active }: { active: boolean }) {
  const { scene } = useGLTF('/models/head.glb');
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    let src: THREE.BufferGeometry | null = null;
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && !src) src = (o as THREE.Mesh).geometry;
    });
    const g = new THREE.BufferGeometry();
    const p = (src as unknown as THREE.BufferGeometry).getAttribute('position');
    const keep: number[] = [];
    for (let i = 0; i < p.count; i++) if (p.getY(i) > -1.55) keep.push(p.getX(i), p.getY(i), p.getZ(i));
    g.setAttribute('position', new THREE.Float32BufferAttribute(keep, 3));
    return g;
  }, [scene]);
  useFrame((_, dt) => {
    if (active && mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <group scale={0.34} position-y={-0.35} rotation-y={-0.5}>
      <points geometry={geo}>
        <shaderMaterial
          ref={mat}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color(ACCENT) } }}
          vertexShader={`
            uniform float uTime; varying float vGlow;
            void main(){
              float scan = mod(uTime * 1.6, 7.0) - 1.8;
              vGlow = exp(-pow((position.y - scan) * 3.0, 2.0));
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * mv;
              gl_PointSize = (1.4 + vGlow * 2.5) * (6.0 / -mv.z);
            }`}
          fragmentShader={`
            uniform vec3 uColor; varying float vGlow;
            void main(){
              float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
              vec3 c = mix(vec3(0.55,0.62,0.68), uColor * 2.5, vGlow);
              gl_FragColor = vec4(c, 0.35 + vGlow * 0.65);
            }`}
        />
      </points>
      {/* Detection frame corners */}
      {[
        [-2.4, 4.0],
        [2.4, 4.0],
        [-2.4, -1.4],
        [2.4, -1.4],
      ].map(([x, y], i) => (
        <group key={i} position={[x, y, 2.6]} rotation-z={[0, -Math.PI / 2, Math.PI / 2, Math.PI][i]}>
          <mesh position={[0.35, 0, 0]}>
            <boxGeometry args={[0.7, 0.05, 0.05]} />
            <meshBasicMaterial color={ACCENT} toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <boxGeometry args={[0.05, 0.7, 0.05]} />
            <meshBasicMaterial color={ACCENT} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* LAB-02: eigenface slabs + MLP ----------------------------------------- */

const eigenFrag = `
  uniform float uIndex; uniform float uTime; varying vec2 vUv;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  void main(){
    vec2 uv = vUv - 0.5;
    // Smooth, face-like low-frequency basis patterns, one per component.
    float k = uIndex + 1.0;
    float face = exp(-dot(uv * vec2(2.6, 2.0), uv * vec2(2.6, 2.0)) * 3.0);
    float eyes = exp(-pow(length(vec2(abs(uv.x) - 0.15, uv.y - 0.08)) * 9.0, 2.0));
    float wave = sin(uv.x * 6.0 * k + uIndex) * cos(uv.y * 5.0 * (k * 0.6) - uIndex * 1.3);
    float v = face * (0.5 + 0.5 * wave) + eyes * (mod(uIndex, 2.0) * 2.0 - 1.0) * 0.6;
    v = 0.5 + 0.5 * v;
    vec3 c = mix(vec3(0.05,0.06,0.08), vec3(0.75,0.82,0.88), v);
    float border = step(0.48, max(abs(uv.x), abs(uv.y)));
    c = mix(c, vec3(0.36,0.78,1.0) * 1.6, border);
    gl_FragColor = vec4(c, 0.92);
  }`;

export function Eigen({ active, mats }: { active: boolean; mats: Mats }) {
  const group = useRef<THREE.Group>(null);
  const slabs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) =>
        new THREE.ShaderMaterial({
          transparent: true,
          side: THREE.DoubleSide,
          uniforms: { uIndex: { value: i }, uTime: { value: 0 } },
          vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} `,
          fragmentShader: eigenFrag,
        }),
      ),
    [],
  );
  useFrame((state) => {
    if (!active || !group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((c, i) => {
      if (i < 6) c.position.z = -i * 0.32 + Math.sin(t * 0.8 + i * 0.6) * 0.06;
    });
  });
  return (
    <group rotation-y={-0.55} position={[-0.25, 0.05, 0]}>
      <group ref={group}>
        {slabs.map((m, i) => (
          <mesh key={i} material={m} position={[i * 0.06, i * 0.03, -i * 0.32]}>
            <planeGeometry args={[1.1, 1.1]} />
          </mesh>
        ))}
      </group>
      {/* MLP: 20 → 100 → classes */}
      {[6, 9, 4].map((n, li) => (
        <group key={li} position={[1.25 + li * 0.42, 0, -0.8]}>
          {Array.from({ length: n }, (_, k) => (
            <mesh key={k} position={[0, (k - (n - 1) / 2) * 0.16, 0]} material={li === 2 ? mats.glow : mats.chrome}>
              <sphereGeometry args={[0.04, 16, 12]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* LAB-03: animated bubble sort ------------------------------------------ */

function bubbleSteps(arr: number[]) {
  const a = arr.slice();
  const steps: { a: number[]; i: number; j: number }[] = [];
  for (let n = a.length; n > 1; n--) {
    for (let i = 0; i < n - 1; i++) {
      if (a[i] > a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]];
      steps.push({ a: a.slice(), i, j: i + 1 });
    }
  }
  return steps;
}

export function Sorting({ active, mats }: { active: boolean; mats: Mats }) {
  const N = 18;
  const bars = useRef<THREE.InstancedMesh>(null);
  const steps = useMemo(() => {
    const init = Array.from({ length: N }, (_, i) => ((i * 7 + 3) % N) + 1);
    return bubbleSteps(init);
  }, []);
  const clock = useRef(0);
  const heights = useRef(new Float32Array(N).fill(0.5));
  const m = useMemo(() => new THREE.Matrix4(), []);
  const c = useMemo(() => new THREE.Color(), []);
  const hi = useMemo(() => new THREE.Color(ACCENT).multiplyScalar(2.4), []);
  const lo = useMemo(() => new THREE.Color('#aab2ba'), []);

  useLayoutEffect(() => {
    for (let i = 0; i < N; i++) bars.current!.setColorAt(i, lo);
  }, [lo]);

  useFrame((_, dt) => {
    if (!active || !bars.current) return;
    clock.current += dt;
    const idx = Math.floor(clock.current / 0.07) % (steps.length + 30);
    const s = steps[Math.min(idx, steps.length - 1)];
    for (let i = 0; i < N; i++) {
      const target = (s.a[i] / N) * 1.5 + 0.05;
      heights.current[i] = THREE.MathUtils.damp(heights.current[i], target, 14, dt);
      const h = heights.current[i];
      m.makeScale(1, h, 1).setPosition((i - (N - 1) / 2) * 0.12, h / 2 - 0.7, 0);
      bars.current.setMatrixAt(i, m);
      const on = idx < steps.length && (i === s.i || i === s.j);
      bars.current.setColorAt(i, c.copy(on ? hi : lo));
    }
    bars.current.instanceMatrix.needsUpdate = true;
    if (bars.current.instanceColor) bars.current.instanceColor.needsUpdate = true;
  });

  return (
    <group rotation-y={-0.35}>
      <instancedMesh ref={bars} args={[undefined, undefined, N]}>
        <boxGeometry args={[0.085, 1, 0.085]} />
        <meshStandardMaterial metalness={0.8} roughness={0.25} toneMapped={false} />
      </instancedMesh>
      <mesh position={[0, -0.72, 0]} material={mats.graphite}>
        <boxGeometry args={[2.4, 0.04, 0.3]} />
      </mesh>
    </group>
  );
}

/* LAB-04: resume ↔ job description TF-IDF match ------------------------- */

function Page({ position, rotation, mats }: { position: [number, number, number]; rotation: number; mats: Mats }) {
  const rows = useMemo(() => Array.from({ length: 11 }, (_, i) => 0.35 + ((i * 37) % 10) / 20), []);
  return (
    <group position={position} rotation-y={rotation}>
      <mesh material={mats.paper}>
        <boxGeometry args={[0.95, 1.3, 0.015]} />
      </mesh>
      {rows.map((w, i) => (
        <mesh key={i} position={[-0.38 + w / 2, 0.52 - i * 0.1, 0.01]} material={i === 0 ? mats.glow : mats.ink}>
          <boxGeometry args={[w, i === 0 ? 0.05 : 0.025, 0.004]} />
        </mesh>
      ))}
    </group>
  );
}

export function ResumeMatch({ active, mats }: { active: boolean; mats: Mats }) {
  const bars = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!active || !bars.current) return;
    const t = state.clock.elapsedTime;
    bars.current.children.forEach((b, i) => {
      b.scale.y = 0.3 + Math.abs(Math.sin(t * 0.9 + i * 0.7)) * 0.9;
    });
  });
  return (
    <group rotation-y={-0.3} position-y={0.05}>
      <Page position={[-0.95, 0, 0]} rotation={0.35} mats={mats} />
      <Page position={[0.95, 0, -0.2]} rotation={-0.35} mats={mats} />
      <group ref={bars} position={[0, -0.55, 0.1]}>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={i} position={[(i - 3) * 0.09, 0, 0]} material={i % 3 === 0 ? mats.glow : mats.chrome}>
            <boxGeometry args={[0.05, 1, 0.05]} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.15, 0.1]} rotation-z={Math.PI / 2}>
        <torusGeometry args={[0.95, 0.008, 8, 64, Math.PI]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* LAB-05: OCR scan + ResNet blocks -------------------------------------- */

export function OcrScan({ active, mats }: { active: boolean; mats: Mats }) {
  const beam = useRef<THREE.Mesh>(null);
  const glyphs = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let r = 0; r < 6; r++) {
      let x = -0.42;
      while (x < 0.4) {
        const w = 0.04 + ((r * 13 + Math.floor(x * 100)) % 7) * 0.012;
        out.push([x + w / 2, 0.42 - r * 0.15, w]);
        x += w + 0.025 + (((r + Math.floor(x * 50)) % 5 === 0) ? 0.05 : 0);
      }
    }
    return out;
  }, []);
  useFrame((state) => {
    if (!active || !beam.current) return;
    beam.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.55;
  });
  return (
    <group rotation-y={-0.4} position={[-0.3, 0.05, 0]}>
      <group rotation-x={-0.15}>
        <mesh material={mats.paper}>
          <boxGeometry args={[1.05, 1.25, 0.02]} />
        </mesh>
        {glyphs.map(([x, y, w], i) => (
          <mesh key={i} position={[x, y, 0.012]} material={mats.ink}>
            <boxGeometry args={[w, 0.06, 0.004]} />
          </mesh>
        ))}
        <mesh position={[0, 0.42, 0.03]}>
          <planeGeometry args={[0.95, 0.11]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.22} toneMapped={false} />
        </mesh>
        <mesh ref={beam} position={[0, 0, 0.05]} material={mats.glow}>
          <boxGeometry args={[1.2, 0.012, 0.012]} />
        </mesh>
      </group>
      {/* ResNet18: progressively smaller feature maps */}
      {[0.62, 0.5, 0.38, 0.28, 0.18].map((s, i) => (
        <mesh key={i} position={[0.95 + i * 0.22, 0, -0.3]} material={i === 4 ? mats.glow : mats.glass}>
          <boxGeometry args={[0.08 + i * 0.03, s, s]} />
        </mesh>
      ))}
    </group>
  );
}

/* LAB-06: time-series ribbon with sliding window ------------------------ */

export function TimeSeries({ active }: { active: boolean }) {
  const win = useRef<THREE.Mesh>(null);
  const { actual, forecast } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    let v = 0;
    let s = 3;
    for (let i = 0; i < 120; i++) {
      s = (s * 16807) % 2147483647;
      v += ((s / 2147483647) - 0.47) * 0.09;
      pts.push(new THREE.Vector3(-1.4 + i * 0.022, v, 0));
    }
    const last = pts[pts.length - 1];
    const fc: THREE.Vector3[] = [last.clone()];
    for (let i = 1; i < 14; i++) fc.push(new THREE.Vector3(last.x + i * 0.022, last.y + Math.sin(i * 0.4) * 0.05 + i * 0.006, 0));
    return {
      actual: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 240, 0.012, 6),
      forecast: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fc), 40, 0.016, 6),
    };
  }, []);
  useFrame((state) => {
    if (!active || !win.current) return;
    win.current.position.x = -1.4 + 0.66 + ((state.clock.elapsedTime * 0.25) % 1) * 1.3;
  });
  return (
    <group rotation-y={-0.35} position-y={0.1}>
      <mesh geometry={actual}>
        <meshPhysicalMaterial color="#cfd6dc" metalness={1} roughness={0.2} />
      </mesh>
      <mesh geometry={forecast}>
        <meshBasicMaterial color={new THREE.Color(ACCENT).multiplyScalar(2.2)} toneMapped={false} />
      </mesh>
      {/* 60-step input window */}
      <mesh ref={win}>
        <boxGeometry args={[1.32, 1.1, 0.5]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.07} depthWrite={false} toneMapped={false} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[0, -0.6 + i * 0.2, -0.3]}>
          <boxGeometry args={[3.1, 0.003, 0.003]} />
          <meshBasicMaterial color="#2c333a" />
        </mesh>
      ))}
    </group>
  );
}
