import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Referrals() {
  const { token } = useAuth();
  const [referrals, setReferrals]   = useState([]);
  const [autoJobs, setAutoJobs]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('referrals');
  const [platforms, setPlatforms]   = useState([]);
  const [activePlatform, setActivePlatform] = useState('all');
  const [search, setSearch]         = useState('');

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/referrals`),
      axios.get(`${API}/api/freelance/jobs?limit=60`),
      axios.get(`${API}/api/freelance/jobs/platforms`),
    ])
      .then(([r, j, p]) => {
        setReferrals(r.data || []);
        setAutoJobs(j.data || []);
        setPlatforms(p.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleReferralClick = async (ref) => {
    try {
      const { data } = await axios.post(
        `${API}/api/referrals/${ref._id}/click`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.open(data.url, '_blank');
    } catch {
      window.open(ref.url, '_blank');
    }
  };

  const filteredJobs = autoJobs.filter(j => {
    const matchP = activePlatform === 'all' || j.platform === activePlatform;
    const matchS = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.description || '').toLowerCase().includes(search.toLowerCase());
    return matchP && matchS;
  });

  const annotationRefs = referrals.filter(r => r.category === 'annotation');
  const jobRefs        = referrals.filter(r => r.category === 'jobs');

  return (
    <div style={{ background:'#0a0a0a', minHeight:'100vh', fontFamily:'DM Sans,sans-serif', paddingTop:54 }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1a0800,#0d0d0d)', padding:'40px 40px 0', borderBottom:'1px solid rgba(212,168,83,0.15)' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(212,168,83,0.1)', border:'1px solid rgba(212,168,83,0.25)', borderRadius:30, padding:'6px 16px', fontSize:12, color:'#d4a853', marginBottom:16, letterSpacing:2, textTransform:'uppercase' }}>
            ✨ Exclusive Referral Opportunities
          </div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'clamp(26px,4vw,46px)', color:'#fff', marginBottom:10 }}>
            Jobs & <span style={{ color:'#d4a853' }}>Referral Links</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, marginBottom:24, maxWidth:580, lineHeight:1.7 }}>
            Apply through Ramana's personal referral links for priority consideration, plus browse auto-updated live job listings.
          </p>

          {/* Stats */}
          <div style={{ display:'flex', gap:32, marginBottom:24, flexWrap:'wrap' }}>
            {[['🔗', referrals.length, 'Referral Links'],['💼', autoJobs.length, 'Live Jobs'],['🏢', platforms.length, 'Platforms'],['⚡','6h','Auto Sync']].map(([icon,num,label]) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                <div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:18, color:'#d4a853', lineHeight:1 }}>{num}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:0 }}>
            {[['referrals',`🔗 My Referral Links (${referrals.length})`],['jobs',`💼 Live Jobs (${autoJobs.length})`]].map(([id,label]) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{ background:'none', border:'none', padding:'12px 20px', fontSize:13, fontWeight:600, color: activeTab===id ? '#d4a853' : 'rgba(255,255,255,0.4)', borderBottom: activeTab===id ? '2px solid #d4a853' : '2px solid transparent', cursor:'pointer', fontFamily:'DM Sans,sans-serif', whiteSpace:'nowrap' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'32px 40px' }}>
        {loading ? (
          <div style={{ textAlign:'center', color:'#d4a853', padding:80, fontSize:16 }}>Loading...</div>
        ) : (
          <>
            {/* REFERRAL LINKS TAB */}
            {activeTab === 'referrals' && (
              <div>
                <div style={{ background:'rgba(212,168,83,0.06)', border:'1px solid rgba(212,168,83,0.15)', borderRadius:10, padding:'12px 16px', marginBottom:24, fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.7 }}>
                  💡 <strong style={{ color:'#d4a853' }}>Using these links</strong> helps Ramana earn referral bonuses and may give your application priority review.
                </div>

                {annotationRefs.length > 0 && (
                  <div style={{ marginBottom:36 }}>
                    <SecTitle title="🏷️ AI Annotation & Data Labeling" />
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:18 }}>
                      {annotationRefs.map(r => <RefCard key={r._id} r={r} onClick={() => handleReferralClick(r)} />)}
                    </div>
                  </div>
                )}

                {jobRefs.length > 0 && (
                  <div style={{ marginBottom:36 }}>
                    <SecTitle title="💼 AI & ML Job Opportunities" />
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:18 }}>
                      {jobRefs.map(r => <RefCard key={r._id} r={r} onClick={() => handleReferralClick(r)} />)}
                    </div>
                  </div>
                )}

                {referrals.length === 0 && (
                  <div style={{ textAlign:'center', padding:'60px 20px', color:'rgba(255,255,255,0.3)' }}>
                    <div style={{ fontSize:48, marginBottom:14 }}>🔗</div>
                    <p>No referral links yet. Check back soon!</p>
                  </div>
                )}

                {/* CTA to live jobs */}
                <div style={{ background:'rgba(99,102,241,0.06)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:12, padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14, marginTop:24 }}>
                  <div>
                    <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:'#fff', marginBottom:4 }}>💼 Want to browse live job listings?</div>
                    <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13 }}>{autoJobs.length} jobs auto-updated every 6 hours</p>
                  </div>
                  <button onClick={() => setActiveTab('jobs')} style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', border:'none', borderRadius:8, padding:'11px 22px', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>
                    View Live Jobs →
                  </button>
                </div>

                {/* Share */}
                <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'22px', textAlign:'center', marginTop:20 }}>
                  <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#fff', marginBottom:8 }}>📤 Share These Opportunities</h3>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:14 }}>Know someone looking for AI/Data Science jobs?</p>
                  <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
                    <a href="mailto:vemunooriramana0602@gmail.com?subject=Referral Enquiry" style={cBtn('#d4a853')}>✉️ Email Ramana</a>
                    <a href="https://wa.me/918499882843" target="_blank" rel="noreferrer" style={cBtn('#25d366')}>💬 WhatsApp</a>
                    <Link to="/freelance" style={cBtn('#6366f1')}>💼 Freelance Hub</Link>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE JOBS TAB */}
            {activeTab === 'jobs' && (
              <div>
                <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap' }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search jobs by title or keyword..." style={{ flex:1, minWidth:200, ...inp }} />
                  <select value={activePlatform} onChange={e => setActivePlatform(e.target.value)} style={{ ...inp, flex:'none', width:'auto' }}>
                    <option value="all">All Platforms ({autoJobs.length})</option>
                    {platforms.map(p => <option key={p} value={p}>{p} ({autoJobs.filter(j=>j.platform===p).length})</option>)}
                  </select>
                </div>

                <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12, marginBottom:16 }}>
                  ⚡ Showing {filteredJobs.length} of {autoJobs.length} jobs · Auto-synced every 6 hours
                </p>

                {filteredJobs.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'60px 20px' }}>
                    <div style={{ fontSize:48, marginBottom:14 }}>🔄</div>
                    <h3 style={{ fontFamily:'Syne,sans-serif', color:'#fff', marginBottom:8 }}>{search ? 'No jobs match your search' : 'Jobs syncing soon...'}</h3>
                    <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginBottom:18 }}>
                      {search ? 'Try a different keyword.' : 'RSS feeds sync every 6 hours. Browse referral links while you wait!'}
                    </p>
                    {!search && <button onClick={() => setActiveTab('referrals')} style={{ background:'#d4a853', color:'#000', border:'none', borderRadius:8, padding:'11px 22px', fontWeight:700, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>View Referral Links →</button>}
                  </div>
                ) : (
                  <div style={{ display:'grid', gap:12 }}>
                    {filteredJobs.map(job => <JobCard key={job._id} job={job} />)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SecTitle({ title }) {
  return (
    <div style={{ marginBottom:16 }}>
      <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:18, color:'#fff', marginBottom:6 }}>{title}</h2>
      <div style={{ width:40, height:3, background:'#d4a853', borderRadius:2 }} />
    </div>
  );
}

function RefCard({ r, onClick }) {
  const bc = { work:{ bg:'rgba(0,212,255,0.15)', br:'rgba(0,212,255,0.3)', c:'#00d4ff' }, hot:{ bg:'rgba(239,68,68,0.15)', br:'rgba(239,68,68,0.3)', c:'#f87171' }, recommended:{ bg:'rgba(124,58,237,0.15)', br:'rgba(124,58,237,0.3)', c:'#a78bfa' } }[r.badgeType] || { bg:'rgba(212,168,83,0.1)', br:'rgba(212,168,83,0.2)', c:'#d4a853' };
  return (
    <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:22, position:'relative', overflow:'hidden', transition:'all 0.25s', display:'flex', flexDirection:'column' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(212,168,83,0.35)'; e.currentTarget.style.transform='translateY(-3px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(0)'; }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#d4a853,#b8860b)' }} />
      {r.badge && <div style={{ position:'absolute', top:12, right:12, background:bc.bg, border:`1px solid ${bc.br}`, color:bc.c, fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:10, textTransform:'uppercase', letterSpacing:1 }}>{r.badge}</div>}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:'rgba(212,168,83,0.1)', border:'1px solid rgba(212,168,83,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{r.icon}</div>
        <div>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15, color:'#fff' }}>{r.platform}</div>
          <div style={{ fontSize:11, color:'#d4a853', textTransform:'uppercase', letterSpacing:1, fontWeight:600 }}>{r.type}</div>
        </div>
      </div>
      <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13, lineHeight:1.6, marginBottom:12, flex:1 }}>{r.description}</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
        {(r.perks||[]).map(p=><span key={p} style={{ background:'rgba(0,212,255,0.06)', border:'1px solid rgba(0,212,255,0.12)', color:'#7dd3fc', fontSize:11, padding:'2px 8px', borderRadius:12 }}>{p}</span>)}
      </div>
      <button onClick={onClick} style={{ width:'100%', background:'linear-gradient(135deg,#d4a853,#b8860b)', color:'#000', border:'none', borderRadius:8, padding:'11px', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>
        🚀 Apply Now →
      </button>
      <div style={{ textAlign:'center', marginTop:7, fontSize:11, color:'rgba(255,255,255,0.2)' }}>{r.clicks||0} people applied via this link</div>
    </div>
  );
}

function JobCard({ job }) {
  const timeAgo = d => {
    const days = Math.floor((Date.now()-new Date(d).getTime())/86400000);
    if(days===0) return 'Today'; if(days===1) return 'Yesterday';
    if(days<7) return `${days}d ago`; if(days<30) return `${Math.floor(days/7)}w ago`;
    return new Date(d).toLocaleDateString();
  };
  return (
    <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16, flexWrap:'wrap', transition:'border-color 0.2s' }}
      onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(212,168,83,0.25)'}
      onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'}>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
          <span style={{ fontSize:16 }}>{job.platformIcon||'💼'}</span>
          <span style={{ background:'rgba(212,168,83,0.1)', color:'#d4a853', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10 }}>{job.platform}</span>
          <span style={{ color:'rgba(255,255,255,0.25)', fontSize:11 }}>🕐 {timeAgo(job.postedAt)}</span>
          {job.location && <span style={{ color:'rgba(255,255,255,0.25)', fontSize:11 }}>📍 {job.location}</span>}
          {job.jobType && <span style={{ background:'rgba(99,102,241,0.1)', color:'#a78bfa', fontSize:10, padding:'2px 7px', borderRadius:8 }}>{job.jobType}</span>}
        </div>
        <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:'#fff', marginBottom:4 }}>{job.title}</h3>
        {job.company && <div style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:6 }}>🏢 {job.company}</div>}
        {job.description && <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, lineHeight:1.6, marginBottom:8 }}>{job.description.substring(0,200)}{job.description.length>200?'...':''}</p>}
        {job.tags?.length>0 && <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>{job.tags.slice(0,5).map(t=><span key={t} style={{ background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.18)', color:'#a78bfa', fontSize:10, padding:'2px 7px', borderRadius:8 }}>{t}</span>)}</div>}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end', flexShrink:0 }}>
        {job.salary && <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:15, color:'#d4a853' }}>{job.salary}</div>}
        <a href={job.referralUrl||job.url} target="_blank" rel="noreferrer" style={{ background:'linear-gradient(135deg,#d4a853,#b8860b)', color:'#000', padding:'9px 18px', borderRadius:8, fontWeight:700, fontSize:13, textDecoration:'none', whiteSpace:'nowrap' }}>Apply Now →</a>
        {job.referralUrl&&job.referralUrl!==job.url && <div style={{ fontSize:10, color:'rgba(212,168,83,0.5)' }}>via referral link</div>}
      </div>
    </div>
  );
}

const inp = { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', color:'#fff', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif' };
const cBtn = color => ({ display:'inline-flex', alignItems:'center', gap:6, background:`${color}12`, border:`1px solid ${color}25`, color, padding:'10px 18px', borderRadius:8, textDecoration:'none', fontSize:13, fontWeight:600 });
