import gsap from 'gsap';

/**
 * Something that can draw the spin in place of rotating the element itself —
 * e.g. MedalLogo's three.js medal (lib/medalView.ts).
 */
export interface SpinView {
  /** Can it take this spin? Asked at every spin start; if not, the element
   *  gets the plain CSS spin instead. */
  ready(): boolean;
  /** Spin starting: swap the view in. */
  show(): void;
  /** Draw the view turned `deg` degrees around its vertical axis, with
   *  perspective at `depth` strength (0 = none, 1 = full): it fades in as a
   *  spin starts and out as it ends, so the first and last frames match the
   *  flat element exactly. */
  render(deg: number, depth: number): void;
  /** Spin over: swap the plain element back. */
  hide(): void;
  /** Gets the glint while the view is shown. */
  glintTarget: HTMLElement;
}

/**
 * The signature logo spin: ~4 turns around the vertical axis, easing
 * slow → fast → slow, with a stage-light glint flashing as each face sweeps
 * past the viewer. The glint is enveloped over the first/last 10% of the
 * spin so the glow fades in and out instead of snapping (rotation 0° and
 * 1440° are both face-on, i.e. peak-glint angles).
 *
 * With a `view`, the turn is drawn by the view (a real 3D medal) whenever it
 * is ready; otherwise — and as the fallback — the element itself is rotated
 * with a CSS 3D transform. Transitions are disabled during a CSS spin
 * (`transition-all` would smear GSAP's per-frame transforms) and every
 * inline style is restored on completion.
 */
export function createLogoSpin(el: HTMLElement, view?: SpinView | null): gsap.core.Tween {
  const angle = { deg: 0 };
  let mode: 'view' | 'css' | null = null;
  const glintTarget = () => (mode === 'view' && view ? view.glintTarget : el);

  const finish = () => {
    if (!mode) return;
    glintTarget().style.filter = '';
    if (mode === 'view') {
      view?.hide();
    } else {
      el.style.transition = '';
      gsap.set(el, { clearProps: 'transform' }); // restore CSS hover transforms
    }
    mode = null;
  };

  return gsap.fromTo(
    angle,
    { deg: 0 },
    {
      // 4 turns at the same angular pace as the original 6-turn/5.4s spin
      deg: 360 * 4,
      duration: 3.6,
      ease: 'power2.inOut',
      paused: true,
      onStart: () => {
        finish(); // a click mid-spin restarts it cleanly
        mode = view?.ready() ? 'view' : 'css';
        if (mode === 'view') {
          view!.show();
        } else {
          el.style.transition = 'none';
          gsap.set(el, { transformPerspective: 900, transformOrigin: '50% 50%' });
        }
      },
      // Plain function, not arrow: GSAP binds `this` to the tween. (The
      // tween const must NOT be closed over here — fromTo's immediateRender
      // fires onUpdate synchronously during creation, before the const
      // exists, which crashes the whole app with a TDZ error.)
      onUpdate(this: gsap.core.Tween) {
        if (!mode) return; // that creation-time render: nothing to draw yet
        const p = this.progress();
        // Fades the glint (and a view's perspective) in/out across the
        // spin's first and last 10%
        const envelope = Math.max(0, Math.min(1, p / 0.1, (1 - p) / 0.1));
        if (mode === 'view') view!.render(angle.deg, envelope);
        else gsap.set(el, { rotationY: angle.deg });

        const glint =
          Math.pow(Math.abs(Math.cos((angle.deg * Math.PI) / 180)), 8) * envelope;
        glintTarget().style.filter =
          `brightness(${(1 + 1.1 * glint).toFixed(3)}) ` +
          `drop-shadow(0 0 ${(8 + 26 * glint).toFixed(1)}px ` +
          `rgba(228, 220, 170, ${(0.25 * envelope + 0.45 * glint).toFixed(3)}))`;
      },
      onComplete: finish,
    },
  );
}
