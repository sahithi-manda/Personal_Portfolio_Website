import { useEffect, useRef } from 'react';
import { certifications, roles } from '../../content/experience';
import { frame, ui, useUI } from '../../lib/store';
import { education } from '../../content/profile';
import { MobileScrim, SectionLabel, Shell } from './common';

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Tracks which card is being read; the 3D gates follow it. */
function useRoleTracking(list: React.RefObject<HTMLOListElement | null>) {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const cards = list.current ? Array.from(list.current.children) as HTMLElement[] : [];
      if (!cards.length) return;
      const probe = window.innerHeight * 0.5;
      const centers = cards.map((c) => {
        const r = c.getBoundingClientRect();
        return r.top + Math.min(r.height, window.innerHeight) * 0.5;
      });
      let t = 0;
      if (probe >= centers[centers.length - 1]) t = centers.length - 1;
      else if (probe > centers[0]) {
        let k = 0;
        while (probe > centers[k + 1]) k++;
        // Pause on each card, then glide to the next gate.
        t = k + smooth(0.2, 0.8, (probe - centers[k]) / (centers[k + 1] - centers[k]));
      }
      frame.roleT = t;
      ui.set({ activeRole: Math.round(t) });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [list]);
}

export function Timeline() {
  const list = useRef<HTMLOListElement>(null);
  const active = useUI((s) => s.activeRole);
  useRoleTracking(list);
  const card = (i: number) =>
    `border bg-ink/80 p-6 backdrop-blur-md transition-colors duration-700 sm:p-8 ${i === active ? 'border-accent/60' : 'border-line'}`;
  return (
    <section id="timeline" data-station="timeline" data-hold-until="ol > li:last-child" className="relative pb-28 pt-[50svh] md:pt-28" aria-labelledby="timeline-title">
      <div className="scrim-left pointer-events-none absolute inset-0 hidden md:block" aria-hidden />
      <MobileScrim />
      <Shell className="relative">
        <div className="max-w-xl">
          <SectionLabel index={5}>Timeline</SectionLabel>
          <h2 id="timeline-title" className="display mt-6 text-6xl sm:text-7xl" data-reveal>
            Experience
          </h2>
          <p className="mt-6 text-[15px] text-mute" data-reveal>
            Flying back through time, from the present.
          </p>
        </div>

        <ol ref={list} className="mt-14 max-w-xl space-y-[22svh]">
          {roles.map((r, i) => (
            <li key={r.company} className={card(i)} data-reveal>
              <div className="flex items-start justify-between gap-4">
                <span className="display text-6xl text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
                  {r.current && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden />}
                  {r.period}
                </span>
              </div>
              <h3 className="display mt-4 text-4xl sm:text-5xl">{r.company}</h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-accent">{r.role}</p>
              <ul className="mt-6 space-y-3">
                {r.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-bone/80">
                    <span className="mt-[0.6em] h-px w-3 shrink-0 bg-accent" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {r.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </li>
          ))}

          <li className={card(2)} data-reveal>
            <div className="flex items-start justify-between gap-4">
              <span className="display text-6xl text-accent">03</span>
              <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">{education.period}</span>
            </div>
            <h3 className="display mt-4 text-4xl">B.Tech · {education.school.split(' ')[0]}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-accent">{education.degree}</p>

            <p className="eyebrow mt-8">Certifications</p>
            <ul className="mt-3 border-t border-line">
              {certifications.map((c) => (
                <li key={c.title} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line py-3">
                  <span className="text-sm text-bone">{c.title}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{c.issuer}</span>
                </li>
              ))}
            </ul>
          </li>
        </ol>
      </Shell>
    </section>
  );
}
