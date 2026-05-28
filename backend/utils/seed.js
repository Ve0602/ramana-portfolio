// seed.js — place this at backend/utils/seed.js
const User = require('./models/User');
const Brand = require('./models/Brand');
const Service = require('./models/Service');
const Referral = require('./models/Referral');
const Portfolio = require('./models/Portfolio');

module.exports = async function seed() {
  // ── Admin user ──────────────────────────────────────────
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    await User.create({
      name: 'Ramana Vemunoori',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });
    console.log('✅ Admin user created');
  }

  // ── Brand settings ──────────────────────────────────────
  const brandExists = await Brand.findOne({ key: 'site' });
  if (!brandExists) {
    await Brand.create({
      key: 'site',
      value: {
        name: 'Vemunoori Collections',
        tagline: 'Fashion · Technology · Excellence',
        logo: '',
        logoText: 'VC',
        primaryColor: '#d4a853',
        accentColor: '#b8860b',
        loginBg: '',
        loginVideo: '',
        homeBannerVideo: '',
        phone: '+91 8499882843',
        whatsapp: '+91 8499882843',
        email: 'vemunooriramana0602@gmail.com',
        location: 'Warangal, Telangana',
        mapLink: '',
        instagram: '',
        facebook: '',
        youtube: '',
        aboutText: 'Vemunoori Collections — your one-stop destination for beautiful handcrafted fashion, expert tailoring, and modern technology services. Based in Warangal, serving with love and quality.',
        loginBgGradient: 'linear-gradient(135deg, #1a0a00 0%, #2d1500 40%, #1a0505 100%)',
        openHours: 'Mon-Sat: 9 AM – 8 PM'
      }
    });
    console.log('✅ Brand settings seeded');
  }

  // ── Home dashboard services ─────────────────────────────
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      { title: 'Vemunoori Collections', subtitle: 'Fashion Boutique', description: 'Kids dresses, women jackets, sarees and custom tailoring by expert designers', icon: '👗', color: '#d4a853', link: '/shop', badge: 'New', category: 'shop', order: 1 },
      { title: 'Tailoring Services', subtitle: 'Custom Stitching', description: 'Professional tailoring for all occasions — bridal, casual, formal and kids wear', icon: '🧵', color: '#e91e8c', link: '/shop?cat=tailoring', category: 'shop', order: 2 },
      { title: 'Computer & Digital', subtitle: 'Tech Services', description: 'Computer work, graphic designs, and digital services for your business needs', icon: '💻', color: '#00d4ff', link: '/shop?cat=computer', category: 'service', order: 3 },
      { title: 'Teaching & Training', subtitle: 'Learn Tailoring', description: 'Learn professional tailoring from scratch — classes for beginners and advanced', icon: '📚', color: '#7c3aed', link: '/shop?cat=teaching', category: 'service', order: 4 },
      { title: 'AI Portfolio', subtitle: "Ramana's Work", description: 'AI & Data Science professional portfolio — Prompt Engineer, ML Annotator', icon: '🤖', color: '#10b981', link: '/portfolio', category: 'portfolio', order: 5 },
      { title: 'Freelance Services', subtitle: 'Hire Ramana', description: 'Hire for AI prompt engineering, data annotation, and full stack web development', icon: '🎯', color: '#f59e0b', link: '/freelance', category: 'portfolio', order: 6 },
      { title: 'Job Referrals', subtitle: 'AI Job Links', description: 'Access exclusive referral links to top AI annotation and data science platforms', icon: '🔗', color: '#6366f1', link: '/referrals', category: 'portfolio', order: 7 },
      { title: 'Resume / CV', subtitle: 'Download Resume', description: "View and download Ramana's professional AI & Data Science resume", icon: '📄', color: '#14b8a6', link: '/resume', category: 'portfolio', order: 8 },
    ]);
    console.log('✅ Services seeded');
  }

  // ── Referrals ───────────────────────────────────────────
  const refCount = await Referral.countDocuments();
  if (refCount === 0) {
    await Referral.insertMany([
      { platform: 'Oneforma (Centific)', type: 'AI Data Annotation', icon: '🌐', description: 'The platform Ramana currently works on. AI annotation projects including audio, OCR, handwriting, and NLP tasks.', perks: ['Remote', 'Flexible Hours', 'Multiple Projects', 'Weekly Pay'], url: 'https://www.oneforma.com', badge: 'I Work Here', badgeType: 'work', category: 'annotation', order: 1 },
      { platform: 'Mercor', type: 'AI Expert Roles – W2 Employment', icon: '🤖', description: 'Premium platform connecting AI/ML experts with leading AI labs. Full-time W-2 positions, 40 hrs/week, remote.', perks: ['Full-Time W-2', 'AI Labs', 'Remote India', '40hrs/week'], url: 'https://mercor.com/apply', badge: 'Hiring Now', badgeType: 'hot', category: 'annotation', order: 2 },
      { platform: 'Outlier AI', type: 'AI Training Data', icon: '📊', description: 'Leading AI data platform offering RLHF, annotation, and expert AI trainer roles.', perks: ['Remote', 'Freelance', 'Expert Tasks', 'Good Pay'], url: 'https://outlier.ai/for-ai-contributors', badge: 'Recommended', badgeType: 'recommended', category: 'annotation', order: 3 },
      { platform: 'Appen', type: 'Data Annotation', icon: '💎', description: 'Global leader in AI training data. Projects for speech, text, image, and video annotation.', perks: ['Remote', 'Beginner Friendly', 'Multiple Languages', 'Flexible'], url: 'https://appen.com/join-our-crowd/', badge: '', badgeType: '', category: 'annotation', order: 4 },
      { platform: 'Remotasks', type: 'AI Data Tasks', icon: '🔬', description: 'Task-based platform for AI data work. Good variety of annotation, tagging, and AI feedback tasks.', perks: ['Remote', 'Flexible', 'Task-Based', 'No Experience Needed'], url: 'https://www.remotasks.com', badge: '', badgeType: '', category: 'annotation', order: 5 },
      { platform: 'LinkedIn Network Referral', type: 'Direct Introduction', icon: '🔵', description: "Connect with Ramana on LinkedIn for a personal referral to AI/ML openings in his network.", perks: ['Personal Referral', 'Direct Intro', 'AI/ML Roles', 'India Remote'], url: 'https://www.linkedin.com/in/vemunoori-ramana-41b86b198', badge: 'Connect with Me', badgeType: 'recommended', category: 'jobs', order: 1 }
    ]);
    console.log('✅ Referrals seeded');
  }

  // ── Portfolio content ───────────────────────────────────
  const portCount = await Portfolio.countDocuments();
  if (portCount === 0) {
    await Portfolio.insertMany([
      { section: 'hero', data: { name: 'Ramana Vemunoori', tagline: 'AI & Data Science professional specializing in prompt engineering, LLM fine-tuning data, and multi-modal AI annotation.', stats: [{ num: '2+', label: 'Years Experience' }, { num: '5+', label: 'AI Projects' }, { num: '4', label: 'Annotation Domains' }] } },
      { section: 'experience', data: [{ company: 'Centific Global Technologies India Pvt. Ltd.', role: 'Prompt Engineer', type: 'Contract · Remote', period: 'Apr 2024 – Present', points: ['Core contributor to the Apple LLM Project.', 'Designed diverse SFT prompt-response pairs across 15+ task categories.', 'Authored multi-turn conversation datasets for LLM training.', 'Applied safety taxonomy frameworks across all task categories.'], tags: ['Prompt Engineering', 'LLM Fine-Tuning', 'SFT Data', 'Python', 'PyTorch', 'NLP'] }, { company: 'Centific / Oneforma Platform', role: 'AI Annotation Specialist', type: 'Freelance · Remote', period: '2024 – Present', points: ['Siri Audio Annotation (Apple Cricket Part 2).', 'OCR – Latin Script & Boxing/Transcription annotation.', 'Hindi/Marathi Devanagari handwriting annotation.', 'Baseball broadcast image annotation.'], tags: ['Audio Annotation', 'OCR', 'Image Labeling', 'Handwriting', 'Data Labeling'] }] },
      { section: 'skills', data: [{ icon: '🧠', name: 'AI & Machine Learning', items: ['Prompt Engineering', 'LLM Fine-Tuning', 'SFT Data', 'NLP', 'Model Evaluation'] }, { icon: '⚙️', name: 'ML Frameworks', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'Pandas', 'NumPy'] }, { icon: '💻', name: 'Programming', items: ['Python', 'Java', 'JavaScript', 'SQL', 'HTML/CSS'] }, { icon: '🏷️', name: 'Data Annotation', items: ['Audio/Speech', 'OCR', 'Image/Video', 'Handwriting', 'RLHF/RLAIF'] }, { icon: '🔧', name: 'Backend & Tools', items: ['Spring Boot', 'MongoDB', 'REST APIs', 'Flask', 'Git'] }, { icon: '🎯', name: 'Methodologies', items: ['Agile/Scrum', 'Safety Taxonomy', 'Eval Frameworks', 'KaTeX/LaTeX'] }] },
      { section: 'projects', data: [{ num: '01', title: 'Online Payments Fraud Detection', desc: 'ML pipeline detecting fraud using Decision Tree, Random Forest, SVM, XGBoost. Flask app deployed on IBM Cloud.', tags: ['Python', 'scikit-learn', 'XGBoost', 'Flask', 'IBM Cloud'] }, { num: '02', title: 'MANA – Home-Cooked Food Marketplace', desc: 'Full-stack platform connecting home cooks with consumers. React + Spring Boot + MongoDB.', tags: ['React', 'Spring Boot', 'MongoDB', 'Figma'] }, { num: '03', title: 'Apple LLM SFT Dataset', desc: 'Contributed to enterprise-scale SFT dataset for Apple LLM. Thousands of prompt-response pairs across 15+ task categories.', tags: ['Prompt Engineering', 'SFT', 'NLP', 'Apple AI'] }] },
      { section: 'annotation', data: [{ client: 'Apple · Centific', title: '🎙️ Siri Audio Annotation (Cricket Part 2)', desc: 'Time-series spectrogram annotation with Post-ITN transcription.' }, { client: 'Oneforma · OCR Project', title: '📝 Latin Script OCR & Transcription', desc: 'Character-level annotation for OCR model training.' }, { client: 'Oneforma · NLP Project', title: '🔤 Hindi/Marathi Handwriting', desc: 'Devanagari character-level annotation with shirorekha marking.' }, { client: 'Oneforma · Sports AI', title: '⚾ Baseball Broadcast Annotation', desc: 'Bounding-box labeling and player role identification.' }] },
      { section: 'contact', data: { email: 'vemunooriramana0602@gmail.com', phone: '+91 8499882843', location: 'Hyderabad, Telangana, India', linkedin: 'https://www.linkedin.com/in/vemunoori-ramana-41b86b198', github: 'https://github.com/Ve0602' } },
      { section: 'resume', data: { pdfUrl: '', email: 'vemunooriramana0602@gmail.com', phone: '+91 8499882843', location: 'Hyderabad, Telangana, India', linkedin: 'https://www.linkedin.com/in/vemunoori-ramana-41b86b198', github: 'https://github.com/Ve0602' } },
      { section: 'freelance', data: { email: 'vemunooriramana0602@gmail.com', linkedin: 'https://www.linkedin.com/in/vemunoori-ramana-41b86b198', subheadline: 'Freelance AI/Data Science expert and Full Stack developer available for projects, contracts, and consulting.', stats: [{ value: '2+', label: 'Years Experience' }, { value: '5+', label: 'Projects Done' }, { value: '100%', label: 'Client Focused' }], services: [{ icon: '🤖', title: 'AI Prompt Engineering', color: '#00d4ff', popular: true, description: 'Expert prompt engineering for LLMs, SFT data creation, RLHF, and AI model fine-tuning.', includes: ['Custom prompt design', 'SFT training data', 'AI model evaluation', 'Safety taxonomy', 'Multi-turn datasets'], price: '₹500/hr', priceNote: 'or fixed project price' }, { icon: '🏷️', title: 'Data Annotation', color: '#7c3aed', description: 'High-quality AI training data annotation across audio, OCR, image, and handwriting domains.', includes: ['Audio/speech annotation', 'OCR & handwriting', 'Image & video labeling', 'Quality assurance'], price: '₹400/hr', priceNote: 'or per-task pricing' }, { icon: '💻', title: 'Full Stack Web Dev', color: '#10b981', description: 'End-to-end web apps using React, Node.js, MongoDB with authentication and admin panels.', includes: ['React frontend', 'Node.js backend', 'MongoDB design', 'REST APIs', 'Vercel/Render deploy'], price: '₹600/hr', priceNote: 'or fixed project price' }], whyMe: [{ icon: '🎯', title: 'Real AI Experience', desc: 'Worked on actual Apple LLM project' }, { icon: '⚡', title: 'Fast Delivery', desc: 'On-time with clear communication' }, { icon: '🔒', title: 'NDA Friendly', desc: 'Happy to sign NDAs' }, { icon: '🌍', title: 'Remote Ready', desc: 'Experienced with global remote teams' }] } }
    ]);
    console.log('✅ Portfolio content seeded');
  }
};
