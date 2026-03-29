import { useEffect, useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { getNavigationConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { trackClick } from '../lib/analytics';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  const navigationConfig = getNavigationConfig(language);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-custom-expo ${
          isScrolled
            ? 'bg-black/90 dark:bg-black/90 light:bg-white/90 backdrop-blur-md py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
            className="flex items-center gap-2 font-display font-black text-xl tracking-tight text-white dark:text-white light:text-black hover:text-red-500 transition-colors duration-300"
          >
            <img 
              src="/images/logo.png" 
              alt="K" 
              className="w-8 h-8 object-contain"
            />
            <span>{navigationConfig.logo}</span>
            <span className="text-red-500">{navigationConfig.logoAccent}</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigationConfig.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { 
                  e.preventDefault(); 
                  trackClick(`Nav: ${link.label}`, 'Navigation');
                  scrollToSection(link.href); 
                }}
                className="font-body text-sm text-white/70 dark:text-white/70 light:text-black/70 hover:text-red-500 transition-colors duration-300 uppercase tracking-widest thai-text"
              >
                {link.label}
              </a>
            ))}
            
            {/* Language Toggle */}
            <button
              onClick={() => {
                trackClick(`Language Toggle: ${language === 'th' ? 'EN' : 'TH'}`, 'Navigation');
                toggleLanguage();
              }}
              className="flex items-center gap-2 px-3 py-1 border border-white/30 dark:border-white/30 light:border-black/30 rounded-full text-white/70 dark:text-white/70 light:text-black/70 hover:text-red-500 hover:border-red-500 transition-all duration-300"
              data-cursor-hover
            >
              <Globe className="w-4 h-4" />
              <span className="font-body text-xs uppercase">{language === 'th' ? 'TH' : 'EN'}</span>
            </button>
            

            {navigationConfig.ctaText && (
              <button 
                onClick={() => {
                  trackClick('CTA: Navigation', 'Navigation');
                  scrollToSection('#contact');
                }}
                className="px-6 py-2 bg-red-500 text-white font-display font-bold text-sm uppercase tracking-wider hover:bg-red-600 transition-colors duration-300"
              >
                {navigationConfig.ctaText}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white dark:text-white light:text-black p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-black dark:bg-black light:bg-white transition-all duration-500 ease-custom-expo md:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navigationConfig.navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
              className="font-display font-bold text-3xl text-white dark:text-white light:text-black hover:text-red-500 transition-colors duration-300 uppercase"
              style={{
                transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : '0ms',
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {link.label}
            </a>
          ))}
          
          {/* Mobile Controls */}
          <div className="flex items-center gap-6 mt-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 border border-white/30 dark:border-white/30 light:border-black/30 rounded-full text-white dark:text-white light:text-black"
            >
              <Globe className="w-5 h-5" />
              <span className="font-body text-sm uppercase">{language === 'th' ? 'TH' : 'EN'}</span>
            </button>

          </div>
          
          {navigationConfig.ctaText && (
            <button
              onClick={() => scrollToSection('#contact')}
              className="mt-8 px-8 py-3 bg-red-500 text-white font-display font-bold text-lg uppercase tracking-wider"
              style={{
                transitionDelay: isMobileMenuOpen ? `${navigationConfig.navLinks.length * 100}ms` : '0ms',
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
            >
              {navigationConfig.ctaText}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
