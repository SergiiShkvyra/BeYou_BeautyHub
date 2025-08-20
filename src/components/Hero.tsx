import React from 'react';
import { Star, Award, Users } from 'lucide-react';

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-[180px] sm:pt-[170px] md:pt-[180px] w-full will-change-transform">
      {/* Background image */}
      <div className="absolute inset-0 z-0 will-change-transform">
        <img
          src="/images/t2001x1212.jpg"
          alt="Beautiful eyelash extensions"
          className="w-full h-full object-cover min-h-screen will-change-transform"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-warm w-full">
        <h1 className="text-4xl md:text-6xl font-inter mb-6 leading-tight">
          Be natural. Be real.
          <span className="text-warm block">BeYou.</span>
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto opacity-90">
          Professional eyelash and eyebrow services that make you feel confident and beautiful every day
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => window.open('https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-gt6tu55b', '_blank')}
            className="bg-olive hover:bg-warm text-white hover:text-olive px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Book Appointment
          </button>
          <button 
            onClick={() => {
              const element = document.getElementById('services');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="border-2 border-white text-white hover:bg-warm hover:text-olive px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200"
          >
            View Services
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-3">
            <Users className="h-8 w-8 text-olive" />
            <div className="text-left">
              <div className="text-3xl font-bold">1400+</div>
              <div className="text-sm opacity-80">Happy Clients</div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Award className="h-8 w-8 text-olive" />
            <div className="text-left">
              <div className="text-3xl font-bold">3+</div>
              <div className="text-sm opacity-80">Years Experience</div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Star className="h-8 w-8 text-olive" />
            <div className="text-left">
              <div className="text-3xl font-bold">5</div>
              <div className="text-sm opacity-80">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;