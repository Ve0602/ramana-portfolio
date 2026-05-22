const User = require('../models/User');
const Brand = require('../models/Brand');
const Service = require('../models/Service');

module.exports = async function seed() {
  // Admin
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

  // Brand settings
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

  // Services for home dashboard
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      { title: 'Vemunoori Collections', subtitle: 'Fashion Boutique', description: 'Kids dresses, women jackets, sarees and custom tailoring by expert designers', icon: '👗', color: '#d4a853', link: '/shop', badge: 'New', category: 'shop', order: 1 },
      { title: 'Tailoring Services', subtitle: 'Custom Stitching', description: 'Professional tailoring for all occasions — bridal, casual, formal and kids wear', icon: '🧵', color: '#e91e8c', link: '/shop?cat=tailoring', category: 'shop', order: 2 },
      { title: 'Computer & Digital', subtitle: 'Tech Services', description: 'Computer work, graphic designs, and digital services for your business needs', icon: '💻', color: '#00d4ff', link: '/shop?cat=computer', category: 'service', order: 3 },
      { title: 'Teaching & Training', subtitle: 'Learn Tailoring', description: 'Learn professional tailoring from scratch — classes for beginners and advanced', icon: '📚', color: '#7c3aed', link: '/shop?cat=teaching', category: 'service', order: 4 },
      { title: 'AI Portfolio', subtitle: 'Ramana\'s Work', description: 'AI & Data Science professional portfolio — Prompt Engineer, ML Annotator', icon: '🤖', color: '#10b981', link: '/portfolio', category: 'portfolio', order: 5 },
      { title: 'Freelance Services', subtitle: 'Hire Ramana', description: 'Hire for AI prompt engineering, data annotation, and full stack web development', icon: '🎯', color: '#f59e0b', link: '/freelance', category: 'portfolio', order: 6 },
      { title: 'Job Referrals', subtitle: 'AI Job Links', description: 'Access exclusive referral links to top AI annotation and data science platforms', icon: '🔗', color: '#6366f1', link: '/referrals', category: 'portfolio', order: 7 },
      { title: 'Resume / CV', subtitle: 'Download Resume', description: 'View and download Ramana\'s professional AI & Data Science resume', icon: '📄', color: '#14b8a6', link: '/resume', category: 'portfolio', order: 8 },
    ]);
    console.log('✅ Services seeded');
  }
};
