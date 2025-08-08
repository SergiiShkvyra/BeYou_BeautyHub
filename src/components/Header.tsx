import React, { useState, useEffect } from 'react';
import { Phone, MapPin } from 'lucide-react';

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
      <div className="py-1 px-4 w-full" style={{ margin: '0', padding: '0.25rem 1rem', width: '100%' }}>
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
                <span>424 Maple Ave E, Vienna, VA 22180</span>
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
            <span className="hidden sm:inline">Mon-Sat: 9AM-7PM | Sun: 11AM-5PM</span>
            <span className="sm:hidden">9AM-7PM</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ margin: '0 auto', width: '100%' }}>
        <div className="flex justify-center items-center py-2 sm:py-3 lg:py-4">
          <div className="font-playfair font-bold text-olive text-center relative flex flex-row items-center space-x-4">
            <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-wider leading-none mr-2">
              BE YOU
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl tracking-wide opacity-90 self-end">
              BeautyHub
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Bar */}
        <div className="border-t border-olive/20 py-1 sm:py-1.5 lg:py-2">
          <nav className="flex justify-center items-center gap-1 sm:gap-4 lg:gap-6 max-w-4xl mx-auto px-1 py-1 sm:py-0 overflow-x-auto font-montserrat">
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
                className="text-gray-700 hover:text-olive active:text-olive active:bg-olive/20 transition-colors duration-200 font-medium cursor-pointer px-1 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-olive/10 focus:outline-none focus:ring-2 focus:ring-olive focus:ring-opacity-50 text-xs sm:text-base whitespace-nowrap flex-shrink-0 select-none"
                className="text-gray-700 hover:text-olive active:text-olive active:bg-olive/20 transition-colors duration-200 font-medium cursor-pointer px-1 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-olive/10 focus:outline-none focus:text-olive text-xs sm:text-base whitespace-nowrap flex-shrink-0 select-none"
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