import { useMemo } from 'react';
import { useGitHubProjects } from '../../hooks/useGitHubProjects';
import { labs } from '../../content/labs';
import { ArrowUpRight, Shell } from './common';

const norm = (u: string) => u.toLowerCase().replace(/\/+$/, '');

/** Every other public repository, kept in sync with GitHub by the existing pipeline. */
export function Archive() {
  const { projects, syncSource } = useGitHubProjects();
  const featured = useMemo(() => new Set(labs.map((l) => norm(l.github))), []);
  const rest = useMemo(() => {
    const seen = new Set<string>();
    return projects.filter((p) => {
      const key = norm(p.github);
      if (featured.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [projects, featured]);

  return (
    <div className="relative bg-ink/85 py-24 backdrop-blur-[2px]">
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
          <div>
            <p className="eyebrow">Archive</p>
            <h3 className="display mt-3 text-4xl sm:text-5xl">More experiments</h3>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            {syncSource === 'live' ? 'Live from GitHub' : 'Synced from GitHub'} · {rest.length} repositories
          </span>
        </div>
        <ul className="mt-10 border-t border-line">
          {rest.map((p, i) => (
            <li key={p.id} data-reveal>
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 border-b border-line py-5 sm:grid-cols-[3.5rem_minmax(0,1.2fr)_minmax(0,1fr)_auto]"
              >
                <span className="font-mono text-xs text-dim group-hover:text-accent">{String(i + 7).padStart(2, '0')}</span>
                <span>
                  <span className="block text-lg text-bone group-hover:text-accent">{p.title}</span>
                  <span className="mt-1 block text-sm text-mute sm:hidden">{p.tech.slice(0, 3).join(' · ')}</span>
                </span>
                <span className="hidden text-sm leading-relaxed text-mute sm:block">{p.description}</span>
                <ArrowUpRight className="text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </a>
            </li>
          ))}
        </ul>
      </Shell>
    </div>
  );
}
