import { focusAreas, profile } from '../../content/profile';
import { MobileScrim, SectionLabel, Shell } from './common';

export function Identity() {
  return (
    <section id="identity" data-station="identity" className="relative min-h-[100svh] pb-28 pt-[50svh] md:pt-28" aria-labelledby="identity-title">
      <div className="scrim-left pointer-events-none absolute inset-0 hidden md:block" aria-hidden />
      <MobileScrim />
      <Shell className="relative">
        <div className="max-w-xl">
          <SectionLabel index={2}>AI identity</SectionLabel>
          <h2 id="identity-title" className="display mt-6 text-6xl sm:text-7xl" data-reveal>
            About me
          </h2>
          <p className="display mt-7 text-3xl leading-tight text-accent sm:text-4xl" data-reveal>
            {profile.about.lead}
          </p>
          <p className="mt-5 text-[17px] leading-relaxed text-bone/85" data-reveal>
            {profile.about.body}
          </p>

          <dl className="mt-10 border-t border-line" data-reveal>
            {profile.about.facts.map((f) => (
              <div key={f.label} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-3.5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{f.label}</dt>
                <dd className="text-sm text-bone/85">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10" data-reveal>
            <p className="eyebrow">Focus</p>
            <ul className="mt-4 grid gap-px border border-line bg-line sm:grid-cols-2">
              {focusAreas.map((f, i) => (
                <li key={f.id} className="bg-ink/90 p-4">
                  <p className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-bone">{f.title}</span>
                  </p>
                  <p className="mt-1.5 text-[13px] leading-snug text-mute">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Shell>
    </section>
  );
}
