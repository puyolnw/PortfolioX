import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, X, Play, Image as ImageIcon, Maximize2, Award } from 'lucide-react';
import { projectsData, projectsConfig, translations } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { trackClick } from '../lib/analytics';

gsap.registerPlugin(ScrollTrigger);

// Demo Loading Screen Component
const DemoLoadingScreen = ({ isVisible, language }: { isVisible: boolean, language: 'th' | 'en' }) => {
  if (!isVisible) return null;
  return (
    <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300">
      <div className="flex flex-col items-center gap-6 max-w-lg text-center p-8 slide-up-anim">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h3 className="text-3xl font-display font-bold text-white mb-2">
          {language === 'th' ? 'กำลังเตรียม Demo...' : 'Starting Demo...'}
        </h3>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mt-4 shadow-xl">
          <p className="text-red-400 font-body text-xl leading-relaxed thai-text font-bold">
            {language === 'th' 
              ? '⚠️ หมายเหตุ: นี่เป็นเพียงระบบ Demo แบบเบื้องต้น (ประมาณ 20% ของโปรเจกต์) ยังไม่ใช่ระบบการทำงานจริงทั้งหมด' 
              : '⚠️ Note: This is an early demo representing about 20% of the project. It is not the full production system.'}
          </p>
        </div>
      </div>
      <style>{`
        .slide-up-anim {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Unified Project Modal Component
interface ProjectModalProps {
  project: typeof projectsData[0] | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'th' | 'en';
  initialTab?: 'details' | 'preview' | 'gallery';
}

const ProjectModal = ({ 
  project, 
  isOpen, 
  onClose, 
  language,
  initialTab = 'details'
}: ProjectModalProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'preview' | 'gallery'>('details');
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePreviewClick = () => {
    if (activeTab === 'preview') return;
    setIsDemoLoading(true);
    setTimeout(() => {
      setIsDemoLoading(false);
      setActiveTab('preview');
    }, 5000);
  };

  // Sync activeTab with initialTab when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialTab === 'preview') {
        setActiveTab('details'); // Set background tab to details while loading
        setIsDemoLoading(true);
        const timer = setTimeout(() => {
          setIsDemoLoading(false);
          setActiveTab('preview');
        }, 5000);
        setIsLoading(true);
        return () => clearTimeout(timer);
      } else {
        setActiveTab(initialTab);
        setIsLoading(true);
        setIsDemoLoading(false);
      }
    } else {
      setIsDemoLoading(false);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const t = translations[language].projects;

  return createPortal(
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/95">
      {/* Close button ... */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors duration-300 z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-black border border-white/20 rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-4">
            <h3 className="font-display font-bold text-xl text-white">
              {language === 'th' ? project.nameTh : project.name}
            </h3>
            {project.achievement && (
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">
                <Award className="w-3 h-3" />
                <span>{language === 'th' ? project.achievementTh : project.achievement}</span>
              </div>
            )}
          </div>
          
          {/* Tab Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all duration-300 ${
                activeTab === 'details'
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              {language === 'th' ? 'รายละเอียด' : 'Details'}
            </button>
            {project.demoUrl && (
              <button
                onClick={handlePreviewClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all duration-300 ${
                  activeTab === 'preview'
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Play className="w-4 h-4" />
                {t.preview}
              </button>
            )}
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all duration-300 ${
                activeTab === 'gallery'
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Gallery
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'details' && (
            <div className="w-full h-full overflow-y-auto p-8 custom-scrollbar bg-black dark:bg-black light:bg-white">
              <div className="max-w-4xl mx-auto">
                {/* Visual Header — show first project image */}
                <div className="relative aspect-video bg-gradient-to-br from-red-500/20 to-red-900/20 rounded-xl overflow-hidden mb-8">
                  {project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={language === 'th' ? project.nameTh : project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display font-black text-8xl text-white/10">
                        {project.id.split('-')[1]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-[1fr_300px] gap-8">
                  <div>
                    <h4 className="font-display font-bold text-2xl text-white dark:text-white light:text-black mb-4">
                      {language === 'th' ? 'เกี่ยวกับโปรเจกต์' : 'About Project'}
                    </h4>
                    <p className="font-body text-white/70 dark:text-white/70 light:text-black/70 mb-8 text-lg leading-relaxed thai-text">
                      {language === 'th' ? project.fullDescriptionTh : project.fullDescription}
                    </p>

                    <h4 className="font-display font-bold text-xl text-white dark:text-white light:text-black mb-4 uppercase tracking-wider">
                      {t.features}
                    </h4>
                    <ul className="space-y-4 mb-8">
                      {(language === 'th' ? project.featuresTh : project.features).map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/60 dark:text-white/60 light:text-black/60 thai-text">
                          <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                          <span className="text-lg">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-8">
                    {/* Tech Stack Box */}
                    <div className="p-6 bg-white/5 dark:bg-white/5 light:bg-black/5 rounded-xl border border-white/10">
                      <h4 className="font-display font-bold text-white dark:text-white light:text-black mb-4 flex items-center gap-2">
                        <Play className="w-4 h-4 text-red-500" />
                        {t.techStack}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1.5 bg-red-500/20 text-red-500 text-sm font-body border border-red-500/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-col gap-3">
                      {project.demoUrl && (
                        <button
                          onClick={handlePreviewClick}
                          className="flex items-center justify-center gap-3 px-6 py-4 bg-red-500 text-white font-display font-bold hover:bg-red-600 transition-all duration-300 rounded-lg group"
                        >
                          <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          {t.preview}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="w-full h-full relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-[5]">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-white/60 font-body text-sm">Loading preview...</span>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={project.demoUrl}
                className="w-full h-full border-0"
                onLoad={() => setIsLoading(false)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />

              {/* PREVIEW Watermark — persistent diagonal overlay */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center" style={{ zIndex: 10 }}>
                <div className="flex flex-col items-center gap-12" style={{ transform: 'rotate(-30deg)' }}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <span
                      key={i}
                      className="font-display font-black text-white/[0.08] whitespace-nowrap"
                      style={{ fontSize: 'clamp(80px, 12vw, 160px)', letterSpacing: '0.2em' }}
                    >
                      PREVIEW
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom bar */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between" style={{ zIndex: 20 }}>
                <div className="px-4 py-2 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10">
                  <span className="text-white/60 text-xs font-body">
                    {language === 'th' ? 'กด F11 เพื่อดูแบบเต็มจอ' : 'Press F11 for fullscreen'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('details')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-body transition-colors duration-300"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  {language === 'th' ? 'กลับไปดูรายละเอียด' : 'Back to Details'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="w-full h-full overflow-y-auto p-6 bg-black dark:bg-black light:bg-white">
              {/* Gallery Grid */}
              <div className="grid grid-cols-2 gap-4">
                {project.images.map((image, index) => (
                  <div
                    key={index}
                    className="group relative aspect-video rounded-lg overflow-hidden border border-white/10 hover:border-red-500/50 transition-all duration-300"
                  >
                    <img
                      src={image}
                      alt={`${project.name} screenshot ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.querySelector('.fallback')?.classList.remove('hidden');
                      }}
                    />
                    <div className="fallback hidden absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-900/10 flex items-center justify-center">
                      <span className="font-display font-black text-4xl text-white/10">{index + 1}</span>
                    </div>
                    {/* Hover overlay with zoom icon */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-white text-xs font-body bg-black/50 px-2 py-1 rounded">
                          {image.split('/').pop()?.replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/^data-/, '').replace(/-/g, ' ').toUpperCase()}
                        </span>
                        <div className="p-2 bg-red-500 text-white rounded-full">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DemoLoadingScreen isVisible={isDemoLoading} language={language} />
      </div>
    </div>,
    document.body
  );
};

const Projects = () => {
  const { language } = useLanguage();
  const [activeProject, setActiveProject] = useState<typeof projectsData[0] | null>(null);
  const [initialTab, setInitialTab] = useState<'details' | 'preview' | 'gallery'>('details');
  const sectionRef = useSectionTracking('Projects');
  const contentRef = useRef<HTMLDivElement>(null);
  const t = translations[language].projects;
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const handleGlobalDemoClick = (project: typeof projectsData[0]) => {
    trackClick(`View Demo: ${project.name}`, 'Projects Card');
    setActiveProject(project);
    setInitialTab('preview');
  };

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const heading = content.querySelector('.section-heading');
    const projectCards = content.querySelectorAll('.project-card');

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
      projectCards,
      { opacity: 0, y: 50, rotateY: -15 },
      { opacity: 1, y: 0, rotateY: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
      '-=0.4'
    );

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, [activeProject]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black dark:bg-black light:bg-white py-24 overflow-hidden"
    >
      {/* Decorative text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 font-display font-black text-[20vw] text-white/5 dark:text-white/5 light:text-black/5 whitespace-nowrap pointer-events-none select-none">
        {projectsConfig.decorativeText}
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

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {projectsData.map((project, index) => (
            <div
              key={project.id}
              className="project-card group relative bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 overflow-hidden hover:border-red-500/50 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-video bg-gradient-to-br from-red-500/20 to-red-900/20 overflow-hidden">
                {project.images.length > 0 ? (
                  <img
                    src={project.images[0]}
                    alt={language === 'th' ? project.nameTh : project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display font-black text-5xl text-white/10">
                      {index + 1}
                    </span>
                  </div>
                )}
                
                {/* Achievement badge */}
                {project.achievement && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-500/90 text-black text-xs font-display font-bold rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {language === 'th' ? project.achievementTh : project.achievement}
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
                  <div className="flex gap-2 mb-4">
                    {project.demoUrl && (
                      <button
                        onClick={() => handleGlobalDemoClick(project)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-display font-bold rounded-lg hover:bg-red-600 transition-colors duration-300"
                      >
                        <Play className="w-4 h-4" />
                        {t.demo}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        trackClick(`View Details: ${project.name}`, 'Projects Card');
                        setActiveProject(project);
                        setInitialTab('details');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-display font-bold rounded-lg hover:bg-white/30 transition-colors duration-300"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {t.viewDetails}
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-white/40 font-body">
                    {language === 'th' ? project.typeTh : project.type} • {project.year}
                  </span>
                </div>
                
                <h3 className="font-display font-bold text-lg text-white dark:text-white light:text-black mb-2 group-hover:text-red-500 transition-colors duration-300">
                  {language === 'th' ? project.nameTh : project.name}
                </h3>
                
                <p className="font-body text-sm text-white/60 dark:text-white/60 light:text-black/60 mb-4 line-clamp-2 thai-text">
                  {language === 'th' ? project.descriptionTh : project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-body rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="px-2 py-0.5 bg-white/5 text-white/40 text-[10px] font-body rounded">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unified Project Modal */}
      <ProjectModal
        project={activeProject}
        isOpen={!!activeProject}
        onClose={() => setActiveProject(null)}
        language={language}
        initialTab={initialTab}
      />

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
    </section>
  );
};

export default Projects;
