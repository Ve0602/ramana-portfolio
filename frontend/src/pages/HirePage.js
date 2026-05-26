import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PROJECT_TYPES = ['AI / Machine Learning','Web Development','Data Annotation','Graphic Design','Data Science','Tailoring / Fashion','Digital Marketing','Other'];
const BUDGETS = ['Under ₹5,000','₹5,000 – ₹15,000','₹15,000 – ₹50,000','₹50,000 – ₹1,00,000','₹1,00,000+','Let\'s discuss'];
const TIMELINES = ['Less than 1 week','1–2 weeks','2–4 weeks','1–2 months','3+ months','Flexible'];

export default function HirePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name:'', email:'', phone:'', company:'', country:'India', clientType:'individual',
    projectType:'', projectTitle:'', description:'', goals:'',
    budget:'', budgetType:'fixed', timeline:'', urgency:'normal', startDate:'',
    skills:[], extraNotes:'', references:'',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const STEPS = ['About You','Project Details','Budget & Timeline','Extras & Submit'];

  const submit = async () => {
    setLoading(true); setError('');
    try {
      await axios.post(`${API}/api/freelance/clients`, form);
      setDone(true);
    } catch(e) { setError(e.response?.data?.message || 'Submission failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const canNext = () => {
    if (step===1) return form.name && form.email;
    if (step===2) return form.projectType && form.projectTitle && form.description;
    if (step===3) return true;
    return true;
  };

  if (done) return (
    <div style={{ background:'#0a0a0a', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:40, paddingTop:100, fontFamily:'DM Sans,sans-serif' }}>
      <div style={{ textAlign:'center', maxWidth:500 }}>
        <div style={{ fontSize:64, marginBottom:20 }}>🎉</div>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:28, color:'#fff', marginBottom:12 }}>Enquiry Submitted!</h2>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:16, lineHeight:1.8, marginBottom:28 }}>
          Thank you! Ramana has received your project details and will respond within <strong style={{color:'#d4a853'}}>24 hours</strong> via email.
        </p>
        <div style={{ background:'rgba(212,168,83,0.08)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:12, padding:'20px 24px', marginBottom:24 }}>
          <p style={{ color:'#d4a853', fontWeight:700, marginBottom:6 }}>What happens next?</p>
          <div style={{ color:'rgba(255,255,255,0.5)', fontSize:14, lineHeight:2 }}>
            1. Ramana reviews your requirements<br/>
            2. You receive a detailed proposal<br/>
            3. Agree on scope & payment<br/>
            4. Project kicks off! 🚀
          </div>
        </div>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <a href={`https://wa.me/918499882843?text=Hi Ramana, I just submitted a project enquiry for: ${encodeURIComponent(form.projectTitle)}`} target="_blank" rel="noreferrer" style={{ background:'rgba(37,211,102,0.15)', border:'1px solid rgba(37,211,102,0.3)', color:'#25d366', padding:'12px 22px', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:14 }}>💬 WhatsApp Ramana</a>
          <button onClick={() => navigate('/freelance')} style={{ background:'#d4a853', color:'#000', border:'none', borderRadius:8, padding:'12px 22px', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>← Back to Freelance</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background:'#0a0a0a', minHeight:'100vh', fontFamily:'DM Sans,sans-serif', paddingTop:54 }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0a001a,#0d0d0d)', padding:'32px 40px', borderBottom:'1px solid rgba(99,102,241,0.2)' }}>
        <button onClick={() => navigate('/freelance')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:13, marginBottom:12, fontFamily:'DM Sans,sans-serif' }}>← Back to Freelance</button>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'clamp(22px,4vw,38px)', color:'#fff', marginBottom:6 }}>
          🚀 Hire <span style={{ color:'#6366f1' }}>Ramana Vemunoori</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:14 }}>Tell us about your project — we'll respond within 24 hours with a proposal</p>
      </div>

      <div style={{ maxWidth:680, margin:'0 auto', padding:'40px' }}>

        {/* Step indicator */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:32 }}>
          {STEPS.map((s,i) => (
            <div key={s} style={{ display:'flex', alignItems:'center', flex: i<STEPS.length-1 ? 1 : 'none' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background: step>i+1 ? '#d4a853' : step===i+1 ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.08)', border:`2px solid ${step>=i+1 ? (step>i+1?'#d4a853':'#6366f1') : 'rgba(255,255,255,0.15)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color: step>=i+1 ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily:'Syne,sans-serif' }}>
                  {step>i+1 ? '✓' : i+1}
                </div>
                <div style={{ fontSize:10, color: step===i+1 ? '#6366f1' : step>i+1 ? '#d4a853' : 'rgba(255,255,255,0.25)', whiteSpace:'nowrap' }}>{s}</div>
              </div>
              {i<STEPS.length-1 && <div style={{ flex:1, height:2, background: step>i+1 ? '#d4a853' : 'rgba(255,255,255,0.08)', margin:'0 8px 18px' }} />}
            </div>
          ))}
        </div>

        {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', color:'#f87171', fontSize:13, marginBottom:16 }}>{error}</div>}

        <div style={{ background:'#111', border:'1px solid rgba(99,102,241,0.2)', borderRadius:14, padding:'28px 28px' }}>

          {/* STEP 1 — About You */}
          {step===1 && (
            <div>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:18, color:'#fff', marginBottom:4 }}>👤 Tell us about yourself</h3>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:20 }}>Basic contact details so we can get back to you</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <FI label="Full Name *" value={form.name} onChange={v=>f('name',v)} required />
                <FI label="Email Address *" value={form.email} onChange={v=>f('email',v)} type="email" required />
                <FI label="Phone / WhatsApp" value={form.phone} onChange={v=>f('phone',v)} placeholder="+91 99999 99999" />
                <FI label="Company / Organization" value={form.company} onChange={v=>f('company',v)} placeholder="Leave blank if individual" />
                <FI label="Country" value={form.country} onChange={v=>f('country',v)} />
                <div>
                  <label style={ls}>I am a...</label>
                  <select value={form.clientType} onChange={e=>f('clientType',e.target.value)} style={is}>
                    <option value="individual">Individual</option>
                    <option value="startup">Startup</option>
                    <option value="company">Company</option>
                    <option value="agency">Agency</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Project Details */}
          {step===2 && (
            <div>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:18, color:'#fff', marginBottom:4 }}>📋 Project Details</h3>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:20 }}>The more details you share, the better proposal we can give you</p>
              <div style={{ display:'grid', gap:14 }}>
                <div>
                  <label style={ls}>Project Type *</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {PROJECT_TYPES.map(pt => (
                      <button key={pt} type="button" onClick={()=>f('projectType',pt)} style={{ padding:'8px 14px', borderRadius:20, border:`1px solid ${form.projectType===pt ? '#6366f1' : 'rgba(255,255,255,0.1)'}`, background: form.projectType===pt ? 'rgba(99,102,241,0.15)' : 'transparent', color: form.projectType===pt ? '#a78bfa' : 'rgba(255,255,255,0.4)', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>{pt}</button>
                    ))}
                  </div>
                </div>
                <FI label="Project Title *" value={form.projectTitle} onChange={v=>f('projectTitle',v)} placeholder="e.g. Build an AI chatbot for my e-commerce store" required />
                <FI label="Project Description *" value={form.description} onChange={v=>f('description',v)} textarea placeholder="Describe what you need in detail. What problem does this solve? What features do you want?" required />
                <FI label="Goals / Expected Outcomes" value={form.goals} onChange={v=>f('goals',v)} textarea placeholder="What does success look like for this project?" />
              </div>
            </div>
          )}

          {/* STEP 3 — Budget & Timeline */}
          {step===3 && (
            <div>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:18, color:'#fff', marginBottom:4 }}>💰 Budget & Timeline</h3>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:20 }}>This helps us give you an accurate proposal</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={ls}>Budget Range</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {BUDGETS.map(b => (
                      <button key={b} type="button" onClick={()=>f('budget',b)} style={{ padding:'8px 14px', borderRadius:20, border:`1px solid ${form.budget===b ? '#d4a853' : 'rgba(255,255,255,0.1)'}`, background: form.budget===b ? 'rgba(212,168,83,0.12)' : 'transparent', color: form.budget===b ? '#d4a853' : 'rgba(255,255,255,0.4)', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>{b}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={ls}>Payment Type</label>
                  <select value={form.budgetType} onChange={e=>f('budgetType',e.target.value)} style={is}>
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="monthly">Monthly Retainer</option>
                    <option value="discuss">Let's Discuss</option>
                  </select>
                </div>
                <div>
                  <label style={ls}>Urgency</label>
                  <select value={form.urgency} onChange={e=>f('urgency',e.target.value)} style={is}>
                    <option value="flexible">Flexible</option>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="asap">ASAP</option>
                  </select>
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={ls}>Preferred Timeline</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {TIMELINES.map(t => (
                      <button key={t} type="button" onClick={()=>f('timeline',t)} style={{ padding:'8px 14px', borderRadius:20, border:`1px solid ${form.timeline===t ? '#d4a853' : 'rgba(255,255,255,0.1)'}`, background: form.timeline===t ? 'rgba(212,168,83,0.12)' : 'transparent', color: form.timeline===t ? '#d4a853' : 'rgba(255,255,255,0.4)', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>{t}</button>
                    ))}
                  </div>
                </div>
                <FI label="Preferred Start Date (optional)" value={form.startDate} onChange={v=>f('startDate',v)} type="date" />
              </div>
            </div>
          )}

          {/* STEP 4 — Extras */}
          {step===4 && (
            <div>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:18, color:'#fff', marginBottom:4 }}>📎 Final Details</h3>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:20 }}>Almost done! Any additional information helps</p>
              <div style={{ display:'grid', gap:14 }}>
                <FI label="Reference Links (similar projects, designs you like)" value={form.references} onChange={v=>f('references',v)} textarea placeholder="https://example.com&#10;https://another-example.com" />
                <FI label="Extra Notes / Special Requirements" value={form.extraNotes} onChange={v=>f('extraNotes',v)} textarea placeholder="Anything else you'd like us to know..." />
                <div style={{ background:'rgba(212,168,83,0.06)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, padding:'16px 18px' }}>
                  <p style={{ color:'#d4a853', fontWeight:700, fontSize:14, marginBottom:8 }}>📋 Your Project Summary</p>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:2 }}>
                    <div><strong style={{color:'#fff'}}>Name:</strong> {form.name}</div>
                    <div><strong style={{color:'#fff'}}>Type:</strong> {form.projectType}</div>
                    <div><strong style={{color:'#fff'}}>Title:</strong> {form.projectTitle}</div>
                    <div><strong style={{color:'#fff'}}>Budget:</strong> {form.budget || 'To discuss'}</div>
                    <div><strong style={{color:'#fff'}}>Timeline:</strong> {form.timeline || 'Flexible'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'space-between' }}>
            <div>
              {step > 1 && <button onClick={()=>setStep(s=>s-1)} style={btnOutline}>← Back</button>}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              {step < 4
                ? <button onClick={()=>canNext() && setStep(s=>s+1)} style={{ ...btnPurple, opacity:canNext()?1:0.5, cursor:canNext()?'pointer':'not-allowed' }}>Next →</button>
                : <button onClick={submit} disabled={loading} style={{ ...btnPurple, opacity:loading?0.7:1 }}>{loading ? '⏳ Submitting...' : '🚀 Submit Enquiry'}</button>
              }
            </div>
          </div>
        </div>

        {/* Contact alternatives */}
        <div style={{ marginTop:20, textAlign:'center' }}>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13, marginBottom:10 }}>Prefer to talk directly?</p>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="mailto:vemunooriramana0602@gmail.com?subject=Project Enquiry" style={{ background:'rgba(212,168,83,0.1)', border:'1px solid rgba(212,168,83,0.2)', color:'#d4a853', padding:'9px 18px', borderRadius:8, textDecoration:'none', fontSize:13, fontWeight:600 }}>✉️ Email</a>
            <a href="https://wa.me/918499882843" target="_blank" rel="noreferrer" style={{ background:'rgba(37,211,102,0.1)', border:'1px solid rgba(37,211,102,0.2)', color:'#25d366', padding:'9px 18px', borderRadius:8, textDecoration:'none', fontSize:13, fontWeight:600 }}>💬 WhatsApp</a>
            <a href="https://www.linkedin.com/in/vemunoori-ramana-41b86b198" target="_blank" rel="noreferrer" style={{ background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', color:'#a78bfa', padding:'9px 18px', borderRadius:8, textDecoration:'none', fontSize:13, fontWeight:600 }}>💼 LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const FI = ({label,value,onChange,textarea,span,placeholder,type,required}) => (
  <div style={span===2?{gridColumn:'1/-1'}:{}}>
    <label style={ls}>{label}</label>
    {textarea
      ? <textarea value={value||''} onChange={e=>onChange(e.target.value)} rows={3} placeholder={placeholder} style={{...is,resize:'vertical'}} />
      : <input type={type||'text'} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required} style={is} />}
  </div>
);

const ls = {display:'block',fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:5};
const is = {width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:13,outline:'none',fontFamily:'DM Sans,sans-serif'};
const btnPurple = {background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:8,padding:'11px 26px',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'DM Sans,sans-serif'};
const btnOutline = {background:'transparent',color:'rgba(255,255,255,0.5)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:8,padding:'11px 24px',fontWeight:600,fontSize:14,cursor:'pointer',fontFamily:'DM Sans,sans-serif'};
