import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../lib/useReveal';

interface ZoomImage {
  src: string;
  alt: string;
}

interface GalleryZoomProps {
  images: ZoomImage[];
  /** Index to show; null when the zoomed view is closed. */
  index: number | null;
  /** On-screen box of the carousel card that was clicked — the geometry the
   *  zoom animates out of (and back into). */
  originRect: DOMRect | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

// Ring geometry, matching RoundCarousel's so the zoomed view is the same
// carousel at a larger scale rather than a different-looking widget.
const TILT = -16; // deg the whole ring is tipped toward the viewer
const SPACING = 1;
const CORNER = 16;
const INNER_DIM = 7; // back faces are dimmed to this tenth of full brightness
const ASPECT = 1.2; // the carousel's card proportions — keep in sync with
// Gallery.tsx's imageWidth/imageHeight ratio (currently 460/383 etc., 1.2:1)
const PERSPECTIVE_RATIO = 900 / 460; // perspective per px of card width

const SNAP_MS = 520;
const DRAG_DEG_PER_PX = 0.32;
const SWIPE_VELOCITY = 0.35; // px/ms flick that advances a card on its own
const WHEEL_COOLDOWN_MS = 340; // one card per gesture, not per raw event
const WHEEL_THRESHOLD = 4; // ignore the sub-pixel noise trackpads emit

/**
 * The zoomed-in gallery: the carousel itself scales up to fill the screen —
 * same 3D ring, same tilt, same dim back-facing cards — with one difference,
 * the front card is counter-rotated so it sits perfectly flat and square to
 * the viewer for detail. Everything else keeps its perspective, so the ring
 * still reads as a carousel.
 *
 * The clicked picture grows out of the exact box it occupied in the small
 * carousel (and flies back into it on close), and the flattening of the
 * front card animates along with the growth.
 *
 * Deliberately not a dark modal: the backdrop is the site's own solid cream,
 * so this reads as the gallery expanding. It is opaque on purpose — a
 * translucent wash let the small carousel show through directly behind the
 * zoomed one, which read as a doubled image.
 *
 * Navigation: drag/swipe the ring, the arrow buttons (pointer screens only),
 * clicking any other card, or the arrow keys. Clicking the empty space —
 * or X, or Escape — zooms back out.
 */
export default function GalleryZoom({
  images,
  index,
  originRect,
  onClose,
  onIndexChange,
}: GalleryZoomProps) {
  const count = images.length;
  const open = index !== null;

  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const frontFaceRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef(0); // live ring rotation, in degrees
  const dragRef = useRef({ id: -1, startX: 0, startRot: 0, t: 0, moved: 0 });
  const swipedRef = useRef(false);
  const closingRef = useRef(false);
  const wheelAtRef = useRef(0);
  // Latest origin box: the parent clears the prop while closing, but the
  // fly-back still needs it.
  const originRef = useRef<DOMRect | null>(null);
  if (originRect) originRef.current = originRect;

  // The front card lies flat only once the zoom has grown in; starting
  // un-flattened means it matches the small carousel's tilted card exactly,
  // and the flattening animates as part of the zoom.
  const [flat, setFlat] = useState(false);

  const [viewport, setViewport] = useState(() => ({
    w: typeof window === 'undefined' ? 1280 : window.innerWidth,
    h: typeof window === 'undefined' ? 800 : window.innerHeight,
  }));
  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Card size: big enough to study, small enough that the neighbouring cards
  // still curve away on both sides. Height is capped so a short (landscape
  // phone) window can't push the ring past the top and bottom edges.
  const cardW = Math.min(
    viewport.w < 640 ? viewport.w * 0.72 : viewport.w < 1024 ? viewport.w * 0.56 : viewport.w * 0.46,
    760,
    viewport.h * 0.62 * ASPECT,
  );
  const cardH = cardW / ASPECT;

  // The arrows are for pointer screens only. Phones are excluded twice over:
  // portrait ones fall below the 640px cut, and landscape ones clear it
  // (they're >=768px wide) but have a short screen the arrows would crowd —
  // the same `(orientation: landscape) and (max-height: 500px)` case the
  // stylesheet special-cases elsewhere. Dragging the ring or tapping another
  // card covers navigation on both.
  const isLandscapePhone = viewport.h <= 500 && viewport.w > viewport.h;
  const showArrows = viewport.w >= 640 && !isLandscapePhone;
  const angle = 360 / count;
  const radius = (cardW * (1 + SPACING * 0.15)) / (2 * Math.tan(Math.PI / count));
  const perspective = cardW * PERSPECTIVE_RATIO;

  const applyRotation = useCallback(
    (deg: number, animate: boolean) => {
      const ring = ringRef.current;
      if (!ring) return;
      rotRef.current = deg;
      ring.style.transition = animate
        ? `transform ${SNAP_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
        : 'none';
      ring.style.transform = `translateZ(${-radius}px) rotateY(${deg}deg)`;
    },
    [radius],
  );

  /** Rotate so `next` faces front, taking the short way round. */
  const goTo = useCallback(
    (next: number) => {
      const target = -next * angle;
      const turns = Math.round((rotRef.current - target) / 360);
      applyRotation(target + turns * 360, true);
      onIndexChange(((next % count) + count) % count);
    },
    [angle, applyRotation, count, onIndexChange],
  );

  const step = useCallback(
    (delta: number) => {
      if (index === null || delta === 0) return;
      goTo((((index + delta) % count) + count) % count);
    },
    [index, count, goTo],
  );

  /** Fly the front card back into its carousel card, then unmount. */
  const close = useCallback(() => {
    // Cleared again on reopen — leaving it set is what once made every open
    // after the first impossible to close.
    if (closingRef.current) return;
    closingRef.current = true;
    const root = rootRef.current;
    const scene = sceneRef.current;
    const face = frontFaceRef.current;
    const origin = originRef.current;

    if (prefersReducedMotion() || !root || !scene || !face || !origin) {
      onClose();
      return;
    }

    setFlat(false); // tips back to the carousel's angle as it shrinks
    const rect = face.getBoundingClientRect();
    gsap.timeline({ onComplete: onClose })
      .to(
        scene,
        {
          x: origin.left + origin.width / 2 - (rect.left + rect.width / 2),
          y: origin.top + origin.height / 2 - (rect.top + rect.height / 2),
          scale: origin.width / rect.width,
          duration: 0.45,
          ease: 'power3.inOut',
        },
        0,
      )
      .to(root.querySelectorAll('[data-zoom-chrome]'), { opacity: 0, duration: 0.2 }, 0)
      .to(root, { opacity: 0, duration: 0.28, ease: 'power2.in' }, 0.17);
  }, [onClose]);

  // Open: point the ring at the clicked card, then grow the whole scene out
  // of that card's on-screen box while the front face flattens.
  useLayoutEffect(() => {
    if (!open || index === null) return;
    closingRef.current = false;
    applyRotation(-index * angle, false);

    const root = rootRef.current;
    const scene = sceneRef.current;
    const face = frontFaceRef.current;
    const origin = originRef.current;
    if (prefersReducedMotion() || !root || !scene || !face || !origin) {
      setFlat(true);
      return;
    }

    const rect = face.getBoundingClientRect();
    // Scale about the front card's centre so the growth tracks that card
    // rather than the ring's bounding box.
    const sceneRect = scene.getBoundingClientRect();
    const ctx = gsap.context(() => {
      gsap.set(scene, {
        transformOrigin: `${rect.left + rect.width / 2 - sceneRect.left}px ${
          rect.top + rect.height / 2 - sceneRect.top
        }px`,
      });
      gsap.from(root, { opacity: 0, duration: 0.28, ease: 'power2.out' });
      gsap.from(scene, {
        x: origin.left + origin.width / 2 - (rect.left + rect.width / 2),
        y: origin.top + origin.height / 2 - (rect.top + rect.height / 2),
        scale: origin.width / rect.width,
        duration: 0.6,
        ease: 'power3.out',
      });
      gsap.from(root.querySelectorAll('[data-zoom-chrome]'), {
        opacity: 0,
        duration: 0.35,
        delay: 0.25,
        ease: 'power2.out',
      });
    }, root);

    // Next frame, so the CSS transition on the face has a value to move from.
    const id = requestAnimationFrame(() => setFlat(true));
    return () => {
      cancelAnimationFrame(id);
      ctx.revert();
    };
    // Depends on `open` only: stepping through pictures must not replay this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Escape closes, arrows step, page scroll is locked behind the view.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close, step]);

  // The wheel turns the carousel instead of the page: one picture per
  // gesture (scroll down / right = forward), with a cooldown so a single
  // flick of a high-resolution wheel or trackpad doesn't rip through the
  // whole ring. Registered natively with passive:false — preventDefault is
  // what stops the page scrolling underneath, and React's own onWheel can't
  // guarantee a non-passive listener.
  useEffect(() => {
    if (!open) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < WHEEL_THRESHOLD) return;
      const now = performance.now();
      if (now - wheelAtRef.current < WHEEL_COOLDOWN_MS) return;
      wheelAtRef.current = now;
      step(delta > 0 ? 1 : -1);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [open, step]);

  if (!open || index === null) return null;

  // ---- drag: spin the ring under the finger, then snap to a card ----
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    dragRef.current = {
      id: e.pointerId,
      startX: e.clientX,
      startRot: rotRef.current,
      t: performance.now(),
      moved: 0,
    };
    swipedRef.current = false;
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (d.id !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    applyRotation(d.startRot + dx * DRAG_DEG_PER_PX, false);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (d.id !== e.pointerId) return;
    d.id = -1;
    const dx = e.clientX - d.startX;
    if (d.moved <= 8) return; // a tap, not a drag — click handlers deal with it
    swipedRef.current = true;

    // A quick flick carries one card past the halfway point on its own.
    const speed = Math.abs(dx) / Math.max(1, performance.now() - d.t);
    const flick = speed > SWIPE_VELOCITY ? Math.sign(dx) * angle * 0.5 : 0;
    const settled = rotRef.current + flick;
    goTo(((Math.round(-settled / angle) % count) + count) % count);
  };

  const chrome =
    'place-items-center rounded-full bg-warm/80 hover:bg-olive text-olive-ink hover:text-warm shadow-lg shadow-olive/20 backdrop-blur-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-olive';

  const faceBase: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: CORNER,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    // Safari-only bug (reproduced in WebKit): border-radius + overflow:hidden
    // fails to clip — square corners — and the face flickers/z-fights while
    // the ring rotates, when a continuously 3D-transformed element like this
    // isn't hinted to its own stable compositing layer. will-change forces
    // that persistent layer; Chromium/Firefox already render this correctly
    // and are unaffected by the hint.
    willChange: 'transform',
  };
  const imgStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    // iOS Safari's own long-press callout ("Save to Photos", "Copy", …).
    // Neither property is in React's CSSProperties types (WebKit-only,
    // undocumented-in-spec), hence the cast below. Verified unable to be
    // reproduced or confirmed via any available desktop browser engine —
    // neither Chromium nor Playwright's WebKit build implement this
    // property at all (it's tied to iOS's native callout UI, which doesn't
    // exist on desktop), so this needs a real-iPhone check.
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
  } as CSSProperties;

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery, zoomed in"
      className="fixed inset-0 flex items-center justify-center select-none bg-cream"
      // zoom-out: clicking the empty space closes. It also restores a VISIBLE
      // pointer here — the site hides the native cursor (html.no-native-cursor)
      // in favour of the sparkle, which this overlay covers; declaring a real
      // cursor both shows a native shape and makes SparkleCursor stand aside,
      // exactly as it does over buttons and links.
      style={{ zIndex: 2147483647, cursor: 'zoom-out', touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (swipedRef.current) return; // a drag is never a click
        if (target.closest('button') || target.closest('[data-picture]')) return;
        close();
      }}
    >
      {/* Close */}
      <button
        data-zoom-chrome
        type="button"
        onClick={close}
        aria-label="Close the zoomed gallery"
        className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-20 grid h-12 w-12 ${chrome}`}
      >
        <X className="h-6 w-6" />
      </button>

      {/* Previous / next — pointer screens only (see showArrows) */}
      {showArrows && (
        <>
          <button
            data-zoom-chrome
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous image"
            className={`absolute left-6 top-1/2 -translate-y-1/2 z-20 grid h-14 w-14 ${chrome}`}
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            data-zoom-chrome
            type="button"
            onClick={() => step(1)}
            aria-label="Next image"
            className={`absolute right-6 top-1/2 -translate-y-1/2 z-20 grid h-14 w-14 ${chrome}`}
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      )}

      {/* The ring. pointer-events stay off everywhere except the card faces,
          so the empty space around and between cards still closes the zoom
          (and pointer events for dragging bubble up from the root anyway). */}
      <div
        ref={sceneRef}
        style={{ perspective: `${perspective}px`, pointerEvents: 'none' }}
      >
        <div style={{ transformStyle: 'preserve-3d', transform: `rotateX(${TILT}deg)` }}>
          <div
            ref={ringRef}
            style={{
              position: 'relative',
              width: cardW,
              height: cardH,
              transformStyle: 'preserve-3d',
            }}
          >
            {images.map((image, i) => {
              const isFront = i === index;
              return (
                <div
                  key={image.src}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Counter-rotating wrapper: cancels the ring's tilt for the
                      front card only, so that one card is square to the
                      viewer while every other card keeps its perspective. */}
                  <div
                    data-picture
                    onClick={() => {
                      if (!isFront && !swipedRef.current) goTo(i);
                    }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      transformStyle: 'preserve-3d',
                      transform: `rotateX(${isFront && flat ? -TILT : 0}deg)`,
                      transition: `transform ${SNAP_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                      pointerEvents: 'auto',
                      cursor: isFront ? 'default' : 'pointer',
                    }}
                  >
                    <div
                      ref={isFront ? frontFaceRef : undefined}
                      style={{
                        ...faceBase,
                        boxShadow: isFront
                          ? '0 24px 60px rgba(38,44,32,0.4)'
                          : '0 10px 30px rgba(38,44,32,0.3)',
                      }}
                    >
                      <img
                        src={image.src}
                        alt={isFront ? image.alt : ''}
                        aria-hidden={!isFront}
                        style={imgStyle}
                        draggable={false}
                        decoding="async"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>
                    {/* Back face — seen through the ring at some angles, dimmed */}
                    <div
                      style={{
                        ...faceBase,
                        transform: 'rotateY(180deg)',
                        filter: `brightness(${INNER_DIM / 10})`,
                      }}
                    >
                      <img
                        src={image.src}
                        alt=""
                        style={imgStyle}
                        draggable={false}
                        aria-hidden="true"
                        decoding="async"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Counter */}
      <p
        data-zoom-chrome
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 text-olive-ink/70 text-xs uppercase tracking-[0.25em]"
      >
        {index + 1} / {count}
      </p>
    </div>,
    document.body,
  );
}
