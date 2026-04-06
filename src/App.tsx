import { useEffect, useMemo, useRef, useState } from 'react';
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
import KIntroOverlay from './components/KIntroOverlay';
import { IntroMorphProvider } from './contexts/IntroMorphContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import DemoRouter from './demo/DemoRouter';

gsap.registerPlugin(ScrollTrigger);

function PortfolioPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroNameTargetRef = useRef<HTMLDivElement>(null);
  const [morphStarted, setMorphStarted] = useState(false);
  const [morphComplete, setMorphComplete] = useState(false);

  const introMorphValue = useMemo(
    () => ({
      heroNameTargetRef,
      morphStarted,
      morphComplete,
    }),
    [morphStarted, morphComplete]
  );

  useEffect(() => {
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
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      if (debugInterval!) clearInterval(debugInterval);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = morphComplete ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [morphComplete]);

  const mainVisible = morphStarted || morphComplete;

  return (
    <IntroMorphProvider value={introMorphValue}>
      <div className="relative bg-black dark:bg-black light:bg-white min-h-screen overflow-x-hidden">
        {!morphComplete && (
          <KIntroOverlay
            variant="overlay"
            morphTargetRef={heroNameTargetRef}
            onMorphStart={() => setMorphStarted(true)}
            onComplete={() => setMorphComplete(true)}
          />
        )}

        {/* Grain overlay */}
        <div className="grain-overlay opacity-[0.03] transition-opacity duration-500 [.modal-open_&]:opacity-0" />

        {/* Custom cursor */}
        <CustomCursor />

        {/* Navigation */}
        <Navigation />

        {/* Main content */}
        <main
          ref={mainRef}
          className={`relative [.modal-open_&]:opacity-20 transition-opacity duration-500 ${
            mainVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
          <Footer />
        </main>
      </div>
    </IntroMorphProvider>
  );
}

function App() {
  useEffect(() => {
    // When this app is rendered inside an iframe (project preview),
    // force native cursor so pointer remains visible inside the frame.
    const isEmbedded = window.self !== window.top;
    document.documentElement.classList.toggle('embedded-iframe', isEmbedded);
    return () => {
      document.documentElement.classList.remove('embedded-iframe');
    };
  }, []);

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
