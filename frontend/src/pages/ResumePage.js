import { useEffect, useState } from 'react';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ResumePage() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/portfolio/resume`)
      .then(r => setResume(r.data))
      .catch(() => setResume(defaultResume))
      .finally(() => setLoading(false));
  }, []);

  const r = resume || defaultResume;

  if (loading) return <Loader />;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '100px 60px 60px' }}>
      {/* Header */}
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
          <div>
            <div className="section-label">My Resume</div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800 }}>
              Ramana <span style={{ color: 'var(--accent)' }}>Vemunoori</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 15, marginTop: 8 }}>AI & Data Science Professional · Prompt Engineer · ML Annotator</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {r.pdfUrl && (
              <>
                <a href={r.pdfUrl} target="_blank" rel="noreferrer" style={btnPrimary}>👁️ View PDF</a>
                <a href={r.pdfUrl} download style={btnSecondary}>⬇️ Download</a>
              </>
            )}
            <button onClick={() => window.print()} style={btnSecondary}>🖨️ Print</button>
          </div>
        </div>

        {/* Resume Card */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>

          {/* Contact bar */}
          <div style={{ background: 'var(--surface)', padding: '16px 32px', display: 'flex', flexWrap: 'wrap', gap: 20, borderBottom: '1px solid var(--border)' }}>
            {[
              ['✉️', r.email || 'vemunooriramana0602@gmail.com', `mailto:${r.email}`],
              ['📞', r.phone || '+91 8499882843', `tel:${r.phone}`],
              ['💼', 'LinkedIn', r.linkedin || '#'],
              ['🐙', 'GitHub', r.github || '#'],
              ['📍', r.location || 'Hyderabad, India', null]
            ].map(([icon, label, href]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
                <span>{icon}</span>
                {href ? <a href={href} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>{label}</a> : <span>{label}</span>}
              </div>
            ))}
          </div>

          <div style={{ padding: '32px' }}>

            {/* Summary */}
            <Section title="Professional Summary">
              <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.8, background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', borderLeft: '3px solid var(--accent)', padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>
                {r.summary || 'AI and Data Science professional with 2+ years of hands-on experience in prompt engineering, LLM fine-tuning data creation, and multi-modal AI annotation. Proven track record contributing to large-scale AI training projects for leading technology companies, including Apple\'s LLM initiative.'}
              </p>
            </Section>

            {/* Experience */}
            <Section title="Professional Experience">
              {(r.experience || defaultResume.experience).map((exp, i) => (
                <div key={i} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < (r.experience || defaultResume.experience).length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{exp.company}</div>
                    <div style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent)', fontSize: 12, padding: '3px 10px', borderRadius: 20 }}>{exp.period}</div>
                  </div>
                  <div style={{ color: '#a78bfa', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{exp.role} · {exp.type}</div>
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {exp.points.map((p, j) => (
                      <li key={j} style={{ color: '#9ca3af', fontSize: 13.5, marginBottom: 5, lineHeight: 1.6 }}>{p}</li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                    {exp.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              ))}
            </Section>

            {/* Skills */}
            <Section title="Technical Skills">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
                {(r.skills || defaultResume.skills).map(s => (
                  <div key={s.name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{s.name}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {s.items.map(item => <span key={item} style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.15)', color: '#94d8e8', fontSize: 11, padding: '2px 8px', borderRadius: 12 }}>{item}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Education */}
            <Section title="Education">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,212,255,0.08)' }}>
                      {['Qualification', 'Institution', 'Board/University', 'Year', 'Score'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--accent)', fontWeight: 600, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(r.education || defaultResume.education).map((e, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px', color: 'var(--text)', fontWeight: 600 }}>{e.qual}</td>
                        <td style={{ padding: '10px 12px', color: '#9ca3af' }}>{e.institution}</td>
                        <td style={{ padding: '10px 12px', color: '#9ca3af' }}>{e.board}</td>
                        <td style={{ padding: '10px 12px', color: '#9ca3af' }}>{e.year}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--accent)', fontWeight: 700 }}>{e.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Certifications */}
            <Section title="Certifications & Training">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 8 }}>
                {(r.certifications || defaultResume.certifications).map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
                    <span style={{ color: 'var(--accent)', fontSize: 16 }}>▸</span>
                    <span style={{ fontSize: 13, color: '#9ca3af' }}>{c}</span>
                  </div>
                ))}
              </div>
            </Section>

          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <a href="mailto:vemunooriramana0602@gmail.com" style={btnPrimary}>✉️ Hire Me</a>
          <a href="/freelance" style={btnSecondary}>💼 View Freelance Services</a>
          {r.pdfUrl && <a href={r.pdfUrl} download style={btnSecondary}>⬇️ Download Resume</a>}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid var(--accent2)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 4, height: 20, background: 'var(--accent)', borderRadius: 2, display: 'inline-block' }} />
        {title}
      </div>
      {children}
    </div>
  );
}

const btnPrimary = { background: 'var(--accent)', color: '#000', padding: '12px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 };
const btnSecondary = { background: 'transparent', color: 'var(--text)', padding: '12px 24px', borderRadius: 8, fontWeight: 500, fontSize: 14, textDecoration: 'none', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' };
const Loader = () => <div style={{ paddingTop: 120, textAlign: 'center', color: 'var(--accent)', fontSize: 18 }}>Loading resume...</div>;

const defaultResume = {
  pdfUrl: '',
  email: 'vemunooriramana0602@gmail.com',
  phone: '+91 8499882843',
  location: 'Hyderabad, Telangana, India',
  linkedin: 'https://www.linkedin.com/in/vemunoori-ramana-41b86b198',
  github: 'https://github.com/Ve0602',
  summary: 'AI and Data Science professional with 2+ years of hands-on experience in prompt engineering, LLM fine-tuning data creation, and multi-modal AI annotation. Proven track record contributing to large-scale AI training projects for leading technology companies, including Apple\'s LLM initiative.',
  experience: [
    { company: 'Centific Global Technologies India Pvt. Ltd.', role: 'Prompt Engineer', type: 'Contract · Remote', period: 'Apr 2024 – Present', points: ['Core contributor to the Apple LLM Project — developing fine-tuning data for Apple\'s advanced AI language model.', 'Designed diverse SFT prompt-response pairs across coding, math, summarization, Q&A, tool use, and safety categories.', 'Authored multi-turn conversation datasets for LLM training.', 'Applied safety taxonomy frameworks across all task categories.'], tags: ['Prompt Engineering', 'LLM Fine-Tuning', 'SFT Data', 'Python', 'PyTorch', 'NLP'] },
    { company: 'Centific / Oneforma Platform', role: 'AI Annotation Specialist', type: 'Freelance · Remote', period: '2024 – Present', points: ['Siri Audio Annotation (Apple Cricket Part 2): Timestamped labeling with Post-ITN transcription.', 'OCR – Latin Script & Boxing/Transcription annotation.', 'Hindi/Marathi Devanagari handwriting annotation.', 'Baseball broadcast image annotation and bounding-box labeling.'], tags: ['Audio Annotation', 'OCR', 'Image Labeling', 'Handwriting', 'Data Labeling'] }
  ],
  skills: [
    { name: 'AI & ML', items: ['Prompt Engineering', 'LLM Fine-Tuning', 'SFT Data', 'NLP', 'Model Evaluation'] },
    { name: 'Frameworks', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'Pandas', 'NumPy'] },
    { name: 'Programming', items: ['Python', 'Java', 'JavaScript', 'SQL', 'HTML/CSS'] },
    { name: 'Annotation', items: ['Audio/Speech', 'OCR', 'Image/Video', 'Handwriting', 'RLHF'] },
    { name: 'Backend', items: ['Spring Boot', 'MongoDB', 'REST APIs', 'Flask', 'Git'] },
    { name: 'Tools', items: ['Figma', 'MS Office', 'Agile/Scrum', 'KaTeX/LaTeX'] }
  ],
  education: [
    { qual: 'B.Tech (CSE)', institution: 'Vaagdevi Engineering College, Warangal', board: 'JNTUH', year: 2023, score: '6.69 CGPA' },
    { qual: 'Intermediate', institution: 'SR Junior College, Hyderabad', board: 'Board of Intermediate', year: 2019, score: '8.8' },
    { qual: 'SSC', institution: 'Ekashila e-Techno School, Warangal', board: 'BSE Telangana', year: 2017, score: '9.5' }
  ],
  certifications: [
    'Junior Full Stack Java Developer – Tata Strive',
    'Applied Data Science Internship – Smart Intenz',
    'Python – Besant Technologies',
    'Java – Besant Technologies',
    'Fundamentals of DevOps – Udemy (In Progress)',
    'Time Management & Productivity – Udemy',
    'PowerPoint Presentation – Udemy',
    'Excel – Udemy'
  ]
};
