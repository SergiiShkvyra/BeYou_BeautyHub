import { useEffect, useRef, type CSSProperties, type PointerEvent } from 'react';
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
}

const COAST_DECAY = 0.9; // per-frame momentum falloff after a drag release
const COAST_STOP_THRESHOLD = 2; // deg/sec below which coasting is considered settled
const PAUSE_MS = 1000; // hold still this long after a drag-released spin settles
const RAMP_MS = 1400; // then ease back up to the steady auto-spin speed

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
}: RoundCarouselProps) {
  const count = images.length;

  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const rotYRef = useRef(0);
  const velRef = useRef(0);
  const lastRef = useRef(0);
  const dragRef = useRef({ active: false, x: 0 });
  const phaseRef = useRef<'auto' | 'coasting' | 'paused' | 'ramping'>('auto');
  const phaseTimeRef = useRef(0);

  const angle = 360 / count;
  const factor = 1 + spacing * 0.15;
  const radius = (imageWidth * factor) / (2 * Math.tan(Math.PI / count));
  const degPerSec = speed * 6 * (direction === 'left' ? -1 : 1);

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

      if (!dragRef.current.active) {
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

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = { active: true, x: e.clientX };
    velRef.current = 0;
    phaseRef.current = 'auto'; // cancel any pending pause/ramp from an earlier release
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    const k = 0.3 * sensitivity;
    rotYRef.current += dx * k;
    velRef.current = dx * k * 60;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    dragRef.current.active = false;
    phaseRef.current = 'coasting';
    phaseTimeRef.current = performance.now();
  };

  const faceBase: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: cornerRadius,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
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
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background,
        perspective: `${perspective}px`,
        cursor: drag ? 'grab' : 'default',
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
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
                />
              </div>
              {/* Back face — visible through the ring at some rotations, dimmed */}
              <div style={{ ...faceBase, transform: 'rotateY(180deg)', filter: `brightness(${innerDim / 10})` }}>
                <img src={image.src} alt="" style={imgStyle} draggable={false} aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
