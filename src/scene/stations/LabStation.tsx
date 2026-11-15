import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import { frame, useUI } from '../../lib/store';
import { labs, type SpecimenKind } from '../../content/labs';
import { ACCENT } from '../palette';
import { ANCHORS } from '../rig';
import { Eigen, FaceScan, OcrScan, ResumeMatch, Sorting, TimeSeries } from './specimens';
import { useMaterials } from './materials';

/** Grows the active specimen in and shrinks the others out. */
function Slot({ index, children }: { index: number; children: (active: boolean) => ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const active = useUI((s) => s.activeLab === index);
  useFrame((state, dt) => {
    if (!g.current) return;
    const s = THREE.MathUtils.damp(g.current.scale.x, active ? 1 : 0.001, 5, dt);
    g.current.scale.setScalar(s);
    g.current.visible = s > 0.01;
    g.current.rotation.y = (1 - s) * 1.4 + Math.sin(state.clock.elapsedTime * 0.3) * 0.12 + frame.pointer.x * 0.2;
  });
  return (
    <group ref={g} scale={index === 0 ? 1 : 0.001}>
      {children(active)}
    </group>
  );
}

export function LabStation({ tier }: { tier?: 'high' | 'low' }) {
  const mats = useMaterials();
  const root = useRef<THREE.Group>(null);
  const ring = useRef<THREE.MeshBasicMaterial>(null);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, -0.2, 0);
    return o;
  }, []);

  const render = (kind: SpecimenKind, active: boolean) => {
    switch (kind) {
      case 'facescan':
        return <FaceScan active={active} />;
      case 'eigen':
        return <Eigen active={active} mats={mats} />;
      case 'sorting':
        return <Sorting active={active} mats={mats} />;
      case 'resume':
        return <ResumeMatch active={active} mats={mats} />;
      case 'ocr':
        return <OcrScan active={active} mats={mats} />;
      case 'timeseries':
        return <TimeSeries active={active} />;
    }
  };

  useFrame((state) => {
    if (!root.current) return;
    const near = Math.abs(frame.t - 3) < 1.2;
    root.current.visible = near;
    if (ring.current) ring.current.opacity = 0.55 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
  });

  return (
    <group position={ANCHORS.lab} ref={root}>
      {/* Pedestal */}
      <mesh position={[0, -1.4, 0]} material={mats.graphite} receiveShadow castShadow>
        <cylinderGeometry args={[1.25, 1.45, 1.8, 96]} />
      </mesh>
      <mesh position={[0, -0.49, 0]} material={mats.chrome} receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.04, 96]} />
      </mesh>
      <mesh position={[0, -0.46, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.12, 1.14, 128]} />
        <meshBasicMaterial ref={ring} color={new THREE.Color(ACCENT).multiplyScalar(2)} transparent toneMapped={false} />
      </mesh>
      {/* Specimen chamber */}
      <group position={[0, 0.55, 0]}>
        {labs.map((lab, i) => (
          <Slot key={lab.id} index={i}>
            {(active) => render(lab.specimen, active)}
          </Slot>
        ))}
      </group>

      <primitive object={target} />
      <SpotLight
        position={[0.5, 6, 1.5]}
        target={target}
        angle={0.36}
        penumbra={0.7}
        distance={12}
        attenuation={8}
        anglePower={5}
        intensity={70}
        color="#eef3f7"
        opacity={tier === 'high' ? 0.16 : 0.1}
        castShadow={tier === 'high'}
        volumetric
      />
      <pointLight position={[-2.5, 0.5, 2]} intensity={5} distance={8} color={ACCENT} />
    </group>
  );
}
