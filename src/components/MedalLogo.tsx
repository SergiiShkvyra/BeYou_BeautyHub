// The footer logo, built as a thin 3D "medal" so its Y-axis spin
// (lib/logoSpin.ts) shows real thickness instead of vanishing edge-on at 90°.
//
//   front face  — the logo itself, pushed forward half the thickness
//   depth stack — RIM_LAYERS logo-shaped slices (the PNG used as a CSS mask
//                 over a solid colour) spread between the faces, shaded
//                 lighter near the faces and darker mid-rim so the side
//                 reads as a rounded edge; an edge wall for the exact
//                 side-on moment (see below); plus the back face
//
// The logo is open line-art, so from behind you look THROUGH the medal and
// see the rim slices mirrored. The back face is therefore mirrored too (just
// pushed back, not turned around) — like clear acrylic seen from behind. A
// back face turned 180° to "read correctly" would criss-cross the slices
// showing through the open middle.
//
// The depth stack is display:none at rest (logoSpin shows it only while
// spinning), so the resting logo renders exactly as a plain <img> would.
//
// Nothing between the spinning element and these layers may set `filter`,
// `opacity` or `overflow` — each of those flattens transform-style:
// preserve-3d and the medal collapses back into a flat card. That's why the
// hover fade lives on the outer wrapper (outside the 3D context) and the
// glint is applied to the faces individually rather than to the spinner.

const SRC = '/images/logoPSD-2.png';
const THICKNESS = 12; // px, front face to back face
const RIM_LAYERS = 16; // ~0.7px apart — dense enough to read as one solid edge

// Where the ring sits inside the PNG (transparent margin above/below it).
const RING_TOP = '3.53%';
const RING_HEIGHT = '89.75%';

// Shades of the logo's own colour, rgb(226, 225, 177).
const RIM_LIGHT = [185, 184, 145];
const RIM_DARK = [124, 124, 97];

const rimColor = (depth: number) => {
  // depth 0..1 front→back; darkest at the middle of the edge
  const k = Math.sin(Math.PI * depth);
  const [r, g, b] = RIM_LIGHT.map((c, i) => Math.round(c + (RIM_DARK[i] - c) * k));
  return `rgb(${r}, ${g}, ${b})`;
};

const half = THICKNESS / 2;
const mask = `url(${SRC})`;

export default function MedalLogo({ heightClass }: { heightClass: string }) {
  return (
    <div className="opacity-80 hover:opacity-100 transition-opacity duration-200">
      <div
        data-footer-logo
        title="Spin me"
        className="relative cursor-pointer will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <img
          data-medal-face
          src={SRC}
          alt="BeYou BeautyHub Logo"
          className={`${heightClass} block w-auto object-contain`}
          style={{ transform: `translateZ(${half}px)`, backfaceVisibility: 'hidden' }}
          loading="lazy"
          decoding="async"
        />
        <div
          data-medal-depth
          aria-hidden="true"
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d', display: 'none' }}
        >
          {Array.from({ length: RIM_LAYERS }, (_, i) => {
            const depth = (i + 1) / (RIM_LAYERS + 1);
            return (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  transform: `translateZ(${(half - THICKNESS * depth).toFixed(2)}px)`,
                  background: rimColor(depth),
                  // --rim-light: edge-on highlight, driven by logoSpin.ts
                  filter: 'brightness(var(--rim-light, 1))',
                  WebkitMaskImage: mask,
                  maskImage: mask,
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                }}
              />
            );
          })}
          {/* Edge wall: a strip at right angles to the faces, through the
              medal's vertical axis. The slices are flat sheets, and a sheet
              seen exactly edge-on has zero width — so right around 90° they
              thin out to broken lines and vanish. This strip faces the
              viewer at exactly that moment, as the solid band a real medal's
              edge would show. It fades in only near side-on (--rim-edge,
              logoSpin.ts); at other angles it would show through the logo's
              open middle as a fin. */}
          <div
            className="absolute"
            style={{
              left: `calc(50% - ${half}px)`,
              top: RING_TOP,
              height: RING_HEIGHT,
              width: THICKNESS,
              borderRadius: 2,
              transform: 'rotateY(90deg)',
              background: `linear-gradient(to right, ${rimColor(0.08)}, ${rimColor(0.5)}, ${rimColor(0.92)})`,
              filter: 'brightness(var(--rim-light, 1))',
              opacity: 'var(--rim-edge, 0)',
            }}
          />
          <img
            data-medal-face
            src={SRC}
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
            style={{ transform: `translateZ(${-half}px)` }}
            // lazy + display:none parent = not fetched at page load; by the
            // time the stack is shown, the front face has cached the file.
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}
