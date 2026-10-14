import gsap from 'gsap';

export interface LogoSpinParts {
  /** Elements that get the face-on glint. Defaults to the spinning element
   *  itself — but for a 3D build (preserve-3d) pass the faces: a `filter` on
   *  the spinning element would flatten its 3D children. */
  faces?: HTMLElement[];
  /** Extra 3D depth (e.g. MedalLogo's rim + back face): shown only while
   *  spinning, and driven by two custom properties — `--rim-light` (the
   *  side brightens as it turns toward the viewer) and `--rim-edge` (0→1
   *  fade-in for the solid edge wall right around side-on). */
  depth?: HTMLElement | null;
}

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
export function createLogoSpin(
  el: HTMLElement,
  { faces, depth }: LogoSpinParts = {},
): gsap.core.Tween {
  const glintTargets = faces?.length ? faces : [el];
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
        if (depth) depth.style.display = '';
        gsap.set(el, { transformPerspective: 900, transformOrigin: '50% 50%' });
      },
      // Plain function, not arrow: GSAP binds `this` to the tween. (The
      // tween const must NOT be closed over here — fromTo's immediateRender
      // fires onUpdate synchronously during creation, before the const
      // exists, which crashes the whole app with a TDZ error.)
      onUpdate(this: gsap.core.Tween) {
        const deg = gsap.getProperty(el, 'rotationY') as number;
        const rad = (deg * Math.PI) / 180;
        const p = this.progress();
        // Fade the glint in/out across the spin's first and last 10%
        const envelope = Math.max(0, Math.min(1, p / 0.1, (1 - p) / 0.1));
        const glint = Math.pow(Math.abs(Math.cos(rad)), 8) * envelope;
        const filter =
          `brightness(${(1 + 1.1 * glint).toFixed(3)}) ` +
          `drop-shadow(0 0 ${(8 + 26 * glint).toFixed(1)}px ` +
          `rgba(228, 220, 170, ${(0.25 + 0.45 * glint).toFixed(3)}))`;
        glintTargets.forEach((t) => (t.style.filter = filter));
        if (depth) {
          const sideOn = Math.abs(Math.sin(rad)); // 1 at 90°, 270°…
          // The rim catches the light as it turns toward the viewer…
          depth.style.setProperty(
            '--rim-light',
            (0.85 + 0.45 * Math.pow(sideOn, 4)).toFixed(3),
          );
          // …and the solid edge wall takes over for the last ~14° before
          // exactly side-on, where the flat rim slices thin out to nothing.
          const s = Math.min(1, Math.max(0, (sideOn - 0.97) / 0.025));
          depth.style.setProperty('--rim-edge', (s * s * (3 - 2 * s)).toFixed(3));
        }
      },
      onComplete: () => {
        glintTargets.forEach((t) => (t.style.filter = ''));
        if (depth) {
          depth.style.display = 'none';
          depth.style.removeProperty('--rim-light');
          depth.style.removeProperty('--rim-edge');
        }
        el.style.transition = '';
        gsap.set(el, { clearProps: 'transform' }); // restore CSS hover transforms
      },
    },
  );
}
