// ============================================================================
// PORTFOLIO SITE CONFIGURATION - Kittiphat Thunthong (P)
// ============================================================================
// Full Stack Developer Portfolio with Thai/English support
// Red accent color theme
// ============================================================================

// ----------------------------------------------------------------------------
// Language Configuration
// ----------------------------------------------------------------------------

export type Language = 'th' | 'en';

export const translations = {
  th: {
    // Navigation
    nav: {
      home: 'หน้าแรก',
      about: 'เกี่ยวกับ',
      experience: 'ประสบการณ์',
      skills: 'ทักษะ',
      projects: 'โปรเจกต์',
      contact: 'ติดต่อ',
    },
    // Hero
    hero: {
      greeting: 'สวัสดี, ฉันคือ',
      name: 'KITTIPHAT',
      nickname: '(P)',
      role: 'Full Stack Developer',
      targetPosition: 'Junior Full Stack Developer / Software Developer',
      subtitle: 'นักพัฒนาซอฟต์แวร์จบใหม่ มุ่งมั่นสร้างเว็บแอปพลิเคชันคุณภาพสูง',
      ctaProjects: 'ดูผลงาน',
      ctaContact: 'ติดต่อฉัน',
    },
    // About
    about: {
      sectionLabel: 'เกี่ยวกับฉัน',
      headingMain: 'นักพัฒนา',
      headingAccent: 'ที่หลงใหลในโค้ด',
      name: 'กิตติพัฒน์ ธันธงค์ (พี)',
      position: 'Junior Full Stack Developer',
      location: 'อำนาจเจริญ, ประเทศไทย',
      summary: 'บัณฑิตสาขาเทคโนโลยีสารสนเทศ จบใหม่ มีความสนใจอย่างมากในการพัฒนาซอฟต์แวร์แบบครบวงจร มีประสบการณ์ในการสร้างเว็บแอปพลิเคชันโดยใช้ React, Node.js, Angular และระบบฐานข้อมูลหลากหลายผ่านโครงการต่างๆ มีทักษะในการวิเคราะห์ระบบ รวบรวมความต้องการ ออกแบบฐานข้อมูล พัฒนา API การทดสอบอัตโนมัติ และ workflows การพัฒนาสมัยใหม่',
      education: {
        degree: 'วิทยาศาสตรบัณฑิต เทคโนโลยีสารสนเทศ',
        university: 'มหาวิทยาลัยราชภัฏมหาสารคาม',
        year: '2022 – 2026',
        gpa: 'GPA: 3.80',
      },
      achievements: {
        title: 'ความสำเร็จ',
        nsc: 'การแข่งขันโปรแกรมคอมพิวเตอร์แห่งประเทศไทย (NSC) 2025',
      },
      languages: {
        title: 'ภาษา',
        thai: 'ไทย — ภาษาแม่',
        english: 'อังกฤษ — อ่านระดับกลาง / ฟังระดับพื้นฐาน',
      },
      interests: {
        title: 'ความสนใจ',
        items: 'การพัฒนาซอฟต์แวร์, ปัญญาประดิษฐ์, เทคโนโลยีใหม่ๆ, เว็บเทคโนโลยี',
      },
      features: {
        projects: { value: '5+', label: 'โปรเจกต์' },
        experience: { value: '4+', label: 'เดือนฝึกงาน' },
        gpa: { value: '3.80', label: 'เกรดเฉลี่ย' },
      },
    },
    // Experience
    experience: {
      sectionLabel: 'ประสบการณ์',
      headingMain: 'การทำงาน',
      headingAccent: 'ของฉัน',
      intern: {
        title: 'Full Stack Developer Intern',
        company: 'Extosoft',
        period: 'ฝึกงาน',
        responsibilities: [
          'พัฒนาเว็บแอปพลิเคชันแบบครบวงจรโดยใช้ Angular และ Golang',
          'วิเคราะห์ความต้องการและเขียนเอกสาร Product Requirement (PRD)',
          'ออกแบบ ER Diagram และ Database Schema',
          'พัฒนา REST APIs และเชื่อมต่อกับ Frontend',
          'สร้างและทดสอบ Frontend Components',
          'สร้าง Automated Tests โดยใช้ Playwright',
          'ทำงานกับ Docker Containers และ CI/CD Pipelines',
          'ใช้ Grafana สำหรับ Monitoring และ Reporting',
        ],
      },
    },
    // Timeline
    timeline: {
      sectionLabel: 'การเดินทางของฉัน',
      headingMain: 'ไทม์ไลน์',
      headingAccent: 'การเรียนรู้',
      milestones: [
        { year: '2022', title: 'เริ่มต้นการเดินทาง', description: 'เริ่มเรียนรู้ HTML และการพัฒนาเว็บเบื้องต้น' },
        { year: '2022-2023', title: 'EJS & Node.js', description: 'สร้างเว็บไซต์โดยใช้ EJS และ Node.js' },
        { year: '2023-2025', title: 'React & Node.js', description: 'พัฒนาแอปพลิเคชัน Full Stack ด้วย React และ Node.js' },
        { year: '2025-ปัจจุบัน', title: 'Angular & Golang', description: 'พัฒนาเว็บแอปพลิเคชันด้วย Angular และ Golang' },
      ],
    },
    // Skills
    skills: {
      sectionLabel: 'ทักษะของฉัน',
      headingMain: 'เทคโนโลยี',
      headingAccent: 'ที่ใช้',
      categories: {
        languages: 'ภาษาโปรแกรม',
        frontend: 'Frontend',
        backend: 'Backend',
        database: 'ฐานข้อมูล',
        devops: 'DevOps & Testing',
        tools: 'เครื่องมือ',
      },
      bottomText: 'ระดับความชำนาญ: สูง = ใช้งานบ่อย | กลาง = พอใช้ได้ | ต่ำ = กำลังเรียนรู้',
      proficiency: {
        high: 'ชำนาญ',
        medium: 'พอใช้',
        low: 'กำลังหัด',
      },
    },
    // Projects
    projects: {
      sectionLabel: 'ผลงานของฉัน',
      headingMain: 'โปรเจกต์',
      headingAccent: 'ที่โดดเด่น',
      viewDetails: 'ดูรายละเอียด',
      viewDemo: 'ทดลองใช้',
      viewGithub: 'GitHub',
      preview: 'ตัวอย่าง',
      demo: 'Demo',
      techStack: 'เทคโนโลยี',
      features: 'ฟีเจอร์',
      achievement: 'ความสำเร็จ',
    },
    // Contact
    contact: {
      sectionLabel: 'ติดต่อ',
      headingMain: 'มาทำงาน',
      headingAccent: 'ร่วมกัน',
      description: 'สนใจทำงานร่วมกันหรือมีคำถาม? ติดต่อฉันได้เลย',
      email: 'อีเมล',
      phone: 'โทรศัพท์',
      location: 'ที่อยู่',
      github: 'GitHub',
      portfolio: 'Portfolio',
      sendMessage: 'ส่งข้อความ',
    },
    // Footer
    footer: {
      copyright: 'สร้างด้วยความภาคภูมิใจโดย Kittiphat Thunthong',
    },
    // Theme
    theme: {
      dark: 'โหมดมืด',
      light: 'โหมดสว่าง',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
    },
    // Hero
    hero: {
      greeting: 'Hello, I am',
      name: 'KITTIPHAT',
      nickname: '(P)',
      role: 'Full Stack Developer',
      targetPosition: 'Junior Full Stack Developer / Software Developer',
      subtitle: 'A recent IT graduate passionate about building high-quality web applications',
      ctaProjects: 'View Projects',
      ctaContact: 'Contact Me',
    },
    // About
    about: {
      sectionLabel: 'About Me',
      headingMain: 'Developer',
      headingAccent: 'Passionate About Code',
      name: 'Kittiphat Thunthong (P)',
      position: 'Junior Full Stack Developer',
      location: 'Amnatcharoen, Thailand',
      summary: 'Recent Information Technology graduate with strong interest in full-stack software development. Experienced in building web applications using React, Node.js, Angular, and multiple database systems through academic, freelance, and internship projects. Skilled in system analysis, requirement gathering, database design, API development, automated testing, and modern development workflows.',
      education: {
        degree: 'Bachelor of Science in Information Technology',
        university: 'Rajabhat Mahasarakham University',
        year: '2022 – 2026',
        gpa: 'GPA: 3.80',
      },
      achievements: {
        title: 'Achievements',
        nsc: 'National Software Contest (NSC) 2025',
      },
      languages: {
        title: 'Languages',
        thai: 'Thai — Native',
        english: 'English — Intermediate Reading / Basic Listening',
      },
      interests: {
        title: 'Interests',
        items: 'Software Development, Artificial Intelligence, Emerging Technologies, Web Technologies',
      },
      features: {
        projects: { value: '5+', label: 'Projects' },
        experience: { value: '4+', label: 'Months Intern' },
        gpa: { value: '3.80', label: 'GPA' },
      },
    },
    // Timeline
    timeline: {
      sectionLabel: 'My Journey',
      headingMain: 'Learning',
      headingAccent: 'Timeline',
      milestones: [
        { year: '2022', title: 'Journey Begins', description: 'Started learning HTML and basic web development' },
        { year: '2022-2023', title: 'EJS & Node.js', description: 'Built websites using EJS and Node.js' },
        { year: '2023-2025', title: 'React & Node.js', description: 'Developed full stack applications using React and Node.js' },
        { year: '2025-Present', title: 'Angular & Golang', description: 'Developing web applications using Angular and Golang' },
      ],
    },
    // Experience
    experience: {
      sectionLabel: 'Experience',
      headingMain: 'My ',
      headingAccent: 'Experience',
      intern: {
        title: 'Full Stack Developer Intern',
        company: 'Extosoft',
        period: 'Internship',
        responsibilities: [
          'Developed full-stack web applications using Angular and Golang',
          'Performed requirement analysis and wrote product requirement documentation (PRD)',
          'Designed ER diagrams and database schemas',
          'Implemented REST APIs and integrated them with frontend applications',
          'Built and tested frontend components',
          'Created automated tests using Playwright',
          'Worked with Docker containers and CI/CD pipelines',
          'Used Grafana for monitoring and reporting system metrics',
        ],
      },
    },
    // Skills
    skills: {
      sectionLabel: 'My Skills',
      headingMain: 'Technologies',
      headingAccent: 'I Use',
      categories: {
        languages: 'Programming Languages',
        frontend: 'Frontend',
        backend: 'Backend',
        database: 'Databases',
        devops: 'DevOps & Testing',
        tools: 'Tools',
      },
      bottomText: 'Proficiency: High = Daily use | Medium = Comfortable | Low = Learning',
      proficiency: {
        high: 'Proficient',
        medium: 'Familiar',
        low: 'Learning',
      },
    },
    // Projects
    projects: {
      sectionLabel: 'My Work',
      headingMain: 'Featured',
      headingAccent: 'Projects',
      viewDetails: 'View Details',
      viewDemo: 'Try Demo',
      viewGithub: 'GitHub',
      preview: 'Preview',
      demo: 'Demo',
      techStack: 'Tech Stack',
      features: 'Features',
      achievement: 'Achievement',
    },
    // Contact
    contact: {
      sectionLabel: 'Get In Touch',
      headingMain: 'Let\'s Work',
      headingAccent: 'Together',
      description: 'Interested in working together or have questions? Reach out to me.',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      github: 'GitHub',
      portfolio: 'Portfolio',
      sendMessage: 'Send Message',
    },
    // Footer
    footer: {
      copyright: 'Crafted with pride by Kittiphat Thunthong',
    },
    // Theme
    theme: {
      dark: 'Dark Mode',
      light: 'Light Mode',
    },
  },
};

// ----------------------------------------------------------------------------
// Personal Information
// ----------------------------------------------------------------------------

export const personalInfo = {
  fullName: 'KITTIPHAT THUNTHONG',
  nickname: 'P',
  targetPosition: 'Junior Full Stack Developer / Software Developer',
  phone: '+66 90 216 9347',
  email: 'opee195@gmail.com',
  location: 'Amnatcharoen, Thailand',
  github: 'https://github.com/puyolnw',
  portfolio: 'https://wx.wsw',
};

// ----------------------------------------------------------------------------
// Navigation
// ----------------------------------------------------------------------------

export interface NavLink {
  label: string;
  href: string;
}

export interface NavigationConfig {
  logo: string;
  logoAccent: string;
  navLinks: NavLink[];
  ctaText: string;
}

export const getNavigationConfig = (lang: Language): NavigationConfig => ({
  logo: 'KITTIPHAT',
  logoAccent: '.',
  navLinks: [
    { label: translations[lang].nav.home, href: '#home' },
    { label: translations[lang].nav.about, href: '#about' },
    { label: translations[lang].nav.experience, href: '#experience' },
    { label: translations[lang].nav.skills, href: '#skills' },
    { label: translations[lang].nav.projects, href: '#projects' },
    { label: translations[lang].nav.contact, href: '#contact' },
  ],
  ctaText: translations[lang].nav.contact,
});

// ----------------------------------------------------------------------------
// Hero Section
// ----------------------------------------------------------------------------

export interface HeroConfig {
  gridRows: number;
  gridCols: number;
  redCells: { row: number; col: number }[];
}

export const heroConfig: HeroConfig = {
  gridRows: 6,
  gridCols: 8,
  redCells: [
    { row: 0, col: 2 }, { row: 0, col: 5 },
    { row: 1, col: 0 }, { row: 1, col: 7 },
    { row: 2, col: 3 }, { row: 2, col: 6 },
    { row: 3, col: 1 }, { row: 3, col: 4 },
    { row: 4, col: 2 }, { row: 4, col: 5 },
    { row: 5, col: 0 }, { row: 5, col: 7 },
  ],
};

// ----------------------------------------------------------------------------
// About Section
// ----------------------------------------------------------------------------

export interface AboutConfig {
  profileImage: string;
  logoImage: string;
  decorativeText: string;
}

export const aboutConfig: AboutConfig = {
  profileImage: '/images/profile.jpg',
  logoImage: '/images/logo.png',
  decorativeText: 'DEVELOPER',
};

// ----------------------------------------------------------------------------
// Timeline Section
// ----------------------------------------------------------------------------

export interface TimelineConfig {
  decorativeText: string;
}

export const timelineConfig: TimelineConfig = {
  decorativeText: 'JOURNEY',
};

// ----------------------------------------------------------------------------
// Experience Section
// ----------------------------------------------------------------------------

export interface Experience {
  id: string;
  title: string;
  titleTh: string;
  company: string;
  period: string;
  periodTh: string;
  responsibilities: string[];
  responsibilitiesTh: string[];
  techStack: string[];
}

export const experienceData: Experience[] = [
  {
    id: 'freelance-web',
    title: 'Freelance Web Developer',
    titleTh: 'ฟรีแลนซ์ Web Developer',
    company: 'Self-Employed',
    period: '2022 - 2024',
    periodTh: '2022 - 2024',
    responsibilities: [
      'Started freelancing while studying and delivered small business websites using WordPress',
      'Handled requirements, page layout design, and production deployment for client work',
      'Built practical communication and project ownership skills from direct client collaboration',
      'Established a strong web development foundation before moving into full-stack projects',
    ],
    responsibilitiesTh: [
      'เริ่มรับงานฟรีแลนซ์ระหว่างเรียน และส่งมอบเว็บไซต์ธุรกิจขนาดเล็กด้วย WordPress',
      'ดูแลตั้งแต่เก็บ requirement ออกแบบหน้าเว็บ ไปจนถึง deploy งานจริงให้ลูกค้า',
      'พัฒนาทักษะการสื่อสารและการรับผิดชอบโปรเจกต์จากการทำงานกับลูกค้าโดยตรง',
      'วางพื้นฐานสาย Web Development ก่อนต่อยอดสู่โปรเจกต์ Full Stack',
    ],
    techStack: ['WordPress', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 'freelance-fullstack',
    title: 'Freelance Full Stack Developer',
    titleTh: 'ฟรีแลนซ์ Full Stack Developer',
    company: 'Self-Employed',
    period: '2024 - 2026',
    periodTh: '2024 - 2026',
    responsibilities: [
      'Delivered full-stack projects while studying, with focus on real workflow and deployment',
      'Developed frontend, backend APIs, and database design for multiple client/student projects',
      'Worked mainly with React, Node.js, and relational databases in end-to-end development',
      'Built project experience across planning, implementation, testing, and handoff',
    ],
    responsibilitiesTh: [
      'พัฒนาโปรเจกต์ Full Stack ไปพร้อมการเรียน โดยเน้น workflow การทำงานจริงและการ deploy',
      'รับผิดชอบทั้ง frontend, backend API และการออกแบบฐานข้อมูลในหลายโปรเจกต์',
      'ทำงานหลักด้วย React, Node.js และฐานข้อมูลเชิงสัมพันธ์แบบ end-to-end',
      'เก็บประสบการณ์ครบตั้งแต่การวางแผน ลงมือพัฒนา ทดสอบ และส่งมอบงาน',
    ],
    techStack: ['React', 'Node.js', 'Express', 'MySQL', 'PostgreSQL'],
  },
  {
    id: 'extosoft',
    title: 'Full Stack Developer Intern',
    titleTh: 'นักพัฒนา Full Stack (ฝึกงาน)',
    company: 'Extosoft',
    period: '2025 - 2026',
    periodTh: '2025 - 2026',
    responsibilities: [
      'Developed full-stack web applications using Angular and Golang',
      'Performed requirement analysis and wrote product requirement documentation (PRD)',
      'Designed ER diagrams and database schemas',
      'Implemented REST APIs and integrated them with frontend applications',
      'Built and tested frontend components',
      'Collaborated with team members to deliver production-ready features',
    ],
    responsibilitiesTh: [
      'พัฒนาเว็บแอปพลิเคชันแบบครบวงจรโดยใช้ Angular และ Golang',
      'วิเคราะห์ความต้องการและเขียนเอกสาร Product Requirement (PRD)',
      'ออกแบบ ER Diagram และ Database Schema',
      'พัฒนา REST APIs และเชื่อมต่อกับ Frontend',
      'สร้างและทดสอบ Frontend Components',
      'ทำงานร่วมกับทีมเพื่อส่งมอบฟีเจอร์ที่พร้อมใช้งานจริง',
    ],
    techStack: ['Angular', 'Golang', 'REST API', 'MySQL', 'Docker'],
  },
  {
    id: 'education',
    title: 'B.Sc. in Information Technology',
    titleTh: 'วิทยาศาสตรบัณฑิต สาขาเทคโนโลยีสารสนเทศ',
    company: 'Rajabhat Mahasarakham University',
    period: '2022 - 2026',
    periodTh: '2022 - 2026',
    responsibilities: [
      'Studied while freelancing and continuously applied classroom knowledge to real projects',
      'Focused on software engineering, web development, and full-stack implementation',
      'Graduated with GPA 3.80 and First-Class Honors',
    ],
    responsibilitiesTh: [
      'เรียนไปพร้อมทำฟรีแลนซ์ และนำความรู้จากห้องเรียนไปใช้กับโปรเจกต์จริงอย่างต่อเนื่อง',
      'เน้นการเรียนด้านวิศวกรรมซอฟต์แวร์ การพัฒนาเว็บ และการพัฒนา Full Stack',
      'สำเร็จการศึกษาด้วยเกรดเฉลี่ย 3.80 และเกียรตินิยมอันดับ 1',
    ],
    techStack: ['Software Engineering', 'Full Stack Development', 'Project-Based Learning'],
  },
];

// ----------------------------------------------------------------------------
// Skills Section with Proficiency Levels
// ----------------------------------------------------------------------------

export type ProficiencyLevel = 'high' | 'medium' | 'low';

export interface Skill {
  name: string;
  icon: string;
  category: 'languages' | 'frontend' | 'backend' | 'database' | 'devops' | 'tools';
  color: string;
  proficiency: ProficiencyLevel;
  description: string;
  descriptionTh: string;
}

export const skillsData: Skill[] = [
  // Programming Languages
  { 
    name: 'JavaScript', 
    icon: 'logos:javascript', 
    category: 'languages', 
    color: '#F7DF1E',
    proficiency: 'high',
    description: 'Primary language for web development, ES6+ features',
    descriptionTh: 'ภาษาหลักสำหรับพัฒนาเว็บ รู้จัก ES6+',
  },
  { 
    name: 'Python', 
    icon: 'logos:python', 
    category: 'languages', 
    color: '#3776AB',
    proficiency: 'low',
    description: 'Used for backend and data processing',
    descriptionTh: 'ใช้สำหรับ Backend และประมวลผลข้อมูล',
  },
  { 
    name: 'Go', 
    icon: 'logos:go', 
    category: 'languages', 
    color: '#00ADD8',
    proficiency: 'medium',
    description: 'Learning for high-performance backend',
    descriptionTh: 'กำลังเรียนรู้สำหรับ Backend ประสิทธิภาพสูง',
  },
  { 
    name: 'PHP', 
    icon: 'logos:php', 
    category: 'languages', 
    color: '#777BB4',
    proficiency: 'low',
    description: 'Basic understanding from academic projects',
    descriptionTh: 'เข้าใจพื้นฐานจากโครงการเรียน',
  },
  
  // Frontend
  { 
    name: 'React', 
    icon: 'logos:react', 
    category: 'frontend', 
    color: '#61DAFB',
    proficiency: 'high',
    description: 'Built multiple projects with hooks and context',
    descriptionTh: 'สร้างโปรเจกต์หลายตัวด้วย hooks และ context',
  },
  { 
    name: 'Angular', 
    icon: 'logos:angular-icon', 
    category: 'frontend', 
    color: '#DD0031',
    proficiency: 'medium',
    description: 'Used during internship at Extosoft',
    descriptionTh: 'ใช้ระหว่างฝึกงานที่ Extosoft',
  },
  { 
    name: 'HTML5', 
    icon: 'logos:html-5', 
    category: 'frontend', 
    color: '#E34F26',
    proficiency: 'high',
    description: 'Strong foundation in semantic HTML',
    descriptionTh: 'พื้นฐาน HTML ที่แข็งแกร่ง',
  },
  { 
    name: 'CSS3', 
    icon: 'logos:css-3', 
    category: 'frontend', 
    color: '#1572B6',
    proficiency: 'high',
    description: 'Experienced with Flexbox, Grid, responsive design',
    descriptionTh: 'มีประสบการณ์กับ Flexbox, Grid, responsive',
  },
  
  // Backend
  { 
    name: 'Node.js', 
    icon: 'logos:nodejs-icon', 
    category: 'backend', 
    color: '#339933',
    proficiency: 'high',
    description: 'Built REST APIs and server applications',
    descriptionTh: 'สร้าง REST APIs และ server applications',
  },
  { 
    name: 'REST API', 
    icon: 'carbon:api', 
    category: 'backend', 
    color: '#FF6B6B',
    proficiency: 'high',
    description: 'Designed and implemented RESTful services',
    descriptionTh: 'ออกแบบและพัฒนา RESTful services',
  },
  
  // Database
  { 
    name: 'MySQL', 
    icon: 'logos:mysql', 
    category: 'database', 
    color: '#4479A1',
    proficiency: 'high',
    description: 'Relational database design and queries',
    descriptionTh: 'ออกแบบและ query ฐานข้อมูลเชิงสัมพันธ์',
  },
  { 
    name: 'MongoDB', 
    icon: 'logos:mongodb-icon', 
    category: 'database', 
    color: '#47A248',
    proficiency: 'low',
    description: 'NoSQL database for flexible schemas',
    descriptionTh: 'ฐานข้อมูล NoSQL สำหรับ schema ที่ยืดหยุ่น',
  },
  { 
    name: 'PostgreSQL', 
    icon: 'logos:postgresql', 
    category: 'database', 
    color: '#336791',
    proficiency: 'medium',
    description: 'Advanced SQL and database design',
    descriptionTh: 'SQL ขั้นสูงและการออกแบบฐานข้อมูล',
  },
  
  // DevOps & Testing
  { 
    name: 'Docker', 
    icon: 'logos:docker-icon', 
    category: 'devops', 
    color: '#2496ED',
    proficiency: 'medium',
    description: 'Containerization for development and deployment',
    descriptionTh: 'Containerization สำหรับการพัฒนาและ deploy',
  },
  { 
    name: 'CI/CD', 
    icon: 'logos:github-actions', 
    category: 'devops', 
    color: '#FF9800',
    proficiency: 'low',
    description: 'Automated build and deployment pipelines',
    descriptionTh: 'Automated build และ deployment pipelines',
  },
  { 
    name: 'Grafana', 
    icon: 'logos:grafana', 
    category: 'devops', 
    color: '#F46800',
    proficiency: 'low',
    description: 'Monitoring and visualization dashboards',
    descriptionTh: 'Monitoring และ visualization dashboards',
  },
  { 
    name: 'Playwright', 
    icon: 'logos:playwright', 
    category: 'devops', 
    color: '#2EAD33',
    proficiency: 'low',
    description: 'End-to-end automated testing',
    descriptionTh: 'End-to-end automated testing',
  },
  
  // Tools
  { 
    name: 'Git', 
    icon: 'logos:git-icon', 
    category: 'tools', 
    color: '#F05032',
    proficiency: 'high',
    description: 'Version control and collaboration',
    descriptionTh: 'Version control และ collaboration',
  },
  { 
    name: 'GitHub', 
    icon: 'logos:github-icon', 
    category: 'tools', 
    color: '#181717',
    proficiency: 'high',
    description: 'Code hosting and project management',
    descriptionTh: 'Code hosting และ project management',
  },
  { 
    name: 'Version Control', 
    icon: 'material-symbols:account-tree-outline-rounded', 
    category: 'tools', 
    color: '#FF5252',
    proficiency: 'high',
    description: 'Daily branching, merge flow, and collaborative versioning',
    descriptionTh: 'ใช้งาน branch/merge/workflow version control เป็นประจำ',
  },
  { 
    name: 'Postman', 
    icon: 'logos:postman-icon', 
    category: 'tools', 
    color: '#FF6C37',
    proficiency: 'high',
    description: 'API testing and documentation',
    descriptionTh: 'API testing และ documentation',
  },
  { 
    name: 'Figma', 
    icon: 'logos:figma', 
    category: 'tools', 
    color: '#F24E1E',
    proficiency: 'low',
    description: 'UI/UX design and prototyping',
    descriptionTh: 'UI/UX design และ prototyping',
  },
  { 
    name: 'ClickUp', 
    icon: 'simple-icons:clickup', 
    category: 'tools', 
    color: '#7B68EE',
    proficiency: 'medium',
    description: 'Task and sprint organization for project execution',
    descriptionTh: 'จัดการงานและติดตาม sprint สำหรับการพัฒนาโปรเจกต์',
  },
  { 
    name: 'AI Studio', 
    icon: 'simple-icons:googlegemini', 
    category: 'tools', 
    color: '#8AB4F8',
    proficiency: 'medium',
    description: 'Used for prototyping prompts and AI-assisted workflows',
    descriptionTh: 'ใช้ทดลอง prompt และ workflow ที่มี AI ช่วยพัฒนา',
  },
];

export const skillsConfig = {
  decorativeText: 'SKILLS',
};

// ----------------------------------------------------------------------------
// Projects Section
// ----------------------------------------------------------------------------

export interface Project {
  id: string;
  name: string;
  nameTh: string;
  type: string;
  typeTh: string;
  year: string;
  description: string;
  descriptionTh: string;
  fullDescription: string;
  fullDescriptionTh: string;
  features: string[];
  featuresTh: string[];
  techStack: string[];
  images: string[];
  demoUrl?: string;
  githubUrl?: string;
  achievement?: string;
  achievementTh?: string;
  isLocalDemo?: boolean;
}

export const projectsData: Project[] = [
  {
    id: 'smart-elderly',
    name: 'Smart Elderly Patient Screening System',
    nameTh: 'ระบบคัดกรองผู้ป่วยสูงอายุอัจฉริยะ',
    type: 'Team Project',
    typeTh: 'โปรเจกต์กลุ่ม',
    year: '2024',
    description: 'Healthcare screening system with face recognition, AI triage, and queue management for hospitals',
    descriptionTh: 'ระบบคัดกรองสุขภาพพร้อมการจดจำใบหน้า AI คัดแยกความเร่งด่วน และจัดการคิวสำหรับโรงพยาบาล',
    fullDescription: 'A smart healthcare screening system designed to assist hospital patient check-in processes. The system features AI-powered face recognition for patient identification, automated queue management with priority-based triage, real-time queue status display for patients and staff, role-based access (admin, doctor, nurse), and comprehensive reporting dashboards. Selected for National Software Contest (NSC) 2025.',
    fullDescriptionTh: 'ระบบคัดกรองสุขภาพอัจฉริยะเพื่อช่วยกระบวนการลงทะเบียนผู้ป่วยในโรงพยาบาล มีฟีเจอร์จดจำใบหน้าด้วย AI ระบบจัดการคิวอัตโนมัติแบบจัดลำดับความเร่งด่วน แสดงสถานะคิวแบบเรียลไทม์ การเข้าถึงตามบทบาท (แอดมิน, แพทย์, พยาบาล) และแดชบอร์ดรายงานครบถ้วน ได้รับคัดเลือกเข้าร่วม NSC 2025',
    features: [
      'Face recognition for patient identification using OpenCV',
      'Automated queue management with priority-based triage',
      'Real-time queue status display screens',
      'Role-based access control (Admin, Doctor, Nurse)',
      'Patient data management and medical records',
      'Department and examination room management',
      'Screening reports, doctor and nurse performance analytics',
    ],
    featuresTh: [
      'การจดจำใบหน้าเพื่อระบุตัวตนผู้ป่วยด้วย OpenCV',
      'ระบบจัดการคิวอัตโนมัติแบบจัดลำดับความเร่งด่วน',
      'แสดงสถานะคิวแบบเรียลไทม์',
      'การเข้าถึงตามบทบาท (แอดมิน, แพทย์, พยาบาล)',
      'จัดการข้อมูลผู้ป่วยและประวัติการรักษา',
      'จัดการแผนกและห้องตรวจ',
      'รายงานการคัดกรอง วิเคราะห์ผลงานแพทย์และพยาบาล',
    ],
    techStack: ['React', 'Python', 'MongoDB', 'OpenCV', 'MUI'],
    images: [
      '/images/smp-login.png',
      '/images/smp-dashboard.png',
      '/images/smp-patients.png',
      '/images/smp-staff.png',
      '/images/smp-departments.png',
      '/images/smp-reports.png',
    ],
    demoUrl: '/demo/smp',
    githubUrl: 'https://github.com/puyolnw/smart-elderly',
    achievement: 'Selected for NSC 2025',
    achievementTh: 'คัดเลือกเข้า NSC 2025',
    isLocalDemo: true,
  },
  {
    id: 'dormitory',
    name: 'Dormitory Management System',
    nameTh: 'ระบบจัดการหอพัก',
    type: 'Independent Project',
    typeTh: 'โปรเจกต์เดี่ยว',
    year: '2024',
    description: 'Full-stack dormitory management with room, billing, and financial reports',
    descriptionTh: 'ระบบจัดการหอพักครบวงจร พร้อมห้อง บิล และรายงานการเงิน',
    fullDescription: 'A comprehensive dormitory management system designed and developed independently. Features include room management, utility billing, financial reporting, and tenant management.',
    fullDescriptionTh: 'ระบบจัดการหอพักครบวงจรที่ออกแบบและพัฒนาด้วยตนเอง มีฟีเจอร์จัดการห้อง บิลค่าสาธารณูปโภค รายงานการเงิน และการจัดการผู้เช่า',
    features: [
      'Room availability and booking management',
      'Utility bill calculation and tracking',
      'Financial reports and analytics',
      'Tenant profile management',
      'Payment history and reminders',
    ],
    featuresTh: [
      'จัดการห้องว่างและการจอง',
      'คำนวณและติดตามบิลค่าสาธารณูปโภค',
      'รายงานและวิเคราะห์การเงิน',
      'จัดการโปรไฟล์ผู้เช่า',
      'ประวัติการชำระเงินและการแจ้งเตือน',
    ],
    techStack: ['React', 'Node.js', 'MySQL', 'Express'],
    demoUrl: "/demo/dormitory",
    isLocalDemo: true,
    githubUrl: "https://github.com/nutthedev/dormitory-management-system",
    images: [
      "/images/dormitory_dashboard_final_v2_1773268398179.png",
      "/images/dormitory_navbar_badges_1773268337262.png",
      "/images/dorm_login_page_1773267644512.png",
      "/images/dormitory_manage_rooms_1773268123475.png",
      "/images/dorm_landing_page_1773267615387.png",
      "/images/dormitory_manage_rooms_incomplete_1773268291384.png"
    ],
  },
  {
    id: 'mooc-platform',
    name: 'MOOC Educational Platform',
    nameTh: 'แพลตฟอร์มการเรียนรู้ออนไลน์ (MOOC)',
    type: 'Team Project',
    typeTh: 'โปรเจกต์กลุ่ม',
    year: '2024',
    description: 'Online learning platform with video courses, quizzes, and certificates',
    descriptionTh: 'แพลตฟอร์มการเรียนรู้ออนไลน์พร้อมวิดีโอคอร์ส แบบทดสอบ และใบประกาศนียบัตร',
    fullDescription: 'A comprehensive MOOC platform for online education. Features include course management, video streaming, interactive quizzes, student progress tracking, and automated certificate generation.',
    fullDescriptionTh: 'แพลตฟอร์ม MOOC แบบครบวงจรสำหรับการศึกษาออนไลน์ มีฟีเจอร์จัดการคอร์ส สตรีมมิ่งวิดีโอ แบบทดสอบโต้ตอบได้ ติดตามความคืบหน้าผู้เรียน และสร้างใบประกาศนียบัตรอัตโนมัติ',
    features: [
      'Course content and module management',
      'Video lesson streaming with progress tracking',
      'Interactive quizzes and assessments',
      'Automated certificate generation',
      'Instructor and student dashboards',
    ],
    featuresTh: [
      'จัดการเนื้อหาคอร์สและโมดูล',
      'สตรีมมิ่งวิดีโอพร้อมติดตามความคืบหน้า',
      'แบบทดสอบและประเมินผลโต้ตอบได้',
      'สร้างใบประกาศนียบัตรระดับอัตโนมัติ',
      'แดชบอร์ดสำหรับผู้สอนและผู้เรียน',
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Express'],
    images: [],
  },
  {
    id: 'village-fund',
    name: 'Village Fund Management System',
    nameTh: 'ระบบจัดการกองทุนหมู่บ้าน',
    type: 'Team Project',
    typeTh: 'โปรเจกต์กลุ่ม',
    year: '2024',
    description: 'Financial management system for community village funds with banking-like workflows',
    descriptionTh: 'ระบบจัดการการเงินสำหรับกองทุนหมู่บ้าน พร้อม workflow คล้ายธนาคาร',
    fullDescription: 'A financial management system for community village funds. Implemented deposit, withdrawal, and accounting record features with workflows similar to simplified banking systems.',
    fullDescriptionTh: 'ระบบจัดการการเงินสำหรับกองทุนหมู่บ้าน มีฟีเจอร์ฝาก ถอน และบันทึกบัญชี พร้อม workflow คล้ายระบบธนาคารที่ง่ายขึ้น',
    features: [
      'Member account management',
      'Deposit and withdrawal transactions',
      'Accounting records and ledgers',
      'Financial reports and statements',
      'Multi-user access control',
    ],
    featuresTh: [
      'จัดการบัญชีสมาชิก',
      'ธุรกรรมฝากและถอน',
      'บันทึกบัญชีและสมุดรายวัน',
      'รายงานและงบการเงิน',
      'การควบคุมการเข้าถึงหลายผู้ใช้',
    ],
    techStack: ['React', 'Node.js', 'MySQL', 'Express'],
    images: [
      "/images/villagefund-preview.png",
      "/images/villagefund-logo.png",
    ],
  },
  {
    id: 'student-activity',
    name: 'Student Activity Tracking System',
    nameTh: 'ระบบติดตามกิจกรรมนักศึกษา',
    type: 'Freelance Project',
    typeTh: 'โปรเจกต์ฟรีแลนซ์',
    year: '2024',
    description: 'Web system for recording and managing student activity hours with role-based access',
    descriptionTh: 'ระบบเว็บสำหรับบันทึกและจัดการชั่วโมงกิจกรรมนักศึกษา พร้อมการเข้าถึงตามบทบาท',
    fullDescription: 'A web system for recording and managing student activity hours. Implemented role-based access for students and instructors, successfully reviewed and validated by university experts.',
    fullDescriptionTh: 'ระบบเว็บสำหรับบันทึกและจัดการชั่วโมงกิจกรรมนักศึกษา มีการเข้าถึงตามบทบาทสำหรับนักศึกษาและอาจารย์ ได้รับการตรวจสอบและยืนยันจากผู้เชี่ยวชาญของมหาวิทยาลัย',
    features: [
      'Activity registration and approval',
      'Hour tracking and validation',
      'Role-based dashboard (student/instructor)',
      'Activity history and certificates',
      'Report generation',
    ],
    featuresTh: [
      'ลงทะเบียนและอนุมัติกิจกรรม',
      'ติดตามและตรวจสอบชั่วโมง',
      'Dashboard ตามบทบาท (นักศึกษา/อาจารย์)',
      'ประวัติกิจกรรมและใบรับรอง',
      'สร้างรายงาน',
    ],
    techStack: ['React', 'Node.js', 'MySQL', 'JWT'],
    images: [
      '/images/student-activity-preview.png',
    ],
    demoUrl: '/demo/student-activity',
    isLocalDemo: true,
    githubUrl: 'https://github.com/puyolnw/student-activity',
  },
  {
    id: 'job-management',
    name: 'Cooperative Education Job Platform',
    nameTh: 'ระบบจัดหางานสำหรับนักศึกษา',
    type: 'Team Project',
    typeTh: 'โปรเจกต์กลุ่ม',
    year: '2024',
    description: 'Job platform connecting students with co-op and part-time opportunities with admin management',
    descriptionTh: 'แพลตฟอร์มจัดหางานพาร์ทไทม์และสหกิจศึกษา เชื่อมโยงนักศึกษากับสถานประกอบการ',
    fullDescription: 'A comprehensive cooperative education job management platform. Students can search and apply for jobs while employers post positions. Admins manage all users, job approvals, applications, and student evaluations. Features a modern dashboard with real-time statistics and role-based access.',
    fullDescriptionTh: 'ระบบจัดการสหกิจศึกษาและจัดหางานครบวงจร นักศึกษาสามารถค้นหาและสมัครงาน สถานประกอบการสามารถลงประกาศ ผู้ดูแลระบบจัดการผู้ใช้ อนุมัติงาน ดูการสมัคร และประเมินนักศึกษา มี Dashboard ที่ทันสมัยพร้อมสถิติแบบเรียลไทม์',
    features: [
      'Admin Dashboard with 8 real-time stat cards',
      'Student, Employer, and Job management',
      'Application tracking with status workflow',
      'Student evaluation with 5-star rating system',
      'Role-based access (Admin / Employer / Student)',
      'Glassmorphic search and modern MUI design',
    ],
    featuresTh: [
      'Dashboard สำหรับผู้ดูแลระบบพร้อมการ์ดสถิติ 8 รายการ',
      'จัดการนักศึกษา สถานประกอบการ และตำแหน่งงาน',
      'ติดตามการสมัครพร้อม workflow สถานะ',
      'ประเมินนักศึกษาด้วยระบบดาว 5 ดาว',
      'เข้าถึงตามบทบาท (แอดมิน / สถานประกอบการ / นักศึกษา)',
      'การค้นหา Glassmorphic และดีไซน์ MUI สมัยใหม่',
    ],
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'MUI'],
    images: [
      '/images/data-login.png',
      '/images/data-dashboard.png',
      '/images/data-students.png',
      '/images/data-employers.png',
      '/images/data-jobposts.png',
      '/images/data-applications.png',
      '/images/data-evaluations.png',
    ],
    demoUrl: '/demo/data',
    githubUrl: 'https://github.com/puyolnw/job-management',
    isLocalDemo: true,
  },
];

export const projectsConfig = {
  decorativeText: 'PROJECTS',
};

// ----------------------------------------------------------------------------
// Contact Section
// ----------------------------------------------------------------------------

export interface ContactConfig {
  email: string;
  phone: string;
  location: string;
  github: string;
  portfolio: string;
  decorativeText: string;
}

export const contactConfig: ContactConfig = {
  email: 'opee195@gmail.com',
  phone: '+66 90 216 9347',
  location: 'Amnatcharoen, Thailand',
  github: 'https://github.com/puyolnw',
  portfolio: 'https://wx.wsw',
  decorativeText: 'CONTACT',
};

// ----------------------------------------------------------------------------
// Footer
// ----------------------------------------------------------------------------

export interface FooterConfig {
  logo: string;
  logoAccent: string;
  brandDescription: string;
  socialLinks: { platform: string; href: string; label: string }[];
  copyrightText: string;
  decorativeText: string;
}

export const getFooterConfig = (lang: Language): FooterConfig => ({
  logo: 'KITTIPHAT',
  logoAccent: '.',
  brandDescription: lang === 'th' 
    ? 'นักพัฒนา Full Stack จบใหม่ มุ่งมั่นสร้างซอฟต์แวร์คุณภาพ'
    : 'Junior Full Stack Developer passionate about building quality software',
  socialLinks: [
    { platform: 'github', href: 'https://github.com/puyolnw', label: 'GitHub' },
    { platform: 'facebook', href: 'https://www.facebook.com/iamKiTTiphat/', label: 'Facebook' },
  ],
  copyrightText: translations[lang].footer.copyright,
  decorativeText: 'PORTFOLIO',
});

// ----------------------------------------------------------------------------
// Site Metadata
// ----------------------------------------------------------------------------

export interface SiteConfig {
  title: string;
  description: string;
  language: string;
  author: string;
}

export const getSiteConfig = (lang: Language): SiteConfig => ({
  title: lang === 'th' 
    ? 'Kittiphat Thunthong (P) | Full Stack Developer'
    : 'Kittiphat Thunthong (P) | Full Stack Developer',
  description: lang === 'th'
    ? 'พอร์ตโฟลิโอของ Kittiphat Thunthong (P) - นักพัฒนา Full Stack จบใหม่'
    : 'Portfolio of Kittiphat Thunthong (P) - Junior Full Stack Developer',
  language: lang,
  author: 'Kittiphat Thunthong',
});
