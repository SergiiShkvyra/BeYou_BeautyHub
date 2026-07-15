/**
 * Shared state for the first-visit intro (IntroOverlay.tsx).
 * Separate module so component files only export components (fast refresh).
 */

/** True when the intro overlay will play on this page load. */
export const introPending =
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fired on window the moment the intro logo lands in the header. */
export const INTRO_DONE_EVENT = 'beyou:intro-done';
