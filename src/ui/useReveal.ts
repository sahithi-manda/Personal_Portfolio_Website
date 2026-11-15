import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/scroll';

/** Batch-reveals every [data-reveal] element as it enters the viewport. */
export function useReveal(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('motion-ok');
    const triggers = ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      once: true,
      onEnter: (els) =>
        gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener('load', refresh);
      document.documentElement.classList.remove('motion-ok');
    };
  }, [enabled]);
}
