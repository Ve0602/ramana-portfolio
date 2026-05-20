import { useEffect, useState } from 'react';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function FreelancePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/portfolio/freelance`)
      .then(r => setData(r.data))
      .catch(() => setData(defaultData));
  }, []);

  const d = data || defaultData;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '100px 60px 60px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="section-label">Available for Hire</div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
            {d.headline || <>Let's Build Something<br /><span style={{ color: 'var(--accent)' }}>Amazing Together</span></>}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 580, margin: '0 auto 32px', lineHeight: 1.7 }}>
            {d.subheadline || 'Freelance AI/Data Science expert and Full Stack developer available for projects, contracts, and consulting.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a href={`mailto:${d.email || 'vemunooriramana0602@gmail.com'}?subject=Freelance Enquiry`} style={{ background: 'var(--accent)', color: '#000', padding: '14px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              ✉️ Hire Me Now
            </a>
            <a href={d.linkedin || 'https://www.linkedin.com/in/vemunoori-ramana-41b86b198'} target="_blank" rel="noreferrer" style={{ background: 'transparent', color: 'var(--text)', padding: '14px 28px', borderRadius: 8, fontWeight: 500, fontSize: 15, textDecoration: 'none', border: '1px solid var(--border)' }}>
              💼 View LinkedIn
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 40 }}>
            {(d.stats || defaultData.stats).map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div style={{ marginBottom: 16 }}>
          <div className="section-label">What I Offer</div>
          <div className="section-title">Freelance Services</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24, marginBottom: 64 }}>
          {(d.services || defaultData.services).map((s, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.color || 'var(--accent)'}, var(--accent2))` }} />
              {s.popular && <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: 'var(--accent)', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>⭐ Popular</div>}
              <div style={{ fontSize: 36, marginBottom: 14 }}>{s.icon}</div>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{s.description}</p>
              <ul style={{ paddingLeft: 18, marginBottom: 20 }}>
                {(s.includes || []).map((item, j) => <li key={j} style={{ color: '#9ca3af', fontSize: 13, marginBottom: 5 }}>{item}</li>)}
              </ul>
              {s.price && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--accent)' }}>{s.price}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.priceNote || 'starting price'}</div>
                  </div>
                  <a href={`mailto:vemunooriramana0602@gmail.com?subject=Freelance: ${s.title}`} style={{ background: 'var(--accent)', color: '#000', padding: '9px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Get Quote</a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Why hire me */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px 48px', marginBottom: 48 }}>
          <div className="section-label">Why Me</div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 32 }}>Why Work With Me?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
            {(d.whyMe || defaultData.whyMe).map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{w.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{w.title}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.08),rgba(124,58,237,0.08))', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 16, padding: '48px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 12 }}>Ready to Start Your Project?</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>Let's discuss your requirements and build something great together.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a href={`mailto:${d.email || 'vemunooriramana0602@gmail.com'}?subject=Project Discussion`} style={{ background: 'var(--accent)', color: '#000', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              📧 Email Me
            </a>
            <a href={d.linkedin || 'https://www.linkedin.com/in/vemunoori-ramana-41b86b198'} target="_blank" rel="noreferrer" style={{ background: 'transparent', color: 'var(--text)', padding: '14px 32px', borderRadius: 8, fontWeight: 500, fontSize: 15, textDecoration: 'none', border: '1px solid var(--border)' }}>
              💼 LinkedIn
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

const defaultData = {
  email: 'vemunooriramana0602@gmail.com',
  linkedin: 'https://www.linkedin.com/in/vemunoori-ramana-41b86b198',
  subheadline: 'Freelance AI/Data Science expert and Full Stack developer available for projects, contracts, and consulting.',
  stats: [
    { value: '2+', label: 'Years Experience' },
    { value: '5+', label: 'Projects Done' },
    { value: '100%', label: 'Client Focused' }
  ],
  services: [
    {
      icon: '🤖', title: 'AI Prompt Engineering', color: '#00d4ff', popular: true,
      description: 'Expert prompt engineering for LLMs, SFT data creation, RLHF, and AI model fine-tuning. Proven experience with Apple LLM and other frontier AI projects.',
      includes: ['Custom prompt design & optimization', 'SFT training data creation', 'AI model evaluation & feedback', 'Safety taxonomy implementation', 'Multi-turn conversation datasets'],
      price: '₹500/hr', priceNote: 'or fixed project price'
    },
    {
      icon: '🏷️', title: 'Data Annotation & Labeling', color: '#7c3aed',
      description: 'High-quality AI training data annotation across audio, OCR, image, video, and handwriting domains. Expert-level precision for ML pipelines.',
      includes: ['Audio/speech annotation & transcription', 'OCR & handwriting annotation', 'Image & video labeling', 'Bounding box & classification', 'Quality assurance & review'],
      price: '₹400/hr', priceNote: 'or per-task pricing'
    },
    {
      icon: '💻', title: 'Full Stack Web Development', color: '#10b981',
      description: 'End-to-end web application development using React, Node.js, MongoDB. From portfolio sites to full-featured web apps with authentication and admin panels.',
      includes: ['React frontend development', 'Node.js + Express backend', 'MongoDB database design', 'REST API development', 'Deployment on Vercel/Render'],
      price: '₹600/hr', priceNote: 'or fixed project price'
    }
  ],
  whyMe: [
    { icon: '🎯', title: 'Real AI Experience', desc: 'Worked on actual Apple LLM project — not just theory' },
    { icon: '⚡', title: 'Fast Delivery', desc: 'On-time delivery with clear communication throughout' },
    { icon: '🔒', title: 'NDA Friendly', desc: 'Happy to sign NDAs for confidential projects' },
    { icon: '🌍', title: 'Remote Ready', desc: 'Experienced working remotely with global teams' },
    { icon: '📊', title: 'Quality First', desc: 'High precision and accuracy in every deliverable' },
    { icon: '🔄', title: 'Revisions Included', desc: 'Free revisions until you are 100% satisfied' }
  ]
};
