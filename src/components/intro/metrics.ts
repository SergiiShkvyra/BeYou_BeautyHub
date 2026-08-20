/**
 * Font size for the intro's morphing phrase, as an actual px number rather
 * than a CSS clamp() string, so it can be computed once here and handed to
 * PhraseMorph as a plain prop.
 *
 * Capped by viewport height too (not just width) so short/landscape
 * viewports — phones held sideways — don't get an oversized phrase that
 * overflows the stage.
 */
const MIN_REM = 2.1;
const MAX_REM = 4.75;
const VW_FRACTION = 0.084;
const VH_FRACTION = 0.17;

export function introPhraseFontSizePx(
  viewportWidth: number,
  viewportHeight: number = viewportWidth,
): number {
  const min = MIN_REM * 16;
  const max = MAX_REM * 16;
  const vw = VW_FRACTION * viewportWidth;
  const vh = VH_FRACTION * viewportHeight;
  // Smallest of the two viewport-relative sizes, but never below the floor.
  return Math.max(min, Math.min(max, vw, vh));
}
