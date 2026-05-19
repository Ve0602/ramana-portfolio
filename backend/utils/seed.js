const User = require('../models/User');
const Referral = require('../models/Referral');
const Portfolio = require('../models/Portfolio');

module.exports = async function seed() {
  // Create admin if not exists
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

  // Seed referrals if empty
  const refCount = await Referral.countDocuments();
  if (refCount === 0) {
    await Referral.insertMany([
      {
        platform: 'Oneforma (Centific)',
        type: 'AI Data Annotation',
        icon: '🌐',
        description: 'The platform Ramana currently works on. Offers AI annotation projects including audio labeling, OCR, handwriting, image annotation, and NLP tasks for top tech companies like Apple. Flexible freelance work from home.',
        perks: ['Remote', 'Flexible Hours', 'Multiple Projects', 'Weekly Pay'],
        url: 'https://www.oneforma.com',
        badge: 'I Work Here',
        badgeType: 'work',
        category: 'annotation',
        order: 1
      },
      {
        platform: 'Mercor',
        type: 'AI Expert Roles – W2 Employment',
        icon: '🤖',
        description: 'Premium platform connecting AI/ML experts with leading AI labs. Full-time W-2 positions for prompt engineers, data scientists, and ML practitioners at frontier AI companies. 40 hrs/week, remote.',
        perks: ['Full-Time W-2', 'AI Labs', 'Remote India', '40hrs/week'],
        url: 'https://mercor.com/apply',
        badge: 'Hiring Now',
        badgeType: 'hot',
        category: 'annotation',
        order: 2
      },
      {
        platform: 'Outlier AI',
        type: 'AI Training Data',
        icon: '📊',
        description: 'Leading AI data platform offering RLHF, annotation, and expert AI trainer roles. Great for those with expertise in coding, math, science, or writing. Competitive pay.',
        perks: ['Remote', 'Freelance', 'Expert Tasks', 'Good Pay'],
        url: 'https://outlier.ai/for-ai-contributors',
        badge: 'Recommended',
        badgeType: 'recommended',
        category: 'annotation',
        order: 3
      },
      {
        platform: 'Appen',
        type: 'Data Annotation',
        icon: '💎',
        description: 'Global leader in AI training data. Annotation projects for speech, text, image, and video. Good for getting started in AI data work and building your annotation portfolio.',
        perks: ['Remote', 'Beginner Friendly', 'Multiple Languages', 'Flexible'],
        url: 'https://appen.com/join-our-crowd/',
        badge: '',
        badgeType: '',
        category: 'annotation',
        order: 4
      },
      {
        platform: 'Remotasks',
        type: 'AI Data Tasks',
        icon: '🔬',
        description: 'Task-based platform for AI data work. Good variety of annotation, tagging, and AI feedback tasks. Easy to get started and work on your own schedule.',
        perks: ['Remote', 'Flexible', 'Task-Based', 'No Experience Needed'],
        url: 'https://www.remotasks.com',
        badge: '',
        badgeType: '',
        category: 'annotation',
        order: 5
      },
      {
        platform: 'LinkedIn Network Referral',
        type: 'Direct Introduction',
        icon: '🔵',
        description: 'Connect with Ramana on LinkedIn for a personal referral to AI/ML openings in his network — especially for Prompt Engineer, AI Trainer, and Data Annotation roles.',
        perks: ['Personal Referral', 'Direct Intro', 'AI/ML Roles', 'India Remote'],
        url: 'https://www.linkedin.com/in/vemunoori-ramana-41b86b198',
        badge: 'Connect with Me',
        badgeType: 'recommended',
        category: 'jobs',
        order: 1
      }
    ]);
    console.log('✅ Referrals seeded');
  }

  // Seed portfolio if empty
  const portCount = await Portfolio.countDocuments();
  if (portCount === 0) {
    await Portfolio.insertMany([
      {
        section: 'hero',
        data: {
          name: 'Ramana Vemunoori',
          title: 'AI & Data Science Professional · Prompt Engineer · ML Annotator',
          tagline: 'AI & Data Science professional specializing in prompt engineering, LLM fine-tuning data, and multi-modal AI annotation. 2+ years building training data for frontier AI systems.',
          stats: [
            { num: '2+', label: 'Years Experience' },
            { num: '5+', label: 'AI Projects' },
            { num: '4', label: 'Annotation Domains' }
          ]
        }
      },
      {
        section: 'experience',
        data: [
          {
            company: 'Centific Global Technologies India Pvt. Ltd.',
            role: 'Prompt Engineer',
            type: 'Contract · Remote',
            period: 'Apr 2024 – Present',
            points: [
              'Core contributor to the Apple LLM Project — developing fine-tuning data for Apple\'s advanced AI language model powering Siri and digital assistant features.',
              'Designed diverse SFT prompt-response pairs across coding, math (KaTeX), summarization, extraction, Q&A, tool use, rewriting, and safety categories per LLM SFT Guidelines v2.1.7.',
              'Authored multi-turn conversation datasets demonstrating context retention, topic transitions, and error recovery for LLM training.',
              'Applied safety taxonomy frameworks to identify and handle harmful, controversial, and sensitive content across all task categories.',
              'Performed large-scale data pre-processing and quality assurance ensuring cleanliness, balance, and diversity of training corpora.'
            ],
            tags: ['Prompt Engineering','LLM Fine-Tuning','SFT Data','Python','PyTorch','TensorFlow','NLP','KaTeX','Pandas','NumPy']
          },
          {
            company: 'Centific / Oneforma Platform',
            role: 'Project Associate – AI Annotation Specialist',
            type: 'Freelance · Remote',
            period: '2024 – Present',
            points: [
              'Siri Audio Annotation (Apple Cricket Part 2): Timestamped labeling of user-Siri audio interactions with Post-ITN transcription.',
              'OCR – Latin Script & Boxing/Transcription: Character and word-level annotation for OCR model training.',
              'Hindi/Marathi Handwriting Annotation: Devanagari character-level annotation with shirorekha marking and illegibility flagging.',
              'Sports Image Annotation – Baseball: Bounding-box labeling, shot classification, and player role identification.'
            ],
            tags: ['Audio Annotation','OCR','Image Labeling','Speech Transcription','Handwriting Recognition','Data Labeling']
          }
        ]
      },
      {
        section: 'skills',
        data: [
          { icon: '🧠', name: 'AI & Machine Learning', items: ['Prompt Engineering','LLM Fine-Tuning','SFT Data','NLP','Agentic Workflows','Model Evaluation'] },
          { icon: '⚙️', name: 'ML Frameworks', items: ['PyTorch','TensorFlow','scikit-learn','Pandas','NumPy','XGBoost'] },
          { icon: '💻', name: 'Programming', items: ['Python','Java','JavaScript','SQL','HTML/CSS','Bootstrap'] },
          { icon: '🏷️', name: 'Data Annotation', items: ['Audio/Speech','OCR','Image/Video','Handwriting','Transcription','RLHF/RLAIF'] },
          { icon: '🔧', name: 'Backend & Tools', items: ['Spring Boot','MongoDB','REST APIs','Git/GitHub','Flask','Figma'] },
          { icon: '🎯', name: 'Methodologies', items: ['Agile/Scrum','Data Pre-processing','Safety Taxonomy','Eval Frameworks','KaTeX/LaTeX'] }
        ]
      },
      {
        section: 'projects',
        data: [
          {
            num: '01',
            title: 'Online Payments Fraud Detection',
            desc: 'End-to-end ML pipeline detecting credit/debit card fraud using Decision Tree, Random Forest, SVM, Extra Tree Classifier, and XGBoost. Full lifecycle including Flask app and IBM Cloud deployment.',
            tags: ['Python','scikit-learn','XGBoost','Flask','IBM Cloud','Pandas']
          },
          {
            num: '02',
            title: 'MANA – Home-Cooked Food Marketplace',
            desc: 'Full-stack platform connecting home cooks with consumers. React frontend, Spring Boot backend, MongoDB with microservices for payment and third-party APIs.',
            tags: ['React','Spring Boot','MongoDB','SQL','Figma','Microservices']
          },
          {
            num: '03',
            title: 'Apple LLM SFT Dataset',
            desc: 'Contributed to enterprise-scale supervised fine-tuning dataset for Apple\'s LLM. Thousands of high-quality prompt-response pairs across 15+ task categories.',
            tags: ['Prompt Engineering','SFT','NLP','Apple AI','Safety']
          }
        ]
      },
      {
        section: 'annotation',
        data: [
          { client: 'Apple · Centific', title: '🎙️ Siri Audio Annotation (Cricket Part 2)', desc: 'Time-series spectrogram annotation of user-Siri audio interactions with millisecond precision and Post-ITN transcription.' },
          { client: 'Oneforma · OCR Project', title: '📝 Latin Script OCR & Transcription', desc: 'Character-level and word-level annotation of handwritten Latin script for OCR and voice recognition model training.' },
          { client: 'Oneforma · NLP Project', title: '🔤 Hindi/Marathi Handwriting (Devanagari)', desc: 'Devanagari script annotation at character level with shirorekha marking, line segmentation, and illegibility flagging.' },
          { client: 'Oneforma · Sports AI', title: '⚾ Baseball Broadcast Annotation', desc: 'Image analysis and bounding-box annotation for baseball broadcast frames with player role labeling.' }
        ]
      },
      {
        section: 'contact',
        data: {
          email: 'vemunooriramana0602@gmail.com',
          phone: '+91 8499882843',
          location: 'Hyderabad, Telangana, India',
          linkedin: 'https://www.linkedin.com/in/vemunoori-ramana-41b86b198',
          github: 'https://github.com/Ve0602'
        }
      }
    ]);
    console.log('✅ Portfolio content seeded');
  }
};
