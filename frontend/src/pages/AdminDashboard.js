import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const tabs = ['Dashboard', 'Projects', 'Referrals', 'Resume', 'Freelance', 'Portfolio', 'Users'];
const tabIcons = { Dashboard: '📊', Projects: '🚀', Referrals: '🔗', Resume: '📄', Freelance: '💼', Portfolio: '📝', Users: '👥' };

export default function AdminDashboard() {
  const { token, API } = useAuth();
  const [tab, setTab] = useState('Dashboard');
  const headers = { Authorization: `Bearer ${token}` };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 66 }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 40px', display: 'flex', gap: 0, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', padding: '14px 16px', fontSize: 13, fontWeight: 600, color: tab === t ? 'var(--accent)' : 'var(--muted)', borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', whiteSpace: 'nowrap' }}>
            {tabIcons[t]} {t}
          </button>
        ))}
      </div>
      <div style={{ padding: '36px 48px' }}>
        {tab === 'Dashboard' && <DashboardTab headers={headers} API={API} />}
        {tab === 'Projects' && <ProjectsTab headers={headers} API={API} />}
        {tab === 'Referrals' && <ReferralsTab headers={headers} API={API} />}
        {tab === 'Resume' && <ResumeTab headers={headers} API={API} />}
        {tab === 'Freelance' && <FreelanceTab headers={headers} API={API} />}
        {tab === 'Portfolio' && <PortfolioTab headers={headers} API={API} />}
        {tab === 'Users' && <UsersTab headers={headers} API={API} />}
      </div>
    </div>
  );
}

/* ---- DASHBOARD ---- */
function DashboardTab({ headers, API }) {
  const [data, setData] = useState(null);
  useEffect(() => { axios.get(`${API}/api/analytics/dashboard`, { headers }).then(r => setData(r.data)); }, []);
  if (!data) return <Loader />;
  return (
    <div>
      <AdminTitle>📊 Dashboard Overview</AdminTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
        {[['Total Clicks', data.totalClicks, '🖱️'], ['Registered Users', data.totalUsers, '👥'], ['Active Referrals', data.totalReferrals, '🔗']].map(([label, val, icon]) => (
          <div key={label} style={{ ...card, textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--accent)' }}>{val}</div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={card}>
          <h3 style={cardTitle}>Clicks Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.clicksByDay}>
              <XAxis dataKey="_id" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#00d4ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <h3 style={cardTitle}>Top Referral Links</h3>
          {data.topReferrals.map(r => (
            <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13 }}>{r.icon} {r.platform}</span>
              <span style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent)', fontSize: 11, padding: '2px 8px', borderRadius: 20 }}>{r.clicks}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={card}>
        <h3 style={cardTitle}>Recent Clicks</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Platform', 'User', 'Time'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--muted)', fontWeight: 600 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {data.recentClicks.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '9px 12px' }}>{c.referralId?.icon} {c.referralId?.platform}</td>
                <td style={{ padding: '9px 12px', color: 'var(--muted)' }}>{c.userEmail}</td>
                <td style={{ padding: '9px 12px', color: 'var(--muted)' }}>{new Date(c.clickedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---- PROJECTS TAB ---- */
function ProjectsTab({ headers, API }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => axios.get(`${API}/api/projects`, { headers }).then(r => setProjects(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      // Parse array fields from comma-separated strings
      const payload = {
        ...form,
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : form.tags,
        results: typeof form.results === 'string' ? form.results.split('\n').map(s => s.trim()).filter(Boolean) : form.results,
      };
      if (editing) await axios.put(`${API}/api/projects/${editing}`, payload, { headers });
      else await axios.post(`${API}/api/projects`, payload, { headers });
      setMsg('✅ Saved!'); setShowForm(false); setEditing(null); setForm(emptyProject); load();
    } catch (e) { setMsg('❌ Error: ' + e.response?.data?.message); }
  };

  const del = async (id) => { if (window.confirm('Delete project?')) { await axios.delete(`${API}/api/projects/${id}`, { headers }); load(); } };
  const edit = (p) => { setEditing(p._id); setForm({ ...p, tags: (p.tags || []).join(', '), results: (p.results || []).join('\n') }); setShowForm(true); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <AdminTitle>🚀 Manage Projects</AdminTitle>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyProject); }} style={addBtn}>+ Add New Project</button>
      </div>
      {msg && <Msg text={msg} onClose={() => setMsg('')} />}

      {showForm && (
        <div style={{ ...card, marginBottom: 28, border: '1px solid rgba(0,212,255,0.3)' }}>
          <h3 style={cardTitle}>{editing ? '✏️ Edit Project' : '➕ Add New Project'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Project Title *" value={form.title} onChange={v => setForm({ ...form, title: v })} />
            <Field label="Icon (emoji)" value={form.icon} onChange={v => setForm({ ...form, icon: v })} />
            <Field label="Category" value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="e.g. Machine Learning" />
            <Field label="Tags (comma separated)" value={form.tags} onChange={v => setForm({ ...form, tags: v })} placeholder="Python, ML, Flask" />
            <Field label="Short Description *" value={form.shortDesc} onChange={v => setForm({ ...form, shortDesc: v })} span={2} />
            <Field label="Overview (detailed)" value={form.overview} onChange={v => setForm({ ...form, overview: v })} textarea span={2} />
            <Field label="Problem Statement" value={form.problem} onChange={v => setForm({ ...form, problem: v })} textarea />
            <Field label="My Solution" value={form.solution} onChange={v => setForm({ ...form, solution: v })} textarea />
            <Field label="Results (one per line)" value={form.results} onChange={v => setForm({ ...form, results: v })} textarea placeholder="Achieved 95% accuracy&#10;Deployed on IBM Cloud" />
            <Field label="Thumbnail Image URL" value={form.thumbnail} onChange={v => setForm({ ...form, thumbnail: v })} placeholder="https://..." />
            <Field label="Live Demo URL" value={form.liveUrl} onChange={v => setForm({ ...form, liveUrl: v })} placeholder="https://..." />
            <Field label="GitHub URL" value={form.githubUrl} onChange={v => setForm({ ...form, githubUrl: v })} placeholder="https://github.com/..." />
            <Field label="Video URL (YouTube or direct)" value={form.videoUrl} onChange={v => setForm({ ...form, videoUrl: v })} placeholder="https://youtube.com/watch?v=..." />
            <div>
              <label style={labelStyle}>Display Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Active?</label>
              <select value={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })} style={inputStyle}>
                <option value="true">Yes — visible on portfolio</option>
                <option value="false">No — hidden</option>
              </select>
            </div>
          </div>

          {/* Tech Stack Builder */}
          <div style={{ marginTop: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--muted)' }}>⚙️ Tech Stack (optional)</h4>
            {(form.techStack || []).map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input value={t.icon} onChange={e => { const ts = [...form.techStack]; ts[i].icon = e.target.value; setForm({ ...form, techStack: ts }); }} placeholder="🐍" style={{ ...inputStyle, width: 60 }} />
                <input value={t.name} onChange={e => { const ts = [...form.techStack]; ts[i].name = e.target.value; setForm({ ...form, techStack: ts }); }} placeholder="Python" style={inputStyle} />
                <input value={t.purpose} onChange={e => { const ts = [...form.techStack]; ts[i].purpose = e.target.value; setForm({ ...form, techStack: ts }); }} placeholder="ML model training" style={inputStyle} />
                <button onClick={() => setForm({ ...form, techStack: form.techStack.filter((_, j) => j !== i) })} style={{ ...addBtn, background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '8px 12px' }}>✕</button>
              </div>
            ))}
            <button onClick={() => setForm({ ...form, techStack: [...(form.techStack || []), { icon: '', name: '', purpose: '' }] })} style={{ ...addBtn, background: 'rgba(0,212,255,0.08)', color: 'var(--accent)', fontSize: 12, padding: '7px 14px' }}>+ Add Technology</button>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={save} style={addBtn}>💾 Save Project</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ ...addBtn, background: 'rgba(255,255,255,0.05)', color: 'var(--muted)' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {projects.map(p => (
          <div key={p._id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, opacity: p.isActive ? 1 : 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>{p.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.category} · {p.isActive ? 'Visible' : 'Hidden'} {p.liveUrl ? '· 🚀 Has live demo' : ''} {p.videoUrl ? '· 🎬 Has video' : ''}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => edit(p)} style={{ ...addBtn, padding: '7px 14px', fontSize: 12, background: 'rgba(0,212,255,0.1)' }}>✏️ Edit</button>
              <button onClick={() => del(p._id)} style={{ ...addBtn, padding: '7px 14px', fontSize: 12, background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>🗑️ Delete</button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>No projects yet. Click "+ Add New Project" to add your first one!</p>}
      </div>
    </div>
  );
}

/* ---- REFERRALS TAB ---- */
function ReferralsTab({ headers, API }) {
  const [refs, setRefs] = useState([]);
  const [form, setForm] = useState(emptyRef);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => axios.get(`${API}/api/referrals/all`, { headers }).then(r => setRefs(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const payload = { ...form, perks: typeof form.perks === 'string' ? form.perks.split(',').map(s => s.trim()).filter(Boolean) : form.perks };
      if (editing) await axios.put(`${API}/api/referrals/${editing}`, payload, { headers });
      else await axios.post(`${API}/api/referrals`, payload, { headers });
      setMsg('✅ Saved!'); setShowForm(false); setEditing(null); setForm(emptyRef); load();
    } catch (e) { setMsg('❌ Error: ' + e.response?.data?.message); }
  };

  const del = async (id) => { if (window.confirm('Delete?')) { await axios.delete(`${API}/api/referrals/${id}`, { headers }); load(); } };
  const edit = (r) => { setEditing(r._id); setForm({ ...r, perks: (r.perks || []).join(', ') }); setShowForm(true); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <AdminTitle>🔗 Manage Referral Links</AdminTitle>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyRef); }} style={addBtn}>+ Add Referral</button>
      </div>
      {msg && <Msg text={msg} onClose={() => setMsg('')} />}

      {showForm && (
        <div style={{ ...card, marginBottom: 28, border: '1px solid rgba(0,212,255,0.3)' }}>
          <h3 style={cardTitle}>{editing ? '✏️ Edit Referral' : '➕ Add Referral'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Platform Name *" value={form.platform} onChange={v => setForm({ ...form, platform: v })} />
            <Field label="Icon (emoji)" value={form.icon} onChange={v => setForm({ ...form, icon: v })} />
            <Field label="Type" value={form.type} onChange={v => setForm({ ...form, type: v })} placeholder="e.g. AI Data Annotation" />
            <Field label="Referral URL *" value={form.url} onChange={v => setForm({ ...form, url: v })} placeholder="https://..." />
            <Field label="Description *" value={form.description} onChange={v => setForm({ ...form, description: v })} textarea span={2} />
            <Field label="Perks (comma separated)" value={form.perks} onChange={v => setForm({ ...form, perks: v })} placeholder="Remote, Flexible, Good Pay" />
            <Field label="Badge Text" value={form.badge} onChange={v => setForm({ ...form, badge: v })} placeholder="e.g. I Work Here" />
            <div>
              <label style={labelStyle}>Badge Type</label>
              <select value={form.badgeType} onChange={e => setForm({ ...form, badgeType: e.target.value })} style={inputStyle}>
                <option value="">None</option>
                <option value="work">I Work Here</option>
                <option value="hot">Hot / Hiring Now</option>
                <option value="recommended">Recommended</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                <option value="annotation">AI Annotation</option>
                <option value="jobs">Job Opportunities</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Active?</label>
              <select value={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })} style={inputStyle}>
                <option value="true">Yes</option>
                <option value="false">No (Hidden)</option>
              </select>
            </div>
            <Field label="Order" value={form.order} onChange={v => setForm({ ...form, order: v })} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={save} style={addBtn}>💾 Save</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ ...addBtn, background: 'rgba(255,255,255,0.05)', color: 'var(--muted)' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {refs.map(r => (
          <div key={r._id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, opacity: r.isActive ? 1 : 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{r.platform}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.type} · {r.clicks} clicks · {r.category}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => edit(r)} style={{ ...addBtn, padding: '6px 12px', fontSize: 12, background: 'rgba(0,212,255,0.1)' }}>✏️ Edit</button>
              <button onClick={() => del(r._id)} style={{ ...addBtn, padding: '6px 12px', fontSize: 12, background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- RESUME TAB ---- */
function ResumeTab({ headers, API }) {
  const [form, setForm] = useState({ pdfUrl: '', email: '', phone: '', location: '', linkedin: '', github: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/portfolio/resume`)
      .then(r => setForm(f => ({ ...f, ...r.data })))
      .catch(() => {});
  }, []);

  const save = async () => {
    try {
      await axios.put(`${API}/api/portfolio/resume`, form, { headers });
      setMsg('✅ Resume settings saved!');
    } catch (e) { setMsg('❌ Error saving'); }
  };

  return (
    <div>
      <AdminTitle>📄 Resume Settings</AdminTitle>
      {msg && <Msg text={msg} onClose={() => setMsg('')} />}
      <div style={card}>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
          Upload your resume PDF to Google Drive or any file host, get the direct link, and paste it here. Users will be able to view, download, and print it.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="📎 Resume PDF URL (Google Drive / Dropbox / any direct link)" value={form.pdfUrl} onChange={v => setForm({ ...form, pdfUrl: v })} placeholder="https://drive.google.com/file/d/..." span={2} />
          <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
          <Field label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
          <Field label="Location" value={form.location} onChange={v => setForm({ ...form, location: v })} />
          <Field label="LinkedIn URL" value={form.linkedin} onChange={v => setForm({ ...form, linkedin: v })} />
          <Field label="GitHub URL" value={form.github} onChange={v => setForm({ ...form, github: v })} />
        </div>
        <div style={{ marginTop: 8, padding: '12px 16px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 8, fontSize: 13, color: '#fbbf24' }}>
          💡 To get a Google Drive direct link: right-click your PDF → Share → Anyone with link → Copy link. Then replace "open?id=" with "uc?id=" in the URL.
        </div>
        <button onClick={save} style={{ ...addBtn, marginTop: 20 }}>💾 Save Resume Settings</button>
      </div>
    </div>
  );
}

/* ---- FREELANCE TAB ---- */
function FreelanceTab({ headers, API }) {
  const [form, setForm] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/portfolio/freelance`)
      .then(r => setForm(JSON.stringify(r.data, null, 2)))
      .catch(() => setForm('{}'));
  }, []);

  const save = async () => {
    try {
      const parsed = JSON.parse(form);
      await axios.put(`${API}/api/portfolio/freelance`, parsed, { headers });
      setMsg('✅ Freelance page saved!');
    } catch (e) { setMsg('❌ Invalid JSON or save error'); }
  };

  return (
    <div>
      <AdminTitle>💼 Freelance Page Editor</AdminTitle>
      {msg && <Msg text={msg} onClose={() => setMsg('')} />}
      <div style={card}>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>Edit your freelance page content. You can update headline, services, prices, and "Why Me" points.</p>
        <textarea value={form} onChange={e => setForm(e.target.value)} rows={28} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, resize: 'vertical', width: '100%' }} />
        <button onClick={save} style={{ ...addBtn, marginTop: 12 }}>💾 Save Freelance Page</button>
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
      setEditText(JSON.stringify(r.data['hero'] || {}, null, 2));
    });
  }, []);

  const selectSection = (s) => { setActiveSection(s); setEditText(JSON.stringify(sections[s] || {}, null, 2)); setMsg(''); };

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      const parsed = JSON.parse(editText);
      await axios.put(`${API}/api/portfolio/${activeSection}`, parsed, { headers });
      setSections({ ...sections, [activeSection]: parsed });
      setMsg('✅ Saved!');
    } catch (e) { setMsg('❌ ' + (e.response?.data?.message || 'Invalid JSON')); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <AdminTitle>📝 Edit Portfolio Sections</AdminTitle>
      {msg && <Msg text={msg} onClose={() => setMsg('')} />}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['hero', 'experience', 'skills', 'projects', 'annotation', 'contact'].map(s => (
          <button key={s} onClick={() => selectSection(s)} style={{ ...addBtn, padding: '7px 14px', fontSize: 12, background: activeSection === s ? 'var(--accent)' : 'rgba(0,212,255,0.08)', color: activeSection === s ? '#000' : 'var(--accent)' }}>{s}</button>
        ))}
      </div>
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={cardTitle}>Editing: <span style={{ color: 'var(--accent)' }}>{activeSection}</span></h3>
          <button onClick={handleSave} disabled={saving} style={addBtn}>{saving ? 'Saving...' : '💾 Save'}</button>
        </div>
        <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={22} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, resize: 'vertical', width: '100%' }} />
      </div>
    </div>
  );
}

/* ---- USERS TAB ---- */
function UsersTab({ headers, API }) {
  const [users, setUsers] = useState([]);
  useEffect(() => { axios.get(`${API}/api/admin/users`, { headers }).then(r => setUsers(r.data)); }, []);
  const del = async (id) => { if (window.confirm('Delete user?')) { await axios.delete(`${API}/api/admin/users/${id}`, { headers }); setUsers(users.filter(u => u._id !== id)); } };
  return (
    <div>
      <AdminTitle>👥 Users ({users.length})</AdminTitle>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Name', 'Email', 'Joined', 'Last Login', ''].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--muted)', fontWeight: 600 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 12px' }}>{u.name}</td>
                <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{u.email}</td>
                <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</td>
                <td style={{ padding: '10px 12px' }}><button onClick={() => del(u._id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No users yet.</p>}
      </div>
    </div>
  );
}

// Shared helpers
const Field = ({ label, value, onChange, textarea, span, placeholder }) => (
  <div style={span === 2 ? { gridColumn: '1/-1' } : {}}>
    <label style={labelStyle}>{label}</label>
    {textarea
      ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3} placeholder={placeholder} style={{ ...inputStyle, resize: 'vertical' }} />
      : <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />}
  </div>
);

const Msg = ({ text, onClose }) => (
  <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: text.startsWith('✅') ? 'rgba(0,212,255,0.1)' : 'rgba(239,68,68,0.1)', color: text.startsWith('✅') ? 'var(--accent)' : '#f87171', fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
    <span>{text}</span><button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
  </div>
);

const AdminTitle = ({ children }) => <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, marginBottom: 24 }}>{children}</h2>;
const Loader = () => <div style={{ textAlign: 'center', color: 'var(--accent)', padding: 60 }}>Loading...</div>;

const card = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 };
const cardTitle = { fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 14 };
const addBtn = { background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' };
const labelStyle = { display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 5 };
const inputStyle = { width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'DM Sans,sans-serif' };

const emptyProject = { title: '', shortDesc: '', icon: '🚀', category: 'Machine Learning', tags: '', overview: '', problem: '', solution: '', results: '', steps: [], techStack: [], liveUrl: '', githubUrl: '', videoUrl: '', thumbnail: '', isActive: true, order: 0 };
const emptyRef = { platform: '', type: '', icon: '🔗', description: '', perks: '', url: '', badge: '', badgeType: '', category: 'annotation', order: 0, isActive: true };
