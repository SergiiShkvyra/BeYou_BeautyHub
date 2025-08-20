import React from 'react';
import { Eye, Sparkles, Clock, Shield } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: 'Lash Lift + Tinting',
      description: 'A lash lift with tinting for a long-lasting, mascara-free look.',
      price: 'From $80',
      duration: '60-75 minutes',
      features: ['Natural curl', 'Color enhancement', 'No maintenance needed', '6-8 week results'],
      bookingUrl: 'https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-suite-3-amjyvodh?service=s%3A19894830'
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'Brow Lamination + Tweezing',
      description: 'Lamination combined with tweezing for a well-groomed look.',
      price: 'From $75',
      duration: '45-60 minutes',
      features: ['Creates a fuller, thicker brow look', 'Smooths and tames unruly hairs', 'Enhances natural brow symmetry', 'Long-lasting results (up to 6–8 weeks)'],
      bookingUrl: 'https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-suite-3-amjyvodh?service=s%3A19894722'
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'Mapping + tweezing',
      description: 'A technique for defining the perfect shape with precise tweezing for symmetry.',
      price: 'From $40',
      duration: '40-45 minutes',
      features: ['Ensures perfectly balanced and symmetrical brows', 'Defines the ideal shape to suit your facial features', 'Gentle tweezing for a clean and precise result', 'Enhances your natural beauty without over-plucking'],
      bookingUrl: 'https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-suite-3-amjyvodh?service=s%3A19894672'
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: 'L&L Combo Deluxe',
      description: 'Elevating your look with premium lash and brow treatments.',
      price: 'From $190',
      duration: '1 hour 45 minutes',
      features: ['Get naturally lifted, darker, and healthier lashes with a nourishing Botox boost for extra shine and strength.', 'Transform your brows with a fuller, perfectly shaped, and defined look. Symmetry, smoothness, and rich color — all in one treatment.'],
      bookingUrl: 'https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-suite-3-amjyvodh?service=s%3A19895121'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Brow Lamination',
      description: 'Creates fuller, more defined brows with a sleek finish',
      price: 'From $85',
      duration: '60-75 minutes',
      features: ['Fuller appearance', 'Long-lasting results', 'Low maintenance', '6-8 week results'],
      bookingUrl: 'https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-suite-3-amjyvodh'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Lash Lift & Tint',
      description: 'Natural lash enhancement without extensions',
      price: 'From $75',
      duration: '45-60 minutes',
      features: ['Natural curl', 'No maintenance', 'Perfect for vacations', '6-8 week results'],
      bookingUrl: 'https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-suite-3-amjyvodh'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Most Popular Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We specialize in enhancing your natural beauty with professional eyelash and eyebrow services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 will-change-transform"
            >
              <div className="text-olive mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-olive">{service.price}</span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {service.duration}
                </span>
              </div>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-center">
                    <div className="h-2 w-2 bg-olive rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => window.open(service.bookingUrl, '_blank')}
               onMouseDown={(e) => {
                 // Handle middle-click (scroll wheel click)
                 if (e.button === 1) {
                   e.preventDefault();
                   window.open(service.bookingUrl, '_blank');
                 }
               }}
                className="w-full bg-olive text-white py-3 rounded-full hover:bg-warm hover:text-olive transition-colors duration-200 font-semibold"
                aria-label="Book appointment at Be You Beauty Hub"
              >
                Book This Service
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;