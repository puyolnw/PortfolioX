import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, ArrowUp, Github, Facebook } from 'lucide-react';
import { getFooterConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const { language } = useLanguage();
  const config = getFooterConfig(language);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const content = footer.querySelector('.footer-content');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      content,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    if (tl.scrollTrigger) {
      triggersRef.current.push(tl.scrollTrigger);
    }

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialIcons: Record<string, React.ElementType> = {
    github: Github,
    facebook: Facebook,
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-black dark:bg-black light:bg-white py-12 overflow-hidden"
    >
      {/* Decorative text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-[15vw] text-white/5 dark:text-white/5 light:text-black/5 whitespace-nowrap pointer-events-none select-none">
        {config.decorativeText}
      </div>

      <div className="footer-content relative z-10 w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            {/* Logo & Description */}
            <div className="text-center md:text-left">
              <a
                href="#home"
                onClick={(e) => { e.preventDefault(); scrollToTop(); }}
                className="font-display font-black text-2xl text-white dark:text-white light:text-black hover:text-red-500 transition-colors duration-300"
              >
                {config.logo}<span className="text-red-500">{config.logoAccent}</span>
              </a>
              <p className="font-body text-sm text-white/50 dark:text-white/50 light:text-black/50 mt-2 max-w-xs thai-text">
                {config.brandDescription}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {config.socialLinks.map((link) => {
                const Icon = socialIcons[link.platform] || Github;
                return (
                  <a
                    key={link.platform}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-center text-white/50 dark:text-white/50 light:text-black/50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
                    data-cursor-hover
                    aria-label={link.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 border border-white/10 dark:border-white/10 light:border-black/10 text-white/50 dark:text-white/50 light:text-black/50 hover:border-red-500 hover:text-red-500 transition-all duration-300"
              data-cursor-hover
            >
              <ArrowUp className="w-4 h-4" />
              <span className="font-body text-xs uppercase tracking-wider thai-text">
                {language === 'th' ? 'กลับขึ้นบน' : 'Back to Top'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 dark:via-white/20 light:via-black/20 to-transparent mb-8" />

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-center">
            <span className="font-body text-sm text-white/40 dark:text-white/40 light:text-black/40 flex items-center gap-1 thai-text">
              {language === 'th' ? 'สร้างด้วย' : 'Crafted with'}
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              {language === 'th' ? 'โดย' : 'by'}
            </span>
            <span className="font-display font-bold text-sm text-white dark:text-white light:text-black">
              Kittiphat Thunthong
            </span>
            <span className="font-body text-sm text-white/40 dark:text-white/40 light:text-black/40">
              © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
