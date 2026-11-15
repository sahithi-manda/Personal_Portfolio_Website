import { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor, Preload, useProgress } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ToneMapping, ChromaticAberration } from '@react-three/postprocessing';
import { ToneMappingMode, BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { ChromaticAberrationEffect } from 'postprocessing';
import { CameraRig } from './CameraRig';
import { Dust, Facility, StudioEnvironment } from './Facility';
import { CoreStation } from './stations/CoreStation';
import { IdentityStation } from './stations/IdentityStation';
import { GalaxyStation } from './stations/GalaxyStation';
import { LabStation } from './stations/LabStation';
import { TimelineStation } from './stations/TimelineStation';
import { SignalStation } from './stations/SignalStation';
import { frame, ui } from '../lib/store';
import type { Tier } from '../lib/quality';
import { BG } from './palette';

function ReadySignal() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    // Wait two frames so the first visible frame is fully composed before the loader lifts.
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => ui.set({ sceneReady: true }));
    });
    return () => cancelAnimationFrame(id);
  }, [gl]);
  return null;
}

function ProgressReporter() {
  const progress = useProgress((s) => s.progress);
  useEffect(() => ui.set({ loadProgress: progress }), [progress]);
  return null;
}

function Effects({ tier }: { tier: Tier }) {
  const ca = useRef<ChromaticAberrationEffect>(null);
  useFrame(() => {
    if (!ca.current) return;
    const s = tier === 'high' ? Math.min(frame.velocity / 40, 1) * 0.0022 : 0;
    ca.current.offset.set(s, s * 0.6);
  });
  return (
    <EffectComposer multisampling={tier === 'high' ? 4 : 0}>
      <Bloom mipmapBlur luminanceThreshold={0.85} luminanceSmoothing={0.2} intensity={tier === 'high' ? 0.9 : 0.6} />
      <ChromaticAberration ref={ca} offset={new THREE.Vector2(0, 0)} radialModulation modulationOffset={0.3} />
      <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.22} darkness={0.78} />
      <ToneMapping mode={ToneMappingMode.AGX} />
    </EffectComposer>
  );
}

export default function Scene({ tier, compact }: { tier: Tier; compact: boolean }) {
  const [dpr, setDpr] = useState<number>(tier === 'high' ? 1.75 : 1.25);
  return (
    <Canvas
      className="!fixed inset-0 !h-[100lvh]"
      dpr={dpr}
      shadows={tier === 'high'}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false }}
      camera={{ position: [0, 1, 19], fov: 32, near: 0.1, far: 120 }}
      eventSource={document.getElementById('root')!}
      eventPrefix="client"
      aria-hidden
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 14, 46]} />
      <ambientLight intensity={0.08} />
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(0.9, d - 0.35))}
        onIncline={() => setDpr((d) => Math.min(tier === 'high' ? 2 : 1.5, d + 0.2))}
      />
      <AdaptiveDpr pixelated={false} />
      <ProgressReporter />
      <Suspense fallback={null}>
        <StudioEnvironment />
        <CameraRig compact={compact} />
        <Facility tier={tier} />
        <Dust count={tier === 'high' ? 4500 : 1600} />
        <CoreStation tier={tier} />
        <IdentityStation />
        <GalaxyStation />
        <LabStation tier={tier} />
        <TimelineStation />
        <SignalStation />
        <Effects tier={tier} />
        <Preload all />
        <ReadySignal />
      </Suspense>
    </Canvas>
  );
}
