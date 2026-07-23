import gsap from 'gsap';

/**
 * The signature logo spin: ~4 turns around the vertical axis, easing
 * slow → fast → slow, with a stage-light glint flashing as each face sweeps
 * past the viewer. The glint is enveloped over the first/last 10% of the
 * spin so the glow fades in and out instead of snapping (rotation 0° and
 * 1440° are both face-on, i.e. peak-glint angles).
 *
 * Transitions are disabled during the spin (CSS `transition-all` on an
 * element would smear GSAP's per-frame transforms) and every inline style
 * is restored on completion, so the element's own hover behaviors keep
 * working exactly as before.
 */
export function createLogoSpin(el: HTMLElement): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { rotationY: 0 },
    {
      // 4 turns at the same angular pace as the original 6-turn/5.4s spin
      rotationY: 360 * 4,
      duration: 3.6,
      ease: 'power2.inOut',
      paused: true,
      onStart: () => {
        el.style.transition = 'none';
        gsap.set(el, { transformPerspective: 900, transformOrigin: '50% 50%' });
      },
      // Plain function, not arrow: GSAP binds `this` to the tween. (The
      // tween const must NOT be closed over here — fromTo's immediateRender
      // fires onUpdate synchronously during creation, before the const
      // exists, which crashes the whole app with a TDZ error.)
      onUpdate(this: gsap.core.Tween) {
        const deg = gsap.getProperty(el, 'rotationY') as number;
        const p = this.progress();
        // Fade the glint in/out across the spin's first and last 10%
        const envelope = Math.max(0, Math.min(1, p / 0.1, (1 - p) / 0.1));
        const glint =
          Math.pow(Math.abs(Math.cos((deg * Math.PI) / 180)), 8) * envelope;
        el.style.filter =
          `brightness(${(1 + 1.1 * glint).toFixed(3)}) ` +
          `drop-shadow(0 0 ${(8 + 26 * glint).toFixed(1)}px ` +
          `rgba(228, 220, 170, ${(0.25 + 0.45 * glint).toFixed(3)}))`;
      },
      onComplete: () => {
        el.style.filter = '';
        el.style.transition = '';
        gsap.set(el, { clearProps: 'transform' }); // restore CSS hover transforms
      },
    },
  );
}
