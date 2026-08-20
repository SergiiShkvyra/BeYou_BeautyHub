import { Heart, Award, Users, Star } from 'lucide-react';
import { useReveal, revealChildren, gsap } from '../lib/useReveal';

const About = () => {
  const features = [
    {
      icon: <Heart className="h-5 w-5" />,
      title: 'Passionate Expertise',
      description: 'Over 4 years of dedicated experience in beauty enhancement'
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: 'Certified Professional',
      description: 'Licensed and certified in advanced lash and brow techniques'
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Personalized Service',
      description: 'Every treatment is customized to enhance your unique beauty'
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: 'Premium Products',
      description: 'We use only the highest quality, hypoallergenic materials'
    }
  ];

  const scope = useReveal<HTMLElement>((section) => {
    revealChildren(section);
    // Gentle parallax on the portrait while scrolling through the section
    gsap.to('[data-about-image]', {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  return (
    <section id="about" ref={scope} className="py-24 sm:py-32 bg-warm/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image — arched "salon window" mask */}
          <div className="relative px-6 sm:px-10 lg:px-4">
            <div
              data-reveal="image"
              className="overflow-hidden rounded-t-[999px] rounded-b-[2rem] shadow-2xl shadow-olive/20"
            >
              <img
                data-about-image
                src="/images/about/About_smaller.jpg"
                alt="Beautiful woman with natural makeup showcasing skincare and beauty"
                className="w-full h-[26rem] lg:h-[34rem] object-cover object-top scale-110 origin-top"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div
              data-reveal
              className="absolute -bottom-6 right-0 sm:right-4 bg-olive text-warm px-8 py-6 rounded-2xl shadow-xl shadow-olive/30"
            >
              <div className="font-display text-3xl leading-none">1400+</div>
              <div className="text-[11px] uppercase tracking-[0.2em] mt-1.5 text-warm/80">
                Happy Clients
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p data-reveal className="micro-label mb-5">
              About
            </p>
            <h2 data-reveal className="font-display text-4xl sm:text-5xl text-olive-ink leading-[1.08] mb-8">
              Your Beauty, <span className="italic text-olive">Our Passion</span>
            </h2>
            <p data-reveal className="text-lg text-olive-ink/75 mb-6 leading-relaxed">
              Welcome to BeYou — not just a beauty studio, but a space where you’re treated the way we treat ourselves:
              with care, honesty, love, and deep respect.
            </p>
            <p data-reveal className="text-lg text-olive-ink/75 mb-10 leading-relaxed">
              Here, you’re more than just a client. You’re part of something real.
              We see your natural beauty, and we help it shine — with every lash, every brow, and every genuine conversation
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
              {features.map((feature, index) => (
                <div key={index} data-reveal className="flex items-start gap-4">
                  <div className="text-olive bg-olive/10 rounded-full p-2.5 mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-olive-ink mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-olive-ink/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              data-reveal
              onClick={() => window.open('https://www.instagram.com/beyou_beautyhub/#', '_blank')}
              className="glow-btn mt-10 bg-olive text-warm px-9 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.2em] hover:bg-olive-deep transition-all duration-300 hover:-translate-y-0.5"
            >
              Learn More About Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
