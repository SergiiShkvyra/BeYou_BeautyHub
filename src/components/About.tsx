import React from 'react';
import { Heart, Award, Users, Star } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Passionate Expertise',
      description: 'Over 5 years of dedicated experience in beauty enhancement'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Certified Professional',
      description: 'Licensed and certified in advanced lash and brow techniques'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Personalized Service',
      description: 'Every treatment is customized to enhance your unique beauty'
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: 'Premium Products',
      description: 'We use only the highest quality, hypoallergenic materials'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/8129903/pexels-photo-8129903.jpeg"
              alt="Professional eyelash extension application"
              className="rounded-2xl shadow-2xl w-full h-96 lg:h-[500px] object-cover will-change-transform"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute -bottom-8 -right-8 bg-olive text-white p-6 rounded-2xl shadow-xl">
              <div className="text-3xl font-bold">1400+</div>
              <div className="text-sm">Happy Clients</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Your Beauty, Our Passion
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Welcome to BeYou — not just a beauty studio, but a space where you’re treated the way we treat ourselves:
              with care, honesty, love, and deep respect.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Here, you’re more than just a client. You’re part of something real.
              We see your natural beauty, and we help it shine — with every lash, every brow, and every genuine conversation
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="text-olive mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => window.open('https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-gt6tu55b', '_blank')}
              className="mt-8 bg-olive text-white px-8 py-3 rounded-full hover:bg-warm hover:text-olive transition-colors duration-200 font-semibold"
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