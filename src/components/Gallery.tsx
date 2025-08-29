import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 
        'iemobile', 'opera mini', 'mobile', 'tablet'
      ];
      
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
                            window.innerWidth <= 768 ||
                            ('ontouchstart' in window) ||
                            (navigator.maxTouchPoints > 0);
      
      setIsMobile(isMobileDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  // Handle image click - only for desktop
  const handleImageClick = (index: number) => {
    if (!isMobile) {
      setSelectedImage(index);
    }
  };

  // Close modal function
  const closeModal = () => {
    setSelectedImage(null);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Navigation functions
  const goToPrevious = () => {
    if (selectedImage !== null) {
      const newIndex = selectedImage === 0 ? images.length - 1 : selectedImage - 1;
      setSelectedImage(newIndex);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      const newIndex = selectedImage === images.length - 1 ? 0 : selectedImage + 1;
      setSelectedImage(newIndex);
    }
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Handle click outside to close modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking on the overlay itself, not the image
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const images = [
    {
      src: '/images/gallery/shutterstock_2611101815.jpg',
      alt: 'Professional eyelash extension work showcasing volume and length'
    },
    {
      src: '/images/gallery/shutterstock_2293561195.jpg',
      alt: 'Beautiful eyebrow shaping and tinting results'
    },
    {
      src: '/images/gallery/shutterstock_1759325294.jpg',
      alt: 'Professional lash lift and tint transformation'
    },
    {
      src: '/images/gallery/shutterstock_2266301635.jpg',
      alt: 'Volume lash extensions creating dramatic eye enhancement'
    },
    {
      src: '/images/gallery/shutterstock_2464025333.jpg',
      alt: 'Natural lash enhancement with professional techniques'
    },
    {
      src: '/images/gallery/shutterstock_2546341347.jpg',
      alt: 'Beautiful brow lamination and shaping results'
    },
    {
      src: '/images/gallery/shutterstock_2219565153.jpg',
      alt: 'Professional eyebrow tinting and design work'
    },
    {
      src: '/images/gallery/shutterstock_1983104336.jpg',
      alt: 'Stunning lash extension transformation showcasing our expertise'
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
              className={`relative group overflow-hidden rounded-2xl shadow-lg transition-all duration-300 will-change-transform ${
                isMobile 
                  ? 'cursor-default' 
                  : 'cursor-pointer hover:shadow-xl'
              }`}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full h-64 object-cover transition-transform duration-500 will-change-transform ${
                  isMobile 
                    ? '' 
                    : 'group-hover:scale-110'
                }`}
                loading="lazy"
                decoding="async"
              />
              <div className={`absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 flex items-center justify-center ${
                isMobile 
                  ? '' 
                  : 'group-hover:bg-opacity-30'
              }`}>
                <div className={`text-white transition-opacity duration-300 text-center ${
                  isMobile 
                    ? 'opacity-0' 
                    : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <p className="text-lg font-semibold">
                    {isMobile ? '' : 'View Full Size'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage !== null && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery modal"
          >
            <div className="relative max-w-4xl max-h-full cursor-default group">
              {/* Enhanced X button with better positioning and touch targets */}
              <button
                onClick={closeModal}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    closeModal();
                  }
                }}
                className="absolute -top-2 -right-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 hover:text-olive rounded-full p-3 z-20 transition-all duration-200 shadow-lg backdrop-blur-sm min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label="Close image modal"
                type="button"
              >
                <X className="h-6 w-6" />
              </button>
              
              {/* Left Navigation Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-3 z-20 transition-all duration-200 opacity-0 group-hover:opacity-100 min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label="Previous image"
                type="button"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              {/* Right Navigation Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-3 z-20 transition-all duration-200 opacity-0 group-hover:opacity-100 min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label="Next image"
                type="button"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {selectedImage + 1} / {images.length}
              </div>
              
              {/* Image container with click prevention */}
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="max-w-full max-h-full object-contain rounded-lg cursor-default"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;