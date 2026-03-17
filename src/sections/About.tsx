import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap, Award, Globe, Heart, MapPin, Mail, Phone } from 'lucide-react';
import { aboutConfig, personalInfo, translations } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const { language } = useLanguage();
  const t = translations[language].about;

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const heading = content.querySelector('.section-heading');
    const description = content.querySelector('.description');
    const infoCards = content.querySelectorAll('.info-card');
    const image = content.querySelector('.profile-image');

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
      description,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo(
      infoCards,
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)' },
      '-=0.3'
    );

    tl.fromTo(
      image,
      { opacity: 0, x: 50, rotateY: -30 },
      { opacity: 1, x: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' },
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

  const features = [
    { icon: Briefcase, value: t.features.projects.value, label: t.features.projects.label },
    { icon: GraduationCap, value: t.features.gpa.value, label: t.features.gpa.label },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black dark:bg-black light:bg-white py-24 overflow-hidden"
    >
      {/* Decorative text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 font-display font-black text-[20vw] text-white/5 dark:text-white/5 light:text-black/5 whitespace-nowrap pointer-events-none select-none">
        {aboutConfig.decorativeText}
      </div>

      <div ref={contentRef} className="relative z-10 w-full px-6 lg:px-12">
        {/* Section Label */}
        <div className="section-heading flex items-center gap-4 mb-8">
          <div className="w-12 h-[2px] bg-red-500" />
          <span className="font-body text-sm text-red-500 uppercase tracking-[0.3em]">
            {t.sectionLabel}
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-white dark:text-white light:text-black mb-2">
              {t.headingMain}
              <span className="text-red-500"> {t.headingAccent}</span>
            </h2>
            
            <h3 className="font-display font-bold text-xl text-red-500 mb-2">
              {t.name}
            </h3>
            
            <p className="text-white/50 font-body mb-6 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t.location}
            </p>

            <p className="description font-body text-white/70 dark:text-white/70 light:text-black/70 text-lg leading-relaxed mb-8 thai-text">
              {t.summary}
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="info-card group p-5 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 hover:border-red-500/50 transition-all duration-300"
                  data-cursor-hover
                >
                  <feature.icon className="w-6 h-6 text-red-500 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="font-display font-black text-2xl text-white dark:text-white light:text-black mb-1">
                    {feature.value}
                  </div>
                  <div className="font-body text-xs text-white/50 dark:text-white/50 light:text-black/50 uppercase tracking-wider thai-text">
                    {feature.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="info-card p-5 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="w-5 h-5 text-red-500" />
                <span className="font-display font-bold text-white dark:text-white light:text-black">
                  {t.education.degree}
                </span>
              </div>
              <p className="font-body text-white/60 text-sm thai-text">
                {t.education.university}
              </p>
              <p className="font-body text-white/40 text-xs mt-1">
                {t.education.year} • {t.education.gpa}
              </p>
            </div>

            {/* Achievement */}
            <div className="info-card p-5 bg-red-500/10 border border-red-500/30 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-red-500" />
                <span className="font-display font-bold text-red-500">
                  {t.achievements.title}
                </span>
              </div>
              <p className="font-body text-white/70 text-sm thai-text">
                {t.achievements.nsc}
              </p>
            </div>

            {/* Languages */}
            <div className="info-card p-5 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-red-500" />
                <span className="font-display font-bold text-white dark:text-white light:text-black">
                  {t.languages.title}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-body text-white/60 text-sm thai-text">{t.languages.thai}</p>
                <p className="font-body text-white/60 text-sm thai-text">{t.languages.english}</p>
              </div>
            </div>

            {/* Interests */}
            <div className="info-card p-5 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-display font-bold text-white dark:text-white light:text-black">
                  {t.interests.title}
                </span>
              </div>
              <p className="font-body text-white/60 text-sm thai-text">{t.interests.items}</p>
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div className="profile-image relative w-full flex items-center justify-center">
            <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl aspect-square mx-auto">
              {/* Background shapes */}
              <div className="absolute inset-0 bg-red-500/20 transform rotate-6" />
              <div className="absolute inset-0 bg-red-500/10 transform -rotate-3" />
              
              {/* Logo watermark */}
              <div className="absolute -top-8 -right-8 w-24 h-24 opacity-30">
                <img 
                  src={aboutConfig.logoImage} 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Image container */}
              <div className="relative overflow-hidden border-2 border-red-500/50">
                <img 
                  src={aboutConfig.profileImage} 
                  alt="Kittiphat Thunthong"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-red-500 text-white font-display font-bold text-xs uppercase">
                {t.position}
              </div>
              
              {/* Contact info badges */}
              <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-2">
                <a 
                  href={`mailto:${personalInfo.email}`}
                  className="px-3 py-2 bg-white text-black font-body text-xs flex items-center gap-1 hover:bg-red-500 hover:text-white transition-colors duration-300"
                >
                  <Mail className="w-3 h-3" />
                  Email
                </a>
                <a 
                  href={`tel:${personalInfo.phone}`}
                  className="px-3 py-2 bg-white text-black font-body text-xs flex items-center gap-1 hover:bg-red-500 hover:text-white transition-colors duration-300"
                >
                  <Phone className="w-3 h-3" />
                  Call
                </a>
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

export default About;
