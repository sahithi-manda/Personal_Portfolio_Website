import { useState, type ReactNode } from 'react';
import { profile } from '../../content/profile';
import { ArrowUpRight, SectionLabel, Shell } from './common';

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
    <path d={d} />
  </svg>
);
const ICONS = {
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  linkedin: 'M4 9h3v11H4zM5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM10 9h3v1.6c.5-.9 1.7-1.8 3.4-1.8 3 0 3.6 2 3.6 4.6V20h-3v-5.8c0-1.4 0-3-1.9-3s-2.1 1.4-2.1 2.9V20h-3z',
  github: 'M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z',
  file: 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h8',
  pin: 'M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
};

function Row({ icon, label, children, href, download }: { icon: keyof typeof ICONS; label: string; children: ReactNode; href?: string; download?: boolean }) {
  const inner = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-accent transition-colors group-hover:border-accent">
        <Icon d={ICONS[icon]} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mute">{label}</span>
        <span className="mt-0.5 block truncate text-[15px] text-bone group-hover:text-accent">{children}</span>
      </span>
      {href && <ArrowUpRight className="text-dim group-hover:text-accent" />}
    </>
  );
  return (
    <li className="border-b border-line">
      {href ? (
        <a
          href={href}
          className="group flex items-center gap-4 py-4"
          {...(download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {inner}
        </a>
      ) : (
        <div className="group flex items-center gap-4 py-4">{inner}</div>
      )}
    </li>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="signal" data-station="signal" className="relative flex min-h-[110svh] flex-col justify-end" aria-labelledby="contact-title">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-ink via-ink/85 to-transparent" aria-hidden />
      <Shell className="relative pb-10 pt-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index={6}>Signal</SectionLabel>
            <h2 id="contact-title" className="display mt-6 text-6xl sm:text-8xl" data-reveal>
              Let’s work
              <br />
              together <span className="align-top font-sans text-3xl text-accent sm:text-4xl" aria-hidden>✦</span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mute" data-reveal>
              Open to AI/ML internships, research collaborations and project work. The fastest way to reach me is email.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" data-reveal>
              <a href={`mailto:${profile.email}`} className="btn-primary">
                Send an email
              </a>
              <button onClick={copy} className="btn-ghost" aria-live="polite">
                {copied ? 'Copied ✓' : 'Copy address'}
              </button>
            </div>
          </div>

          <ul className="border-t border-line lg:col-span-5 lg:col-start-8 lg:self-end" data-reveal>
            <Row icon="mail" label="Email" href={`mailto:${profile.email}`}>
              {profile.email}
            </Row>
            <Row icon="linkedin" label="LinkedIn" href={profile.linkedin}>
              in/sahithi-reddy-manda
            </Row>
            <Row icon="github" label="GitHub" href={profile.github}>
              github.com/{profile.githubHandle}
            </Row>
            <Row icon="file" label="Résumé (PDF)" href={profile.resume} download>
              Download résumé
            </Row>
            <Row icon="pin" label="Based in">
              {profile.location}
            </Row>
          </ul>
        </div>

        <footer className="mt-24 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-dim sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {profile.fullName}</span>
          <span className="normal-case tracking-normal">
            Head model based on the Lee Perry-Smith scan by{' '}
            <a className="underline hover:text-bone" href="https://www.infinite-realities.net" target="_blank" rel="noopener noreferrer">
              Infinite Realities
            </a>{' '}
            (
            <a className="underline hover:text-bone" href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">
              CC BY 3.0
            </a>
            ), restyled.
          </span>
        </footer>
      </Shell>
    </section>
  );
}
