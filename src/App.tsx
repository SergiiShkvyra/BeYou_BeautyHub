import React, { useEffect } from 'react';
import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [headerHeight, setHeaderHeight] = useState(120);

  useEffect(() => {
    // Calculate header height for proper body padding
    const calculateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        const height = header.offsetHeight;
        setHeaderHeight(height);
        document.body.style.paddingTop = `${height}px`;
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
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', calculateHeaderHeight);
      cleanupScroll();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden will-change-scroll-position" style={{ margin: '0', padding: '0', border: '0' }}>
      <Header />
      <Hero />
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