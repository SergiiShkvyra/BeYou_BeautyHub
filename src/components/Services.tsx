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
      features: ['Natural curl', 'Color enhancement', 'No maintenance needed', '6-8 week results']
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'Volume Lash Extensions',
      description: 'Multiple lightweight extensions for dramatic, full lashes',
      price: 'From $180',
      duration: '3-4 hours',
      features: ['Dramatic volume', 'Customizable fullness', 'Lightweight comfort', '4-6 week touch-ups']
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: 'Hybrid Lash Extensions',
      description: 'Perfect blend of classic and volume for texture and fullness',
      price: 'From $150',
      duration: '2.5-3.5 hours',
      features: ['Best of both worlds', 'Natural texture', 'Medium volume', '5-7 week touch-ups']
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'Eyebrow Shaping & Tinting',
      description: 'Professional brow design and color enhancement',
      price: 'From $65',
      duration: '45-60 minutes',
      features: ['Custom shaping', 'Color matching', 'Precise technique', 'Monthly maintenance']
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Brow Lamination',
      description: 'Creates fuller, more defined brows with a sleek finish',
      price: 'From $85',
      duration: '60-75 minutes',
      features: ['Fuller appearance', 'Long-lasting results', 'Low maintenance', '6-8 week results']
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Lash Lift & Tint',
      description: 'Natural lash enhancement without extensions',
      price: 'From $75',
      duration: '45-60 minutes',
      features: ['Natural curl', 'No maintenance', 'Perfect for vacations', '6-8 week results']
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
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
                onClick={() => window.location.href = 'https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-suite-3-amjyvodh?service=s%3A19894830'}
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