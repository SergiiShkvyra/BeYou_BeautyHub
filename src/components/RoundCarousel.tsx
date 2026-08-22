import {
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { prefersReducedMotion } from '../lib/useReveal';

interface RoundCarouselImage {
  src: string;
  alt: string;
}

interface RoundCarouselProps {
  images: RoundCarouselImage[];
  imageWidth?: number;
  imageHeight?: number;
  spacing?: number;
  speed?: number;
  direction?: 'right' | 'left';
  drag?: boolean;
  sensitivity?: number;
  tilt?: number;
  perspective?: number;
  cornerRadius?: number;
  innerDim?: number;
  background?: string;
  /** Fires when the FRONT card is tapped/clicked (not dragged), with that
   *  image's index and the on-screen box it occupies — the caller uses the
   *  box as the starting geometry for a zoom animation. The hit zone only
   *  covers the front card, so this is exactly "the picture in the middle". */
  onImageClick?: (index: number, rect: DOMRect) => void;
  /** Freezes the ambient auto-spin and ignores drags (used while the zoomed
   *  view is open). A pending focus snap still runs. */
  paused?: boolean;
  /** Rotates the ring so this index ends up facing front. Kept in sync with
   *  the zoomed view so closing it lands on the picture being viewed. */
  focusIndex?: number | null;
}

const COAST_DECAY = 0.9; // per-frame momentum falloff after a drag release
const COAST_STOP_THRESHOLD = 2; // deg/sec below which coasting is considered settled
const PAUSE_MS = 1000; // hold still this long after a drag-released spin settles
const RAMP_MS = 1400; // then ease back up to the steady auto-spin speed
const TAP_SLOP = 10; // px of pointer travel still counted as a tap, not a drag
const TAP_MAX_MS = 600; // longer than this and it's a hold, not a tap

/**
 * 3D ring of images that auto-spins slowly and can be grabbed and flicked
 * to spin faster in either direction. After a drag ends, momentum coasts
 * to a stop, holds for a beat, then eases back up to the steady auto-spin
 * speed rather than snapping straight back to full speed.
 *
 * Under prefers-reduced-motion, the ambient auto-spin (and the ramp back
 * into it) is skipped — a drag still coasts to a natural stop and then
 * simply stays put, matching this project's reveal convention (see
 * useReveal.ts) of treating dragging as user-initiated, not ambient, motion.
 */
export default function RoundCarousel({
  images,
  imageWidth = 481,
  imageHeight = 323,
  spacing = 1,
  speed = 2,
  direction = 'right',
  drag = true,
  sensitivity = 1,
  tilt = -16,
  perspective = 800,
  cornerRadius = 10,
  innerDim = 7,
  background = '#FFFBE4',
  onImageClick,
  paused = false,
  focusIndex = null,
}: RoundCarouselProps) {
  const count = images.length;

  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const rotYRef = useRef(0);
  const velRef = useRef(0);
  const lastRef = useRef(0);
  const dragRef = useRef({ active: false, x: 0 });
  // Distinguishes a tap (open the image) from a drag (spin the ring):
  // total pointer travel under the threshold + a short hold = tap.
  const tapRef = useRef({ startX: 0, startY: 0, moved: 0, t: 0 });
  const phaseRef = useRef<'auto' | 'coasting' | 'paused' | 'ramping'>('auto');
  const phaseTimeRef = useRef(0);
  const pausedRef = useRef(paused);
  const targetRotRef = useRef<number | null>(null);

  const angle = 360 / count;
  const factor = 1 + spacing * 0.15;
  const radius = (imageWidth * factor) / (2 * Math.tan(Math.PI / count));
  const degPerSec = speed * 6 * (direction === 'left' ? -1 : 1);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Aim the ring at a specific card. The target is expressed in the same
  // unwrapped degrees the rotation already accumulated (nearest equivalent
  // turn), so the ring takes the short way around instead of unwinding.
  useEffect(() => {
    if (focusIndex == null) return;
    const desired = -focusIndex * angle;
    const turns = Math.round((rotYRef.current - desired) / 360);
    targetRotRef.current = desired + turns * 360;
  }, [focusIndex, angle]);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const reduceMotion = prefersReducedMotion();
    const apply = () =>
      (ring.style.transform = `translateZ(${-radius}px) rotateY(${rotYRef.current}deg)`);
    apply();

    const draw = (now: number) => {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
      lastRef.current = now;
      const f = Math.min(dt, 0.1);

      // A pending focus snap outranks everything else (it runs even while
      // paused — that's how closing the zoomed view lands the ring on the
      // picture the visitor was looking at).
      if (targetRotRef.current !== null && !dragRef.current.active) {
        const diff = targetRotRef.current - rotYRef.current;
        if (Math.abs(diff) < 0.15) {
          rotYRef.current = targetRotRef.current;
          targetRotRef.current = null;
          phaseRef.current = 'paused';
          phaseTimeRef.current = now;
        } else {
          rotYRef.current += diff * Math.min(1, f * 7);
        }
        apply();
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      if (!dragRef.current.active && !pausedRef.current) {
        if (reduceMotion) {
          // A drag still coasts to a stop; it just never ramps back into
          // ambient auto-spin afterward.
          if (phaseRef.current === 'coasting') {
            if (Math.abs(velRef.current) > COAST_STOP_THRESHOLD) {
              rotYRef.current += velRef.current * f;
              velRef.current *= COAST_DECAY;
            } else {
              velRef.current = 0;
              phaseRef.current = 'paused';
            }
          }
        } else {
          switch (phaseRef.current) {
            case 'coasting':
              if (Math.abs(velRef.current) > COAST_STOP_THRESHOLD) {
                rotYRef.current += velRef.current * f;
                velRef.current *= COAST_DECAY;
              } else {
                velRef.current = 0;
                phaseRef.current = 'paused';
                phaseTimeRef.current = now;
              }
              break;
            case 'paused':
              if (now - phaseTimeRef.current >= PAUSE_MS) {
                phaseRef.current = 'ramping';
                phaseTimeRef.current = now;
              }
              break;
            case 'ramping': {
              const t = Math.min(1, (now - phaseTimeRef.current) / RAMP_MS);
              rotYRef.current += degPerSec * t * f;
              if (t >= 1) phaseRef.current = 'auto';
              break;
            }
            case 'auto':
            default:
              rotYRef.current += degPerSec * f;
              break;
          }
        }
      }
      apply();
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [radius, degPerSec, count]);

  /** Index of the card currently facing the viewer, from the live rotation. */
  const frontIndex = () => {
    const steps = Math.round(-rotYRef.current / angle);
    return ((steps % count) + count) % count;
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag || pausedRef.current) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = { active: true, x: e.clientX };
    tapRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      moved: 0,
      t: performance.now(),
    };
    velRef.current = 0;
    phaseRef.current = 'auto'; // cancel any pending pause/ramp from an earlier release
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    const t = tapRef.current;
    t.moved = Math.max(
      t.moved,
      Math.hypot(e.clientX - t.startX, e.clientY - t.startY),
    );
    const k = 0.3 * sensitivity;
    rotYRef.current += dx * k;
    velRef.current = dx * k * 60;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const wasDragging = dragRef.current.active;
    dragRef.current.active = false;
    phaseRef.current = 'coasting';
    phaseTimeRef.current = performance.now();

    // Tap (not a drag): open the front image. TAP_SLOP tolerates the small
    // finger travel every real tap has; the time cap keeps a slow "hold and
    // nudge" from counting as a tap.
    const t = tapRef.current;
    if (
      wasDragging &&
      onImageClick &&
      t.moved <= TAP_SLOP &&
      performance.now() - t.t <= TAP_MAX_MS
    ) {
      onImageClick(frontIndex(), e.currentTarget.getBoundingClientRect());
    }
  };

  const faceBase: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: cornerRadius,
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
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Not hidden: the tilt+perspective make each card's rendered extent
        // taller than the box, especially at the imageWidth/imageHeight
        // this project uses on small screens — clipping to the box cut
        // images off sharply at the top/sides. Left visible so the full
        // images always show, spilling above/beside the box rather than
        // being cropped; the box's own size is unchanged.
        overflow: 'visible',
        background,
      }}
    >
      {/* 3D SCENE — pointer-events: none so the side cards spilling outside
          the box below (and any empty space around them) never intercept a
          touch. Only the HIT ZONE re-enables pointer-events, so a touch that
          starts on a spilled-out side card (or the empty margin beside the
          carousel) falls through to the page underneath and scrolls
          normally instead of getting eaten by this component's drag. */}
      <div
        style={{
          pointerEvents: 'none',
          perspective: `${perspective}px`,
        }}
      >
        <div style={{ transformStyle: 'preserve-3d', transform: `rotateX(${tilt}deg)` }}>
          <div
            ref={ringRef}
            style={{
              position: 'relative',
              width: imageWidth,
              height: imageHeight,
              transformStyle: 'preserve-3d',
            }}
          >
            {images.map((image, i) => (
              <div
                key={image.src}
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div style={{ ...faceBase, boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    style={imgStyle}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
                {/* Back face — visible through the ring at some rotations, dimmed.
                    loading="lazy" + decoding="async" matter here even though
                    the src is shared with the front face: without them this
                    tag was eager, forcing the browser to fetch/decode all 8
                    back faces the instant the component mounted — regardless
                    of scroll position — competing with everything else on
                    the page for bandwidth and CPU. */}
                <div style={{ ...faceBase, transform: 'rotateY(180deg)', filter: `brightness(${innerDim / 10})` }}>
                  <img
                    src={image.src}
                    alt=""
                    style={imgStyle}
                    draggable={false}
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HIT ZONE — invisible, sized to exactly the front card's own box
          (imageWidth × imageHeight, centered), so drag/touch only responds
          within that box — never over the spilled-out side cards or the
          surrounding empty space, which is what let a touch there hijack
          page scroll before. */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: imageWidth,
          height: imageHeight,
          pointerEvents: 'auto',
          cursor: onImageClick ? 'zoom-in' : drag ? 'grab' : 'default',
          touchAction: 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        // This zone is the actual topmost element under the front card (see
        // the comment above), so a real right-click lands here, not on the
        // <img> underneath — the img's own onContextMenu never fires without
        // this.
        onContextMenu={(e) => e.preventDefault()}
        {...(onImageClick
          ? {
              role: 'button',
              tabIndex: 0,
              'aria-label': 'Open the gallery image in full screen',
              onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onImageClick(
                    frontIndex(),
                    e.currentTarget.getBoundingClientRect(),
                  );
                }
              },
            }
          : {})}
      />
    </div>
  );
}
