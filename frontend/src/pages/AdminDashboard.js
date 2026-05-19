import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const tabs = ['Dashboard', 'Referrals', 'Portfolio', 'Users'];

export default function AdminDashboard() {
  const { token, API } = useAuth();
  const [tab, setTab] = useState('Dashboard');
  const headers = { Authorization: `Bearer ${token}` };

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', padding:'88px 0 60px' }}>
      {/* Tab bar */}
      <div style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'0 48px', display:'flex', gap:4 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background:'none', border:'none', padding:'16px 18px', fontSize:14, fontWeight:600, color: tab===t ? 'var(--accent)' : 'var(--muted)', borderBottom: tab===t ? '2px solid var(--accent)' : '2px solid transparent', cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>
            {t === 'Dashboard' ? '📊 ' : t === 'Referrals' ? '🔗 ' : t === 'Portfolio' ? '📝 ' : '👥 '}{t}
          </button>
        ))}
      </div>

      <div style={{ padding:'40px 48px' }}>
        {tab === 'Dashboard' && <DashboardTab headers={headers} API={API} />}
        {tab === 'Referrals' && <ReferralsTab headers={headers} API={API} />}
        {tab === 'Portfolio' && <PortfolioTab headers={headers} API={API} />}
        {tab === 'Users' && <UsersTab headers={headers} API={API} />}
      </div>
    </div>
  );
}

/* ---- DASHBOARD TAB ---- */
function DashboardTab({ headers, API }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios.get(`${API}/api/analytics/dashboard`, { headers }).then(r => setData(r.data));
  }, [API, headers]);
  if (!data) return <Loader />;

  return (
    <div>
      <AdminTitle>📊 Dashboard Overview</AdminTitle>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20, marginBottom:40 }}>
        {[['Total Clicks', data.totalClicks, '🖱️'], ['Registered Users', data.totalUsers, '👥'], ['Active Referrals', data.totalReferrals, '🔗']].map(([label, val, icon]) => (
          <div key={label} style={statCard}>
            <div style={{ fontSize:32, marginBottom:8 }}>{icon}</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:36, fontWeight:800, color:'var(--accent)' }}>{val}</div>
            <div style={{ color:'var(--muted)', fontSize:14 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:40 }}>
        <div style={card}>
          <h3 style={cardTitle}>Clicks Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.clicksByDay}>
              <XAxis dataKey="_id" tick={{ fill:'#6b7280', fontSize:11 }} />
              <YAxis tick={{ fill:'#6b7280', fontSize:11 }} />
              <Tooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8 }} />
              <Bar dataKey="count" fill="#00d4ff" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <h3 style={cardTitle}>Top Referral Links</h3>
          {data.topReferrals.map(r => (
            <div key={r._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
              <span style={{ fontSize:14 }}>{r.icon} {r.platform}</span>
              <span style={{ background:'rgba(0,212,255,0.1)', color:'var(--accent)', fontSize:12, padding:'3px 10px', borderRadius:20 }}>{r.clicks} clicks</span>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <h3 style={cardTitle}>Recent Clicks</h3>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
            {['Platform','User','Time'].map(h => <th key={h} style={{ textAlign:'left', padding:'8px 12px', color:'var(--muted)', fontWeight:600 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {data.recentClicks.map((c, i) => (
              <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                <td style={{ padding:'10px 12px' }}>{c.referralId?.icon} {c.referralId?.platform}</td>
                <td style={{ padding:'10px 12px', color:'var(--muted)' }}>{c.userEmail}</td>
                <td style={{ padding:'10px 12px', color:'var(--muted)' }}>{new Date(c.clickedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---- REFERRALS TAB ---- */
function ReferralsTab({ headers, API }) {
  const [refs, setRefs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const empty = { platform:'', type:'', icon:'🔗', description:'', perks:'', url:'', badge:'', badgeType:'', category:'annotation', order:0, isActive:true };
  const [form, setForm] = useState(empty);

  const load = () => axios.get(`${API}/api/referrals/all`, { headers }).then(r => setRefs(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    const payload = { ...form, perks: typeof form.perks === 'string' ? form.perks.split(',').map(s => s.trim()) : form.perks };
    if (editing) { await axios.put(`${API}/api/referrals/${editing}`, payload, { headers }); }
    else { await axios.post(`${API}/api/referrals`, payload, { headers }); }
    setEditing(null); setCreating(false); setForm(empty); load();
  };

  const del = async (id) => { if (window.confirm('Delete this referral?')) { await axios.delete(`${API}/api/referrals/${id}`, { headers }); load(); } };
  const edit = (r) => { setEditing(r._id); setForm({ ...r, perks: r.perks.join(', ') }); setCreating(true); };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <AdminTitle>🔗 Manage Referral Links</AdminTitle>
        <button onClick={() => { setCreating(true); setEditing(null); setForm(empty); }} style={addBtn}>+ Add New Referral</button>
      </div>

      {creating && (
        <div style={{ ...card, marginBottom:32, border:'1px solid rgba(0,212,255,0.3)' }}>
          <h3 style={cardTitle}>{editing ? 'Edit Referral' : 'Add New Referral'}</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {[['platform','Platform Name'],['type','Platform Type'],['icon','Icon (emoji)'],['url','Referral URL'],['badge','Badge Text (optional)'],['order','Display Order (number)']].map(([key, label]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} style={inputStyle} />
              </div>
            ))}
            <div style={{ gridColumn:'1/-1' }}>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})} rows={3} style={{ ...inputStyle, resize:'vertical' }} />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <label style={labelStyle}>Perks (comma separated, e.g. Remote, Flexible, Good Pay)</label>
              <input value={form.perks} onChange={e => setForm({...form,perks:e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} style={inputStyle}>
                <option value="annotation">AI Annotation</option>
                <option value="jobs">Job Opportunities</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Badge Type</label>
              <select value={form.badgeType} onChange={e => setForm({...form,badgeType:e.target.value})} style={inputStyle}>
                <option value="">None</option>
                <option value="work">I Work Here</option>
                <option value="hot">Hot / Hiring Now</option>
                <option value="recommended">Recommended</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Active?</label>
              <select value={form.isActive} onChange={e => setForm({...form,isActive:e.target.value==='true'})} style={inputStyle}>
                <option value="true">Yes</option>
                <option value="false">No (Hidden)</option>
              </select>
            </div>
          </div>
          <div style={{ display:'flex', gap:12, marginTop:20 }}>
            <button onClick={save} style={{ ...addBtn, padding:'10px 24px' }}>💾 Save</button>
            <button onClick={() => { setCreating(false); setEditing(null); }} style={{ ...addBtn, background:'rgba(255,255,255,0.05)', color:'var(--muted)' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gap:12 }}>
        {refs.map(r => (
          <div key={r._id} style={{ ...card, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, opacity:r.isActive?1:0.5 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:24 }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:15 }}>{r.platform}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>{r.type} · {r.category} · {r.clicks} clicks</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => edit(r)} style={{ ...addBtn, padding:'7px 16px', fontSize:12, background:'rgba(0,212,255,0.1)' }}>✏️ Edit</button>
              <button onClick={() => del(r._id)} style={{ ...addBtn, padding:'7px 16px', fontSize:12, background:'rgba(239,68,68,0.1)', color:'#f87171' }}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- PORTFOLIO TAB ---- */
function PortfolioTab({ headers, API }) {
  const [sections, setSections] = useState({});
  const [activeSection, setActiveSection] = useState('hero');
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/portfolio`).then(r => {
      setSections(r.data);
      setEditText(JSON.stringify(r.data[activeSection] || {}, null, 2));
    });
  }, [API]);

  const selectSection = (s) => {
    setActiveSection(s);
    setEditText(JSON.stringify(sections[s] || {}, null, 2));
    setMsg('');
  };

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      const parsed = JSON.parse(editText);
      await axios.put(`${API}/api/portfolio/${activeSection}`, parsed, { headers });
      setSections({ ...sections, [activeSection]: parsed });
      setMsg('✅ Saved successfully!');
    } catch (e) {
      setMsg(`❌ ${e.response?.data?.message || 'Invalid JSON — check the format'}`);
    } finally { setSaving(false); }
  };

  const sectionNames = ['hero', 'experience', 'skills', 'projects', 'annotation', 'contact'];

  return (
    <div>
      <AdminTitle>📝 Edit Portfolio Content</AdminTitle>
      <p style={{ color:'var(--muted)', fontSize:14, marginBottom:24 }}>Edit your portfolio content in JSON format. Each section is saved separately.</p>
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {sectionNames.map(s => (
          <button key={s} onClick={() => selectSection(s)} style={{ ...addBtn, padding:'8px 16px', fontSize:12, background: activeSection===s ? 'var(--accent)' : 'rgba(0,212,255,0.08)', color: activeSection===s ? '#000' : 'var(--accent)' }}>{s}</button>
        ))}
      </div>
      <div style={card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <h3 style={cardTitle}>Editing: <span style={{ color:'var(--accent)' }}>{activeSection}</span></h3>
          <button onClick={handleSave} disabled={saving} style={{ ...addBtn, padding:'9px 20px' }}>{saving ? 'Saving...' : '💾 Save Section'}</button>
        </div>
        {msg && <div style={{ marginBottom:12, padding:'10px 14px', borderRadius:8, background: msg.startsWith('✅') ? 'rgba(0,212,255,0.1)' : 'rgba(239,68,68,0.1)', color: msg.startsWith('✅') ? 'var(--accent)' : '#f87171', fontSize:14 }}>{msg}</div>}
        <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={24} style={{ ...inputStyle, fontFamily:'monospace', fontSize:13, resize:'vertical' }} />
      </div>
    </div>
  );
}

/* ---- USERS TAB ---- */
function UsersTab({ headers, API }) {
  const [users, setUsers] = useState([]);
  useEffect(() => { axios.get(`${API}/api/admin/users`, { headers }).then(r => setUsers(r.data)); }, [API]);

  const del = async (id) => {
    if (window.confirm('Delete this user?')) {
      await axios.delete(`${API}/api/admin/users/${id}`, { headers });
      setUsers(users.filter(u => u._id !== id));
    }
  };

  return (
    <div>
      <AdminTitle>👥 Registered Users ({users.length})</AdminTitle>
      <div style={card}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
            {['Name','Email','Joined','Last Login','Action'].map(h => <th key={h} style={{ textAlign:'left', padding:'10px 12px', color:'var(--muted)', fontWeight:600 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom:'1px solid var(--border)' }}>
                <td style={{ padding:'12px' }}>{u.name}</td>
                <td style={{ padding:'12px', color:'var(--muted)' }}>{u.email}</td>
                <td style={{ padding:'12px', color:'var(--muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding:'12px', color:'var(--muted)' }}>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</td>
                <td style={{ padding:'12px' }}>
                  <button onClick={() => del(u._id)} style={{ background:'rgba(239,68,68,0.1)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)', borderRadius:6, padding:'5px 12px', fontSize:12, cursor:'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p style={{ textAlign:'center', color:'var(--muted)', padding:32 }}>No users registered yet.</p>}
      </div>
    </div>
  );
}

// Shared styles
const card = { background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:'24px' };
const statCard = { ...card, textAlign:'center', padding:28 };
const cardTitle = { fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, marginBottom:16 };
const addBtn = { background:'var(--accent)', color:'#000', border:'none', borderRadius:8, padding:'10px 20px', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'DM Sans,sans-serif' };
const labelStyle = { display:'block', fontSize:12, color:'var(--muted)', marginBottom:5 };
const inputStyle = { width:'100%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 12px', color:'var(--text)', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif' };
const AdminTitle = ({ children }) => <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:26, marginBottom:24 }}>{children}</h2>;
const Loader = () => <div style={{ textAlign:'center', color:'var(--accent)', padding:60, fontSize:16 }}>Loading...</div>;
