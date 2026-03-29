import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Building2, Calendar, CheckCircle2 } from 'lucide-react';
import { experienceData, translations } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { useSectionTracking } from '../hooks/useSectionTracking';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useSectionTracking('Experience');
  const contentRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const { language } = useLanguage();
  const t = translations[language].experience;

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const heading = content.querySelector('.section-heading');
    const experienceCard = content.querySelector('.experience-card');
    const responsibilities = content.querySelectorAll('.responsibility-item');

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

    tl.fromTo(
      experienceCard,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo(
      responsibilities,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
      '-=0.3'
    );

    if (tl.scrollTrigger) {
      triggersRef.current.push(tl.scrollTrigger);
    }

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, []);

  const experience = experienceData[0];

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black dark:bg-black light:bg-white py-24 overflow-hidden"
    >
      {/* Decorative text */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 font-display font-black text-[20vw] text-white/5 dark:text-white/5 light:text-black/5 whitespace-nowrap pointer-events-none select-none rotate-90 origin-right">
        WORK
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

        {/* Experience Card */}
        <div className="experience-card max-w-4xl mx-auto">
          <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 p-8 md:p-12 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            {/* Header */}
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl md:text-3xl text-white dark:text-white light:text-black">
                    {language === 'th' ? experience.titleTh : experience.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4 text-red-500" />
                    <span className="font-body text-red-500 font-medium">
                      {experience.company}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
                <Calendar className="w-4 h-4 text-red-500" />
                <span className="font-body text-sm text-red-500">
                  {language === 'th' ? experience.periodTh : experience.period}
                </span>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="relative">
              <h4 className="font-display font-bold text-lg text-white/80 dark:text-white/80 light:text-black/80 mb-6 uppercase tracking-wider">
                {language === 'th' ? 'ความรับผิดชอบ' : 'Responsibilities'}
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                {(language === 'th' ? experience.responsibilitiesTh : experience.responsibilities).map((item, index) => (
                  <div
                    key={index}
                    className="responsibility-item flex items-start gap-3 p-4 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/5 dark:border-white/5 light:border-black/5 hover:border-red-500/30 transition-colors duration-300"
                  >
                    <CheckCircle2 className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="font-body text-white/70 dark:text-white/70 light:text-black/70 text-sm leading-relaxed thai-text">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech stack used */}
            <div className="relative mt-8 pt-8 border-t border-white/10 dark:border-white/10 light:border-black/10">
              <h4 className="font-display font-bold text-sm text-white/50 dark:text-white/50 light:text-black/50 mb-4 uppercase tracking-wider">
                {language === 'th' ? 'เทคโนโลยีที่ใช้' : 'Technologies Used'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Angular', 'Golang', 'Docker', 'CI/CD', 'Grafana', 'Playwright'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-red-500/10 text-red-500 text-xs font-body border border-red-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
    </section>
  );
};

export default Experience;
