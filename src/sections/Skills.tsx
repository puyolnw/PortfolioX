import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from '@iconify/react';
import { 
  Flame, Zap, BookOpen
} from 'lucide-react';
import { skillsData, skillsConfig, translations, type ProficiencyLevel } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { useSectionTracking } from '../hooks/useSectionTracking';

gsap.registerPlugin(ScrollTrigger);

type TierKey = 'S' | 'A' | 'B';
type TierConfig = {
  tier: TierKey;
  sourceProficiency: ProficiencyLevel;
  icon: React.ElementType;
  title: string;
  titleTh: string;
  usage: string;
  usageTh: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
};

const tierConfig: TierConfig[] = [
  {
    tier: 'S',
    sourceProficiency: 'high',
    icon: Flame,
    title: 'Core Stack',
    titleTh: 'ตัวหลักที่ใช้ประจำ',
    usage: 'Daily / almost every project',
    usageTh: 'ใช้ทุกวัน / แทบทุกโปรเจกต์',
    colorClass: 'text-red-400',
    bgClass: 'bg-red-500/15',
    borderClass: 'border-red-500/40',
  },
  {
    tier: 'A',
    sourceProficiency: 'medium',
    icon: Zap,
    title: 'Strong Working',
    titleTh: 'ใช้งานคล่อง',
    usage: 'Weekly / frequent use',
    usageTh: 'ใช้บ่อยทุกสัปดาห์',
    colorClass: 'text-orange-400',
    bgClass: 'bg-orange-500/15',
    borderClass: 'border-orange-500/40',
  },
  {
    tier: 'B',
    sourceProficiency: 'low',
    icon: BookOpen,
    title: 'Learning Zone',
    titleTh: 'กำลังพัฒนา',
    usage: 'Occasional / currently improving',
    usageTh: 'ใช้เป็นครั้งคราว / กำลังอัปสกิล',
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-500/15',
    borderClass: 'border-blue-500/40',
  },
];

const Skills = () => {
  const sectionRef = useSectionTracking('Skills');
  const contentRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const { language } = useLanguage();
  const t = translations[language].skills;

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const heading = content.querySelector('.section-heading');
    const tierRows = content.querySelectorAll('.tier-row');
    const tierChips = content.querySelectorAll('.tier-chip');

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
      tierRows,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.12, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo(
      tierChips,
      { opacity: 0, scale: 0.92, y: 18 },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.015, ease: 'power2.out' },
      '-=0.2'
    );

    if (tl.scrollTrigger) {
      triggersRef.current.push(tl.scrollTrigger);
    }

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, []);

  const tierRows = tierConfig.map((tier) => {
    const items = skillsData.filter((skill) => skill.proficiency === tier.sourceProficiency);

    return { ...tier, items };
  });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black dark:bg-black light:bg-white py-24 overflow-hidden"
    >
      {/* Decorative text */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 font-display font-black text-[20vw] text-white/5 dark:text-white/5 light:text-black/5 whitespace-nowrap pointer-events-none select-none rotate-90 origin-right">
        {skillsConfig.decorativeText}
      </div>

      <div ref={contentRef} className="relative z-10 w-full px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-10">
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

        {/* Tier List Table */}
        <div className="w-full space-y-3">
          {tierRows.map((row) => {
            const TierIcon = row.icon;
            const chipSizeClass =
              row.tier === 'S'
                ? 'gap-3 px-4 py-3 rounded-xl'
                : row.tier === 'A'
                  ? 'gap-2.5 px-3.5 py-2.5 rounded-lg'
                  : 'gap-2 px-3 py-2 rounded-lg';
            const iconWrapClass =
              row.tier === 'S'
                ? 'w-9 h-9 rounded-lg'
                : row.tier === 'A'
                  ? 'w-8 h-8 rounded-md'
                  : 'w-7 h-7 rounded-md';
            const iconClass =
              row.tier === 'S' ? 'w-5 h-5' : row.tier === 'A' ? 'w-4.5 h-4.5' : 'w-4 h-4';
            const textClass =
              row.tier === 'S'
                ? 'text-sm md:text-base font-semibold'
                : row.tier === 'A'
                  ? 'text-xs md:text-sm'
                  : 'text-xs';
            return (
              <div
                key={row.tier}
                className={`tier-row grid md:grid-cols-[180px_1fr] rounded-xl border overflow-hidden ${row.borderClass}`}
              >
                <div className={`p-4 md:p-4 border-b md:border-b-0 md:border-r border-white/10 ${row.bgClass}`}>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${row.borderClass} ${row.bgClass}`}>
                      <TierIcon className={`w-4.5 h-4.5 ${row.colorClass}`} />
                    </div>
                    <span className={`font-display font-black text-2xl ${row.colorClass}`}>
                      {row.tier}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-white dark:text-white light:text-black text-sm md:text-base">
                    {language === 'th' ? row.titleTh : row.title}
                  </h3>
                  <p className="font-body text-[11px] md:text-xs text-white/60 dark:text-white/60 light:text-black/60 mt-0.5 thai-text">
                    {language === 'th' ? row.usageTh : row.usage}
                  </p>
                  <p className="font-body text-[10px] text-white/40 dark:text-white/40 light:text-black/40 mt-2">
                    {row.items.length} {language === 'th' ? 'เทคโนโลยี' : 'technologies'}
                  </p>
                </div>

                <div className="p-3 md:p-3.5 bg-white/5 dark:bg-white/5 light:bg-black/5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
                    {row.items.map((skill) => (
                      <div
                        key={skill.name}
                        className={`tier-chip group w-full inline-flex items-center border border-white/10 dark:border-white/10 light:border-black/10 bg-black/30 dark:bg-black/30 light:bg-white/60 hover:border-red-500/40 transition-colors duration-200 ${chipSizeClass}`}
                        data-cursor-hover
                        title={language === 'th' ? skill.descriptionTh : skill.description}
                      >
                        <div
                          className={`${iconWrapClass} flex items-center justify-center`}
                          style={{ backgroundColor: `${skill.color}1f` }}
                        >
                          <Icon icon={skill.icon} className={iconClass} style={{ color: skill.color }} />
                        </div>
                        <span className={`font-body text-white dark:text-white light:text-black ${textClass}`}>
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom text */}
        <p className="text-center font-body text-xs text-white/40 dark:text-white/40 light:text-black/40 mt-12 thai-text">
          {t.bottomText}
        </p>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
    </section>
  );
};

export default Skills;
