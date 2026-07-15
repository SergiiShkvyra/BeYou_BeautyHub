/**
 * Cursor-tracking glow for elements tagged with .glow-btn (light inside the
 * button surface) or .glow-text (light inside the letterforms via
 * background-clip: text).
 *
 * One passive document-level pointermove listener updates --glow-x/--glow-y
 * on the hovered element; index.css paints a radial "light" at that point.
 * Touch-only devices skip entirely — there is no cursor to follow.
 */
export function initCursorGlow(): () => void {
  if (
    typeof window === 'undefined' ||
    window.matchMedia('(hover: none)').matches
  ) {
    return () => {};
  }

  const onMove = (e: PointerEvent) => {
    const target = (e.target as Element | null)?.closest?.(
      '.glow-btn, .glow-text',
    ) as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    target.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
  };

  document.addEventListener('pointermove', onMove, { passive: true });
  return () => document.removeEventListener('pointermove', onMove);
}
