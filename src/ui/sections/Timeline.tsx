import { certifications, roles } from '../../content/experience';
import { education } from '../../content/profile';
import { SectionLabel, Shell } from './common';

export function Timeline() {
  return (
    <section id="timeline" data-station="timeline" className="relative py-28" aria-labelledby="timeline-title">
      <div className="scrim-left pointer-events-none absolute inset-0 hidden md:block" aria-hidden />
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

        <ol className="mt-14 max-w-xl space-y-16">
          {roles.map((r, i) => (
            <li key={r.company} className="border border-line bg-ink/80 p-6 backdrop-blur-md sm:p-8" data-reveal>
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

          <li className="border border-line bg-ink/80 p-6 backdrop-blur-md sm:p-8" data-reveal>
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
