import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Header } from './ui/Header';
import { Loader } from './ui/Loader';
import { Intro } from './ui/Intro';
import { useReveal } from './ui/useReveal';
import { Hero } from './ui/sections/Hero';
import { Identity } from './ui/sections/Identity';
import { Skills } from './ui/sections/Skills';
import { Labs } from './ui/sections/Labs';
import { Timeline } from './ui/sections/Timeline';
import { Contact } from './ui/sections/Contact';
import { frame, ui } from './lib/store';
import { initSmoothScroll, initStationTracking, ScrollTrigger } from './lib/scroll';
import { detectTier, hasWebGL, isSmallScreen, prefersReducedMotion, readSavedMode, saveMode, shouldPlayIntro, type Mode } from './lib/quality';

// The WebGL world is split out of the first paint.
const Scene = lazy(() => import('./scene/Scene'));

function initialMode(): Mode {
  if (!hasWebGL()) return 'static';
  return readSavedMode() ?? (prefersReducedMotion() ? 'static' : '3d');
}

export default function App() {
  const [webgl] = useState(hasWebGL);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [tier] = useState(detectTier);
  const [compact, setCompact] = useState(isSmallScreen);
  const [reduced] = useState(prefersReducedMotion);
  const is3D = mode === '3d';
  const [intro, setIntro] = useState(shouldPlayIntro);
  const endIntro = useCallback(() => {
    setIntro(false);
    ui.set({ introDone: true });
  }, []);

  useEffect(() => {
    if (!intro) ui.set({ introDone: true });
    // Only on mount: whether this visit starts with the intro.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setCompact(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Smooth scrolling and scroll→camera mapping only matter in 3D mode.
  useEffect(() => initSmoothScroll(is3D && !reduced), [is3D, reduced]);
  useEffect(() => initStationTracking(), []);
  useReveal(!reduced);

  useEffect(() => {
    if (!is3D) ui.set({ sceneReady: true });
    else ui.set({ sceneReady: false });
    ScrollTrigger.refresh();
  }, [is3D]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      frame.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      frame.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const toggle = () => {
    const next: Mode = is3D ? 'static' : '3d';
    saveMode(next);
    setMode(next);
  };

  return (
    <>
      <a href="#identity" className="sr-only z-[200] bg-bone px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>

      {is3D ? (
        <>
          <Suspense fallback={null}>
            <Scene tier={tier} compact={compact} />
          </Suspense>
          <Loader />
        </>
      ) : (
        <div aria-hidden className="fixed inset-0 -z-0 bg-ink">
          <img src="/poster.jpg" alt="" className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/60 to-ink" />
        </div>
      )}

      {intro && <Intro onDone={endIntro} />}

      <Header mode={mode} onToggleMode={toggle} canUse3D={webgl} />

      <main className="relative z-10">
        <Hero />
        <Identity />
        <Skills is3D={is3D} />
        <Labs is3D={is3D} />
        <Timeline />
        <Contact />
      </main>
    </>
  );
}
