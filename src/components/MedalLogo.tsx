// The footer logo. At rest it is just the <img>. While it spins (logoSpin,
// wired up in Footer.tsx) the <img> is swapped for a real 3D medal drawn on
// the <canvas> — the logo traced from the PNG and extruded into a solid with
// three.js (lib/medal3d.ts, loaded on demand via lib/medalView.ts). Every
// stroke has continuous side walls, so it reads as one thick object at any
// angle, and the open line-art stays see-through: from behind it shows the
// logo mirrored.
//
// The canvas is centred on the logo and overhangs it by 10% on each side —
// room for the near edge growing in perspective mid-turn. It stays
// display:none except during a spin.

const SRC = '/images/logoPSD-2.png';

export default function MedalLogo({ heightClass }: { heightClass: string }) {
  return (
    <div className="opacity-80 hover:opacity-100 transition-opacity duration-200">
      <div data-footer-logo title="Spin me" className="relative cursor-pointer">
        <img
          data-medal-face
          src={SRC}
          alt="BeYou BeautyHub Logo"
          className={`${heightClass} block w-auto object-contain`}
          loading="lazy"
          decoding="async"
        />
        <canvas
          data-medal-canvas
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ display: 'none', left: '-10%', top: '-10%', width: '120%', height: '120%' }}
        />
      </div>
    </div>
  );
}
