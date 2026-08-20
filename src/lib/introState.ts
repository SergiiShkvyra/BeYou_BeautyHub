/**
 * Shared state for the first-visit intro (IntroOverlay.tsx).
 * Separate module so component files only export components (fast refresh).
 */

/** True when the intro overlay will play on this page load. */
export const introPending =
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fired on window the moment the intro begins its hand-off — the logo
 *  starts falling into the header and the veil starts dissolving. Hero
 *  starts its entrance on this beat so the animation is actually seen. */
export const INTRO_DONE_EVENT = 'beyou:intro-done';
