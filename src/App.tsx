import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './sections/Hero';
import About from './sections/About';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import DemoRouter from './demo/DemoRouter';

gsap.registerPlugin(ScrollTrigger);

function PortfolioPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentSkew = 0;
    let targetSkew = 0;
    let rafId: number;
    const updateSkew = () => {
      // Stop loop if modal is open to save resources
      if (document.body.classList.contains('modal-open')) {
        rafId = requestAnimationFrame(updateSkew);
        return;
      }

      const delta = targetSkew - currentSkew;
      if (Math.abs(delta) > 0.01) {
        currentSkew += delta * 0.1;
        if (mainRef.current) {
          mainRef.current.style.transform = `skewY(${currentSkew}deg)`;
        }
      } else if (currentSkew !== 0) {
        currentSkew = 0;
        if (mainRef.current) {
          mainRef.current.style.transform = 'skewY(0deg)';
        }
      }
      rafId = requestAnimationFrame(updateSkew);
    };
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const lastScrollY = (window as any).lastScrollY || 0;
      const scrollSpeed = Math.abs(scrollY - lastScrollY);
      targetSkew = Math.min(scrollSpeed * 0.015, 2);
      (window as any).lastScrollY = scrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateSkew();
    
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const resetSkew = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        targetSkew = 0;
      }, 50);
    };
    window.addEventListener('scroll', resetSkew, { passive: true });
    
    // --- SECURITY HARDENING ---
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    let debugInterval: ReturnType<typeof setInterval>;
    if (import.meta.env.PROD) {
      debugInterval = setInterval(() => {
        const startTime = performance.now();
        // eslint-disable-next-line no-debugger
        debugger;
        const endTime = performance.now();
        if (endTime - startTime > 100) {
          if (mainRef.current) {
            mainRef.current.style.display = 'none';
          }
          alert('Security protocol active. Inspection is not permitted.');
        }
      }, 1000);
    }
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', resetSkew);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      if (debugInterval!) clearInterval(debugInterval);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative bg-black dark:bg-black light:bg-white min-h-screen overflow-x-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay opacity-[0.03] transition-opacity duration-500 [.modal-open_&]:opacity-0" />
      
      {/* Custom cursor */}
      <CustomCursor />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main content */}
      <main ref={mainRef} className="relative will-change-transform [.modal-open_&]:opacity-20 transition-opacity duration-500">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/demo/*" element={<DemoRouter />} />
            <Route path="/*" element={<PortfolioPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
