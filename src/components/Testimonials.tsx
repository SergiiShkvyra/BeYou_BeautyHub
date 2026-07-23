import { Star, Quote } from 'lucide-react';
import { useReveal, revealChildren, gsap } from '../lib/useReveal';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Jada C.',
      service: 'Brow mapping shaping + tinting',
      rating: 5,
      text: 'Anastasiia is AMAZING! I was so nervous about finding a new eyebrow and lash tech but she immediately made the space feel safe and personable. One of my eyebrows was unfortunately uneven from over waxing and she was able to not only make them look fuller, but I don’t even see where it was uneven to begin with. Highly recommend!',
      image: '/images/testimonials/JC.png'
    },
    {
      name: 'Megan W.',
      service: 'Lash lift + tint and brow shaping + tinting',
      rating: 5,
      text: 'I’ve been going to Anastasia for Lash lift intense and eyebrow shaping for a few years now. She is amazing! She’s very detailed, makes you feel so comfortable, and always takes time to make sure everything looks perfect. The lash lift results last so well and make getting ready much easier, especially in the summer when you don’t want to be wearing mascara! The new Ballston studio location is great! Highly recommend if you’re looking for someone, talented, professional, and genuinely caring.',
      image: '/images/testimonials/Megan_W.jpg'
    },
    {
      name: 'Arielle T.',
      service: 'Brow lamination + shaping',
      rating: 5,
      text: 'I had a great brow lamination experience here! Anastasia was kind, detailed, consultative, and so gentle that I actually fell asleep while she was tweezing. She made sure she understood the result I wanted, and it’s exactly what I got. I will be back!',
      image: '/images/testimonials/Arielle_T.jpg'
    },
    {
      name: 'Averie G.',
      service: 'Brow lamination shaping + tinting',
      rating: 5,
      text: 'Anastasia is amazing!!! Every time she does my eyebrows, they look PERFECT. I always get asked where I get them done at. I drive 45 mins from MD just to see her because I won’t trust anyone else with my eyebrows. She’s also done my lashes before and they looked fab, too. Definitely recommend going here and seeing Anastasia!',
      image: '/images/testimonials/AG.png'
    }
  ];

  // Timeline entrance (modeled on the reference site's staged rail): each
  // review row triggers independently as it scrolls into view, once —
  // 1) the numbered badge pops in with a springy overshoot,
  // 2) the connector line draws downward right behind it,
  // 3) the card slides in from the right and fades up to full opacity.
  // Reduced motion: useReveal skips this whole callback and the authored
  // markup is already in its final visible state.
  const scope = useReveal<HTMLElement>((section) => {
    revealChildren(section);
    section
      .querySelectorAll<HTMLElement>('[data-stage]')
      .forEach((row) => {
        const node = row.querySelector('[data-stage-node]');
        const line = row.querySelector('[data-stage-line]');
        const panel = row.querySelector('[data-stage-panel]');
        const typed = row.querySelector<HTMLElement>('[data-typed-text]');
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 85%', once: true },
        });
        tl.from(node, { scale: 0.55, duration: 0.52, ease: 'back.out(1.7)' }, 0)
          .from(node, { opacity: 0, duration: 0.3, ease: 'power1.out' }, 0);

        if (typed) {
          // The "…and counting" ending: instead of sliding in, the line
          // types itself out (40ms/char — a touch brisker than the intro's
          // 55ms, since this line is longer) starting the moment the badge
          // pop lands. GSAP-driven so ctx.revert cleans up.
          const caret = row.querySelector<HTMLElement>('[data-typed-caret]');
          const fullText = (typed.textContent ?? '').trim();
          typed.textContent = '';
          const state = { i: 0 };
          tl.to(
            state,
            {
              i: fullText.length,
              duration: fullText.length * 0.02,
              ease: 'none',
              onStart: () => {
                if (caret) caret.hidden = false;
              },
              onUpdate: () => {
                typed.textContent = fullText.slice(0, Math.round(state.i));
              },
              onComplete: () => {
                if (caret) {
                  gsap.to(caret, {
                    opacity: 0,
                    duration: 0.4,
                    onComplete: () => {
                      caret.hidden = true;
                    },
                  });
                }
              },
            },
            0.52,
          );
        } else {
          tl.from(
            panel,
            { x: 28, opacity: 0, duration: 0.62, ease: 'expo.out' },
            0,
          );
        }

        if (line) {
          tl.from(
            line,
            {
              scaleY: 0,
              transformOrigin: '50% 0%',
              duration: 0.6,
              ease: 'expo.out',
            },
            0.13,
          );
        }
      });
  });

  return (
    <section ref={scope} className="py-24 sm:py-32 bg-warm/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto">
          <p data-reveal className="micro-label mb-5 justify-center">
            Testimonials
          </p>
          <h2 data-reveal className="font-display text-4xl sm:text-5xl lg:text-6xl text-olive-ink leading-[1.05] mb-6">
            What Our <span className="italic text-olive">Clients Say</span>
          </h2>
          <p data-reveal className="text-lg text-olive-ink/70">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        {/* Vertical timeline: numbered badge rail on the left, one review
            card per row, colors alternating olive/warm down the line. */}
        <div className="max-w-4xl mx-auto flex flex-col">
          {testimonials.map((testimonial, index) => {
            const inverted = index % 2 === 0;
            return (
              <article
                key={index}
                data-stage
                className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[4.25rem_1fr] gap-4 sm:gap-8"
              >
                {/* Rail: numbered badge + connector line to the next review */}
                <div className="flex flex-col items-center" aria-hidden="true">
                  <div
                    data-stage-node
                    className={`h-[3.25rem] w-[3.25rem] sm:h-[4.25rem] sm:w-[4.25rem] rounded-[22px] grid place-items-center font-display font-bold text-2xl sm:text-3xl ${
                      inverted
                        ? 'bg-olive text-warm shadow-[0_5px_0_-1px_#262c20,0_10px_24px_rgba(58,69,49,0.25)]'
                        : 'bg-warm text-olive-ink shadow-[0_5px_0_-1px_rgba(80,94,71,0.55),0_10px_24px_rgba(58,69,49,0.16)]'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {/* Every review connects onward — the rail ends at the
                      "…and many more" badge below the last card. */}
                  <div
                    data-stage-line
                    className={`my-3 w-[3px] flex-1 rounded-full ${
                      inverted ? 'bg-olive' : 'bg-warm'
                    }`}
                  />
                </div>

              {/* Animation wrapper: GSAP animates THIS plain div. The figure
                  inside keeps transition-all + hover transforms, which (with
                  Tailwind's important:true) would override GSAP's inline
                  styles if animated directly. */}
              <div data-stage-panel className="mb-8 sm:mb-12">
              <figure
                className={`relative rounded-3xl p-8 lg:p-10 transition-all duration-500 hover:-translate-y-1.5 ${
                  inverted
                    ? 'bg-olive text-warm shadow-xl shadow-olive/25'
                    : 'bg-white/70 border border-olive/15 text-olive-ink shadow-sm hover:shadow-xl hover:shadow-olive/10'
                }`}
              >
                <Quote
                  aria-hidden="true"
                  className={`absolute top-8 right-8 h-10 w-10 ${
                    inverted ? 'text-warm/25' : 'text-olive/15'
                  }`}
                />

                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 fill-current ${
                        inverted ? 'text-warm' : 'text-olive'
                      }`}
                    />
                  ))}
                </div>

                <blockquote
                  className={`font-display text-lg lg:text-xl leading-relaxed mb-8 ${
                    inverted ? 'text-warm/95' : 'text-olive-ink/85'
                  }`}
                >
                  “{testimonial.text}”
                </blockquote>

                <figcaption className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className={`h-12 w-12 rounded-full object-cover mr-4 ring-2 ${
                      inverted ? 'ring-warm/40' : 'ring-olive/20'
                    }`}
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p
                      className={`text-xs uppercase tracking-[0.15em] mt-0.5 ${
                        inverted ? 'text-warm/90' : 'text-olive-ink/65'
                      }`}
                    >
                      {testimonial.service}
                    </p>
                  </div>
                </figcaption>
              </figure>
              </div>
              </article>
            );
          })}

          {/* Rail ending: a quiet "…and many more" — same stage entrance
              (badge pop + text slide-in), no card, no button. */}
          <article
            data-stage
            className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[4.25rem_1fr] gap-4 sm:gap-8"
          >
            <div className="flex justify-center" aria-hidden="true">
              <div
                data-stage-node
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl grid place-items-center font-display font-bold text-xl sm:text-2xl bg-olive text-warm shadow-[0_5px_0_-1px_#262c20,0_10px_24px_rgba(58,69,49,0.25)]"
              >
                <span className="-translate-y-1">…</span>
              </div>
            </div>
            <div data-stage-panel className="self-center">
              {/* Full text lives in the markup (reduced-motion / no-JS / tests
                  see it as-is); the reveal callback empties it and types it
                  back in. The caret stays hidden except while typing.
                  The line links to the Fresha reviews section (the
                  reviews=true param deep-links into Reviews in the Fresha
                  app on phones via Fresha's own universal-link handling). */}
              <p className="text-lg">
                <a
                  href="https://www.fresha.com/a/be-you-beauty-hub-arlington-3865-wilson-boulevard-sochrclt?pId=2531140&reviews=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Read all our reviews on Fresha"
                  className="text-olive-ink/70 hover:text-olive transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  <span data-typed-text>
                    …and counting. Your 5-star experience could be the next one we celebrate.
                  </span>
                </a>
                <span data-typed-caret className="intro-caret" hidden />
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
