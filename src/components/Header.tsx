import React, { useState, useEffect } from 'react';
import { Phone, MapPin } from 'lucide-react';

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSparkleActive, setIsSparkleActive] = useState(false);

  // Function to handle phone number click
  const handlePhoneClick = (phoneNumber: string) => {
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, open phone dialer
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // On desktop, copy to clipboard
      navigator.clipboard.writeText(phoneNumber).then(() => {
        // Show notification that number was copied
        const notification = document.createElement('div');
        notification.textContent = 'Phone number copied to clipboard!';
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #505e47;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 10000;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }).catch(() => {
        // Fallback if clipboard API fails
        alert('Phone number: ' + phoneNumber);
      });
    }
  };
  // ULTIMATE NUCLEAR OPTION: Force header to be visible at all times
  useEffect(() => {
    // Scroll animation handler
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Set animation state based on scroll position
      setIsAnimating(currentScrollY > 50);
    };

    // Add scroll event listener with throttling for performance
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    const forceHeaderVisible = () => {
      const header = document.querySelector('header');
      if (header) {
        // ULTIMATE AGGRESSIVE: Force all positioning and visibility properties
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.bottom = 'auto';
        header.style.left = '0';
        header.style.right = '0';
        header.style.width = '100vw';
        header.style.maxWidth = '100vw';
        header.style.zIndex = '2147483647';
        header.style.transform = 'translateZ(0)';
        header.style.webkitTransform = 'translateZ(0)';
        header.style.backfaceVisibility = 'hidden';
        header.style.webkitBackfaceVisibility = 'hidden';
        header.style.willChange = 'transform';
        header.style.contain = 'layout style paint';
        
        // Force visibility properties
        header.style.display = 'block';
        header.style.visibility = 'visible';
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
        
        // Prevent any scroll behavior or transforms
        header.style.overflowY = 'visible';
        header.style.overflowX = 'hidden';
        header.style.transformStyle = 'preserve-3d';
        header.style.perspective = '1000px';
        
        // Prevent any CSS animations or transitions that might hide it
        header.style.transition = 'none';
        header.style.animation = 'none';
        
        // Force positioning context
        header.style.margin = '0';
        header.style.padding = '0';
        header.style.border = '0';
        header.style.outline = '0';
        
        // Prevent any parent transforms from affecting it
        header.style.isolation = 'isolate';
        header.style.mixBlendMode = 'normal';
      }
    };

    // Apply immediately and very frequently
    forceHeaderVisible();
    
    // Create multiple intervals to continuously enforce visibility
    const interval1 = setInterval(forceHeaderVisible, 50);
    const interval2 = setInterval(forceHeaderVisible, 100);
    const interval3 = setInterval(forceHeaderVisible, 200);
    
    // Reapply on ALL possible events that could affect visibility
    const events = [
      'scroll', 'resize', 'orientationchange', 'load', 
      'touchstart', 'touchmove', 'touchend', 'wheel',
      'mousewheel', 'DOMMouseScroll', 'touchcancel',
      'gesturestart', 'gesturechange', 'gestureend',
      'pageshow', 'pagehide', 'focus', 'blur',
      'visibilitychange', 'transitionend', 'animationend'
    ];
    
    events.forEach(event => {
      window.addEventListener(event, forceHeaderVisible, { passive: true });
      document.addEventListener(event, forceHeaderVisible, { passive: true });
    });

    // Force visibility on animation frame
    const animationFrame = () => {
      forceHeaderVisible();
      requestAnimationFrame(animationFrame);
    };
    requestAnimationFrame(animationFrame);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
      events.forEach(event => {
        window.removeEventListener(event, forceHeaderVisible);
        document.removeEventListener(event, forceHeaderVisible);
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate animation values based on scroll position
  // Animation starts at 50px scroll and completes at 200px scroll
  const scrollThreshold = 50;
  const animationRange = 150; // 200px - 50px
  const scrollProgress = Math.min(Math.max((scrollY - scrollThreshold) / animationRange, 0), 1);
  
  // Calculate opacity for "BeautyHub" (1 to 0)
  const beautyHubOpacity = 1 - scrollProgress;
  
  // Calculate transform for "BE YOU" (moves to center)
  // This creates a smooth transition from left-aligned to center-aligned
  const beYouTransform = scrollProgress * 20; // Adjust this value to control movement distance
  return (
    <header 
      className="bg-warm fixed top-0 left-0 right-0 w-full shadow-sm z-[99999] will-change-transform"
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        width: '100vw',
        maxWidth: '100vw',
        margin: '0',
        padding: '0',
        zIndex: '99999',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
        boxSizing: 'border-box',
        WebkitTransform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        WebkitPosition: 'fixed'
      }}
    >
      {/* Top contact bar */}
      <div className="py-0 px-4 w-full" style={{ margin: '0', padding: '0 1rem', width: '100%' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-olive">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <button 
                onClick={() => handlePhoneClick('(571)-276-7014')}
                className="hover:underline transition-all duration-200 cursor-pointer"
              >
                (571)-276-7014
              </button>
            </div>
            <div className="hidden sm:flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <a 
                href="https://www.google.com/maps/place/BeYou+Beautyhub/data=!4m2!3m1!1s0x0:0x8b1970ecf4fc771f?sa=X&ved=1t:2428&ictx=111&cshid=1754622378904828"
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline transition-all duration-200"
              >
                <span>424 Maple Ave E Suite 3, Vienna, VA 22180</span>
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:hidden">
            <MapPin className="h-4 w-4" />
            <span 
              onClick={() => window.open('https://www.google.com/maps/place/BeYou+Beautyhub/data=!4m2!3m1!1s0x0:0x8b1970ecf4fc771f?sa=X&ved=1t:2428&ictx=111', '_blank')}
              className="cursor-pointer hover:underline hover:text-olive transition-all duration-200"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('https://www.google.com/maps/place/BeYou+Beautyhub/data=!4m2!3m1!1s0x0:0x8b1970ecf4fc771f?sa=X&ved=1t:2428&ictx=111', '_blank');
                }
              }}
              aria-label="Open BeYou BeautyHub location in Google Maps"
              title="Click to view location on Google Maps"
            >
              Vienna, VA
            </span>
          </div>
          <div className="text-right">
            <span className="hidden sm:inline">Tue-Thur: 10AM-7PM | Sat: 10AM-5PM</span>
            <span className="sm:hidden">9AM-7PM</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ margin: '0 auto', width: '100%' }}>
        <div className="flex justify-center items-center py-0">
          <div className="font-playfair font-bold text-olive relative w-full flex justify-center items-center">
            <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-wider leading-none flex items-end">
              <span className="flex items-center">
                <span>BE</span>
                <button
                  onClick={() => {
                    setIsSparkleActive(true);
                    setTimeout(() => setIsSparkleActive(false), 5000);
                    const element = document.getElementById('home');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  onMouseEnter={() => setIsSparkleActive(true)}
                  onMouseLeave={() => {
                    setTimeout(() => setIsSparkleActive(false), 5000);
                  }}
                  className="hover:opacity-80 transition-opacity duration-200 cursor-pointer mx-2 sm:mx-3 relative"
                  aria-label="BeYou BeautyHub - Return to homepage"
                >
                  {/* Sparkle effects */}
                  {isSparkleActive && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute pointer-events-none"
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${10 + Math.random() * 80}%`,
                            animation: `sparkle 5s ease-out ${i * 0.2}s`,
                            animationFillMode: 'both'
                          }}
                        >
                          <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-0 animate-pulse"></div>
                        </div>
                      ))}
                      {/* Additional sparkle layer */}
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={`star-${i}`}
                          className="absolute pointer-events-none text-yellow-400"
                          style={{
                            left: `${15 + Math.random() * 70}%`,
                            top: `${5 + Math.random() * 90}%`,
                            animation: `sparkleRotate 5s ease-out ${i * 0.3}s`,
                            animationFillMode: 'both',
                            fontSize: '12px'
                          }}
                        >
                          ✨
                        </div>
                      ))}
                    </>
                  )}
                  <img
                    src="/images/tryLogo-1.png"
                    alt="BeYou BeautyHub Logo"
                    className={`h-12 w-auto sm:h-16 md:h-20 object-contain transition-all duration-300 ${
                      isSparkleActive ? 'scale-105 brightness-110' : ''
                    }`}
                    loading="eager"
                    decoding="async"
                  />
                </button>
                <span>YOU</span>
              </span>
              <div className="text-sm sm:text-base lg:text-base tracking-wide opacity-70 ml-0">
                BeautyHub
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Bar */}
        <div className="border-t border-olive/20 py-0 mt-0">
          <nav className="flex justify-center items-center gap-1 sm:gap-4 lg:gap-6 max-w-4xl mx-auto px-1 py-0.5 sm:py-0 overflow-x-auto font-montserrat">
            {['Home', 'Services', 'About', 'Gallery', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                onTouchStart={() => {}} 
                onTouchEnd={(e) => {
                  e.preventDefault();
                  scrollToSection(item.toLowerCase());
                }}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
                className="text-gray-700 hover:text-olive active:text-olive active:bg-olive/20 transition-colors duration-200 font-medium cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-olive/10 focus:outline-none focus:text-olive text-xs sm:text-base whitespace-nowrap flex-shrink-0 select-none min-h-[40px] flex items-center"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;