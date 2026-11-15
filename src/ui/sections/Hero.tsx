import { profile, stats } from '../../content/profile';
import { scrollToId } from '../../lib/scroll';
import { Arrow, Shell } from './common';

export function Hero() {
  return (
    <section id="core" data-station="core" className="relative flex min-h-[115svh] flex-col" aria-labelledby="hero-name">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink/90 via-ink/50 to-transparent md:hidden" aria-hidden />
      <Shell className="relative flex flex-col pb-14 pt-28 sm:pb-16 lg:min-h-[100svh] lg:justify-end">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          {/* Identity block */}
          <div className="flex min-h-[calc(100svh-9rem)] max-w-xl flex-col justify-end lg:col-span-5 lg:block lg:min-h-0">
            <p className="mb-3 font-sans text-2xl font-light italic text-bone/80 sm:text-3xl">Hello, I’m</p>
            <h1 id="hero-name" className="display text-[17vw] sm:text-8xl xl:text-[8.5rem]">
              Sahithi
              <br />
              Reddy
            </h1>
            <p className="mt-5 font-mono text-sm uppercase tracking-[0.24em] text-accent">{profile.role}</p>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-bone/75">{profile.tagline}</p>
            <p className="mt-2 hidden max-w-md text-[15px] leading-relaxed text-mute sm:block">
              B.Tech CSE (AI & ML) · machine learning, computer vision and applied NLP.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => scrollToId('lab')} className="btn-primary">
                Enter the lab <Arrow />
              </button>
              <a href={profile.resume} download className="btn-ghost">
                Résumé
              </a>
            </div>
          </div>

          {/* Right column: statement + stats (editorial) */}
          <div className="lg:col-span-3 lg:col-start-10">
            <div className="mb-8 hidden items-start gap-4 lg:flex">
              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-accent">✦</span>
              <p className="text-sm leading-relaxed text-bone/75">Turning data into working intelligence.</p>
            </div>
            <dl className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-0">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1 border-t border-line pt-3 lg:flex-row lg:items-center lg:gap-5 lg:py-4">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="display text-4xl text-accent lg:w-20 lg:text-5xl">{s.value}</dd>
                  <dd className="font-mono text-[10px] uppercase leading-snug tracking-[0.18em] text-mute">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {profile.location}
          </span>
          <span className="hidden sm:block">Scroll to enter the facility ↓</span>
        </div>
      </Shell>
    </section>
  );
}
