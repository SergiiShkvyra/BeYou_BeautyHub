/**
 * Cursor-tracking glow for elements tagged with .glow-btn (light inside the
 * button surface) or .glow-text (light inside the letterforms via
 * background-clip: text).
 *
 * Mouse: one passive document-level pointermove listener updates
 * --glow-x/--glow-y on the hovered element; CSS :hover paints the light.
 *
 * Touch: fingers don't hover, so touchstart/touchmove find the .glow-text
 * under the finger (elementFromPoint), position the light at the touch
 * point and toggle the .glow-touch class — the light appears on touch,
 * follows a sliding finger across elements, and lingers briefly on release.
 */
export function initCursorGlow(): () => void {
  if (typeof window === 'undefined') return () => {};

  // --- Mouse / trackpad ----------------------------------------------------
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

  // --- Touch ---------------------------------------------------------------
  let touchEl: HTMLElement | null = null;
  let releaseTimer: ReturnType<typeof setTimeout> | undefined;

  const onTouch = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    const under = document.elementFromPoint(t.clientX, t.clientY);
    const target = (under?.closest?.('.glow-text') ?? null) as HTMLElement | null;
    if (touchEl && touchEl !== target) touchEl.classList.remove('glow-touch');
    if (target) {
      clearTimeout(releaseTimer);
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--glow-x', `${t.clientX - rect.left}px`);
      target.style.setProperty('--glow-y', `${t.clientY - rect.top}px`);
      target.classList.add('glow-touch');
    }
    touchEl = target;
  };

  const onTouchEnd = () => {
    if (!touchEl) return;
    const el = touchEl;
    touchEl = null;
    // Let the light linger for a beat instead of vanishing mid-tap
    releaseTimer = setTimeout(() => el.classList.remove('glow-touch'), 450);
  };

  document.addEventListener('touchstart', onTouch, { passive: true });
  document.addEventListener('touchmove', onTouch, { passive: true });
  document.addEventListener('touchend', onTouchEnd, { passive: true });
  document.addEventListener('touchcancel', onTouchEnd, { passive: true });

  return () => {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('touchstart', onTouch);
    document.removeEventListener('touchmove', onTouch);
    document.removeEventListener('touchend', onTouchEnd);
    document.removeEventListener('touchcancel', onTouchEnd);
    clearTimeout(releaseTimer);
  };
}
