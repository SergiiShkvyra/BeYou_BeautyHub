import { Star, Award, Users } from 'lucide-react';
import { scrollToSection } from '../utils/interactions';
import { useReveal, gsap } from '../lib/useReveal';
import { introPending, INTRO_DONE_EVENT } from '../lib/introState';

const stats = [
  { icon: Users, value: '1400+', label: 'Happy Clients' },
  { icon: Award, value: '3+', label: 'Years Experience' },
  { icon: Star, value: '5', label: 'Average Rating' },
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
      className="relative min-h-[calc(100svh-var(--header-h,170px))] flex items-end overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          data-hero-image
          src="/images/t2001x1212.jpg"
          alt="Beautiful eyelash extensions"
          className="w-full h-full object-cover object-[50%_18%] scale-105"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-olive-ink/55 via-olive-ink/25 to-olive-ink/80"></div>
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
                className="glow-btn group bg-warm text-olive-ink px-9 py-4 rounded-full text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 hover:bg-olive hover:text-warm hover:-translate-y-0.5"
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
          <div data-hero-fade className="flex items-stretch divide-x divide-warm/25">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col gap-1 px-6 first:pl-0 last:pr-0"
              >
                <Icon className="h-5 w-5 text-warm/80 mb-2" />
                <div className="font-display text-3xl sm:text-4xl text-warm leading-none">
                  {value}
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
