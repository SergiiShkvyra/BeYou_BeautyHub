import { useEffect } from 'react';
import { initCursorGlow } from './lib/cursorGlow';
import IntroOverlay from './components/IntroOverlay';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import About from './components/About';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    // Calculate header height for proper body padding
    const calculateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (!header) return;
      // Only trust a measurement taken with the top section fully expanded.
      // Real phones fire `resize` when the URL bar hides mid-scroll — if the
      // header is collapsed (or mid-transition) at that moment, its height
      // would poison the body padding with a too-small value.
      const collapsible = header.querySelector<HTMLElement>(
        ':scope > div.overflow-hidden',
      );
      if (collapsible) {
        // Collapsed state is authoritative from the inline max-height the
        // Header component drives; the height comparison (with a 2px
        // tolerance for fractional-vs-integer rounding) catches mid-
        // transition frames.
        if (collapsible.style.maxHeight === '0px') return;
        const rendered = collapsible.getBoundingClientRect().height;
        if (rendered < collapsible.scrollHeight - 2) return;
      }
      const height = header.offsetHeight;
      document.body.style.paddingTop = `${height}px`;
      // Published for layout math (e.g. the hero sizes itself to the
      // viewport minus the header so its content fits the first screen).
      document.documentElement.style.setProperty('--header-h', `${height}px`);
    };

    // Initial calculation
    calculateHeaderHeight();

    // Recalculate on resize — and once fonts/assets settle: the wordmark's
    // web font loads after mount and changes the header's height, which
    // otherwise leaves a stale body padding (a visible gap under the header
    // on mobile).
    window.addEventListener('resize', calculateHeaderHeight);
    window.addEventListener('load', calculateHeaderHeight);
    document.fonts?.ready.then(calculateHeaderHeight).catch(() => {});

    // The resize event can fire BEFORE the header reflows to the new
    // viewport (verified: DevTools device-toolbar toggles left a stale
    // desktop padding on a mobile-width header). ResizeObserver fires
    // after layout whenever the header's actual size changes — it corrects
    // every such case; the guard above keeps collapse animations from
    // poisoning the value.
    const headerEl = document.querySelector('header');
    const headerResizeObserver = new ResizeObserver(() => calculateHeaderHeight());
    if (headerEl) headerResizeObserver.observe(headerEl);

    // Fix for responsive mode white screen
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    // Optimize scroll performance
    const optimizeScrolling = () => {
      // Debounce scroll events for better performance
      let ticking = false;
      
      const updateScrollPosition = () => {
        // Update any scroll-dependent elements here
        ticking = false;
      };
      
      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateScrollPosition);
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', requestTick, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', requestTick);
      };
    };
    
    const cleanupScroll = optimizeScrolling();
    const cleanupGlow = initCursorGlow();

    return () => {
      cleanupGlow();
      headerResizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', calculateHeaderHeight);
      window.removeEventListener('load', calculateHeaderHeight);
      cleanupScroll();
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream w-full overflow-x-hidden">
      <IntroOverlay />
      <Header />
      <Hero />
      <Marquee />
      <Services />
      <About />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;