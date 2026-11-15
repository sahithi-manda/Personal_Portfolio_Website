import { useEffect, useRef } from 'react';
import type { Lab } from '../../content/labs';
import { ArrowUpRight } from './common';
import { lockScroll } from '../../lib/scroll';

/** Full project dossier in a native modal <dialog> (focus trap + Esc for free). */
export function Dossier({ lab, onClose }: { lab: Lab | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (lab && !d.open) {
      d.showModal();
      lockScroll(true);
    }
    if (!lab && d.open) d.close();
  }, [lab]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onCloseEvt = () => {
      lockScroll(false);
      onClose();
    };
    d.addEventListener('close', onCloseEvt);
    return () => d.removeEventListener('close', onCloseEvt);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="dossier-title"
      className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-0 text-bone md:ml-auto md:w-[min(820px,92vw)]"
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      data-lenis-prevent
    >
      {lab && (
        <div className="min-h-full border-l border-line bg-ink-2 px-5 pb-16 pt-6 sm:px-10">
          <div className="sticky top-0 z-10 -mx-5 flex items-center justify-between border-b border-line bg-ink-2/95 px-5 py-4 backdrop-blur sm:-mx-10 sm:px-10">
            <span className="eyebrow">
              <span className="text-accent">{lab.code}</span> · Research dossier
            </span>
            <button onClick={() => ref.current?.close()} className="font-mono text-xs uppercase tracking-[0.2em] text-mute hover:text-accent" autoFocus>
              Close ✕
            </button>
          </div>

          <p className="eyebrow mt-10">{lab.kicker}</p>
          <h2 id="dossier-title" className="display mt-3 text-5xl sm:text-7xl">
            {lab.title}
          </h2>

          <Block n="01" title="Overview">
            <p>{lab.overview}</p>
          </Block>
          <Block n="02" title="Problem">
            <p>{lab.problem}</p>
          </Block>
          <Block n="03" title="Architecture">
            <ol className="mt-1">
              {lab.architecture.map((a, i) => (
                <li key={a.label} className="relative grid grid-cols-[2.25rem_1fr] gap-x-4 pb-5 last:pb-0">
                  <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-ink-2 font-mono text-[10px] text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {i < lab.architecture.length - 1 && <span className="absolute left-[1.1rem] top-9 h-[calc(100%-2.25rem)] w-px bg-line" aria-hidden />}
                  <div className="pt-1.5">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-bone">{a.label}</p>
                    <p className="mt-1 text-sm text-mute">{a.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>
          <Block n="04" title="Implementation">
            <ul className="space-y-2.5">
              {lab.implementation.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="text-accent">→</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Block>
          {(lab.results || lab.honestNote) && (
            <Block n="05" title="Results">
              {lab.results && (
                <dl className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
                  {lab.results.map((r) => (
                    <div key={r.label} className="bg-ink-2 p-4">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{r.label}</dt>
                      <dd className="display mt-2 text-3xl">{r.value}</dd>
                      {r.note && <dd className="mt-1 text-xs text-dim">{r.note}</dd>}
                    </div>
                  ))}
                </dl>
              )}
              {lab.honestNote && <p className="mt-4 border-l-2 border-accent pl-4 text-sm text-bone/80">{lab.honestNote}</p>}
            </Block>
          )}
          <Block n={lab.results || lab.honestNote ? '06' : '05'} title="Stack">
            <div className="flex flex-wrap gap-2">
              {lab.stack.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </Block>

          <div className="mt-12 flex flex-wrap gap-3">
            <a className="btn-primary" href={lab.github} target="_blank" rel="noopener noreferrer">
              View on GitHub <ArrowUpRight />
            </a>
            {lab.live && (
              <a className="btn-ghost" href={lab.live} target="_blank" rel="noopener noreferrer">
                Live demo <ArrowUpRight />
              </a>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 grid gap-4 border-t border-line pt-6 sm:grid-cols-[9rem_1fr]">
      <h3 className="eyebrow">
        <span className="text-accent">{n}</span> {title}
      </h3>
      <div className="text-[15px] leading-relaxed text-bone/80">{children}</div>
    </section>
  );
}
