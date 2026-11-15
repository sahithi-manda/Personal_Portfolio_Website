import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { labs, type Lab } from '../../content/labs';
import { ui, useUI } from '../../lib/store';
import { ScrollTrigger, scrollToY } from '../../lib/scroll';
import { Arrow, ArrowUpRight, SectionLabel, Shell } from './common';
import { Dossier } from './Dossier';
import { Archive } from './Archive';

export function Labs({ is3D }: { is3D: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const active = useUI((s) => s.activeLab);
  const [open, setOpen] = useState<Lab | null>(null);
  const lab = labs[active];

  useEffect(() => {
    if (!track.current) return;
    const st = ScrollTrigger.create({
      trigger: track.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => ui.set({ activeLab: Math.min(labs.length - 1, Math.floor(self.progress * labs.length)) }),
    });
    return () => st.kill();
  }, []);

  const jump = (i: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    scrollToY(top + ((i + 0.5) / labs.length) * span);
  };

  return (
    <section id="lab" data-station="lab" className="relative" aria-labelledby="lab-title">
      <div ref={track} style={{ height: `${labs.length * 80 + 100}svh` }} className="relative">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="scrim-left pointer-events-none absolute inset-0 hidden md:block" aria-hidden />
          <div className="scrim-full pointer-events-none absolute inset-0 md:hidden" aria-hidden />
          <Shell className="relative">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-6 xl:col-span-5">
                <SectionLabel index={4}>Digital laboratory</SectionLabel>
                <h2 id="lab-title" className="sr-only">
                  Selected projects
                </h2>

                <AnimatePresence mode="wait">
                  <motion.article
                    key={lab.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                    className="mt-8"
                    aria-live="polite"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="display text-6xl text-accent sm:text-7xl">{String(active + 1).padStart(2, '0')}</span>
                      <span className="eyebrow">
                        {lab.code} · {lab.kicker}
                      </span>
                    </div>
                    <h3 className="display mt-4 text-5xl sm:text-6xl">{lab.title}</h3>
                    <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-bone/80">{lab.overview}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {lab.stack.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                    {lab.results && (
                      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                        {lab.results.map((r) => (
                          <div key={r.label}>
                            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{r.label}</dt>
                            <dd className="display mt-1 text-3xl">{r.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <div className="mt-8 flex flex-wrap gap-3">
                      <button className="btn-primary" onClick={() => setOpen(lab)}>
                        Open dossier <Arrow />
                      </button>
                      <a className="btn-ghost" href={lab.github} target="_blank" rel="noopener noreferrer">
                        GitHub <ArrowUpRight />
                      </a>
                      {lab.live && (
                        <a className="btn-ghost" href={lab.live} target="_blank" rel="noopener noreferrer">
                          Live demo <ArrowUpRight />
                        </a>
                      )}
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>

              {/* Index */}
              <div className="hidden lg:col-span-3 lg:col-start-10 lg:flex lg:flex-col lg:justify-end">
                {!is3D && (
                  <div className="display mb-auto text-[9rem] leading-none text-bone/[0.05]" aria-hidden>
                    {lab.code.replace('LAB-', '')}
                  </div>
                )}
                <ol className="border-t border-line">
                  {labs.map((l, i) => (
                    <li key={l.id}>
                      <button
                        onClick={() => jump(i)}
                        className="group flex w-full items-center gap-4 border-b border-line py-3 text-left"
                        aria-current={i === active ? 'true' : undefined}
                      >
                        <span className={`font-mono text-xs ${i === active ? 'text-accent' : 'text-dim'}`}>{String(i + 1).padStart(2, '0')}</span>
                        <span className={`flex-1 text-sm ${i === active ? 'text-bone' : 'text-mute group-hover:text-bone'}`}>{l.title}</span>
                        <span className={`h-px transition-all ${i === active ? 'w-6 bg-accent' : 'w-0 bg-bone'}`} />
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Mobile progress */}
            <div className="mt-10 flex gap-1.5 lg:hidden" aria-hidden>
              {labs.map((l, i) => (
                <span key={l.id} className={`h-0.5 flex-1 ${i === active ? 'bg-accent' : 'bg-line'}`} />
              ))}
            </div>
          </Shell>
        </div>
      </div>

      <Archive />
      <Dossier lab={open} onClose={() => setOpen(null)} />
    </section>
  );
}
