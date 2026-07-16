import { Star, Quote } from 'lucide-react';
import { useReveal, revealChildren } from '../lib/useReveal';

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

  const scope = useReveal<HTMLElement>((section) => revealChildren(section));

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => {
            const inverted = index % 3 === 0;
            // Single-column (mobile) order: swap cards 3 and 4 so the colors
            // alternate olive/warm/olive/warm. Colors stay with their cards;
            // md:order-none restores DOM order for the desktop 2×2 grid.
            const mobileOrder = ['order-1', 'order-2', 'order-4', 'order-3'][index];
            return (
              <figure
                key={index}
                data-reveal
                className={`${mobileOrder} md:order-none relative rounded-3xl p-8 lg:p-10 transition-all duration-500 hover:-translate-y-1.5 ${
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
