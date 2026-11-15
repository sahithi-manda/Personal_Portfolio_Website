import { education, focusAreas, profile } from '../../content/profile';
import { roles } from '../../content/experience';
import { SectionLabel, Shell } from './common';

export function Identity() {
  return (
    <section id="identity" data-station="identity" className="relative min-h-[170svh] py-32" aria-labelledby="identity-title">
      <div className="scrim-left pointer-events-none absolute inset-0 hidden md:block" aria-hidden />
      <Shell className="relative">
        <div className="max-w-xl">
          <SectionLabel index={2}>AI identity</SectionLabel>
          <h2 id="identity-title" className="display mt-6 text-6xl sm:text-7xl" data-reveal>
            About me
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-bone/85" data-reveal>
            {profile.summary}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-mute" data-reveal>
            {profile.intent}
          </p>

          {/* Education */}
          <div className="mt-14" data-reveal>
            <p className="eyebrow text-accent">Education</p>
            <div className="mt-4 border-t border-line pt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-medium text-bone">{education.degree}</h3>
                <span className="font-mono text-xs text-accent">{education.period}</span>
              </div>
              <p className="mt-1 text-sm text-mute">{education.school}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {education.coursework.map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Focus areas: numbered, editorial */}
          <div className="mt-14">
            <p className="eyebrow text-accent" data-reveal>
              What I work on
            </p>
            <ol className="mt-4">
              {focusAreas.map((f, i) => (
                <li key={f.id} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-line py-5" data-reveal>
                  <span className="display text-3xl text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-bone">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mute">{f.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Journey snapshot */}
          <div className="mt-14 grid grid-cols-2 gap-px border border-line bg-line" data-reveal>
            {roles.map((r) => (
              <div key={r.company} className="bg-ink/90 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">{r.period}</p>
                <p className="display mt-2 text-2xl">{r.company}</p>
                <p className="mt-1 text-xs text-accent">{r.role}</p>
              </div>
            ))}
          </div>
        </div>
      </Shell>
    </section>
  );
}
