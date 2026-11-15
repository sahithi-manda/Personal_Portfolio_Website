import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../lib/store';

/** Full-screen boot sequence; lifts once the first composed frame is on screen. */
export function Loader() {
  const ready = useUI((s) => s.sceneReady);
  const progress = useUI((s) => s.loadProgress);
  const [shown, setShown] = useState(0);
  const [failsafe, setFailsafe] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setShown((s) => Math.min(ready ? 100 : Math.max(s, progress) * 0.98 + 1, 100)), 60);
    return () => clearInterval(id);
  }, [progress, ready]);

  // Never trap the visitor: lift after 12s regardless.
  useEffect(() => {
    const id = setTimeout(() => setFailsafe(true), 12000);
    return () => clearTimeout(id);
  }, []);

  const visible = !(ready || failsafe);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-4 py-6 sm:px-8 lg:px-12"
          exit={{ opacity: 0, transition: { duration: 1.1, ease: [0.7, 0, 0.2, 1] } }}
          role="status"
          aria-live="polite"
        >
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
            <span>Initialising facility</span>
            <span className="text-accent">✦</span>
          </div>
          <div>
            <div className="display text-[22vw] leading-none text-bone/[0.06] sm:text-[16vw]" aria-hidden>
              {String(Math.floor(shown)).padStart(3, '0')}
            </div>
            <div className="mt-4 h-px w-full bg-line">
              <div className="h-px bg-accent transition-[width] duration-200" style={{ width: `${shown}%` }} />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
              <span>Sahithi Reddy · AI / ML Engineer</span>
              <span className="tabular-nums">{Math.floor(shown)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
