import { useEffect } from 'react';
import { initCursorGlow } from './lib/cursorGlow';
import GlitterCursor from './components/GlitterCursor';
import SparkleCursor from './components/SparkleCursor';
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
      // header is collapsed at that moment, its height would poison the
      // body padding with a too-small value. The Header component's own
      // inline max-height is the authoritative signal for this (unlike a
      // getBoundingClientRect/scrollHeight comparison, which turned out to
      // read as "still short" on a plain reload — reproducibly, not just as
      // a one-off transition frame — for reasons unrelated to collapse
      // state, and could leave --header-h permanently unset since every
      // trigger below only ever fires once each).
      const collapsible = header.querySelector<HTMLElement>(
        ':scope > div.overflow-hidden',
      );
      if (collapsible?.style.maxHeight === '0px') return;
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
    // No overflow-x-hidden on this div: it would turn it into a clip box
    // that truncates the hero's pulled-up top (the part that must show
    // through the header's rounded corners on mobile). html/body already
    // clip horizontal overflow.
    <div className="min-h-screen bg-cream w-full">
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
      {/* Site-wide glitter cursor trail. Fixed + pointer-events-none so it
          never intercepts clicks; the component's own logic disables itself
          on mobile (<=768px) and hides when the pointer leaves the window.
          Mounted AFTER IntroOverlay (z-index 100000) and Header (z-index
          2147483647) and matching the header's z-index so it wins the
          stacking tie by DOM order — otherwise the WebGL canvas renders but
          is hidden behind their opaque backgrounds, and the trail silently
          disappears during the intro and over the header bar. */}
      <div className="pointer-events-none fixed inset-0 z-[2147483647]">
        <GlitterCursor label={false} starColor="#f2c94c" />
      </div>
      {/* Mounted last so it paints above the glitter trail (same z-index,
          later DOM wins the tie). */}
      <SparkleCursor />
    </div>
  );
}

export default App;