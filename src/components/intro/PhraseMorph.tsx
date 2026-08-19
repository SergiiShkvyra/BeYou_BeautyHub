import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { brandEase } from './easing';

const WORDS = ['Be Natural.', 'Be Real.', 'BeYou.'];
export const MORPH = 1.35; // seconds to morph between words (also the reveal fade duration)
const HOLD = 0.85; // seconds a word stays fully visible
const LAST_HOLD_EXTRA = 1; // extra seconds "BeYou." lingers before its morph-out
const LAST_SCALE = 1.2; // "BeYou." renders 20% bigger than the other two words
const COLOR = '#505E47';

interface PhraseMorphProps {
  fontSizePx: number;
  /** Fires the instant the last word starts morphing out — IntroOverlay
   *  starts the background fade and reveals the header on this same beat,
   *  so the text and the black veil dissolve together. */
  onLastMorphOutStart: () => void;
  /** Fires once the last word has fully faded — safe to unmount. */
  onDone: () => void;
}

/**
 * Cycles through the intro's three brand phrases with a blur/scale morph
 * cross-dissolve — outgoing and incoming words overlap under a shared SVG
 * "goo" filter so they melt into each other rather than simple-crossfading.
 * Every word morphs in, holds, then morphs back out; the last word ("BeYou.")
 * renders bigger and lingers an extra beat before its morph-out, which IS
 * the reveal.
 *
 * Any click/tap while this is playing jumps straight to that final
 * morph-out (matching the original intro's "click anywhere to skip").
 */
export default function PhraseMorph({
  fontSizePx,
  onLastMorphOutStart,
  onDone,
}: PhraseMorphProps) {
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const onLastMorphOutStartRef = useRef(onLastMorphOutStart);
  onLastMorphOutStartRef.current = onLastMorphOutStart;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const filterId = useRef(
    `intro-goo-${Math.random().toString(36).slice(2)}`,
  ).current;

  useEffect(() => {
    const els = wordRefs.current;
    if (els.some((el) => !el)) return;

    const tl = gsap.timeline({ onComplete: () => onDoneRef.current() });
    WORDS.forEach((_, i) => {
      const el = els[i] as HTMLSpanElement;
      const isLast = i === WORDS.length - 1;
      const t0 = i * (MORPH + HOLD);
      tl.fromTo(
        el,
        { autoAlpha: 0, filter: 'blur(20px)', scale: 0.8 },
        {
          autoAlpha: 1,
          filter: 'blur(0px)',
          scale: 1,
          duration: MORPH,
          ease: brandEase,
        },
        t0,
      );
      const outAt = t0 + MORPH + HOLD + (isLast ? LAST_HOLD_EXTRA : 0);
      tl.to(
        el,
        {
          autoAlpha: 0,
          filter: 'blur(20px)',
          scale: 1.2,
          duration: MORPH,
          ease: brandEase,
        },
        outAt,
      );
      if (isLast) {
        tl.addLabel('reveal', outAt);
        tl.call(() => onLastMorphOutStartRef.current(), [], 'reveal');
      }
    });

    const skip = () => {
      if (tl.time() >= tl.labels.reveal) return;
      // seek()'s second arg is suppressEvents — false so the .call() sitting
      // exactly at the 'reveal' label still fires; the default (true) would
      // silently skip it, and IntroOverlay would never hear the reveal.
      tl.seek('reveal', false);
    };
    window.addEventListener('pointerdown', skip);

    return () => {
      window.removeEventListener('pointerdown', skip);
      tl.kill();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          filter: `url(#${filterId})`,
        }}
      >
        {WORDS.map((word, i) => {
          const isLast = i === WORDS.length - 1;
          return (
            <span
              key={word}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0,
                visibility: 'hidden',
                whiteSpace: 'nowrap',
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: 700,
                fontSize: `${isLast ? fontSizePx * LAST_SCALE : fontSizePx}px`,
                color: COLOR,
                willChange: 'opacity, filter, transform',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
