import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Code2, Terminal } from 'lucide-react';
import { heroConfig, translations } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { language } = useLanguage();
  const t = translations[language].hero;

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const content = contentRef.current;
    if (!section || !grid || !content) return;

    const loadTimer = setTimeout(() => setIsLoaded(true), 100);

    const ctx = gsap.context(() => {
      const cells = grid.querySelectorAll('.grid-cell');
      const titleBlocks = content.querySelectorAll('.title-block');
      const subtitle = content.querySelector('.subtitle-text');
      const ctaButtons = content.querySelectorAll('.cta-button');

      const tl = gsap.timeline({ delay: 0.3 });

      // Grid cells flip in with stagger
      tl.fromTo(
        cells,
        {
          rotateX: 90,
          y: -100,
          opacity: 0,
        },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: {
            each: 0.05,
            from: 'random',
          },
          ease: 'expo.out',
        }
      );

      // Title blocks decode animation
      tl.fromTo(
        titleBlocks,
        {
          scale: 0,
          rotate: 180,
          opacity: 0,
        },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        },
        '-=0.5'
      );

      // Subtitle fade in
      tl.fromTo(
        subtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );

      // CTA buttons
      tl.fromTo(
        ctaButtons,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        '-=0.2'
      );

      // Scroll-based parallax
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
      ctx.revert(); // Correct way to clean up GSAP context
    };
  }, []);

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

          {/* Main Title */}
          <div className="mb-6">
            <div className="title-block inline-block">
              <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white dark:text-white light:text-black tracking-tighter">
                Kittiphat
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
              onClick={() => scrollToSection('#projects')}
              className="cta-button group flex items-center gap-3 px-8 py-4 bg-red-500 text-white font-display font-bold text-sm uppercase tracking-wider hover:bg-red-600 transition-all duration-300"
              data-cursor-hover
            >
              {t.ctaProjects}
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() => scrollToSection('#contact')}
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
