import type { SpecimenKind } from '../../content/labs';

/**
 * Lightweight SVG "specimen" for each project card in the reel.
 * Pure SVG + CSS animations (no canvas) so a reel of cards stays cheap.
 */
export function LabMotif({ kind, seed }: { kind: SpecimenKind; seed: number }) {
  const rnd = mulberry(seed * 9973 + 17);
  switch (kind) {
    case 'sorting': {
      const bars = Array.from({ length: 14 }, (_, i) => 18 + ((i * 37 + seed * 11) % 62));
      return (
        <svg viewBox="0 0 160 100" className="reel-motif" aria-hidden>
          {bars.map((h, i) => (
            <rect
              key={i}
              x={8 + i * 10.4}
              y={92 - h}
              width={6.4}
              height={h}
              rx={1}
              className={i === 6 || i === 7 ? 'fill-accent motif-pulse' : 'fill-bone/25'}
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </svg>
      );
    }
    case 'facescan': {
      const pts = Array.from({ length: 46 }, (_, i) => {
        const a = (i / 46) * Math.PI * 2;
        const r = 30 + (rnd() - 0.5) * 10;
        return [80 + Math.cos(a) * r * 0.78 + (rnd() - 0.5) * 18, 52 + Math.sin(a) * r + (rnd() - 0.5) * 16];
      });
      return (
        <svg viewBox="0 0 160 100" className="reel-motif" aria-hidden>
          <ellipse cx="80" cy="52" rx="28" ry="36" className="fill-none stroke-accent/40" strokeWidth="0.6" />
          {pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 7 === 0 ? 1.6 : 0.9} className={i % 7 === 0 ? 'fill-accent' : 'fill-bone/50'} />
          ))}
          <rect x="44" y="14" width="72" height="1.2" className="fill-accent motif-scan" />
        </svg>
      );
    }
    case 'eigen': {
      return (
        <svg viewBox="0 0 160 100" className="reel-motif" aria-hidden>
          {Array.from({ length: 15 }, (_, i) => {
            const c = i % 5;
            const r = Math.floor(i / 5);
            const o = 0.12 + rnd() * 0.5;
            return <rect key={i} x={22 + c * 24} y={14 + r * 25} width={20} height={21} rx={2} className="fill-accent" opacity={o} />;
          })}
          <path d="M14 96 L146 96" className="stroke-bone/20" strokeWidth="0.6" />
        </svg>
      );
    }
    case 'ocr': {
      return (
        <svg viewBox="0 0 160 100" className="reel-motif" aria-hidden>
          {[0, 1, 2, 3, 4].map((l) => (
            <g key={l}>
              <rect x="20" y={18 + l * 15} width={60 + ((l * 29 + seed * 7) % 60)} height="5" rx="2.5" className="fill-bone/25" />
              <rect x="18" y={15 + l * 15} width={64 + ((l * 29 + seed * 7) % 60)} height="11" rx="2" className="fill-none stroke-accent/50" strokeWidth="0.5" />
            </g>
          ))}
          <rect x="12" y="10" width="2" height="80" className="fill-accent motif-sweep" />
        </svg>
      );
    }
    case 'resume': {
      const nodes = Array.from({ length: 9 }, () => [24 + rnd() * 112, 16 + rnd() * 68] as const);
      return (
        <svg viewBox="0 0 160 100" className="reel-motif" aria-hidden>
          {nodes.map(([x, y], i) =>
            nodes.slice(i + 1, i + 3).map(([x2, y2], j) => (
              <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} className="stroke-accent/35" strokeWidth="0.6" />
            )),
          )}
          {nodes.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 0 ? 4 : 2.2} className={i === 0 ? 'fill-accent motif-pulse' : 'fill-bone/60'} />
          ))}
        </svg>
      );
    }
    case 'timeseries':
    default: {
      const pts: string[] = [];
      for (let i = 0, y = 60; i < 24; i++) {
        y = Math.min(88, Math.max(12, y + (rnd() - 0.48) * 14));
        pts.push(`${8 + i * 6.3},${y.toFixed(1)}`);
      }
      return (
        <svg viewBox="0 0 160 100" className="reel-motif" aria-hidden>
          {[25, 50, 75].map((g) => (
            <path key={g} d={`M8 ${g} H152`} className="stroke-bone/10" strokeWidth="0.5" />
          ))}
          <polyline points={pts.join(' ')} className="fill-none stroke-accent motif-draw" strokeWidth="1.4" />
        </svg>
      );
    }
  }
}

function mulberry(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
