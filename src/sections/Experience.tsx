import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Building2, Calendar, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { experienceData, translations } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { useSectionTracking } from '../hooks/useSectionTracking';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useSectionTracking('Experience');
  const contentRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const initialIndex = experienceData.findIndex((item) => item.id === 'extosoft');
  const watchDrag = useCallback((_emblaApi: unknown, event: MouseEvent | TouchEvent) => {
    const target = event.target as HTMLElement | null;
    return Boolean(target?.closest('[data-active-slide="true"]'));
  }, []);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    dragFree: false,
    containScroll: false,
    skipSnaps: false,
    startIndex: initialIndex >= 0 ? initialIndex : 0,
    duration: 40,
    watchDrag,
  });
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  const { language } = useLanguage();
  const t = translations[language].experience;
  const totalSlides = experienceData.length;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const heading = content.querySelector('.section-heading');
    const gallery = content.querySelector('.experience-gallery');

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

    if (gallery) {
      tl.fromTo(
        gallery,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );
    }

    if (tl.scrollTrigger) {
      triggersRef.current.push(tl.scrollTrigger);
    }

    return () => {
      triggersRef.current.forEach((trigger) => trigger.kill());
      triggersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;

    const tweenSlides = () => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const snaps = emblaApi.scrollSnapList();

      snaps.forEach((snap, index) => {
        let diffToTarget = snap - scrollProgress;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            if (loopItem.index !== index) return;
            const target = loopItem.target();
            if (target === 0) return;
            const sign = Math.sign(target);
            if (sign < 0) diffToTarget = snap - (1 + scrollProgress);
            if (sign > 0) diffToTarget = snap + (1 - scrollProgress);
          });
        }

        const tweenValue = 1 - Math.min(Math.abs(diffToTarget * 1.8), 1);
        const scale = 0.9 + tweenValue * 0.1;
        const opacity = 0.35 + tweenValue * 0.65;
        const slideNode = slideRefs.current[index];
        if (slideNode) {
          slideNode.style.transform = `scale(${scale})`;
          slideNode.style.opacity = `${opacity}`;
        }
      });
    };

    emblaApi.on('scroll', tweenSlides);
    emblaApi.on('select', tweenSlides);
    emblaApi.on('reInit', tweenSlides);
    tweenSlides();

    return () => {
      emblaApi.off('scroll', tweenSlides);
      emblaApi.off('select', tweenSlides);
      emblaApi.off('reInit', tweenSlides);
    };
  }, [emblaApi]);

  const goPrev = () => emblaApi?.scrollPrev();
  const goNext = () => emblaApi?.scrollNext();

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black dark:bg-black light:bg-white py-24 overflow-hidden"
    >
      <div className="absolute top-1/2 right-0 -translate-y-1/2 font-display font-black text-[20vw] text-white/5 dark:text-white/5 light:text-black/5 whitespace-nowrap pointer-events-none select-none rotate-90 origin-right">
        WORK
      </div>

      <div ref={contentRef} className="relative z-10 w-full px-3 sm:px-5 lg:px-6">
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

        <div className="experience-gallery w-full">
          <div className="flex items-center justify-center mb-4">
            <p className="font-body text-xs md:text-sm text-white/50 dark:text-white/50 light:text-black/50">
              {language === 'th' ? 'แกลเลอรีประสบการณ์' : 'Experience Gallery'}: {activeIndex + 1} / {totalSlides}
            </p>
          </div>

          <div className="relative">
            <button
              onClick={goPrev}
              aria-label={language === 'th' ? 'ก่อนหน้า' : 'Previous'}
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-white/20 dark:border-white/20 light:border-black/20 bg-black/50 dark:bg-black/50 light:bg-white/80 items-center justify-center text-white/85 dark:text-white/85 light:text-black/85 hover:border-red-500/40 hover:text-red-500 transition-colors"
              data-cursor-hover
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              aria-label={language === 'th' ? 'ถัดไป' : 'Next'}
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-white/20 dark:border-white/20 light:border-black/20 bg-black/50 dark:bg-black/50 light:bg-white/80 items-center justify-center text-white/85 dark:text-white/85 light:text-black/85 hover:border-red-500/40 hover:text-red-500 transition-colors"
              data-cursor-hover
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={goPrev}
              aria-label={language === 'th' ? 'เลื่อนไปซ้าย' : 'Slide left'}
              className="hidden md:block absolute left-0 top-0 bottom-0 w-[8%] z-20"
              data-cursor-hover
            />
            <button
              onClick={goNext}
              aria-label={language === 'th' ? 'เลื่อนไปขวา' : 'Slide right'}
              className="hidden md:block absolute right-0 top-0 bottom-0 w-[8%] z-20"
              data-cursor-hover
            />

            <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
              <div className="flex">
                {experienceData.map((experience, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={experience.id}
                      className="min-w-0 flex-[0_0_92%] md:flex-[0_0_64%] lg:flex-[0_0_58%] px-2"
                    >
                      <div
                        ref={(node) => {
                          slideRefs.current[index] = node;
                        }}
                        data-active-slide={isActive ? 'true' : 'false'}
                        className={`experience-card bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 p-6 md:p-7 rounded-xl relative overflow-hidden h-[560px] transition-[transform,opacity] duration-500 ${
                          isActive ? 'z-10 pointer-events-auto' : 'pointer-events-none'
                        }`}
                      >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative h-full flex flex-col">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
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

                          <div className="flex-1 min-h-0">
                            <h4 className="font-display font-bold text-lg text-white/80 dark:text-white/80 light:text-black/80 mb-3 uppercase tracking-wider">
                              {language === 'th' ? 'ความรับผิดชอบ' : 'Responsibilities'}
                            </h4>
                            <div className="grid md:grid-cols-2 gap-2.5 h-[220px] overflow-y-auto pr-1">
                              {(language === 'th' ? experience.responsibilitiesTh : experience.responsibilities).slice(0, 4).map((item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="responsibility-item flex items-start gap-2.5 p-3 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/5 dark:border-white/5 light:border-black/5 rounded-lg"
                                >
                                  <CheckCircle2 className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span className="font-body text-white/70 dark:text-white/70 light:text-black/70 text-xs md:text-sm leading-relaxed line-clamp-2 thai-text">
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-5 pt-5 border-t border-white/10 dark:border-white/10 light:border-black/10">
                            <h4 className="font-display font-bold text-sm text-white/50 dark:text-white/50 light:text-black/50 mb-3 uppercase tracking-wider">
                              {language === 'th' ? 'เทคโนโลยีที่ใช้' : 'Technologies Used'}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {experience.techStack.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-3 py-1.5 bg-red-500/10 text-red-500 text-xs font-body border border-red-500/20 rounded-md"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5">
            {experienceData.map((item, index) => (
              <button
                key={item.id}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === activeIndex ? 'w-6 bg-red-500' : 'w-2 bg-white/25 dark:bg-white/25 light:bg-black/25'
                }`}
                aria-label={`${language === 'th' ? 'ไปยังรายการ' : 'Go to item'} ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
    </section>
  );
};

export default Experience;
