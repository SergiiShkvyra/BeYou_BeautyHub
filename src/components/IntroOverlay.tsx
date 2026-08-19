import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { introPending, INTRO_DONE_EVENT } from '../lib/introState';
import PhraseMorph, { MORPH } from './intro/PhraseMorph';
import { introPhraseFontSizePx } from './intro/metrics';

/**
 * First-visit intro: on a black veil, the brand phrases morph one into the
 * next (blur/scale cross-dissolve, PhraseMorph) — "Be Natural." → "Be
 * Real." → "BeYou." — and the last word's own morph-out doubles as the
 * reveal: the text dissolves while the black veil fades with it, on the
 * same beat, uncovering the already-built landing page underneath. No
 * logo animation — the header's own logo is simply revealed as part of
 * the page once the veil is gone.
 *
 * The header is z-index-pinned above everything by its force-visible loop,
 * so during the intro it is hidden via `body.intro-active header` CSS and
 * revealed the instant the reveal begins.
 *
 * Skipped under prefers-reduced-motion (keeps the test suite unaffected).
 */

const IntroOverlay = () => {
  const [active, setActive] = useState(introPending);
  const [started, setStarted] = useState(false);
  const [fontSizePx, setFontSizePx] = useState(() =>
    introPhraseFontSizePx(
      typeof window !== 'undefined' ? window.innerWidth : 1280,
      typeof window !== 'undefined' ? window.innerHeight : 800,
    ),
  );
  const bgRef = useRef<HTMLDivElement | null>(null);
  const revealedRef = useRef(false);

  // Scroll pin + lock classes + the start trigger, for as long as the
  // overlay is mounted. The "click anywhere to skip" listener now lives
  // inside PhraseMorph itself, since it's the only thing worth skipping.
  useLayoutEffect(() => {
    if (!active) return;

    // On reload the browser restores the previous scroll position, which
    // would make the intro reveal a mid-page view. index.html already sets
    // history.scrollRestoration='manual' before the bundle runs; on top of
    // that, pin the page to the very top and hold it there for as long as
    // the intro is on screen (Chromium can still write a restored offset
    // asynchronously after first paint).
    window.scrollTo(0, 0);
    const pinToTop = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };
    window.addEventListener('scroll', pinToTop, { passive: true });

    document.body.classList.add('intro-active');
    document.documentElement.classList.add('intro-active');
    document.documentElement.classList.add('intro-lock');

    const onResize = () =>
      setFontSizePx(introPhraseFontSizePx(window.innerWidth, window.innerHeight));
    window.addEventListener('resize', onResize, { passive: true });

    let hasStarted = false;
    const start = () => {
      if (hasStarted) return;
      hasStarted = true;
      removeTriggers();
      setStarted(true);
    };

    // Auto-start as soon as the essentials are ready — the phrase's serif
    // is loaded — plus a 250ms beat so the veil registers first. The 1.8s
    // cap guarantees a start even if the font-load promise hangs; any
    // interaction still starts it instantly.
    const capTimer = setTimeout(start, 1800);
    let graceTimer: ReturnType<typeof setTimeout> | undefined;
    (
      document.fonts?.load('700 1rem "Playfair Display"').catch(() => {}) ??
      Promise.resolve()
    ).then(() => {
      graceTimer = setTimeout(start, 250);
    });

    const startEvents: (keyof WindowEventMap)[] = [
      'pointerdown',
      'wheel',
      'touchmove',
      'keydown',
    ];
    startEvents.forEach((ev) =>
      window.addEventListener(ev, start, { passive: true }),
    );
    const removeTriggers = () => {
      clearTimeout(capTimer);
      if (graceTimer) clearTimeout(graceTimer);
      startEvents.forEach((ev) => window.removeEventListener(ev, start));
    };

    return () => {
      removeTriggers();
      window.removeEventListener('scroll', pinToTop);
      window.removeEventListener('resize', onResize);
      document.body.classList.remove('intro-active');
      document.documentElement.classList.remove('intro-active');
      document.documentElement.classList.remove('intro-lock');
    };
  }, [active]);

  // Fires once (guarded — PhraseMorph's own skip-seek can in principle
  // reach this at the same moment the timeline's natural progression
  // would have): reveal the header/hero and start fading the black veil,
  // timed to finish exactly when the text's own morph-out does.
  const handleReveal = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;

    window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    document.body.classList.remove('intro-active');
    document.documentElement.classList.remove('intro-active');

    if (bgRef.current) {
      gsap.to(bgRef.current, { opacity: 0, duration: MORPH, ease: 'power2.inOut' });
    }
  };

  const handleDone = () => {
    document.documentElement.classList.remove('intro-lock');
    setActive(false);
  };

  if (!active) return null;

  return (
    <div className="intro-overlay" aria-hidden="true">
      <div ref={bgRef} data-bg className="intro-bg" />

      <div className="intro-stage">
        {started && (
          <PhraseMorph
            fontSizePx={fontSizePx}
            onLastMorphOutStart={handleReveal}
            onDone={handleDone}
          />
        )}
      </div>
    </div>
  );
};

export default IntroOverlay;
