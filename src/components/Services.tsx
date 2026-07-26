import React from 'react';
import { Eye, Sparkles, Clock } from 'lucide-react';
import { useReveal, revealChildren } from '../lib/useReveal';

const Services = () => {
  const services = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'Signature Korean Lash lift',
      description: 'The luxury treatment-focused lash lift using advanced Korean technology to safely lift, nourish, and strengthen your natural lashes while creating a beautifully defined, long-lasting curl.',
      price: 'From $115',
      duration: '60 min',
      features: ['Gentle, lash-health focused technique', 'Premium Korean formulas enriched with vitamins', 'Suitable for all lash types and complexities', 'Results last up to 8 weeks with minimal maintenance'],
      bookingUrl: 'https://www.fresha.com/book-now/beyou-beautyhub-j4ur9xlp/services?lid=2613695&eid=4605333&oiid=sv%3A27974629&share=true&pId=2531140',
      isNew: true,
      isFeatured: true,
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'Brow Lamination + Tweezing',
      description: 'Lamination combined with tweezing for a well-groomed look.',
      price: 'From $75',
      duration: '45-60 min',
      features: ['Creates a fuller, thicker brow look', 'Smooths and tames unruly hairs', 'Enhances natural brow symmetry', 'Long-lasting results (up to 6–8 weeks)'],
      bookingUrl: 'https://www.fresha.com/book-now/beyou-beautyhub-j4ur9xlp/services?lid=2613695&eid=4605333&oiid=sv%3A22827507&share&pId=2531140'
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'Mapping + tweezing',
      description: 'A technique for defining the perfect shape with precise tweezing for symmetry.',
      price: 'From $40',
      duration: '40-45 min',
      features: ['Ensures perfectly balanced and symmetrical brows', 'Defines the ideal shape to suit your facial features', 'Gentle tweezing for a clean and precise result', 'Enhances your natural beauty without over-plucking'],
      bookingUrl: 'https://www.fresha.com/book-now/beyou-beautyhub-j4ur9xlp/services?lid=2613695&eid=4605333&oiid=sv%3A22827454&share&pId=2531140'
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'L&L Combo Deluxe',
      description: 'Elevating your look with premium lash and brow treatments.',
      price: 'From $190',
      duration: '1 h 45 min',
      features: ['Say goodbye to mascara! Get naturally lifted, darker, and healthier lashes with a nourishing Botox boost for extra shine and strength.', 'Transform your brows with a fuller, perfectly shaped, and defined look. Symmetry, smoothness, and rich color — all in one treatment.'],
      bookingUrl: 'https://www.fresha.com/book-now/beyou-beautyhub-j4ur9xlp/services?lid=2613695&eid=4605333&oiid=sv%3A22827944&share&pId=2531140'
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Lash Lift + Tinting',
      description: 'A lash lift with tinting for a long-lasting, mascara-free look.',
      price: 'From $80',
      duration: '60-75 min',
      features: ['Natural curl', 'Color enhancement', 'No maintenance needed', '6-8 week results'],
      bookingUrl: 'https://www.fresha.com/book-now/beyou-beautyhub-j4ur9xlp/services?lid=2613695&eid=4605333&oiid=sv%3A22827620&share&pId=2531140'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'And Many More...',
      description: 'Explore our full range of beauty services including individual treatments and consultations.',
      price: 'From $25',
      features: ['Lash Titing', 'Brow Tinting', 'Tweezing', 'Free Consultation'],
      bookingUrl: 'https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-suite-3-amjyvodh?pId=2531140'
    }
  ];

  const scope = useReveal<HTMLElement>((section) => revealChildren(section));

  return (
    <section id="services" ref={scope} className="py-24 sm:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-16 sm:mb-20 max-w-3xl">
          <p data-reveal className="micro-label mb-5">
            Services
          </p>
          <h2 data-reveal className="font-display text-4xl sm:text-5xl lg:text-6xl text-olive-ink leading-[1.05] mb-6">
            Our Most Popular <span className="italic text-olive">Services</span>
          </h2>
          <p data-reveal className="text-lg text-olive-ink/70 leading-relaxed">
            We specialize in enhancing your natural beauty with professional eyelash and eyebrow services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const isFeatured = 'isFeatured' in service && service.isFeatured;
            const isNew = 'isNew' in service && service.isNew;

            return (
              <article
                key={index}
                data-reveal
                className={`relative flex flex-col h-full rounded-3xl p-8 lg:p-9 transition-all duration-500 will-change-transform hover:-translate-y-2 ${
                  isFeatured
                    ? 'bg-olive text-warm shadow-xl shadow-olive/25 hover:shadow-2xl hover:shadow-olive/30'
                    : 'bg-white/70 border border-olive/15 text-olive-ink shadow-sm hover:shadow-xl hover:shadow-olive/10 hover:border-olive/30'
                }`}
              >
                {/* Ghost index numeral */}
                <span
                  aria-hidden="true"
                  className={`absolute top-6 right-7 font-display italic text-5xl leading-none select-none ${
                    isFeatured ? 'text-warm/20' : 'text-olive/10'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {isFeatured && (
                  <span className="absolute -top-3 left-8 bg-warm text-olive-ink text-[10px] font-semibold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full shadow">
                    Featured
                  </span>
                )}

                <div className="flex-grow">
                  <div
                    className={`flex items-center gap-2 mb-6 ${
                      isFeatured ? 'text-warm' : 'text-olive'
                    }${isNew ? ' animate-flash' : ''}`}
                  >
                    {service.icon}
                    {isNew && (
                      <span className="text-xs font-bold uppercase tracking-[0.25em]">
                        NEW
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-2xl lg:text-[1.7rem] leading-snug mb-3">
                    {service.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      isFeatured ? 'text-warm/85' : 'text-olive-ink/65'
                    }`}
                  >
                    {service.description}
                  </p>

                  <div
                    className={`flex justify-between items-baseline border-t pt-5 mb-6 ${
                      isFeatured ? 'border-warm/25' : 'hairline border-t'
                    }`}
                  >
                    <span className="font-display text-3xl">{service.price}</span>
                    {service.duration && (
                      <span
                        className={`text-[11px] uppercase tracking-[0.18em] ${
                          isFeatured ? 'text-warm/70' : 'text-olive-ink/60'
                        }`}
                      >
                        {service.duration}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`text-sm leading-relaxed flex items-start ${
                          isFeatured ? 'text-warm/85' : 'text-olive-ink/70'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full mr-3 mt-1.5 flex-shrink-0 ${
                            isFeatured ? 'bg-warm' : 'bg-olive'
                          }`}
                        ></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => window.open(service.bookingUrl || 'https://www.fresha.com/book-now/beyou-beautyhub-j4ur9xlp/services?lid=2613695&eid=4605333&oiid=sv%3A22827620&share&pId=2531140', '_blank')}
                    onMouseDown={(e: React.MouseEvent) => {
                      // Handle middle-click (scroll wheel click)
                      if (e.button === 1) {
                        e.preventDefault();
                        // Open in new tab without shifting focus from current page
                        const newWindow = window.open(service.bookingUrl || 'https://www.fresha.com/book-now/beyou-beautyhub-j4ur9xlp/services?lid=2613695&eid=4605333&oiid=sv%3A22827620&share&pId=2531140', '_blank', 'noopener,noreferrer');
                        if (newWindow) {
                          // Ensure current window stays focused
                          window.focus();
                        }
                      }
                    }}
                    onAuxClick={(e: React.MouseEvent) => {
                      // Additional handler for auxiliary clicks (middle-click on some browsers)
                      if (e.button === 1) {
                        e.preventDefault();
                        const newWindow = window.open(service.bookingUrl || 'https://www.fresha.com/book-now/beyou-beautyhub-j4ur9xlp/services?lid=2613695&eid=4605333&oiid=sv%3A22827620&share&pId=2531140', '_blank', 'noopener,noreferrer');
                        if (newWindow) {
                          window.focus();
                        }
                      }
                    }}
                    className={`glow-btn w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
                      isFeatured
                        ? 'glow-dark bg-warm text-olive-ink hover:bg-cream'
                        : 'bg-olive text-warm hover:bg-olive-deep'
                    }`}
                    aria-label="Book appointment at Be You Beauty Hub"
                  >
                    Book This Service
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
