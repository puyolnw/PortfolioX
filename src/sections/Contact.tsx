import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Github, Facebook } from 'lucide-react';
import { personalInfo, translations } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { trackClick } from '../lib/analytics';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useSectionTracking('Contact');
  const contentRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const { language } = useLanguage();
  const t = translations[language].contact;

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const heading = content.querySelector('.section-heading');
    const contactInfo = content.querySelectorAll('.contact-info');
    const socials = content.querySelectorAll('.social-link');

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
      contactInfo,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo(
      socials,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.4)' },
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

  const socialLinks = [
    { icon: Github, href: personalInfo.github, label: 'GitHub' },
    { icon: Facebook, href: 'https://www.facebook.com/iamKiTTiphat/', label: 'Facebook' },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black dark:bg-black light:bg-white py-24 overflow-hidden"
    >
      {/* Decorative text */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 font-display font-black text-[20vw] text-white/5 dark:text-white/5 light:text-black/5 whitespace-nowrap pointer-events-none select-none rotate-90 origin-right">
        CONTACT
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

          <p className="font-body text-white/60 dark:text-white/60 light:text-black/60 max-w-xl mx-auto thai-text">
            {t.description}
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center max-w-3xl mx-auto">
          {/* Contact Details */}
          <div className="w-full space-y-6 mb-12">
            <div className="contact-info flex items-center gap-4 p-4 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 hover:border-red-500/50 transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <span className="block font-body text-xs text-white/50 dark:text-white/50 light:text-black/50 uppercase tracking-wider mb-1 thai-text">
                  {t.email}
                </span>
                <a 
                  href={`mailto:${personalInfo.email}`}
                  className="font-display font-bold text-white dark:text-white light:text-black hover:text-red-500 transition-colors duration-300"
                >
                  {personalInfo.email}
                </a>
              </div>
            </div>

            <div className="contact-info flex items-center gap-4 p-4 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 hover:border-red-500/50 transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <span className="block font-body text-xs text-white/50 dark:text-white/50 light:text-black/50 uppercase tracking-wider mb-1 thai-text">
                  {t.location}
                </span>
                <span className="font-display font-bold text-white dark:text-white light:text-black">
                  {personalInfo.location}
                </span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center">
            <span className="block font-body text-xs text-white/50 dark:text-white/50 light:text-black/50 uppercase tracking-wider mb-4 thai-text">
              {language === 'th' ? 'ติดตามฉัน' : 'Follow Me'}
            </span>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick(`Social: ${social.label}`, 'Contact')}
                  className="social-link w-12 h-12 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-center text-white/70 dark:text-white/70 light:text-black/70 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
                  data-cursor-hover
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
    </section>
  );
};

export default Contact;
