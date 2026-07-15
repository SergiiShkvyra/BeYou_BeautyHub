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
      if (header) {
        const height = header.offsetHeight;
        document.body.style.paddingTop = `${height}px`;
        // Published for layout math (e.g. the hero sizes itself to the
        // viewport minus the header so its content fits the first screen).
        document.documentElement.style.setProperty('--header-h', `${height}px`);
      }
    };

    // Initial calculation
    calculateHeaderHeight();

    // Recalculate on resize
    window.addEventListener('resize', calculateHeaderHeight);

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
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', calculateHeaderHeight);
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