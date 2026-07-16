import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Scoped GSAP setup for a section. Runs `build` inside a gsap.context bound
 * to the returned ref (StrictMode-safe via ctx.revert cleanup) and skips all
 * motion when the visitor prefers reduced motion — content is authored
 * visible, so skipping simply leaves everything in its final state.
 */
export function useReveal<T extends HTMLElement>(
  build: (scope: T) => void,
) {
  const scopeRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    if (!scopeRef.current || prefersReducedMotion()) return;
    const scope = scopeRef.current;
    const ctx = gsap.context(() => build(scope), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return scopeRef;
}

/**
 * Standard entrance: children tagged [data-reveal] inside `scope` rise and
 * fade in when they scroll into view, staggered by DOM order within each
 * trigger group. Elements tagged [data-reveal="image"] get a soft scale
 * settle instead. Every tween ends at the element's natural state.
 */
export function revealChildren(scope: HTMLElement) {
  const items = gsap.utils.toArray<HTMLElement>(
    scope.querySelectorAll('[data-reveal]'),
  );
  items.forEach((el, i) => {
    const isImage = el.dataset.reveal === 'image';
    // opacity (not autoAlpha): unrevealed elements must never be
    // visibility:hidden — screen readers and test tooling should still
    // consider them present.
    // Timing is deliberately brisk: reveals that trail a fast scroll by a
    // second read as "the page is slow", not as choreography.
    gsap.from(el, {
      y: isImage ? 0 : 28,
      scale: isImage ? 1.05 : 1,
      opacity: 0,
      duration: isImage ? 0.9 : 0.65,
      ease: 'power3.out',
      delay: (i % 4) * 0.06,
      scrollTrigger: {
        trigger: el,
        start: 'top 94%',
        once: true,
      },
    });
  });
}

export { gsap, ScrollTrigger };
