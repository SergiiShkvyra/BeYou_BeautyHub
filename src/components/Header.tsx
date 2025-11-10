import React, { useState, useEffect } from 'react';
import { Phone, MapPin } from 'lucide-react';

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false);

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
              <button
                onClick={() => {
                  // Prevent opening modal if already open
                  if (isNavigationModalOpen) return;
                  
                  setIsNavigationModalOpen(true);
                  const address = "424 Maple Ave E Suite 3, Vienna, VA 22180";
                  const encodedAddress = encodeURIComponent(address);
                  
                  // Create navigation options
                  const navigationOptions = [
                    {
                      name: "Google Maps",
                      url: `https://www.google.com/maps/place/BeYou+Beautyhub/data=!4m2!3m1!1s0x0:0x8b1970ecf4fc771f?sa=X&ved=1t:2428&ictx=111&cshid=1754622378904828`,
                      icon: "🗺️"
                    },
                    {
                      name: "Apple Maps",
                      url: `https://maps.apple.com/place?place-id=IC0C55897AF474D4C&address=424+Maple+Ave+E%2C+Vienna%2C+VA++22180%2C+United+States&coordinate=38.9092273%2C-77.2568108&name=BeYou+BeautyHub&_provider=9902`,
                      icon: "🍎"
                    },
                    {
                      name: "Waze",
                      url: `https://ul.waze.com/ul?place=ChIJ_SSTFQBLtokRH3f89OxwGYs&ll=38.90924020%2C-77.25683010&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location`,
                      icon: "🚗"
                    }
                  ];
                  
                  // Create modal
                  const modal = document.createElement('div');
                  modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                  `;
                  
                  const modalContent = document.createElement('div');
                  modalContent.style.cssText = `
                    background: #dbd6b2;
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 400px;
                    width: 100%;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                  `;
                  
                  modalContent.innerHTML = `
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #505e47;">
                      Choose Navigation App
                    </h3>
                    <p style="margin: 0 0 20px 0; color: #505e47; font-size: 14px; opacity: 0.8;">
                      ${address}
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                      ${navigationOptions.map(option => `
                        <button 
                          onclick="window.open('${option.url}', '_blank'); document.body.removeChild(document.querySelector('[data-navigation-modal]'))"
                          style="
                            display: flex;
                            align-items: center;
                           gap: 8px;
                            padding: 12px 16px;
                            border: 2px solid #505e47;
                            border-radius: 8px;
                            background: #f5f3e8;
                            cursor: pointer;
                            transition: all 0.2s;
                            font-size: 16px;
                            font-weight: 500;
                            color: #505e47;
                           margin: 0;
                          "
                          onmouseover="this.style.borderColor='#3a4a35'; this.style.backgroundColor='#dbd6b2'"
                          onmouseout="this.style.borderColor='#505e47'; this.style.backgroundColor='#f5f3e8'"
                        >
                         <span style="font-size: 20px; margin-right: 12px;">${option.icon}</span>
                         <span style="flex: 1;">Open in ${option.name}</span>
                        </button>
                      `).join('')}
                    </div>
                    <button 
                      onclick="document.body.removeChild(document.querySelector('[data-navigation-modal]'))"
                      style="
                        margin-top: 16px;
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #505e47;
                        border-radius: 6px;
                        background: #dbd6b2;
                        cursor: pointer;
                        font-size: 14px;
                        color: #505e47;
                      "
                      onmouseover="this.style.backgroundColor='#dbd6b2'"
                      onmouseout="this.style.backgroundColor='#f5f3e8'"
                    >
                      Cancel
                    </button>
                  `;
                  
                  modal.appendChild(modalContent);
                  modal.setAttribute('data-navigation-modal', 'true');
                  
                  // Close modal when clicking outside
                  modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                      document.body.removeChild(modal);
                      setIsNavigationModalOpen(false);
                    }
                  });
                  
                  // Update all onclick handlers to close modal and reset state
                  modalContent.innerHTML = `
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #505e47;">
                      Choose Navigation App
                    </h3>
                    <p style="margin: 0 0 20px 0; color: #505e47; font-size: 14px; opacity: 0.8;">
                      ${address}
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                      ${navigationOptions.map(option => `
                        <button 
                          onclick="window.open('${option.url}', '_blank'); document.body.removeChild(document.querySelector('[data-navigation-modal]')); window.headerComponent?.setIsNavigationModalOpen(false);"
                          style="
                            display: flex;
                            align-items: center;
                           gap: 8px;
                            padding: 12px 16px;
                            border: 2px solid #505e47;
                            border-radius: 8px;
                            background: #dbd6b2;
                            cursor: pointer;
                            transition: all 0.2s;
                            font-size: 16px;
                            font-weight: 500;
                            color: #505e47;
                           margin: 0;
                          "
                          onmouseover="this.style.borderColor='#3a4a35'; this.style.backgroundColor='#c9c4a0'"
                          onmouseout="this.style.borderColor='#505e47'; this.style.backgroundColor='#dbd6b2'"
                          <span style="font-size: 20px; background: transparent; color: inherit;">${option.icon}</span>
                          <span style="background: transparent; color: inherit;">Open in ${option.name}</span>
                         <span style="font-size: 20px; background: transparent; color: inherit;">${option.icon}</span>
                         <span style="background: transparent; color: inherit;">Open in ${option.name}</span>
                        </button>
                      `).join('')}
                    </div>
                    <button 
                      onclick="document.body.removeChild(document.querySelector('[data-navigation-modal]')); window.headerComponent?.setIsNavigationModalOpen(false);"
                      style="
                        margin-top: 16px;
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #505e47;
                        border-radius: 6px;
                        background: #dbd6b2;
                        cursor: pointer;
                        font-size: 14px;
                        color: #505e47;
                      "
                      onmouseover="this.style.backgroundColor='#c9c4a0'"
                      onmouseout="this.style.backgroundColor='#dbd6b2'"
                    >
                      Cancel
                    </button>
                  `;
                  
                  document.body.appendChild(modal);
                  
                  // Expose state setter to global scope for onclick handlers
                  window.headerComponent = { setIsNavigationModalOpen };
                }}
                className={`hover:underline transition-all duration-200 ${isNavigationModalOpen ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <span>424 Maple Ave E Suite 3, Vienna, VA 22180</span>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:hidden">
            <MapPin className="h-4 w-4" />
            <button
              onClick={() => {
                const address = "424 Maple Ave E Suite 3, Vienna, VA 22180";
                const encodedAddress = encodeURIComponent(address);
                
                // Create navigation options
                const navigationOptions = [
                  {
                    name: "Google Maps",
                    url: "https://www.google.com/maps/place/BeYou+Beautyhub/data=!4m2!3m1!1s0x0:0x8b1970ecf4fc771f?sa=X&ved=1t:2428&ictx=111&cshid=1754622378904828",
                    icon: "🗺️"
                  },
                  {
                    name: "Apple Maps",
                    url: `https://maps.apple.com/place?place-id=IC0C55897AF474D4C&address=424+Maple+Ave+E%2C+Vienna%2C+VA++22180%2C+United+States&coordinate=38.9092273%2C-77.2568108&name=BeYou+BeautyHub&_provider=9902`,
                    icon: "🍎"
                  },
                  {
                    name: "Waze",
                    url: `https://ul.waze.com/ul?place=ChIJ_SSTFQBLtokRH3f89OxwGYs&ll=38.90924020%2C-77.25683010&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location`,
                    icon: "🚗"
                  }
                ];
                
                // Create modal
                const modal = document.createElement('div');
                modal.style.cssText = `
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: rgba(0, 0, 0, 0.5);
                  z-index: 99999;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 20px;
                `;
                
                const modalContent = document.createElement('div');
                modalContent.style.cssText = `
                  background: #dbd6b2;
                  border-radius: 12px;
                  padding: 24px;
                  max-width: 400px;
                  width: 100%;
                  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                `;
                
                modalContent.innerHTML = `
                  <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #505e47;">
                    Choose Navigation App
                  </h3>
                  <p style="margin: 0 0 20px 0; color: #505e47; font-size: 14px; opacity: 0.8;">
                    ${address}
                  </p>
                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${navigationOptions.map(option => `
                      <button 
                        onclick="window.open('${option.url}', '_blank'); document.body.removeChild(document.querySelector('[data-navigation-modal]'))"
                        style="
                          display: flex;
                          align-items: center;
                          gap: 12px;
                          padding: 12px 16px;
                          border: 2px solid #505e47;
                          border-radius: 8px;
                          background: #dbd6b2;
                          cursor: pointer;
                          transition: all 0.2s;
                          font-size: 16px;
                          font-weight: 500;
                          color: #505e47;
                        "
                        onmouseover="this.style.borderColor='#3a4a35'; this.style.backgroundColor='#c9c4a0'"
                        onmouseout="this.style.borderColor='#505e47'; this.style.backgroundColor='#dbd6b2'"
                      >
                        <span style="font-size: 20px; background: transparent; color: inherit;">${option.icon}</span>
                        <span style="flex: 1; background: transparent; color: inherit;">Open in ${option.name}</span>
                      </button>
                    `).join('')}
                  </div>
                  <button 
                    onclick="document.body.removeChild(document.querySelector('[data-navigation-modal]'))"
                    style="
                      margin-top: 16px;
                      width: 100%;
                      padding: 10px;
                      border: 1px solid #505e47;
                      border-radius: 6px;
                      background: #dbd6b2;
                      cursor: pointer;
                      font-size: 14px;
                      color: #505e47;
                    "
                    onmouseover="this.style.backgroundColor='#c9c4a0'"
                    onmouseout="this.style.backgroundColor='#dbd6b2'"
                  >
                    Cancel
                  </button>
                `;
                
                modal.appendChild(modalContent);
                modal.setAttribute('data-navigation-modal', 'true');
                
                // Close modal when clicking outside
                modal.addEventListener('click', (e) => {
                  if (e.target === modal) {
                    document.body.removeChild(modal);
                  }
                });
                
                document.body.appendChild(modal);
              }}
              className="cursor-pointer hover:underline hover:text-olive transition-all duration-200"
              aria-label="Open BeYou BeautyHub location in navigation app"
              title="Click to choose navigation app"
            >
              Vienna, VA
            </button>
          </div>
          <div className="text-right">
            <div 
              className="text-right text-sm leading-tight cursor-pointer hover:text-olive transition-colors duration-200"
              onClick={() => {
                // Scroll to contact section first
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                  
                  // After scrolling, find and highlight the Hours div
                  setTimeout(() => {
                    // Find the Hours div in the Contact section (now the first div in the space-y-6 container)
                    const contactInfoContainer = contactSection.querySelector('.space-y-6');
                    const hoursDiv = contactInfoContainer?.querySelector('div:first-child'); // The Hours div is now the first child
                    if (hoursDiv) {
                      // Center the Hours div on screen
                      const rect = hoursDiv.getBoundingClientRect();
                      const viewportHeight = window.innerHeight;
                      const elementHeight = rect.height;
                      const scrollOffset = window.scrollY + rect.top - (viewportHeight / 2) + (elementHeight / 2);
                      
                      window.scrollTo({
                        top: scrollOffset,
                        behavior: 'smooth'
                      });
                      
                      // Add blinking highlight effect
                      const originalStyle = hoursDiv.getAttribute('style') || '';
                      let blinkCount = 0;
                      const maxBlinks = 6;
                      
                      const blink = () => {
                        if (blinkCount < maxBlinks) {
                          const isHighlighted = blinkCount % 2 === 0;
                          (hoursDiv as HTMLElement).style.cssText = originalStyle + 
                            (isHighlighted ? 
                              '; background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 8px; transition: all 0.3s ease;' : 
                              '; transition: all 0.3s ease;'
                            );
                          blinkCount++;
                          setTimeout(blink, 400);
                        } else {
                          // Reset to original style
                          (hoursDiv as HTMLElement).style.cssText = originalStyle;
                        }
                      };
                      
                      // Start blinking after a short delay
                      setTimeout(blink, 500);
                    }
                  }, 800); // Wait for scroll to complete
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  (e.target as HTMLElement).click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Click to view business hours"
            >
              Our schedule
            </div>
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
                    const element = document.getElementById('home');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:opacity-70 transition-opacity duration-200 cursor-pointer mx-2 sm:mx-3 relative"
                  aria-label="BeYou BeautyHub - Return to homepage"
                >
                  <img
                    src="/images/tryLogo-1.png"
                    alt="BeYou BeautyHub Logo"
                    className="h-12 w-auto sm:h-16 md:h-20 object-contain transition-all duration-200 ease-in-out hover:scale-105"
                    loading="eager"
                    decoding="async"
                  />
                </button>
                <span>YOU</span>
              </span>
              <span 
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light tracking-wide"
                style={{
                  opacity: Math.max(beautyHubOpacity, 0.8),
                  transition: 'opacity 0.3s ease-out'
                }}
              >
                <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-playfair">Beauty Hub</span>
              </span>
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
    </header>
  );
};

export default Header;