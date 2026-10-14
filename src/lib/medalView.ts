import type { SpinView } from './logoSpin';
import type { Medal3D } from './medal3d';

/** Portion of the spin's perspective fade-in (its first 10%) over which the
 *  <img> crossfades into the 3D medal. */
const CROSSFADE = 0.35;

/**
 * SpinView for MedalLogo: during a spin the logo <img> is swapped for a real
 * 3D medal (lib/medal3d.ts, three.js), drawn on the component's <canvas>.
 *
 * The 3D code is loaded and built lazily — once the logo comes within
 * ~1500px of the viewport, and only for a copy that is actually displayed
 * (the footer has a desktop and a mobile copy; the hidden one never builds,
 * so no WebGL context is wasted on it). Until it's ready — or if WebGL is
 * unavailable or its context is lost — logoSpin falls back to the plain CSS
 * spin, so a spin is never skipped.
 */
export function createMedalView(logo: HTMLElement): (SpinView & { dispose(): void }) | null {
  const img = logo.querySelector<HTMLImageElement>('[data-medal-face]');
  const canvas = logo.querySelector<HTMLCanvasElement>('[data-medal-canvas]');
  if (!img || !canvas) return null;

  let medal: Medal3D | null = null;
  let state: 'idle' | 'loading' | 'ready' | 'off' = 'idle';

  const prepare = () => {
    if (state !== 'idle' || !logo.getClientRects().length) return; // hidden copy
    state = 'loading';
    import('./medal3d')
      .then(({ buildMedal }) => buildMedal(img, canvas))
      .then((built) => {
        if (state !== 'loading') {
          built?.dispose(); // disposed while loading
          return;
        }
        medal = built;
        state = built ? 'ready' : 'off';
      })
      .catch(() => {
        if (state === 'loading') state = 'off';
      });
  };

  const near = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        near.disconnect();
        prepare();
      }
    },
    { rootMargin: '0px 0px 1500px 0px' },
  );
  near.observe(logo);

  // GPU reset, backgrounded tab on some phones, etc.: plain spins from then on.
  const onContextLost = (e: Event) => {
    e.preventDefault();
    state = 'off';
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  return {
    glintTarget: canvas,
    ready: () => {
      prepare(); // e.g. a jump straight to the footer: build for next time
      return state === 'ready';
    },
    show: () => {
      canvas.style.opacity = '0';
      canvas.style.display = 'block';
      // render() measures the canvas, which is why it's displayed first.
      medal?.render(0, 0);
    },
    render: (deg, depth) => {
      medal?.render(deg, depth);
      // Crossfade <img> → medal over the first ~3% of the spin (and back over
      // the last), while it has turned only a couple of degrees: the two are
      // drawn by different engines and can sit a device pixel apart, which a
      // hard swap would show as a twitch.
      const f = Math.min(1, depth / CROSSFADE);
      canvas.style.opacity = String(f);
      img.style.opacity = String(1 - f);
    },
    hide: () => {
      canvas.style.display = 'none';
      canvas.style.opacity = '';
      img.style.opacity = '';
    },
    dispose: () => {
      near.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      state = 'off';
      medal?.dispose();
      medal = null;
    },
  };
}
