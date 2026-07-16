import { useState, useEffect, useRef } from 'react';
import { Phone, MapPin } from 'lucide-react';
import { scrollToSection, handlePhoneClick } from '../utils/interactions';

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false);
  const [isTopSectionCollapsed, setIsTopSectionCollapsed] = useState(false);
  const [pressedNavItem, setPressedNavItem] = useState<string | null>(null);
  // Which nav item is currently showing its click-flash. Held in React state
  // (not classList) because the header re-renders on every scroll frame and
  // React rewrites className, wiping imperatively-added classes.
  const [flashedNavItem, setFlashedNavItem] = useState<string | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastScrollYRef = useRef(0);

  const flashNav = (item: string) => {
    // Null first so a rapid re-click restarts the CSS animation.
    setFlashedNavItem(null);
    requestAnimationFrame(() => setFlashedNavItem(item));
    clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setFlashedNavItem(null), 850);
  };

  // ULTIMATE NUCLEAR OPTION: Force header to be visible at all times
  useEffect(() => {
    // Scroll animation handler
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Collapse the top bar + logo row when scrolling down, drop it back down when scrolling up.
      // Always fully expanded near the very top of the page regardless of direction.
      // Exception: phone in landscape ("horizontal") — once collapsed, only re-expand at the very top.
      const isPhoneLandscape = window.matchMedia('(max-height: 500px) and (orientation: landscape)').matches;
      const lastScrollY = lastScrollYRef.current;
      if (currentScrollY <= 10) {
        setIsTopSectionCollapsed(false);
      } else if (currentScrollY > lastScrollY + 8) {
        setIsTopSectionCollapsed(true);
      } else if (!isPhoneLandscape && currentScrollY < lastScrollY - 8) {
        setIsTopSectionCollapsed(false);
      }
      lastScrollYRef.current = currentScrollY;
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
        // NO GPU-layer promotion here (translateZ / will-change / contain
        // paint / preserve-3d): a composited fixed layer with border-radius
        // triggers a Chromium compositor bug that paints the rounded
        // corners as opaque squares over the hero on real devices. The
        // neutral values are set explicitly to overwrite older inline ones.
        header.style.transform = 'none';
        header.style.webkitTransform = 'none';
        header.style.backfaceVisibility = 'visible';
        header.style.webkitBackfaceVisibility = 'visible';
        header.style.willChange = 'auto';
        header.style.contain = 'none';
        
        // Force visibility properties
        header.style.display = 'block';
        header.style.visibility = 'visible';
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
        
        // Prevent any scroll behavior or transforms
        header.style.overflowY = 'visible';
        header.style.overflowX = 'hidden';
        header.style.transformStyle = 'flat';
        header.style.perspective = 'none';
        
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

  // Calculate animation values based on scroll position
  // Animation starts at 50px scroll and completes at 200px scroll
  const scrollThreshold = 50;
  const animationRange = 150; // 200px - 50px
  const scrollProgress = Math.min(Math.max((scrollY - scrollThreshold) / animationRange, 0), 1);
  
  // Calculate opacity for "BeautyHub" (1 to 0)
  const beautyHubOpacity = 1 - scrollProgress;
  return (
    <header
      onClick={(e) => {
        // Minimized header: a click anywhere on the bar (except an actual
        // control, which keeps its own meaning) re-opens the top section.
        // It stays open until the visitor scrolls down again — the scroll
        // handler's existing down-collapse rule takes it from there.
        if (!isTopSectionCollapsed) return;
        if ((e.target as HTMLElement).closest('button, a')) return;
        setIsTopSectionCollapsed(false);
      }}
      className="header-surface md:backdrop-blur-md fixed top-0 left-0 right-0 w-full z-[99999]"
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
        boxSizing: 'border-box',
        cursor: isTopSectionCollapsed ? 'pointer' : 'auto'
      }}
    >
      {/* Collapsible: top contact bar + logo row. Slides away on scroll-down, drops back on scroll-up. */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isTopSectionCollapsed ? '0px' : '400px',
          opacity: isTopSectionCollapsed ? 0 : 1,
        }}
      >
      {/* Top contact bar */}
      <div className="py-0 px-4 w-full" style={{ margin: '0', padding: '0 1rem', width: '100%' }}>
        <div className="header-line-top max-w-7xl mx-auto flex justify-between items-center text-xs text-olive py-1.5 border-b border-olive/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <button
                onClick={() => handlePhoneClick('(571)-276-7014')}
                className="glow-text hover:underline transition-all duration-200 cursor-pointer"
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

                  // Create navigation options
                  const navigationOptions = [
                    {
                      name: "Google Maps",
                      url: `https://www.google.com/maps/place/BeYou+Beauty+Hub/@38.880467,-77.1067753,19z/data=!3m2!4b1!5s0x89b7b5a8beaade69:0x86d7e23f64a3a3fe!4m6!3m5!1s0x89b64b00159324fd:0x8b1970ecf4fc771f!8m2!3d38.880466!4d-77.1061316!16s%2Fg%2F11xgky7njv?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D`,
                      icon: "🗺️"
                    },
                    {
                      name: "Apple Maps",
                      url: `https://maps.apple.com/place?place-id=I90D4B8468B267FB6&address=3865+Wilson+Blvd%2C+Rm+4%2C+Arlington%2C+VA++22203%2C+United+States&coordinate=38.880472%2C-77.106054&name=BeYou+BeautyHub&_provider=9902`,
                      icon: "🍎"
                    },
                    {
                      name: "Waze",
                      url: `https://www.waze.com/en/live-map/directions/us/va/arlington/beyou-beauty-hub?to=place.ChIJ_SSTFQBLtokRH3f89OxwGYs`,
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
                    max-width: 320px;
                    width: 100%;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                  `;
                  
                  modalContent.innerHTML = `
                    <h3 style="margin: 0 0 24px 0; font-size: 18px; font-weight: 600; color: #505e47; line-height: 1.6; text-align: center;">
                      Choose Navigation App
                    </h3>
                    <div style="margin: 0 0 16px 0; height: 1px;"></div>
                    <div style="display: flex; flex-direction: column; gap: 20px;">
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
                     setIsNavigationModalOpen(false);
                      setIsNavigationModalOpen(false);
                    }
                  });
                  
                  // Update all onclick handlers to close modal and reset state
                  modalContent.innerHTML = `
                    <h3 style="margin: 0 0 24px 0; font-size: 18px; font-weight: 600; color: #505e47; line-height: 1.6; text-align: center;">
                      Choose Navigation App
                    </h3>
                    <div style="margin: 0 0 16px 0; height: 1px;"></div>
                    <div style="display: flex; flex-direction: column; gap: 20px;">
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
                        </button>
                      `).join('')}
                    </div>
                    <button 
                     onclick="document.body.removeChild(document.querySelector('[data-navigation-modal]')); if(window.headerComponent) window.headerComponent.setIsNavigationModalOpen(false);"
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
                  
                  // Add document-wide click listener to close modal
                  const handleDocumentClick = (e: Event) => {
                    const target = e.target as HTMLElement;
                    // Check if click is outside the modal
                    if (!modal.contains(target)) {
                     if (document.body.contains(modal)) {
                       document.body.removeChild(modal);
                     }
                      setIsNavigationModalOpen(false);
                      document.removeEventListener('click', handleDocumentClick);
                    }
                  };
                  
                  // Add listener after a small delay to prevent immediate closure
                  setTimeout(() => {
                    document.addEventListener('click', handleDocumentClick);
                  }, 100);
                  
                  // Expose state setter to global scope for onclick handlers
                  window.headerComponent = { setIsNavigationModalOpen };
                }}
                className={`glow-text hover:underline transition-all duration-200 ${isNavigationModalOpen ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <span>Salons by JC, 3865 Wilson Blvd, room 4, Arlington, VA 22203</span>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:hidden">
            <MapPin className="h-4 w-4" />
            <button
              onClick={() => {
                // Create navigation options
                const navigationOptions = [
                  {
                    name: "Google Maps",
                    url: "https://www.google.com/maps/place/BeYou+Beauty+Hub/@38.880466,-77.1061316,19z/data=!3m2!4b1!5s0x89b7b5a8beaade69:0x86d7e23f64a3a3fe!4m6!3m5!1s0x89b64b00159324fd:0x8b1970ecf4fc771f!8m2!3d38.880466!4d-77.1061316!16s%2Fg%2F11xgky7njv?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D",
                    icon: "🗺️"
                  },
                  {
                    name: "Apple Maps",
                    url: `https://maps.apple.com/place?place-id=I90D4B8468B267FB6&address=3865+Wilson+Blvd%2C+Rm+4%2C+Arlington%2C+VA++22203%2C+United+States&coordinate=38.880472%2C-77.106054&name=BeYou+BeautyHub&_provider=9902`,
                    icon: "🍎"
                  },
                  {
                    name: "Waze",
                    url: `https://www.waze.com/en/live-map/directions/us/va/arlington/beyou-beauty-hub?to=place.ChIJ_SSTFQBLtokRH3f89OxwGYs`,
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
                  <h3 style="margin: 0 0 24px 0; font-size: 18px; font-weight: 600; color: #505e47; line-height: 1.6; text-align: center;">
                    Choose Navigation App
                  </h3>
                  <div style="margin: 0 0 16px 0; height: 1px;"></div>
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
                        <span style="background: transparent; color: inherit;">Open in ${option.name}</span>
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
                
                // Add document-wide click listener to close modal
                const handleDocumentClick = (e: Event) => {
                  const target = e.target as HTMLElement;
                  // Check if click is outside the modal
                  if (!modal.contains(target)) {
                   if (document.body.contains(modal)) {
                     document.body.removeChild(modal);
                   }
                    document.removeEventListener('click', handleDocumentClick);
                  }
                };
                
                // Add listener after a small delay to prevent immediate closure
                setTimeout(() => {
                  document.addEventListener('click', handleDocumentClick);
                }, 100);
              }}
              className="glow-text cursor-pointer hover:underline hover:text-olive transition-all duration-200"
              aria-label="Open BeYou BeautyHub location in navigation app"
              title="Click to choose navigation app"
            >
              Arlington, VA
            </button>
          </div>
          <div className="text-right">
            <div 
              className="glow-text text-right text-sm leading-tight cursor-pointer hover:text-olive transition-colors duration-200"
              onClick={() => {
                // ONE smooth scroll straight to the final position (the Hours
                // block centered on screen). The old version chained a second
                // smooth scroll off a timer while the first was still moving,
                // which showed as a harsh jump near the end.
                const contactSection = document.getElementById('contact');
                if (!contactSection) return;
                const hoursDiv = contactSection
                  .querySelector('.space-y-6')
                  ?.querySelector('div:first-child') as HTMLElement | null;
                if (!hoursDiv) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                  return;
                }

                // Element positions are stable, so the centered target can be
                // computed up front in absolute document coordinates.
                const rect = hoursDiv.getBoundingClientRect();
                const target = Math.round(
                  window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2,
                );
                window.scrollTo({ top: target, behavior: 'smooth' });

                // Soft highlight once the scroll has actually settled —
                // `scrollend` where supported, scroll-position stability as
                // the fallback. Never both (guarded by `done`).
                let done = false;
                const startHighlight = () => {
                  if (done) return;
                  done = true;
                  window.removeEventListener('scrollend', startHighlight);
                  clearInterval(stabilityPoll);
                  hoursDiv.classList.remove('schedule-highlight');
                  void hoursDiv.offsetWidth; // restart the animation if re-clicked
                  hoursDiv.classList.add('schedule-highlight');
                  hoursDiv.addEventListener(
                    'animationend',
                    () => hoursDiv.classList.remove('schedule-highlight'),
                    { once: true },
                  );
                };
                window.addEventListener('scrollend', startHighlight, { once: true });
                let lastY = -1;
                let stableTicks = 0;
                const stabilityPoll = setInterval(() => {
                  if (window.scrollY === lastY) {
                    stableTicks += 1;
                    if (stableTicks >= 3) startHighlight();
                  } else {
                    stableTicks = 0;
                    lastY = window.scrollY;
                  }
                }, 120);
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
                <span className="glow-text glow-text-lg">BE</span>
                <button
                  onClick={() => scrollToSection('home')}
                  className="hover:opacity-70 transition-opacity duration-200 cursor-pointer mx-2 sm:mx-3 relative"
                  aria-label="BeYou BeautyHub - Return to homepage"
                >
                  <img
                    src="/images/tryLogo-1.png"
                    alt="BeYou BeautyHub Logo"
                    className="logo-glow h-12 w-auto sm:h-16 md:h-20 object-contain transition-all duration-200 ease-in-out hover:scale-105"
                    loading="eager"
                    decoding="async"
                  />
                </button>
                <span className="glow-text glow-text-lg">YOU</span>
              </span>
              <span 
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light tracking-wide"
                style={{
                  opacity: Math.max(beautyHubOpacity, 0.8),
                  transition: 'opacity 0.3s ease-out'
                }}
              >
                <span className="glow-text text-xs sm:text-sm lg:text-base xl:text-lg font-playfair">Beauty Hub</span>
              </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Navigation Bar — always visible; sits at the very top once the section above collapses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="header-line-bottom border-t border-olive/20 py-0 mt-0">
          <nav className="flex justify-center items-center gap-0.5 sm:gap-4 lg:gap-6 max-w-4xl mx-auto px-1 py-2 overflow-x-auto font-montserrat min-h-[48px]">
            {['Home', 'Services', 'About', 'Gallery', 'Contact'].map((item) => {
              const isPressed = pressedNavItem === item;
              const releasePress = () => {
                // Keep the pressed look on screen briefly so a quick tap is still visibly noticeable.
                setTimeout(() => {
                  setPressedNavItem((current) => (current === item ? null : current));
                }, 200);
              };
              return (
                <button
                  key={item}
                  onClick={() => {
                    flashNav(item);
                    scrollToSection(item.toLowerCase());
                  }}
                  onTouchStart={() => setPressedNavItem(item)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    flashNav(item);
                    scrollToSection(item.toLowerCase());
                    releasePress();
                  }}
                  onMouseDown={() => setPressedNavItem(item)}
                  onMouseUp={releasePress}
                  onMouseLeave={() => setPressedNavItem((current) => (current === item ? null : current))}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                  }}
                  className={`${flashedNavItem === item ? 'nav-flash ' : ''}glow-text relative font-montserrat font-semibold uppercase tracking-[0.1em] sm:tracking-[0.18em] cursor-pointer px-2 sm:px-4 py-2 text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0 select-none min-h-[32px] flex items-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive/40 rounded-sm after:content-[''] after:absolute after:left-2 after:right-2 sm:after:left-4 sm:after:right-4 after:bottom-1 after:h-px after:bg-olive after:origin-left after:transition-transform after:duration-300 ${
                    isPressed
                      ? 'text-olive-deep after:scale-x-100'
                      : 'text-olive after:scale-x-0 hover:after:scale-x-100 hover:text-olive-deep'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;