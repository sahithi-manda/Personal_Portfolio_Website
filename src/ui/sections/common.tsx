import type { ReactNode } from 'react';

export function SectionLabel({ index, children }: { index: number; children: ReactNode }) {
  return (
    <div className="eyebrow flex items-center gap-3" data-reveal>
      <span className="text-accent">{String(index).padStart(2, '0')}</span>
      <span className="h-px w-8 bg-line" />
      <span>{children}</span>
    </div>
  );
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export const Shell = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:pl-40 lg:pr-12 xl:pl-48 ${className}`}>{children}</div>
);

/** Phones: keeps the top of each section clear as a window onto the 3D scene, then fades to ink behind the copy. */
export const MobileScrim = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 md:hidden">
    <div className="absolute inset-x-0 top-[34svh] h-[22svh] bg-gradient-to-b from-transparent to-ink/90" />
    <div className="absolute inset-x-0 bottom-0 top-[56svh] bg-ink/90" />
  </div>
);
