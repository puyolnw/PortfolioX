import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Code2, Terminal } from 'lucide-react';
import { heroConfig, translations } from '../config';
import { useIntroMorph } from '../contexts/IntroMorphContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { trackClick } from '../lib/analytics';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useSectionTracking('Hero');
  const gridRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { language } = useLanguage();
  const t = translations[language].hero;
  const introMorph = useIntroMorph();
  const heroNameTargetRef = introMorph?.heroNameTargetRef;
  const morphStarted = introMorph?.morphStarted ?? true;
  const morphComplete = introMorph?.morphComplete ?? true;

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const content = contentRef.current;
    if (!section || !grid || !content) return;
    if (!morphStarted) return;

    const loadTimer = setTimeout(() => setIsLoaded(true), 100);

    const ctx = gsap.context(() => {
      const cells = grid.querySelectorAll('.grid-cell');
      const titleBlocks = content.querySelectorAll('.title-block');
      const subtitle = content.querySelector('.subtitle-text');
      const ctaButtons = content.querySelectorAll('.cta-button');

      const tl = gsap.timeline({ delay: 0.15 });

      // Grid: fade + slight lift (no 3D spin)
      tl.fromTo(
        cells,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: {
            each: 0.04,
            from: 'random',
          },
          ease: 'expo.out',
        }
      );

      // Greeting / role chips: fade + slide up
      tl.fromTo(
        titleBlocks,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
        },
        '-=0.45'
      );

      tl.fromTo(
        subtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.25'
      );

      tl.fromTo(
        ctaButtons,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        '-=0.2'
      );

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      scrollTl.to(grid, {
        y: 150,
        ease: 'none',
      });

      scrollTl.to(
        content,
        {
          y: -100,
          opacity: 0,
          ease: 'none',
        },
        0
      );
    }, section);

    return () => {
      clearTimeout(loadTimer);
      ctx.revert();
    };
  }, [morphStarted]);

  const rows = heroConfig.gridRows || 6;
  const cols = heroConfig.gridCols || 8;

  const generateGridCells = () => {
    const cells = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isRed = heroConfig.redCells.some((p) => p.row === row && p.col === col);
        const cellIndex = row * cols + col;

        cells.push(
          <div
            key={cellIndex}
            className={`grid-cell absolute top-0 left-0 preserve-3d backface-hidden will-change-transform ${isRed ? 'bg-red-500' : 'bg-white/5 dark:bg-white/5 light:bg-black/5'
              }`}
            style={{
              x: `${(col / cols) * 100}%`, // Use x/y instead of left/top if possible, but keeping consistency for now
              y: `${(row / rows) * 100}%`,
              left: `${(col / cols) * 100}%`,
              top: `${(row / rows) * 100}%`,
              width: `${100 / cols}%`,
              height: `${100 / rows}%`,
              transformOrigin: 'center center',
            }}
            data-cursor-hover
          />
        );
      }
    }
    return cells;
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black dark:bg-black light:bg-white overflow-hidden perspective-1000"
    >
      {/* Grid container */}
      <div
        ref={gridRef}
        className="absolute inset-0 preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {generateGridCells()}
      </div>

      {/* Content overlay */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex items-center justify-center z-20"
      >
        <div className="relative w-full max-w-6xl px-6 text-center">
          {/* Greeting */}
          <div className="mb-4">
            <span className="title-block inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full">
              <Terminal className="w-4 h-4 text-red-500" />
              <span className="font-body text-sm text-red-500 uppercase tracking-wider">
                {t.greeting}
              </span>
            </span>
          </div>

          {/* Main Title — ref for intro→hero morph; real text appears after morph */}
          <div className="mb-6">
            <div
              ref={heroNameTargetRef}
              className={`inline-block transition-opacity duration-300 ${
                morphComplete ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white dark:text-white light:text-black tracking-tighter">
                {t.name}
              </h1>
            </div>
          </div>

          {/* Role */}
          <div className="mb-8">
            <div className="title-block inline-flex items-center gap-3 bg-white px-6 py-3">
              <Code2 className="w-6 h-6 text-red-500" />
              <span className="font-display font-bold text-xl md:text-2xl text-red-500 uppercase tracking-wider">
                {t.role}
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="subtitle-text font-body text-white/60 dark:text-white/60 light:text-black/60 text-base md:text-lg max-w-2xl mx-auto mb-10 thai-text">
            {t.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                trackClick('View Projects', 'Hero');
                scrollToSection('#projects');
              }}
              className="cta-button group flex items-center gap-3 px-8 py-4 bg-red-500 text-white font-display font-bold text-sm uppercase tracking-wider hover:bg-red-600 transition-all duration-300"
              data-cursor-hover
            >
              {t.ctaProjects}
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() => {
                trackClick('Contact Me', 'Hero');
                scrollToSection('#contact');
              }}
              className="cta-button px-8 py-4 border-2 border-white/30 dark:border-white/30 light:border-black/30 text-white dark:text-white light:text-black font-display font-bold text-sm uppercase tracking-wider hover:border-red-500 hover:text-red-500 transition-all duration-300"
              data-cursor-hover
            >
              {t.ctaContact}
            </button>
          </div>
        </div>
      </div>


      {/* Corner decorations */}
      <div className="absolute top-24 left-6 w-16 h-16 border-l-2 border-t-2 border-red-500/30 z-20" />
      <div className="absolute bottom-24 right-6 w-16 h-16 border-r-2 border-b-2 border-red-500/30 z-20" />

      {/* Code decoration */}
      <div className="absolute bottom-32 left-6 font-mono text-xs text-white/20 dark:text-white/20 light:text-black/20 hidden lg:block">
        <div>{'<Developer />'}</div>
        <div>{'const passion = "code";'}</div>
      </div>

      {/* Loading overlay */}
      <div
        className={`absolute inset-0 bg-black dark:bg-black light:bg-white z-50 transition-opacity duration-700 pointer-events-none ${isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
      />
    </section>
  );
};

export default Hero;
