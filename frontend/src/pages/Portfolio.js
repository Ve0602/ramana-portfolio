import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Portfolio() {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios.get(`${API}/api/portfolio`).then(r => setData(r.data)).catch(() => setData(defaultData));
  }, []);
  const d = data || defaultData;

  return (
    <div>
      {/* HERO */}
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', padding:'100px 60px 60px', position:'relative', overflow:'hidden', background:'var(--bg)' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 60% 40%,rgba(0,212,255,0.07) 0%,transparent 70%),radial-gradient(ellipse 50% 50% at 20% 80%,rgba(124,58,237,0.08) 0%,transparent 60%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' }} />
        <div style={{ maxWidth:700, position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:40, padding:'6px 16px', fontSize:13, color:'var(--accent)', marginBottom:28 }}>
            <span style={{ width:8, height:8, background:'var(--accent)', borderRadius:'50%', display:'inline-block', animation:'pulse 2s infinite' }} />
            🤖 Available for AI & Data Science Roles
          </div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(42px,6vw,76px)', fontWeight:800, lineHeight:1.05, marginBottom:20 }}>
            {d.hero?.name?.split(' ')[0]}<br /><span style={{ color:'var(--accent)' }}>{d.hero?.name?.split(' ')[1]}</span>
          </h1>
          <p style={{ fontSize:18, color:'var(--muted)', lineHeight:1.7, maxWidth:560, marginBottom:36, fontWeight:300 }}>{d.hero?.tagline}</p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:56 }}>
            <a href="mailto:vemunooriramana0602@gmail.com" style={btnPrimary}>✉️ Email Me</a>
            <a href="https://github.com/Ve0602" target="_blank" rel="noreferrer" style={btnSecondary}>🐙 GitHub</a>
            <a href="https://www.linkedin.com/in/vemunoori-ramana-41b86b198" target="_blank" rel="noreferrer" style={btnSecondary}>💼 LinkedIn</a>
            <Link to="/referrals" style={{ ...btnSecondary, background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.25)', color:'var(--accent)' }}>🔗 Job Referrals</Link>
          </div>
          <div style={{ display:'flex', gap:40 }}>
            {(d.hero?.stats || []).map(s => (
              <div key={s.label} style={{ borderLeft:'2px solid var(--accent)', paddingLeft:16 }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:28, fontWeight:800, color:'var(--accent)' }}>{s.num}</div>
                <div style={{ fontSize:12, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXPERIENCE */}
      <div className="psec" id="experience" style={{ background:'var(--surface)' }}>
        <div className="section-label">Career</div>
        <div className="section-title">Professional Experience</div>
        <div style={{ position:'relative', paddingLeft:28, borderLeft:'2px solid transparent', backgroundImage:'linear-gradient(var(--surface),var(--surface)),linear-gradient(to bottom,var(--accent),var(--accent2))', backgroundOrigin:'border-box', backgroundClip:'padding-box,border-box' }}>
          {(d.experience || []).map((exp, i) => (
            <div key={i} style={{ position:'relative', marginBottom:44, paddingLeft:28 }}>
              <div style={{ position:'absolute', left:-37, top:4, width:16, height:16, background:i===0?'var(--accent)':'var(--accent2)', borderRadius:'50%', border:'3px solid var(--surface)', boxShadow:`0 0 12px ${i===0?'rgba(0,212,255,0.5)':'rgba(124,58,237,0.5)'}` }} />
              <div style={card}>
                <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:6 }}>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17 }}>{exp.company}</div>
                  <div style={{ background:'rgba(0,212,255,0.1)', color:'var(--accent)', fontSize:12, padding:'4px 12px', borderRadius:20 }}>{exp.period}</div>
                </div>
                <div style={{ color:'#a78bfa', fontWeight:600, fontSize:14, marginBottom:14 }}>{exp.role} · {exp.type}</div>
                <ul style={{ paddingLeft:18 }}>
                  {exp.points.map((p, j) => <li key={j} style={{ color:'#9ca3af', fontSize:14, marginBottom:7, lineHeight:1.6 }} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e8eaf0">$1</strong>') }} />)}
                </ul>
                <div className="tags">{exp.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SKILLS */}
      <div className="psec" id="skills" style={{ background:'var(--bg)' }}>
        <div className="section-label">Expertise</div>
        <div className="section-title">Technical Skills</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
          {(d.skills || []).map(s => (
            <div key={s.name} style={{ ...card, transition:'all 0.2s' }}>
              <div style={{ fontSize:26, marginBottom:12 }}>{s.icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15, marginBottom:10 }}>{s.name}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {s.items.map(item => <span key={item} style={{ background:'rgba(0,212,255,0.07)', border:'1px solid rgba(0,212,255,0.15)', color:'#94d8e8', fontSize:11, padding:'3px 10px', borderRadius:20 }}>{item}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROJECTS */}
      <div className="psec" id="projects" style={{ background:'var(--surface)' }}>
        <div className="section-label">Work</div>
        <div className="section-title">Featured Projects</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
          {(d.projects || []).map(p => (
            <div key={p.num} style={{ ...card, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,var(--accent),var(--accent2))' }} />
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:42, fontWeight:800, color:'rgba(0,212,255,0.08)', position:'absolute', top:16, right:24 }}>{p.num}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:18, marginBottom:12 }}>{p.title}</div>
              <p style={{ color:'#9ca3af', fontSize:14, lineHeight:1.7, marginBottom:16 }}>{p.desc}</p>
              <div className="tags">{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ANNOTATION */}
      <div className="psec" id="annotation" style={{ background:'var(--bg)' }}>
        <div className="section-label">Annotation Expertise</div>
        <div className="section-title">AI Data Annotation Projects</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
          {(d.annotation || []).map(a => (
            <div key={a.title} style={{ ...card, borderTop:'3px solid var(--accent2)' }}>
              <div style={{ fontSize:12, color:'var(--accent)', fontWeight:600, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>{a.client}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15, marginBottom:10 }}>{a.title}</div>
              <p style={{ color:'#9ca3af', fontSize:13.5, lineHeight:1.6 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <div className="psec" id="contact" style={{ background:'var(--surface)', textAlign:'center' }}>
        <div className="section-label">Connect</div>
        <div className="section-title">Let's Work Together</div>
        <div style={{ maxWidth:600, margin:'0 auto', ...card, padding:48 }}>
          <p style={{ color:'var(--muted)', fontSize:16, lineHeight:1.7, marginBottom:32 }}>I'm actively looking for AI & Data Science opportunities — prompt engineering, LLM data annotation, evaluation, and ML roles. Available for remote full-time engagements.</p>
          <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
            <a href={`mailto:${d.contact?.email}`} style={contactBtn}>✉️ Email Me</a>
            <a href={d.contact?.linkedin} target="_blank" rel="noreferrer" style={contactBtn}>💼 LinkedIn</a>
            <a href={d.contact?.github} target="_blank" rel="noreferrer" style={contactBtn}>🐙 GitHub</a>
            <Link to="/referrals" style={contactBtn}>🔗 Job Referrals</Link>
          </div>
          <p style={{ marginTop:20, fontSize:13, color:'#4b5563' }}>📍 {d.contact?.location} · Open to Remote · {d.contact?.phone}</p>
        </div>
      </div>

      <footer style={{ padding:'24px 60px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <p style={{ color:'var(--muted)', fontSize:13 }}>© 2026 Ramana Vemunoori · AI & Data Science Professional</p>
        <Link to="/referrals" style={{ color:'var(--muted)', fontSize:13 }}>🔗 Job Referrals</Link>
      </footer>

      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(1.4);}}`}</style>
    </div>
  );
}

const card = { background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:'24px 28px' };
const btnPrimary = { background:'var(--accent)', color:'#000', padding:'13px 24px', borderRadius:8, fontWeight:700, fontSize:14 };
const btnSecondary = { background:'transparent', color:'var(--text)', padding:'13px 24px', borderRadius:8, fontWeight:500, fontSize:14, border:'1px solid var(--border)' };
const contactBtn = { display:'flex', alignItems:'center', gap:8, background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', color:'var(--accent)', padding:'12px 20px', borderRadius:8, fontSize:14, fontWeight:500 };

const defaultData = {
  hero: { name: 'Ramana Vemunoori', tagline: 'AI & Data Science professional specializing in prompt engineering, LLM fine-tuning data, and multi-modal AI annotation.', stats: [{ num:'2+', label:'Years Experience' }, { num:'5+', label:'AI Projects' }, { num:'4', label:'Annotation Domains' }] },
  experience: [], skills: [], projects: [], annotation: [],
  contact: { email:'vemunooriramana0602@gmail.com', phone:'+91 8499882843', location:'Hyderabad, Telangana, India', linkedin:'https://www.linkedin.com/in/vemunoori-ramana-41b86b198', github:'https://github.com/Ve0602' }
};
