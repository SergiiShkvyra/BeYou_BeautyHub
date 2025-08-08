import React, { useState } from 'react';
import { X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    {
      src: 'https://images.pexels.com/photos/7755468/pexels-photo-7755468.jpeg',
      alt: 'Beautiful woman with perfectly shaped eyebrows showcasing professional brow artistry'
    },
    {
      src: 'https://images.pexels.com/photos/8129903/pexels-photo-8129903.jpeg',
      alt: 'Beautiful volume lash extensions close-up'
    },
    {
      src: 'https://images.pexels.com/photos/8129864/pexels-photo-8129864.jpeg',
      alt: 'Beautiful eyelash extensions close-up view'
    },
    {
      src: 'https://images.pexels.com/photos/7755468/pexels-photo-7755468.jpeg',
      alt: 'Perfect eyebrow tinting and shaping results'
    },
    {
      src: 'https://images.pexels.com/photos/8129852/pexels-photo-8129852.jpeg',
      alt: 'Classic lash extensions natural look'
    },
    {
      src: 'https://images.pexels.com/photos/5938253/pexels-photo-5938253.jpeg',
      alt: 'Volume lash extensions dramatic look'
    },
    {
      src: 'https://images.pexels.com/photos/7755433/pexels-photo-7755433.jpeg',
      alt: 'Lash lift and tint natural enhancement'
    },
    {
      src: 'https://images.pexels.com/photos/8129868/pexels-photo-8129868.jpeg',
      alt: 'Beautiful hybrid lash extensions final result'
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Work</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the beautiful transformations we've created for our clients
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 will-change-transform"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 will-change-transform"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <p className="text-lg font-semibold">View Full Size</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white hover:text-olive z-10"
              >
                <X className="h-8 w-8" />
              </button>
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;