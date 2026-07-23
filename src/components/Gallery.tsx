import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReveal, revealChildren } from '../lib/useReveal';

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

  const scope = useReveal<HTMLElement>((section) => revealChildren(section));

  // Editorial rhythm: alternating tile heights.
  // Desktop (lg, 4 columns): tall/short alternates by index — unchanged,
  // including the mt-10 stagger on short tiles.
  // Mobile/tablet (2 columns): masonry — each column is its own flex stack
  // (tall/short alternating, opposite phase per column), so every tile is
  // top-aligned against the one above it with one consistent gap. The
  // column wrappers dissolve at lg via `display: contents`, and lg:order
  // restores the original left-to-right desktop sequence.
  const tileHeight = (index: number) => {
    const desktopTall = index % 2 === 0;
    const mobileTall = (Math.floor(index / 2) + (index % 2)) % 2 === 0;
    const mobile = mobileTall ? 'h-[22rem] sm:h-[26rem]' : 'h-64 sm:h-80';
    const desktop = desktopTall ? 'lg:h-[26rem] lg:mt-0' : 'lg:h-80 lg:mt-10';
    return `${mobile} ${desktop}`;
  };
  // Literal strings so Tailwind's scanner generates them (no template names)
  const tileOrder = [
    'lg:order-1',
    'lg:order-2',
    'lg:order-3',
    'lg:order-4',
    'lg:order-5',
    'lg:order-6',
    'lg:order-7',
    'lg:order-8',
  ];

  return (
    <section id="gallery" ref={scope} className="py-24 sm:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-16 sm:mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p data-reveal className="micro-label mb-5">
              Gallery
            </p>
            <h2 data-reveal className="font-display text-4xl sm:text-5xl lg:text-6xl text-olive-ink leading-[1.05]">
              Our <span className="italic text-olive">Work</span>
            </h2>
          </div>
          <p data-reveal className="text-lg text-olive-ink/70 leading-relaxed max-w-md lg:text-right">
            See the beautiful transformations we've created for our clients
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 items-start">
          {[0, 1].map((col) => (
            <div key={col} className="flex flex-col gap-3 sm:gap-5 lg:contents">
              {images
                .map((image, index) => ({ image, index }))
                .filter(({ index }) => index % 2 === col)
                .map(({ image, index }) => (
            <div
              key={index}
              data-reveal="image"
              className={`relative group overflow-hidden rounded-2xl transition-all duration-500 will-change-transform ${tileHeight(
                index,
              )} ${tileOrder[index]} ${
                isMobile
                  ? 'cursor-default'
                  : 'cursor-pointer hover:shadow-2xl hover:shadow-olive/20'
              }`}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform ${
                  isMobile ? '' : 'group-hover:scale-110'
                }`}
                loading="lazy"
                decoding="async"
              />
              <div className={`absolute inset-0 bg-olive-ink/0 transition-all duration-500 flex items-end justify-start p-5 ${
                isMobile ? '' : 'group-hover:bg-olive-ink/35'
              }`}>
                <div className={`text-warm transition-all duration-500 ${
                  isMobile
                    ? 'opacity-0'
                    : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                }`}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                    {isMobile ? '' : 'View Full Size'}
                  </p>
                </div>
              </div>
            </div>
                ))}
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-olive-ink/95 z-50 flex items-center justify-center p-4 cursor-pointer"
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
            <div className="relative max-w-2xl max-h-full cursor-default group">
              {/* Enhanced X button with better positioning and touch targets */}
              <button
                onClick={closeModal}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    closeModal();
                  }
                }}
                className="absolute -top-2 -right-2 bg-cream/95 hover:bg-cream text-olive-ink hover:text-olive rounded-full p-3 z-20 transition-all duration-200 shadow-lg backdrop-blur-sm min-w-[48px] min-h-[48px] flex items-center justify-center"
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
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-olive-ink/50 hover:bg-olive-ink/75 text-warm rounded-full p-3 z-20 transition-all duration-200 opacity-0 group-hover:opacity-100 min-w-[48px] min-h-[48px] flex items-center justify-center"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-olive-ink/50 hover:bg-olive-ink/75 text-warm rounded-full p-3 z-20 transition-all duration-200 opacity-0 group-hover:opacity-100 min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label="Next image"
                type="button"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-olive-ink/60 text-warm px-4 py-2 rounded-full text-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
