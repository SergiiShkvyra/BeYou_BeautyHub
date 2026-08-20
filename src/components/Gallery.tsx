import { useEffect, useState } from 'react';
import { useReveal, revealChildren } from '../lib/useReveal';
import RoundCarousel from './RoundCarousel';
import GalleryZoom from './GalleryZoom';

// Swap pictures by replacing the files in public/images/gallery (keep the
// filenames) or by editing the entries below — the carousel adapts to
// however many images are listed here.
const images = [
  {
    src: '/images/gallery/IMG_01.jpg',
    alt: 'Professional eyelash extension work showcasing volume and length'
  },
  {
    src: '/images/gallery/IMG_02.JPG',
    alt: 'Beautiful eyebrow shaping and tinting results'
  },
  {
    src: '/images/gallery/IMG_03.jpg',
    alt: 'Professional lash lift and tint transformation'
  },
  {
    src: '/images/gallery/IMG_04.JPG',
    alt: 'Volume lash extensions creating dramatic eye enhancement'
  },
  {
    src: '/images/gallery/IMG_05.jpg',
    alt: 'Natural lash enhancement with professional techniques'
  },
  {
    src: '/images/gallery/IMG_06.JPG',
    alt: 'Beautiful brow lamination and shaping results'
  },
  {
    src: '/images/gallery/IMG_07.jpg',
    alt: 'Professional eyebrow tinting and design work'
  },
  {
    src: '/images/gallery/IMG_08.JPG',
    alt: 'Stunning lash extension transformation showcasing our expertise'
  }
];

const Gallery = () => {
  const scope = useReveal<HTMLElement>((section) => revealChildren(section));

  // The carousel's face size is real 3D geometry (drives the ring radius),
  // not CSS, so it needs actual breakpoint values rather than Tailwind
  // classes — mirrored to Tailwind's own sm/lg breakpoints.
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280,
  );
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Which picture is zoomed in (null = carousel only), and the carousel card
  // box it grew out of — the zoom animates from and back to that geometry.
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [zoomOrigin, setZoomOrigin] = useState<DOMRect | null>(null);

  const isSmall = viewportWidth < 640;
  const isMedium = viewportWidth >= 640 && viewportWidth < 1024;
  const imageWidth = isSmall ? 220 : isMedium ? 340 : 460;
  // 1.2:1 — the new gallery photos are square (often 2-row grid collages),
  // and the previous ~1.49:1 frame cropped a third of their height away.
  const imageHeight = isSmall ? 183 : isMedium ? 283 : 383;

  return (
    <section id="gallery" ref={scope} className="py-24 sm:py-32 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-16 sm:mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p data-reveal className="micro-label mb-5">
              Gallery
            </p>
            <h2 data-reveal className="font-display text-4xl sm:text-5xl lg:text-6xl text-olive-ink leading-[1.05]">
              Our <span className="italic text-olive">Work</span>
            </h2>
          </div>
          <p data-reveal className="text-lg text-olive-ink/70 leading-relaxed max-w-md lg:text-right">
            See the beautiful transformations we've created for our clients
          </p>
        </div>

        <div data-reveal className="h-[260px] sm:h-[340px] lg:h-[460px]">
          <RoundCarousel
            images={images}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            spacing={1}
            speed={2}
            direction="right"
            drag
            sensitivity={1}
            tilt={-16}
            perspective={900}
            cornerRadius={16}
            innerDim={7}
            background="transparent"
            onImageClick={(i, rect) => {
              setZoomOrigin(rect);
              setZoomIndex(i);
            }}
            // Frozen while zoomed, and kept aimed at the picture on screen so
            // closing lands the ring on whatever the visitor navigated to.
            paused={zoomIndex !== null}
            focusIndex={zoomIndex}
          />
        </div>
      </div>

      <GalleryZoom
        images={images}
        index={zoomIndex}
        originRect={zoomOrigin}
        onClose={() => setZoomIndex(null)}
        onIndexChange={setZoomIndex}
      />
    </section>
  );
};

export default Gallery;
