import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function JobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platforms, setPlatforms] = useState([]);
  const [activePlatform, setActivePlatform] = useState('all');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('jobs'); // jobs | referrals | register

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/freelance/jobs?limit=50`),
      axios.get(`${API}/api/referrals`),
      axios.get(`${API}/api/freelance/jobs/platforms`),
    ]).then(([j, r, p]) => {
      setJobs(j.data);
      setReferrals(r.data);
      setPlatforms(p.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter(j => {
    const matchPlatform = activePlatform === 'all' || j.platform === activePlatform;
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || (j.description || '').toLowerCase().includes(search.toLowerCase());
    return matchPlatform && matchSearch;
  });

  return (
    <div style={{ background:'#0a0a0a', minHeight:'100vh', fontFamily:'DM Sans,sans-serif', paddingTop:54 }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1a0800,#0d0d0d)', padding:'32px 40px', borderBottom:'1px solid rgba(212,168,83,0.15)' }}>
        <button onClick={() => navigate('/freelance')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:13, marginBottom:12, fontFamily:'DM Sans,sans-serif' }}>← Back to Freelance</button>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'clamp(22px,4vw,38px)', color:'#fff', marginBottom:6 }}>
          💼 Jobs & <span style={{ color:'#d4a853' }}>Referral Links</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:14 }}>Auto-updated job listings + exclusive referral links from top AI platforms</p>
      </div>

      {/* Tabs */}
      <div style={{ padding:'0 40px', background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:0 }}>
        {[['jobs',`💼 Job Listings (${jobs.length})`],['referrals',`🔗 Referral Links (${referrals.length})`],['register','👤 Register as Freelancer']].map(([v, l]) => (
          <button key={v} onClick={() => setActiveTab(v)} style={{ background:'none', border:'none', padding:'14px 20px', fontSize:13, fontWeight:600, color: activeTab===v ? '#d4a853' : 'rgba(255,255,255,0.4)', borderBottom: activeTab===v ? '2px solid #d4a853' : '2px solid transparent', cursor:'pointer', fontFamily:'DM Sans,sans-serif', whiteSpace:'nowrap' }}>{l}</button>
        ))}
      </div>

      <div style={{ padding:'28px 40px' }}>

        {/* ── JOBS TAB ── */}
        {activeTab === 'jobs' && (
          <div>
            {/* Search + filter */}
            <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="🔍 Search jobs by title or keyword..."
                style={{ flex:1, minWidth:200, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', color:'#fff', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif' }}
              />
              <select value={activePlatform} onChange={e => setActivePlatform(e.target.value)} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', color:'#fff', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif' }}>
                <option value="all">All Platforms</option>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign:'center', color:'#d4a853', padding:60, fontSize:16 }}>Loading jobs...</div>
            ) : filteredJobs.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px' }}>
                <div style={{ fontSize:48, marginBottom:14 }}>🔄</div>
                <h3 style={{ fontFamily:'Syne,sans-serif', color:'#fff', marginBottom:8 }}>Jobs loading from RSS feeds...</h3>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginBottom:16 }}>Jobs auto-sync every 6 hours. Check back soon or browse referral links!</p>
                <button onClick={() => setActiveTab('referrals')} style={{ background:'#d4a853', color:'#000', border:'none', borderRadius:8, padding:'11px 24px', fontWeight:700, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>View Referral Links →</button>
              </div>
            ) : (
              <div style={{ display:'grid', gap:14 }}>
                {filteredJobs.map(job => <JobCard key={job._id} job={job} />)}
              </div>
            )}
          </div>
        )}

        {/* ── REFERRALS TAB ── */}
        {activeTab === 'referrals' && (
          <div>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginBottom:20 }}>Apply through Ramana's personal referral links — this helps track referrals and may speed up your application.</p>
            {referrals.length === 0 ? (
              <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', padding:40 }}>No referral links yet. Check back soon!</div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:18 }}>
                {referrals.map(r => <RefCard key={r._id} r={r} />)}
              </div>
            )}
          </div>
        )}

        {/* ── REGISTER TAB ── */}
        {activeTab === 'register' && <FreelancerRegForm />}

      </div>
    </div>
  );
}

function JobCard({ job }) {
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'18px 20px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16, flexWrap:'wrap', transition:'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(212,168,83,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; }}>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <span style={{ fontSize:18 }}>{job.platformIcon || '💼'}</span>
          <span style={{ background:'rgba(212,168,83,0.1)', color:'#d4a853', fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:10 }}>{job.platform}</span>
          <span style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>{timeAgo(job.postedAt)}</span>
          {job.location && <span style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>📍 {job.location}</span>}
        </div>
        <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:'#fff', marginBottom:6 }}>{job.title}</h3>
        {job.company && <div style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:6 }}>🏢 {job.company}</div>}
        {job.description && <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, lineHeight:1.6, marginBottom:10 }}>{job.description.substring(0, 180)}{job.description.length > 180 ? '...' : ''}</p>}
        {job.tags?.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {job.tags.slice(0,5).map(t => <span key={t} style={{ background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', color:'#a78bfa', fontSize:11, padding:'2px 8px', borderRadius:10 }}>{t}</span>)}
          </div>
        )}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
        {job.salary && <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:15, color:'#d4a853' }}>{job.salary}</div>}
        <a href={job.referralUrl || job.url} target="_blank" rel="noreferrer"
          style={{ background:'linear-gradient(135deg,#d4a853,#b8860b)', color:'#000', padding:'9px 18px', borderRadius:8, fontWeight:700, fontSize:13, textDecoration:'none', textAlign:'center', whiteSpace:'nowrap' }}>
          Apply Now →
        </a>
        {job.referralUrl && job.referralUrl !== job.url && (
          <div style={{ fontSize:10, color:'rgba(212,168,83,0.6)', textAlign:'center' }}>via referral link</div>
        )}
      </div>
    </div>
  );
}

function RefCard({ r }) {
  const badgeColors = { work:'#00d4ff', hot:'#f87171', recommended:'#a78bfa' };
  const bc = badgeColors[r.badgeType] || '#d4a853';
  return (
    <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:13, padding:22, position:'relative', overflow:'hidden', transition:'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(212,168,83,0.3)'; e.currentTarget.style.transform='translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.transform='translateY(0)'; }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#d4a853,#b8860b)' }} />
      {r.badge && <div style={{ position:'absolute', top:12, right:12, background:`${bc}20`, border:`1px solid ${bc}40`, color:bc, fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:10, textTransform:'uppercase' }}>{r.badge}</div>}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
        <span style={{ fontSize:24 }}>{r.icon}</span>
        <div>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15, color:'#fff' }}>{r.platform}</div>
          <div style={{ fontSize:11, color:'#d4a853', textTransform:'uppercase', letterSpacing:1 }}>{r.type}</div>
        </div>
      </div>
      <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, lineHeight:1.6, marginBottom:12 }}>{r.description}</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
        {(r.perks||[]).map(p => <span key={p} style={{ background:'rgba(0,212,255,0.06)', border:'1px solid rgba(0,212,255,0.12)', color:'#7dd3fc', fontSize:11, padding:'2px 8px', borderRadius:12 }}>{p}</span>)}
      </div>
      <a href={r.url} target="_blank" rel="noreferrer" style={{ display:'block', background:'linear-gradient(135deg,#d4a853,#b8860b)', color:'#000', padding:'10px', borderRadius:8, fontWeight:700, fontSize:13, textDecoration:'none', textAlign:'center' }}>
        🚀 Apply Now →
      </a>
    </div>
  );
}

function FreelancerRegForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:'', email:'', phone:'', location:'', title:'', bio:'', skills:'', experience:'fresher', availability:'flexible', hourlyRate:'', platforms:'', linkedinUrl:'', githubUrl:'', portfolioUrl:'', interestedInReferrals:true });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const f = (k,v) => setForm(p => ({...p,[k]:v}));

  const submit = async () => {
    setLoading(true); setError('');
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean), platforms: form.platforms.split(',').map(s=>s.trim()).filter(Boolean) };
      await axios.post(`${API}/api/freelance/freelancers`, payload);
      setDone(true);
    } catch(e) { setError(e.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  if (done) return (
    <div style={{ textAlign:'center', padding:'60px 20px' }}>
      <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
      <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:24, color:'#fff', marginBottom:10 }}>Registration Successful!</h2>
      <p style={{ color:'rgba(255,255,255,0.5)', fontSize:15, lineHeight:1.7 }}>Your profile has been submitted. Ramana will review it and get back to you within 24 hours.</p>
    </div>
  );

  const steps = ['Personal Info', 'Professional', 'Platforms & Links'];

  return (
    <div style={{ maxWidth:600, margin:'0 auto' }}>
      <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#fff', marginBottom:6 }}>👤 Register as Freelancer</h2>
      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:24 }}>Share your profile to get matched with referral jobs and opportunities</p>

      {/* Step indicator */}
      <div style={{ display:'flex', gap:0, marginBottom:28 }}>
        {steps.map((s,i) => (
          <div key={s} style={{ flex:1, textAlign:'center' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background: step>i+1 ? '#d4a853' : step===i+1 ? 'linear-gradient(135deg,#d4a853,#b8860b)' : 'rgba(255,255,255,0.08)', border:`2px solid ${step>=i+1 ? '#d4a853' : 'rgba(255,255,255,0.15)'}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 6px', fontSize:13, fontWeight:700, color: step>=i+1 ? '#000' : 'rgba(255,255,255,0.4)', fontFamily:'Syne,sans-serif' }}>{step>i+1 ? '✓' : i+1}</div>
            <div style={{ fontSize:11, color: step===i+1 ? '#d4a853' : 'rgba(255,255,255,0.3)' }}>{s}</div>
            {i<steps.length-1 && <div style={{ position:'absolute', display:'none' }} />}
          </div>
        ))}
      </div>

      {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', color:'#f87171', fontSize:13, marginBottom:16 }}>{error}</div>}

      <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:24 }}>
        {step===1 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <FI label="Full Name *" value={form.name} onChange={v=>f('name',v)} required />
            <FI label="Email *" value={form.email} onChange={v=>f('email',v)} type="email" required />
            <FI label="Phone Number" value={form.phone} onChange={v=>f('phone',v)} />
            <FI label="Location" value={form.location} onChange={v=>f('location',v)} placeholder="City, Country" />
          </div>
        )}
        {step===2 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <FI label="Professional Title" value={form.title} onChange={v=>f('title',v)} placeholder="e.g. AI Prompt Engineer" />
            <FI label="Hourly Rate" value={form.hourlyRate} onChange={v=>f('hourlyRate',v)} placeholder="e.g. ₹500/hr" />
            <FI label="Skills (comma separated)" value={form.skills} onChange={v=>f('skills',v)} placeholder="Python, NLP, Annotation" span={2} />
            <FI label="Bio / About" value={form.bio} onChange={v=>f('bio',v)} textarea placeholder="Tell us about yourself..." span={2} />
            <div>
              <label style={ls}>Experience</label>
              <select value={form.experience} onChange={e=>f('experience',e.target.value)} style={is}>
                <option value="fresher">Fresher (0-1 yr)</option>
                <option value="1-2years">1-2 Years</option>
                <option value="3-5years">3-5 Years</option>
                <option value="5plus">5+ Years</option>
              </select>
            </div>
            <div>
              <label style={ls}>Availability</label>
              <select value={form.availability} onChange={e=>f('availability',e.target.value)} style={is}>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
                <option value="weekends">Weekends only</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
        )}
        {step===3 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <FI label="Platforms you work on (comma separated)" value={form.platforms} onChange={v=>f('platforms',v)} placeholder="Oneforma, Outlier, Mercor" span={2} />
            <FI label="LinkedIn URL" value={form.linkedinUrl} onChange={v=>f('linkedinUrl',v)} placeholder="https://linkedin.com/in/..." />
            <FI label="GitHub URL" value={form.githubUrl} onChange={v=>f('githubUrl',v)} placeholder="https://github.com/..." />
            <FI label="Portfolio URL" value={form.portfolioUrl} onChange={v=>f('portfolioUrl',v)} placeholder="https://..." />
            <div style={{ gridColumn:'1/-1', display:'flex', alignItems:'center', gap:12 }}>
              <button type="button" onClick={()=>f('interestedInReferrals',!form.interestedInReferrals)} style={{ width:44, height:24, borderRadius:12, border:'none', cursor:'pointer', background:form.interestedInReferrals?'#d4a853':'rgba(255,255,255,0.1)', position:'relative', flexShrink:0 }}>
                <span style={{ position:'absolute', top:2, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'all 0.2s', left:form.interestedInReferrals?22:2 }} />
              </button>
              <span style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>I'm interested in job referral opportunities</span>
            </div>
          </div>
        )}

        <div style={{ display:'flex', gap:10, marginTop:20 }}>
          {step>1 && <button onClick={()=>setStep(s=>s-1)} style={{ ...btnOutline }}>← Back</button>}
          {step<3
            ? <button onClick={()=>setStep(s=>s+1)} style={{ ...btnGold }}>Next →</button>
            : <button onClick={submit} disabled={loading} style={{ ...btnGold, opacity:loading?0.7:1 }}>{loading?'Submitting...':'🚀 Submit Profile'}</button>
          }
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
const btnGold = {background:'#d4a853',color:'#000',border:'none',borderRadius:8,padding:'11px 24px',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'DM Sans,sans-serif'};
const btnOutline = {background:'transparent',color:'rgba(255,255,255,0.5)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:8,padding:'11px 24px',fontWeight:600,fontSize:14,cursor:'pointer',fontFamily:'DM Sans,sans-serif'};
