import { Star, Award, Users } from 'lucide-react';
import { scrollToSection } from '../utils/interactions';
import { useReveal, gsap, ScrollTrigger } from '../lib/useReveal';
import { introPending, INTRO_DONE_EVENT } from '../lib/introState';

// value is the count-up target; suffix stays static beside it (the markup
// keeps the full final value, so no-JS / reduced-motion visitors — and the
// test suite — always see "1400+" etc. without any animation).
const stats = [
  { icon: Users, value: 1400, suffix: '+', label: 'Happy Clients' },
  { icon: Award, value: 3, suffix: '+', label: 'Years Experience' },
  { icon: Star, value: 5, suffix: '', label: 'Average Rating' },
];

const Hero = () => {
  const scope = useReveal<HTMLElement>((section) => {
    // While the intro overlay plays, hold the entrance on its first frame and
    // release it the moment the intro's logo lands in the header.
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      paused: introPending,
    });
    tl.from('[data-hero-image]', { scale: 1.18, duration: 2.2, ease: 'power2.out' }, 0)
      .from(
        '[data-hero-line]',
        { yPercent: 115, duration: 1.1, stagger: 0.14 },
        0.25,
      )
      .from(
        '[data-hero-fade]',
        { y: 28, opacity: 0, duration: 0.9, stagger: 0.12 },
        0.85,
      );

    // Stat counters: zeroed while the entrance plays, then counting up to
    // their targets only AFTER the rest of the hero animation has finished
    // (appended at the timeline's end). ~1s ease-out rendering whole
    // integers — the same feel as the reference site's count-up — and run
    // once per page load. Skipped wholesale under prefers-reduced-motion
    // (this whole callback never runs), leaving the static final values.
    const counters = Array.from(
      section.querySelectorAll<HTMLElement>('[data-count-to]'),
    );
    counters.forEach((el) => (el.textContent = '0'));
    const startCounters = () => {
      counters.forEach((el) => {
        const target = Number(el.dataset.countTo);
        const state = { v: 0 };
        gsap.to(state, {
          v: target,
          duration: 1,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(state.v));
          },
        });
      });
    };
    // Landscape phones: the stats row sits below the fold, so counting at
    // the entrance's end would play unseen — arm a one-shot ScrollTrigger
    // and count when the row actually scrolls into view instead.
    if (
      window.matchMedia('(orientation: landscape) and (max-height: 500px)')
        .matches
    ) {
      ScrollTrigger.create({
        trigger: section.querySelector('[data-hero-stats]'),
        start: 'top 95%',
        once: true,
        onEnter: startCounters,
      });
    } else {
      // Start counting at the exact moment the stats row's fade-in begins
      // (its slot in the [data-hero-fade] stagger: base 0.85s + 0.12s per
      // preceding fade element) — the numbers are already rolling as they
      // become visible, never sitting at a static 0.
      const fades = Array.from(
        section.querySelectorAll<HTMLElement>('[data-hero-fade]'),
      );
      const statsIndex = Math.max(
        0,
        fades.indexOf(section.querySelector('[data-hero-stats]') as HTMLElement),
      );
      tl.add(startCounters, 0.85 + statsIndex * 0.12);
    }

    if (introPending) {
      tl.progress(0); // render the first frame so nothing flashes pre-reveal
      window.addEventListener(INTRO_DONE_EVENT, () => tl.play(), {
        once: true,
      });
    }

    // Slow parallax drift while the hero scrolls away
    gsap.to('[data-hero-image]', {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  return (
    <section
      id="home"
      ref={scope}
      className="relative [margin-top:calc(var(--header-h,170px)*-1)] min-h-[100svh] flex items-end overflow-hidden"
    >
      {/* Background image */}
      <div className="hero-canvas-fade absolute inset-0 z-0 overflow-hidden">
        {/* The image starts pushed down inside the (header-tucked) hero so
            the brows/lashes — the entire point of a lash & brow studio site
            — land clearly below the header, using the empty hair/forehead
            headroom in the source photo rather than the header cutting into
            the brow line. The offset is bigger at md+ than on mobile: at
            tablet/desktop-ish aspect ratios (roughly 1.3–1.6, i.e. most
            non-ultra-wide windows) object-fit: cover ends up scaling to the
            container's HEIGHT rather than its width, which shrinks the
            effective on-screen scale — and with it, the brow's pixel
            distance from the top — well below what the same 64px offset
            gives on mobile or on wide/short windows. 112px stays safely
            under the measured header height (~160px on tablet/desktop, vs
            ~128px on mobile) in every aspect ratio tested. */}
        <img
          data-hero-image
          src="/images/t2001x1212.jpg"
          alt="Beautiful eyelash extensions"
          className="w-full mt-16 h-[calc(100%-4rem)] md:mt-28 md:h-[calc(100%-7rem)] object-cover object-[60%_0%] md:object-[50%_0%]"
          loading="eager"
          decoding="async"
        />
        {/* Darkens the whole photo, not just the edges — the warm-colored
            copy (label, headline) sits in the middle of the hero too, and
            a fully-clear middle band left it with little contrast there. */}
        <div className="absolute inset-0 bg-gradient-to-b from-olive-ink/55 via-olive-ink/30 to-olive-ink/85"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20 pt-40">
        <p data-hero-fade className="micro-label !text-warm mb-6">
          Lash &amp; Brow Studio — Arlington, VA
        </p>

        <h1 className="font-display text-warm leading-[1.02] mb-8 text-[13vw] sm:text-7xl lg:text-8xl">
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              {/* One phrase per line on phones; single line from sm up */}
              <span className="block sm:inline">Be natural. </span>
              <span className="block sm:inline">Be real.</span>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block italic">
              BeYou.
            </span>
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="max-w-xl">
            <p data-hero-fade className="text-base sm:text-lg text-cream leading-relaxed mb-8">
              Professional eyelash and eyebrow services that make you feel
              confident and beautiful every day
            </p>

            <div data-hero-fade className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  window.open(
                    'https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-gt6tu55b',
                    '_blank',
                  )
                }
                className="glow-btn glow-sweep group bg-olive text-warm px-9 py-4 rounded-full text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 hover:bg-olive hover:text-warm hover:-translate-y-0.5"
              >
                Book Appointment
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="glow-btn glow-dark border border-warm/60 text-warm px-9 py-4 rounded-full text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 hover:bg-warm hover:text-olive-ink hover:-translate-y-0.5"
                aria-label="Scroll to Our Most Popular Services section"
                type="button"
              >
                View Services
              </button>
            </div>
          </div>

          {/* Stats */}
          <div
            data-hero-fade
            data-hero-stats
            className="flex items-stretch divide-x divide-warm/25"
          >
            {stats.map(({ icon: Icon, value, suffix, label }) => (
              <div
                key={label}
                className="flex flex-col gap-1 px-6 first:pl-0 last:pr-0"
              >
                <Icon className="h-5 w-5 text-warm/80 mb-2" />
                <div className="font-display text-3xl sm:text-4xl text-warm leading-none">
                  <span data-count-to={value}>{value}</span>
                  {suffix}
                </div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-cream/90 mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
