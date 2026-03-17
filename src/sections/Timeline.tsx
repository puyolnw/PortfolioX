import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Code, Rocket } from 'lucide-react';
import { timelineConfig, translations } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

function Atom(props: { className?: string }) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  );
}

const Timeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const { language } = useLanguage();
  const t = translations[language].timeline;

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const line = lineRef.current;
    if (!section || !content || !line) return;

    const heading = content.querySelector('.section-heading');
    const milestones = content.querySelectorAll('.milestone');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      heading,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    // Animate timeline line
    tl.fromTo(
      line,
      { scaleY: 0 },
      { scaleY: 1, duration: 1, ease: 'power2.out', transformOrigin: 'top' },
      '-=0.4'
    );

    tl.fromTo(
      milestones,
      { opacity: 0, x: (i) => (i % 2 === 0 ? -50 : 50) },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out' },
      '-=0.5'
    );

    if (tl.scrollTrigger) {
      triggersRef.current.push(tl.scrollTrigger);
    }

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, []);

  const icons = [GraduationCap, Code, Rocket, Atom];

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black dark:bg-black light:bg-white py-24 overflow-hidden"
    >
      {/* Decorative text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-[25vw] text-white/5 dark:text-white/5 light:text-black/5 whitespace-nowrap pointer-events-none select-none">
        {timelineConfig.decorativeText}
      </div>

      <div ref={contentRef} className="relative z-10 w-full px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="section-heading flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-red-500" />
            <span className="font-body text-sm text-red-500 uppercase tracking-[0.3em]">
              {t.sectionLabel}
            </span>
            <div className="w-12 h-[2px] bg-red-500" />
          </div>

          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-white dark:text-white light:text-black mb-4">
            {t.headingMain}
            <span className="text-red-500"> {t.headingAccent}</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center Line */}
          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-red-500 via-red-500/50 to-transparent transform -translate-x-1/2 hidden md:block"
          />

          {/* Mobile Line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-red-500 via-red-500/50 to-transparent md:hidden" />

          {/* Milestones */}
          <div className="space-y-12 md:space-y-0">
            {t.milestones.map((milestone, index) => {
              const Icon = icons[index % icons.length];
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`milestone relative md:grid md:grid-cols-2 md:gap-8 ${
                    index > 0 ? 'md:mt-12' : ''
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`pl-12 md:pl-0 ${
                      isLeft ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-3 mb-3 ${
                        isLeft ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-red-500" />
                      </div>
                      <span className="font-display font-bold text-red-500 text-lg">
                        {milestone.year}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl md:text-2xl text-white dark:text-white light:text-black mb-2">
                      {milestone.title}
                    </h3>

                    <p className="font-body text-white/60 dark:text-white/60 light:text-black/60 thai-text">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Center Dot */}
                  <div
                    className={`absolute left-4 md:left-1/2 top-0 w-4 h-4 rounded-full bg-red-500 border-4 border-black dark:border-black light:border-white transform -translate-x-1/2 hidden md:block`}
                  />
                  <div
                    className={`absolute left-4 top-0 w-4 h-4 rounded-full bg-red-500 border-4 border-black dark:border-black light:border-white transform -translate-x-1/2 md:hidden`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
    </section>
  );
};

export default Timeline;
