import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from '@iconify/react';
import { 
  Star, Sparkles, Circle
} from 'lucide-react';
import { skillsData, skillsConfig, translations, type ProficiencyLevel } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { trackClick } from '../lib/analytics';

gsap.registerPlugin(ScrollTrigger);



const proficiencyConfig: Record<ProficiencyLevel, { icon: React.ElementType; label: string; labelTh: string; color: string; bgColor: string }> = {
  high: {
    icon: Star,
    label: 'Proficient',
    labelTh: 'ชำนาญ',
    color: '#4CAF50',
    bgColor: 'rgba(76, 175, 80, 0.15)',
  },
  medium: {
    icon: Sparkles,
    label: 'Familiar',
    labelTh: 'พอใช้',
    color: '#FF9800',
    bgColor: 'rgba(255, 152, 0, 0.15)',
  },
  low: {
    icon: Circle,
    label: 'Learning',
    labelTh: 'กำลังหัด',
    color: '#9E9E9E',
    bgColor: 'rgba(158, 158, 158, 0.15)',
  },
};

// Category labels for reference
// const categoryLabels: Record<string, { en: string; th: string }> = {
//   languages: { en: 'Programming Languages', th: 'ภาษาโปรแกรม' },
//   frontend: { en: 'Frontend', th: 'Frontend' },
//   backend: { en: 'Backend', th: 'Backend' },
//   database: { en: 'Databases', th: 'ฐานข้อมูล' },
//   devops: { en: 'DevOps & Testing', th: 'DevOps & Testing' },
//   tools: { en: 'Tools', th: 'เครื่องมือ' },
// };

const Skills = () => {
  const sectionRef = useSectionTracking('Skills');
  const contentRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { language } = useLanguage();
  const t = translations[language].skills;

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const heading = content.querySelector('.section-heading');
    const categoryTabs = content.querySelectorAll('.category-tab');
    const skillCards = content.querySelectorAll('.skill-card');

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
      categoryTabs,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo(
      skillCards,
      { opacity: 0, rotateX: -90, y: 50 },
      { opacity: 1, rotateX: 0, y: 0, duration: 0.6, stagger: 0.03, ease: 'back.out(1.4)' },
      '-=0.2'
    );

    if (tl.scrollTrigger) {
      triggersRef.current.push(tl.scrollTrigger);
    }

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, [activeCategory]);

  const filteredSkills = activeCategory === 'all' 
    ? skillsData 
    : skillsData.filter(skill => skill.category === activeCategory);

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'languages', label: t.categories.languages },
    { key: 'frontend', label: t.categories.frontend },
    { key: 'backend', label: t.categories.backend },
    { key: 'database', label: t.categories.database },
    { key: 'devops', label: t.categories.devops },
    { key: 'tools', label: t.categories.tools },
  ];

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

      <div ref={contentRef} className="relative z-10 w-full px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
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

        {/* Proficiency Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {(Object.keys(proficiencyConfig) as ProficiencyLevel[]).map((level) => {
            const config = proficiencyConfig[level];
            const Icon = config.icon;
            return (
              <div 
                key={level}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body"
                style={{ backgroundColor: config.bgColor, color: config.color }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="thai-text">{language === 'th' ? config.labelTh : config.label}</span>
              </div>
            );
          })}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                trackClick(`Filter: ${cat.label}`, 'Skills');
                setActiveCategory(cat.key);
              }}
              className={`category-tab px-4 py-2 font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat.key
                  ? 'bg-red-500 text-white'
                  : 'bg-white/5 dark:bg-white/5 light:bg-black/5 text-white/70 dark:text-white/70 light:text-black/70 hover:bg-white/10 hover:text-red-500 border border-white/10 dark:border-white/10 light:border-black/10'
              }`}
              data-cursor-hover
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-6xl mx-auto">
          {filteredSkills.map((skill, index) => {
            const profConfig = proficiencyConfig[skill.proficiency];
            const ProficiencyIcon = profConfig.icon;
            
            return (
              <div
                key={skill.name}
                className="skill-card group relative p-4 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 hover:border-red-500/50 transition-all duration-300"
                data-cursor-hover
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Proficiency indicator */}
                <div 
                  className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: profConfig.bgColor }}
                >
                  <ProficiencyIcon className="w-2.5 h-2.5" style={{ color: profConfig.color }} />
                </div>

                <div className="flex flex-col items-center text-center pt-1">
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${skill.color}15` }}
                  >
                    <Icon 
                      icon={skill.icon}
                      className="w-5 h-5 transition-transform duration-300" 
                      style={{ color: skill.color }}
                    />
                  </div>
                  <span className="font-body text-xs text-white dark:text-white light:text-black group-hover:text-red-500 transition-colors duration-300">
                    {skill.name}
                  </span>
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
