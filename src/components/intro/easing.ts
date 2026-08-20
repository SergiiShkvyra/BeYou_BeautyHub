/**
 * Cubic-bezier sampler shared by the intro's GSAP timeline and its
 * canvas/rAF-driven particle phases — lets every phase use the same easing
 * curves without pulling in GSAP's CustomEase plugin for the canvas-only
 * parts, which have no GSAP tween to attach an ease to in the first place.
 */
export function cubicBezierEase(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const dX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (p: number) => {
    let t = p;
    for (let i = 0; i < 8; i++) {
      const x = sampleX(t) - p;
      const d = dX(t);
      if (Math.abs(x) < 1e-4 || Math.abs(d) < 1e-6) break;
      t -= x / d;
    }
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return sampleY(t);
  };
}

/** Matches the Originkit presets' shared cubic-bezier easing curve. */
export const brandEase = cubicBezierEase(0.44, 0, 0.56, 1);

export const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

export const backOut = (t: number) => {
  const c = 1.70158 + 1;
  return 1 + c * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
};
