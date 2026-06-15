import React from 'react';
import { Star, Quote } from 'lucide-react';

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

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-olive rounded-2xl p-8 relative hover:shadow-lg transition-shadow duration-300"
            >
              <Quote className="absolute top-6 left-6 h-8 w-8 text-olive" />
              
              <div className="pt-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-warm mb-6 text-lg leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-warm">{testimonial.service}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;