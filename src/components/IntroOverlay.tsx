import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { introPending, INTRO_DONE_EVENT } from '../lib/introState';

/**
 * First-visit intro: on a warm gradient veil, the logo grows in at the
 * center (on first interaction, or as soon as the logo image and motto font
 * are loaded — capped at 1.8s), the motto types
 * itself out in three lines, then the veil dissolves over the already-built
 * site while the logo glides into its slot in the header between BE and YOU.
 *
 * The header is z-index-pinned above everything by its force-visible loop,
 * so during the intro it is hidden via `body.intro-active header` CSS and
 * revealed as the hand-off begins.
 *
 * Skipped under prefers-reduced-motion (keeps the test suite unaffected).
 */

const PHRASES = ['Be Natural.', 'Be Real.', 'BeYou.'];
const CHAR_DELAY = 0.055; // s per typed character
const PHRASE_PAUSE = 0.75; // s of stillness before each new line
const TYPE_TOTAL =
  PHRASES.join('').length * CHAR_DELAY +
  (PHRASES.length - 1) * PHRASE_PAUSE +
  0.4;

const IntroOverlay = () => {
  const [active, setActive] = useState(introPending);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  // useLayoutEffect: GSAP must position/hide the elements BEFORE the first
  // paint, or the raw <img> flashes at the overlay's top-left for a frame.
  useLayoutEffect(() => {
    if (!active || !rootRef.current) return;
    const root = rootRef.current;

    // On reload the browser restores the previous scroll position, which
    // would make the intro reveal a mid-page view and strand the logo's
    // landing. index.html already sets history.scrollRestoration='manual'
    // before the bundle runs; on top of that, pin the page to the very top
    // and hold it there for as long as the intro is on screen (Chromium can
    // still write a restored offset asynchronously after first paint).
    window.scrollTo(0, 0);
    const pinToTop = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };
    window.addEventListener('scroll', pinToTop, { passive: true });

    document.body.classList.add('intro-active');
    document.documentElement.classList.add('intro-active');
    document.documentElement.classList.add('intro-lock');

    const headerLogo = document.querySelector<HTMLImageElement>(
      'header img[alt="BeYou BeautyHub Logo"]',
    );

    let typeTimeout: ReturnType<typeof setTimeout> | undefined;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      // Anchor the logo slightly above center; motto flows underneath.
      // x/y: 0 clears the pixel offsets GSAP decomposes out of the CSS
      // translate() pre-paint guard — otherwise they'd stack with xPercent.
      gsap.set(q('[data-intro-logo]'), {
        left: '50%',
        top: '40%',
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        scale: 0.07,
      });
      gsap.set(q('[data-motto]'), {
        left: '50%',
        top: '71%',
        x: 0,
        y: 0,
        xPercent: -50,
        autoAlpha: 0,
      });

      /** Typewriter: char by char, with a long still beat between phrases. */
      const typeMotto = (el: HTMLElement) => {
        let phrase = 0;
        let char = 0;
        let out = '';
        const step = () => {
          const current = PHRASES[phrase];
          out += current[char];
          el.textContent = out;
          char += 1;
          let delay = CHAR_DELAY * 1000;
          if (char >= current.length) {
            phrase += 1;
            char = 0;
            if (phrase >= PHRASES.length) return;
            out += '\n';
            delay = PHRASE_PAUSE * 1000;
          }
          typeTimeout = setTimeout(step, delay);
        };
        step();
      };

      const runSequence = () => {
        const mottoText = root.querySelector<HTMLElement>('[data-motto-text]');

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          onComplete: finish,
        });

        // 1) The logo grows in at the center of the veil
        tl.to(
          q('[data-intro-logo]'),
          { opacity: 1, scale: 1, duration: 1.6, ease: 'power3.out' },
          0,
        );

        // Let the page build itself now, hidden behind the veil, so the
        // reveal shows a finished site instead of a sudden load-in.
        tl.call(() => window.dispatchEvent(new Event(INTRO_DONE_EVENT)), [], 0.9);

        // 2) Typewriter motto, three lines with pauses
        tl.to(q('[data-motto]'), { autoAlpha: 1, duration: 0.3 }, 1.3);
        tl.call(() => mottoText && typeMotto(mottoText), [], 1.5);
        tl.to({}, { duration: TYPE_TOTAL }, 1.5); // spacer while typing
        tl.to({}, { duration: 0.6 }); // hold on the finished motto

        // 3) Hand-off: the motto cross-fade, the logo's flight home and the
        // veil dissolve all begin on the same beat.
        tl.to(q('[data-motto]'), {
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power1.inOut',
        });
        tl.add(() => {
          // Reveal the (already settled) site's header; its own logo stays
          // invisible until ours lands in the slot.
          if (headerLogo) headerLogo.style.opacity = '0';
          document.body.classList.remove('intro-active');
          document.documentElement.classList.remove('intro-active');

          const logoEl = q('[data-intro-logo]')[0] as HTMLElement;
          if (headerLogo && logoEl) {
            const from = logoEl.getBoundingClientRect();
            const to = headerLogo.getBoundingClientRect();
            const currentScale = gsap.getProperty(logoEl, 'scale') as number;
            gsap.to(logoEl, {
              x: `+=${to.left + to.width / 2 - (from.left + from.width / 2)}`,
              y: `+=${to.top + to.height / 2 - (from.top + from.height / 2)}`,
              scale: currentScale * (to.height / from.height),
              duration: 1.5,
              ease: 'power2.inOut',
            });
            // Touchdown cross-fade over the flight's slow tail: the natively
            // rendered (crisp) header logo fades in while the transform-scaled
            // one fades out, hiding the resample seam an instant swap shows.
            gsap.to(headerLogo, {
              opacity: 1,
              duration: 0.4,
              delay: 1.15,
              ease: 'power1.inOut',
            });
            gsap.to(logoEl, {
              opacity: 0,
              duration: 0.4,
              delay: 1.2,
              ease: 'power1.inOut',
            });
          }
        }, '<');
        tl.to(
          q('[data-bg]'),
          { opacity: 0, duration: 1.35, ease: 'power2.inOut' },
          '<',
        );
        tl.to({}, { duration: 1.55 }); // flight time + touchdown beat
      };

      const start = () => {
        if (startedRef.current) return;
        startedRef.current = true;
        removeTriggers();
        runSequence();
      };

      // Auto-start as soon as the essentials are ready — the logo image is
      // decoded and the motto's serif is loaded — plus a 250ms beat so the
      // veil registers first. The 1.8s cap guarantees a start even if a
      // decode/font promise hangs; any interaction still starts it instantly.
      const capTimer = setTimeout(start, 1800);
      let graceTimer: ReturnType<typeof setTimeout> | undefined;
      const logoImg = root.querySelector<HTMLImageElement>('[data-intro-logo]');
      Promise.all([
        logoImg?.decode().catch(() => {}) ?? Promise.resolve(),
        document.fonts?.load('1rem "Playfair Display"').catch(() => {}) ??
          Promise.resolve(),
      ]).then(() => {
        graceTimer = setTimeout(start, 250);
      });

      const events: (keyof WindowEventMap)[] = [
        'pointerdown',
        'wheel',
        'touchmove',
        'keydown',
      ];
      events.forEach((ev) =>
        window.addEventListener(ev, start, { passive: true }),
      );
      const removeTriggers = () => {
        clearTimeout(capTimer);
        if (graceTimer) clearTimeout(graceTimer);
        events.forEach((ev) => window.removeEventListener(ev, start));
      };

      const finish = () => {
        window.removeEventListener('scroll', pinToTop);
        if (headerLogo) headerLogo.style.opacity = '';
        document.body.classList.remove('intro-active');
        document.documentElement.classList.remove('intro-active');
        document.documentElement.classList.remove('intro-lock');
        setActive(false);
      };

      return removeTriggers;
    }, root);

    return () => {
      window.removeEventListener('scroll', pinToTop);
      if (typeTimeout) clearTimeout(typeTimeout);
      ctx.revert();
      if (headerLogo) headerLogo.style.opacity = '';
      document.body.classList.remove('intro-active');
      document.documentElement.classList.remove('intro-active');
      document.documentElement.classList.remove('intro-lock');
    };
  }, [active]);

  if (!active) return null;

  return (
    <div ref={rootRef} className="intro-overlay" aria-hidden="true">
      <div data-bg className="intro-bg" />

      {/* The logo that grows in and lands in the header */}
      <img
        data-intro-logo
        className="intro-logo"
        src="/images/tryLogo-1.png"
        alt=""
        draggable={false}
      />

      {/* Typewriter motto, one phrase per line */}
      <p data-motto className="intro-motto">
        <span data-motto-text></span>
        <span className="intro-caret" />
      </p>
    </div>
  );
};

export default IntroOverlay;
