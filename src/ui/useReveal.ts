import { useEffect } from 'react';
import { gsap } from '../lib/scroll';

/**
 * Reveals every [data-reveal] element as it enters the viewport, including
 * elements added later (e.g. archive rows that arrive from GitHub after load).
 * Anything already scrolled past is shown immediately, so nothing can stay hidden.
 */
export function useReveal(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add('motion-ok');

    let queue: Element[] = [];
    let raf = 0;
    const flush = () => {
      raf = 0;
      const els = queue;
      queue = [];
      gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, overwrite: true });
    };
    const pending = new Set<Element>();
    const reveal = (el: Element) => {
      if (!pending.delete(el)) return;
      queue.push(el);
      if (!raf) raf = requestAnimationFrame(flush);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Entering the viewport, or already above it (scrolled past / jumped over).
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            io.unobserve(e.target);
            reveal(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );

    // Jumping far (menu links, fast flicks) can skip an element without it ever
    // intersecting; reveal anything that is now above the viewport.
    let scrollRaf = 0;
    const sweep = () => {
      scrollRaf = 0;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
          io.unobserve(el);
          reveal(el);
        }
      });
    };
    const onScroll = () => {
      if (!scrollRaf) scrollRaf = requestAnimationFrame(sweep);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const seen = new WeakSet<Element>();
    const watch = (scope: ParentNode) => {
      scope.querySelectorAll('[data-reveal]').forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        pending.add(el);
        io.observe(el);
      });
    };
    watch(document);

    const mo = new MutationObserver((records) => {
      for (const r of records) {
        // Forget elements React removed (e.g. cached rows replaced by live GitHub data).
        r.removedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          [n, ...n.querySelectorAll('[data-reveal]')].forEach((el) => {
            if (pending.delete(el)) io.unobserve(el);
          });
        });
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches('[data-reveal]') && !seen.has(n)) {
            seen.add(n);
            pending.add(n);
            io.observe(n);
          }
          watch(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      root.classList.remove('motion-ok');
    };
  }, [enabled]);
}
