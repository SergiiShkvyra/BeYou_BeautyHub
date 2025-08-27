import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      service: 'Lash Lift + Tinting',
      rating: 5,
      text: 'Absolutely amazing! The lashes look so natural and beautiful. I get compliments every day. The technician was so professional and made me feel comfortable throughout the entire process.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    },
    {
      name: 'Emily Rodriguez',
      service: 'Eyebrow Shaping & Tinting',
      rating: 5,
      text: 'My brows have never looked better! The shape is perfect for my face and the tinting looks so natural. I save so much time on my morning routine now. Highly recommend!',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
    },
    {
      name: 'Jessica Chen',
      service: 'Lash Lift + Tinting',
      rating: 5,
      text: 'Perfect for someone who wanted a natural enhancement. The lash lift gave me beautiful curl and the tinting added just the right amount of definition. The service was relaxing and the results exceeded my expectations.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    },
    {
      name: 'Amanda Davis',
      service: 'Brow Lamination',
      rating: 5,
      text: 'The brow lamination gave me the fluffy, full brows I always wanted. The results lasted for weeks and looked incredible. Such a game-changer for my beauty routine!',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg'
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