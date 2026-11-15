import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../content/profile';
import { STATIONS } from '../lib/store';
import { useUI } from '../lib/store';
import { scrollToId } from '../lib/scroll';
import type { Mode } from '../lib/quality';

const LABELS: Record<(typeof STATIONS)[number], string> = {
  core: 'Core',
  identity: 'Identity',
  galaxy: 'Skills',
  lab: 'Laboratory',
  timeline: 'Timeline',
  signal: 'Contact',
};

export function Header({ mode, onToggleMode, canUse3D }: { mode: Mode; onToggleMode: () => void; canUse3D: boolean }) {
  const station = useUI((s) => s.station);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-ink via-ink/75 to-transparent pb-6 lg:from-ink/80 lg:via-ink/30">
        <div className="mx-auto flex max-w-[1600px] items-start justify-between px-4 pt-5 sm:px-8 lg:px-12">
          <button onClick={() => go('core')} className="group text-left" aria-label="Back to top">
            <span className="block font-mono text-[11px] uppercase tracking-[0.22em] text-accent">{profile.role}</span>
            <span className="block font-mono text-[11px] uppercase tracking-[0.22em] text-mute group-hover:text-bone">
              {profile.name}
            </span>
          </button>

          <div className="flex items-center gap-3 sm:gap-6">
            <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:flex">
              Open to opportunities <span className="text-accent">✦</span>
            </span>
            {canUse3D && (
              <button
                onClick={onToggleMode}
                className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-mute hover:text-accent sm:block"
                aria-pressed={mode === '3d'}
                title="Toggle the 3D experience"
              >
                3D {mode === '3d' ? 'On' : 'Off'}
              </button>
            )}
            <a href={profile.resume} download className="border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] hover:border-accent hover:text-accent">
              CV
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] border border-line lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Menu"
            >
              <span className={`h-px w-4 bg-bone transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
              <span className={`h-px w-4 bg-bone transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Station rail (desktop) */}
      <nav aria-label="Sections" className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:left-10">
        <ol className="flex flex-col gap-4">
          {STATIONS.map((id, i) => {
            const active = station === i;
            return (
              <li key={id}>
                <button onClick={() => go(id)} className="group flex items-center gap-3" aria-current={active ? 'true' : undefined}>
                  <span className={`font-mono text-[10px] tabular-nums ${active ? 'text-accent' : 'text-dim group-hover:text-bone'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`h-px transition-all duration-500 ${active ? 'w-8 bg-accent' : 'w-3 bg-dim group-hover:w-5 group-hover:bg-bone'}`} />
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.22em] transition-opacity duration-300 ${
                      active ? 'text-bone opacity-100' : 'text-mute opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {LABELS[id]}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/95 px-4 pt-24 backdrop-blur-sm lg:hidden"
          >
            <ol className="flex flex-col">
              {STATIONS.map((id, i) => (
                <motion.li key={id} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <button onClick={() => go(id)} className="flex w-full items-baseline gap-4 border-b border-line py-4 text-left">
                    <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span className="display text-4xl">{LABELS[id]}</span>
                  </button>
                </motion.li>
              ))}
            </ol>
            {canUse3D && (
              <button onClick={onToggleMode} className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-mute">
                3D experience: {mode === '3d' ? 'On' : 'Off'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
