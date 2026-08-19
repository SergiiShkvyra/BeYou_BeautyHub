import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { brandEase } from './easing';

const WORDS = ['Be Natural.', 'Be Real.', 'BeYou.'];
export const MORPH = 1.35; // seconds to morph between words (also the reveal fade duration)
const HOLD = 0.85; // seconds a word stays fully visible
const LAST_HOLD_EXTRA = 1; // extra seconds "BeYou." lingers before its morph-out
const LAST_SCALE = 1.2; // "BeYou." renders 20% bigger than the other two words
const COLOR = '#505E47';
// A skip mid-animation used to jump straight to the reveal label — the exact
// instant "BeYou." starts fading out — so it was barely glimpsed. Skipping
// now lands this much earlier instead, so it's held fully visible for a
// beat before its already-scheduled morph-out carries it into the reveal.
const SKIP_HOLD_EXTRA = 0.7;

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
      // Land SKIP_HOLD_EXTRA seconds before the reveal rather than on it, so
      // "BeYou." gets a guaranteed beat fully visible before its morph-out
      // starts — playback (already running, not paused) carries it the rest
      // of the way there naturally, firing the 'reveal' label's .call() in
      // real time same as an unskipped run. A click already inside that
      // final stretch is left alone rather than rewound.
      const holdUntil = Math.max(0, tl.labels.reveal - SKIP_HOLD_EXTRA);
      if (tl.time() < holdUntil) {
        // seek()'s second arg is suppressEvents — false so any .call()s
        // between here and holdUntil still fire; the default (true) would
        // silently skip them.
        tl.seek(holdUntil, false);
      }
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
