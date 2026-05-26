// ─────────────────────────────────────────────────────────────
// ADD THESE THREE TAB COMPONENTS TO YOUR AdminDashboard.js
// ─────────────────────────────────────────────────────────────
// 1. Add to TABS array:
//    '👥 Clients', '🧑‍💻 Freelancers', '💼 Auto Jobs'
// 2. Add to ICONS object:
//    '👥 Clients':'👥', '🧑‍💻 Freelancers':'🧑‍💻', '💼 Auto Jobs':'💼'
// 3. Add render lines:
//    {tab==='👥 Clients'      && <ClientsTab h={h} API={API} />}
//    {tab==='🧑‍💻 Freelancers' && <FreelancersTab h={h} API={API} />}
//    {tab==='💼 Auto Jobs'    && <AutoJobsTab h={h} API={API} />}
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import axios from 'axios';

const STATUS_COLORS = {
  new:'#f59e0b', viewed:'#00d4ff', 'in-discussion':'#7c3aed',
  accepted:'#4ade80', rejected:'#f87171', completed:'#d4a853',
  pending:'#f59e0b', approved:'#4ade80',
};

// ── CLIENTS TAB ───────────────────────────────────────────────
export function ClientsTab({ h, API }) {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [msg, setMsg] = useState('');

  const load = () => axios.get(`${API}/api/freelance/clients`, { headers:h }).then(r => setClients(r.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status, adminNotes) => {
    try {
      const updated = await axios.put(`${API}/api/freelance/clients/${id}`, { status, adminNotes }, { headers:h });
      setClients(c => c.map(x => x._id===id ? updated.data : x));
      if (selected?._id === id) setSelected(updated.data);
      setMsg('✅ Status updated!');
    } catch { setMsg('❌ Update failed'); }
  };

  const del = async id => {
    if (window.confirm('Delete this client enquiry?')) {
      await axios.delete(`${API}/api/freelance/clients/${id}`, { headers:h });
      setClients(c => c.filter(x => x._id !== id));
      if (selected?._id === id) setSelected(null);
    }
  };

  const filtered = clients.filter(c => {
    const matchStatus = filterStatus==='all' || c.status===filterStatus;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.projectTitle.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusCounts = clients.reduce((acc, c) => { acc[c.status]=(acc[c.status]||0)+1; return acc; }, {});

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#fff' }}>👥 Client Enquiries ({clients.length})</h2>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {Object.entries(statusCounts).map(([s,count]) => (
            <span key={s} style={{ background:`${STATUS_COLORS[s]}15`, border:`1px solid ${STATUS_COLORS[s]}30`, color:STATUS_COLORS[s], padding:'4px 10px', borderRadius:14, fontSize:11, fontWeight:700 }}>{s}: {count}</span>
          ))}
        </div>
      </div>

      {msg && <div style={{ marginBottom:12, padding:'9px 14px', borderRadius:8, background:msg.startsWith('✅')?'rgba(74,222,128,0.1)':'rgba(239,68,68,0.1)', color:msg.startsWith('✅')?'#4ade80':'#f87171', fontSize:13, display:'flex', justifyContent:'space-between' }}><span>{msg}</span><button onClick={()=>setMsg('')} style={{background:'none',border:'none',color:'inherit',cursor:'pointer'}}>✕</button></div>}

      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search by name, email or project..." style={iS} />
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ ...iS, flex:'none', width:'auto' }}>
          <option value="all">All Status</option>
          {['new','viewed','in-discussion','accepted','rejected','completed'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap:16 }}>
        {/* List */}
        <div style={{ display:'grid', gap:10 }}>
          {filtered.map(c => (
            <div key={c._id} onClick={() => setSelected(selected?._id===c._id ? null : c)}
              style={{ background:'#111', border:`1px solid ${selected?._id===c._id ? 'rgba(212,168,83,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius:12, padding:'16px 18px', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { if(selected?._id!==c._id) e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { if(selected?._id!==c._id) e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexWrap:'wrap' }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                    <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15, color:'#fff' }}>{c.projectTitle}</span>
                    <span style={{ background:`${STATUS_COLORS[c.status]}15`, color:STATUS_COLORS[c.status], fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, textTransform:'uppercase' }}>{c.status}</span>
                  </div>
                  <div style={{ color:'rgba(255,255,255,0.4)', fontSize:13 }}>{c.name} · {c.email} {c.phone ? `· ${c.phone}` : ''}</div>
                  <div style={{ color:'rgba(255,255,255,0.3)', fontSize:12, marginTop:2 }}>{c.projectType} · {c.budget||'Budget TBD'} · {c.timeline||'Timeline TBD'}</div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <span style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                  <button onClick={e=>{e.stopPropagation();del(c._id);}} style={{ background:'rgba(239,68,68,0.1)', border:'none', color:'#f87171', borderRadius:6, padding:'4px 8px', fontSize:11, cursor:'pointer' }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length===0 && <div style={{ textAlign:'center', padding:'48px 20px', color:'rgba(255,255,255,0.3)' }}>{search||filterStatus!=='all' ? 'No matching enquiries.' : 'No client enquiries yet.'}</div>}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background:'#111', border:'1px solid rgba(212,168,83,0.25)', borderRadius:12, padding:20, alignSelf:'start', maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:'#fff' }}>Enquiry Details</h3>
              <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:18 }}>✕</button>
            </div>
            {[
              ['👤 Name', selected.name],
              ['✉️ Email', selected.email],
              ['📱 Phone', selected.phone||'—'],
              ['🏢 Company', selected.company||'Individual'],
              ['🌍 Country', selected.country||'—'],
              ['📋 Type', selected.projectType],
              ['💰 Budget', selected.budget||'To discuss'],
              ['⏱️ Timeline', selected.timeline||'Flexible'],
              ['🔥 Urgency', selected.urgency],
              ['📅 Start', selected.startDate||'—'],
            ].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 }}>
                <span style={{ color:'rgba(255,255,255,0.4)' }}>{k}</span>
                <span style={{ color:'#fff', fontWeight:500, textAlign:'right', maxWidth:200, wordBreak:'break-word' }}>{v}</span>
              </div>
            ))}
            <div style={{ margin:'12px 0' }}>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginBottom:4 }}>📝 Description</div>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13, lineHeight:1.6, background:'rgba(255,255,255,0.04)', padding:'10px 12px', borderRadius:8 }}>{selected.description}</p>
            </div>
            {selected.goals && <div style={{ margin:'10px 0' }}>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginBottom:4 }}>🎯 Goals</div>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13, lineHeight:1.6 }}>{selected.goals}</p>
            </div>}
            {selected.references && <div style={{ margin:'10px 0' }}>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginBottom:4 }}>🔗 References</div>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13 }}>{selected.references}</p>
            </div>}

            {/* Update status */}
            <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
              <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Update Status</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                {['new','viewed','in-discussion','accepted','rejected','completed'].map(s => (
                  <button key={s} onClick={()=>updateStatus(selected._id, s, selected.adminNotes)} style={{ padding:'5px 10px', borderRadius:14, border:`1px solid ${STATUS_COLORS[s]}40`, background: selected.status===s ? `${STATUS_COLORS[s]}25` : 'transparent', color:STATUS_COLORS[s], fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans,sans-serif', textTransform:'capitalize' }}>{s}</button>
                ))}
              </div>
              <textarea
                value={selected.adminNotes||''}
                onChange={e => setSelected(p=>({...p,adminNotes:e.target.value}))}
                placeholder="Admin notes (internal only)..."
                rows={2}
                style={{ ...iS, resize:'vertical', marginBottom:8 }}
              />
              <button onClick={()=>updateStatus(selected._id, selected.status, selected.adminNotes)} style={bG}>💾 Save Notes</button>
            </div>

            {/* Contact buttons */}
            <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
              {selected.email && <a href={`mailto:${selected.email}?subject=Re: ${selected.projectTitle}`} style={cBtn('#d4a853')}>✉️ Email</a>}
              {selected.phone && <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" style={cBtn('#25d366')}>💬 WhatsApp</a>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FREELANCERS TAB ───────────────────────────────────────────
export function FreelancersTab({ h, API }) {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const load = () => axios.get(`${API}/api/freelance/freelancers`, { headers:h }).then(r => setList(r.data));
  useEffect(() => { load(); }, []);

  const update = async (id, data) => {
    const updated = await axios.put(`${API}/api/freelance/freelancers/${id}`, data, { headers:h });
    setList(l => l.map(x => x._id===id ? updated.data : x));
    if (selected?._id===id) setSelected(updated.data);
  };

  const del = async id => {
    if (window.confirm('Delete freelancer?')) {
      await axios.delete(`${API}/api/freelance/freelancers/${id}`, { headers:h });
      setList(l => l.filter(x => x._id!==id));
      if (selected?._id===id) setSelected(null);
    }
  };

  const filtered = list.filter(f =>
    !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.email.toLowerCase().includes(search.toLowerCase()) || (f.skills||[]).some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#fff' }}>🧑‍💻 Freelancers ({list.length})</h2>
        <div style={{ display:'flex', gap:8 }}>
          <span style={{ background:'rgba(74,222,128,0.1)', color:'#4ade80', padding:'4px 10px', borderRadius:14, fontSize:11, fontWeight:700 }}>✅ {list.filter(f=>f.status==='approved').length} approved</span>
          <span style={{ background:'rgba(245,158,11,0.1)', color:'#f59e0b', padding:'4px 10px', borderRadius:14, fontSize:11, fontWeight:700 }}>⏳ {list.filter(f=>f.status==='pending').length} pending</span>
        </div>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search by name, email or skill..." style={{ ...iS, marginBottom:16 }} />

      <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap:16 }}>
        <div style={{ display:'grid', gap:10 }}>
          {filtered.map(f => (
            <div key={f._id} onClick={()=>setSelected(selected?._id===f._id ? null : f)}
              style={{ background:'#111', border:`1px solid ${selected?._id===f._id ? 'rgba(212,168,83,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius:12, padding:'14px 18px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap', transition:'all 0.2s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                {f.photo ? <img src={f.photo} alt="" style={{ width:36,height:36,borderRadius:'50%',objectFit:'cover' }} /> : <div style={{ width:36,height:36,borderRadius:'50%',background:'rgba(212,168,83,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#d4a853' }}>{f.name?.[0]?.toUpperCase()}</div>}
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#fff' }}>{f.name}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{f.title||'Freelancer'} · {f.experience}</div>
                  <div style={{ display:'flex', gap:4, marginTop:3, flexWrap:'wrap' }}>
                    {(f.skills||[]).slice(0,3).map(s => <span key={s} style={{ background:'rgba(99,102,241,0.1)', color:'#a78bfa', fontSize:10, padding:'1px 6px', borderRadius:8 }}>{s}</span>)}
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ background:`${STATUS_COLORS[f.status]}15`, color:STATUS_COLORS[f.status], fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:10, textTransform:'uppercase' }}>{f.status}</span>
                <button onClick={e=>{e.stopPropagation();del(f._id);}} style={{ background:'rgba(239,68,68,0.1)', border:'none', color:'#f87171', borderRadius:6, padding:'4px 8px', fontSize:11, cursor:'pointer' }}>🗑️</button>
              </div>
            </div>
          ))}
          {filtered.length===0 && <div style={{ textAlign:'center', padding:'48px 20px', color:'rgba(255,255,255,0.3)' }}>No freelancers registered yet.</div>}
        </div>

        {selected && (
          <div style={{ background:'#111', border:'1px solid rgba(212,168,83,0.25)', borderRadius:12, padding:20, alignSelf:'start', maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15, color:'#fff' }}>Freelancer Profile</h3>
              <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:18 }}>✕</button>
            </div>
            <div style={{ textAlign:'center', marginBottom:14 }}>
              {selected.photo ? <img src={selected.photo} alt="" style={{ width:60,height:60,borderRadius:'50%',objectFit:'cover',border:'2px solid #d4a853' }} /> : <div style={{ width:60,height:60,borderRadius:'50%',background:'rgba(212,168,83,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'#d4a853',margin:'0 auto' }}>{selected.name?.[0]?.toUpperCase()}</div>}
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, marginTop:8 }}>{selected.name}</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:13 }}>{selected.title}</div>
            </div>
            {[
              ['✉️', selected.email], ['📱', selected.phone||'—'],
              ['📍', selected.location||'—'], ['💰', selected.hourlyRate||'—'],
              ['⏰', selected.availability], ['📅', selected.experience],
            ].map(([icon, val]) => (
              <div key={icon} style={{ display:'flex', gap:8, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 }}>
                <span>{icon}</span><span style={{ color:'rgba(255,255,255,0.6)' }}>{val}</span>
              </div>
            ))}
            {(selected.skills||[]).length>0 && <div style={{ marginTop:10 }}>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Skills</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>{selected.skills.map(s=><span key={s} style={{ background:'rgba(99,102,241,0.1)', color:'#a78bfa', fontSize:11, padding:'2px 8px', borderRadius:10 }}>{s}</span>)}</div>
            </div>}
            {(selected.platforms||[]).length>0 && <div style={{ marginTop:10 }}>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Platforms</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>{selected.platforms.map(p=><span key={p} style={{ background:'rgba(212,168,83,0.1)', color:'#d4a853', fontSize:11, padding:'2px 8px', borderRadius:10 }}>{p}</span>)}</div>
            </div>}
            {selected.bio && <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, lineHeight:1.6, marginTop:10 }}>{selected.bio}</p>}
            <div style={{ display:'flex', gap:6, marginTop:14, flexWrap:'wrap' }}>
              {['pending','approved','rejected'].map(s => (
                <button key={s} onClick={()=>update(selected._id,{status:s})} style={{ padding:'6px 12px', borderRadius:14, border:`1px solid ${STATUS_COLORS[s]}40`, background:selected.status===s?`${STATUS_COLORS[s]}25`:'transparent', color:STATUS_COLORS[s], fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>{s}</button>
              ))}
            </div>
            <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
              {selected.email && <a href={`mailto:${selected.email}`} style={cBtn('#d4a853')}>✉️ Email</a>}
              {selected.linkedinUrl && <a href={selected.linkedinUrl} target="_blank" rel="noreferrer" style={cBtn('#0077b5')}>💼 LinkedIn</a>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── AUTO JOBS TAB ─────────────────────────────────────────────
export function AutoJobsTab({ h, API }) {
  const [jobs, setJobs] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const platforms = [...new Set(jobs.map(j => j.platform))];

  const load = () => axios.get(`${API}/api/freelance/jobs/all`, { headers:h }).then(r => setJobs(r.data));
  useEffect(() => { load(); }, []);

  const syncNow = async () => {
    setSyncing(true); setMsg('');
    try {
      await axios.post(`${API}/api/freelance/jobs/sync`, {}, { headers:h });
      setMsg('✅ Sync started! New jobs will appear in 1-2 minutes.');
      setTimeout(() => { load(); setMsg(''); }, 60000);
    } catch(e) { setMsg('❌ Sync failed: ' + e.response?.data?.message); }
    finally { setSyncing(false); }
  };

  const del = async id => {
    await axios.delete(`${API}/api/freelance/jobs/${id}`, { headers:h });
    setJobs(j => j.filter(x => x._id!==id));
  };

  const toggle = async (job) => {
    const updated = await axios.put(`${API}/api/freelance/jobs/${job._id}`, { isActive:!job.isActive }, { headers:h });
    setJobs(j => j.map(x => x._id===job._id ? updated.data : x));
  };

  const filtered = jobs.filter(j => {
    const matchP = filterPlatform==='all' || j.platform===filterPlatform;
    const matchS = !search || j.title.toLowerCase().includes(search.toLowerCase());
    return matchP && matchS;
  });

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#fff' }}>💼 Auto-Synced Jobs ({jobs.length})</h2>
        <button onClick={syncNow} disabled={syncing} style={{ ...bG, display:'flex', alignItems:'center', gap:8 }}>
          {syncing ? '⏳ Syncing...' : '🔄 Sync Now'}
        </button>
      </div>

      {msg && <div style={{ marginBottom:12, padding:'9px 14px', borderRadius:8, background:msg.startsWith('✅')?'rgba(74,222,128,0.1)':'rgba(239,68,68,0.1)', color:msg.startsWith('✅')?'#4ade80':'#f87171', fontSize:13 }}>{msg}</div>}

      <div style={{ background:'rgba(212,168,83,0.05)', border:'1px solid rgba(212,168,83,0.15)', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:13, color:'rgba(255,255,255,0.5)' }}>
        ⏰ Jobs auto-sync every <strong style={{color:'#d4a853'}}>6 hours</strong> from RemoteOK, WeWorkRemotely, Jobicy, and LinkedIn RSS feeds. Click "Sync Now" to force an immediate update.
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search jobs..." style={iS} />
        <select value={filterPlatform} onChange={e=>setFilterPlatform(e.target.value)} style={{ ...iS, flex:'none', width:'auto' }}>
          <option value="all">All Platforms</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div style={{ display:'grid', gap:10 }}>
        {filtered.map(job => (
          <div key={job._id} style={{ background:'#111', border:`1px solid rgba(255,255,255,${job.isActive?'0.08':'0.03'})`, borderRadius:10, padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexWrap:'wrap', opacity:job.isActive?1:0.5, transition:'all 0.2s' }}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <span style={{ fontSize:16 }}>{job.platformIcon}</span>
                <span style={{ background:'rgba(212,168,83,0.1)', color:'#d4a853', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:10 }}>{job.platform}</span>
                <span style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>{new Date(job.postedAt).toLocaleDateString()}</span>
              </div>
              <div style={{ fontWeight:600, fontSize:14, color:'#fff', marginBottom:3 }}>{job.title}</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:12 }}>{job.company} · {job.location}</div>
            </div>
            <div style={{ display:'flex', gap:6, flexShrink:0 }}>
              <button onClick={()=>toggle(job)} style={{ background:job.isActive?'rgba(74,222,128,0.1)':'rgba(255,255,255,0.06)', border:'none', color:job.isActive?'#4ade80':'rgba(255,255,255,0.3)', borderRadius:6, padding:'5px 10px', fontSize:11, cursor:'pointer' }}>{job.isActive?'✅ Active':'⛔ Hidden'}</button>
              <a href={job.url} target="_blank" rel="noreferrer" style={{ background:'rgba(212,168,83,0.1)', color:'#d4a853', padding:'5px 10px', borderRadius:6, textDecoration:'none', fontSize:11, fontWeight:600 }}>View →</a>
              <button onClick={()=>del(job._id)} style={{ background:'rgba(239,68,68,0.1)', border:'none', color:'#f87171', borderRadius:6, padding:'5px 8px', fontSize:11, cursor:'pointer' }}>🗑️</button>
            </div>
          </div>
        ))}
        {filtered.length===0 && <div style={{ textAlign:'center', padding:'48px 20px', color:'rgba(255,255,255,0.3)' }}>No auto-synced jobs yet. Click "Sync Now" to fetch jobs from RSS feeds!</div>}
      </div>
    </div>
  );
}

// Shared styles
const iS = { flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', color:'#fff', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif' };
const bG = { background:'#d4a853', color:'#000', border:'none', borderRadius:8, padding:'10px 18px', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'DM Sans,sans-serif' };
const cBtn = color => ({ background:`${color}12`, border:`1px solid ${color}25`, color, padding:'8px 14px', borderRadius:8, textDecoration:'none', fontWeight:600, fontSize:12 });
