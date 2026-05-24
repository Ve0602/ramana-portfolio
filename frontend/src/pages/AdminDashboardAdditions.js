// ─────────────────────────────────────────────────────────────────
// INSTRUCTIONS: Add these changes to your AdminDashboard.js
// ─────────────────────────────────────────────────────────────────
// 
// 1. Add this import at the TOP of AdminDashboard.js:
//    import NotificationsTab from './NotificationsTab';
//
// 2. Add '📧 Notifications' to the TABS array:
//    const TABS = ['Dashboard','Brand Settings','Login Page','Home Page',
//                  'Products','Services','Referrals','Resume','Freelance',
//                  'Portfolio','Reviews','📧 Notifications','Users'];
//
// 3. Add this line inside the tab content render section:
//    {tab==='📧 Notifications' && <NotificationsTab h={h} API={API} />}
//
// 4. Replace the ENTIRE UsersTab function with the one below:
// ─────────────────────────────────────────────────────────────────

// REPLACE YOUR UsersTab function with this improved version:
export function UsersTab({ h, API }) {
  const [users, setUsers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    axios.get(`${API}/api/admin/users`, { headers: h }).then(r => setUsers(r.data));
  }, []);

  const del = async id => {
    if (window.confirm('Delete this user?')) {
      await axios.delete(`${API}/api/admin/users/${id}`, { headers: h });
      setUsers(u => u.filter(x => x._id !== id));
      if (selected?._id === id) setSelected(null);
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  const providerBadge = (p) => {
    const colors = { google:'#4285f4', facebook:'#1877f2', github:'#24292e', local:'#d4a853' };
    const labels = { google:'G Google', facebook:'f Facebook', github:'⌥ GitHub', local:'✉️ Email' };
    return (
      <span style={{ background:`${colors[p]||'#333'}20`, border:`1px solid ${colors[p]||'#333'}40`, color: colors[p]||'#888', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10 }}>
        {labels[p] || p}
      </span>
    );
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#fff' }}>👥 Users ({users.length})</h2>
        <div style={{ display:'flex', gap:8 }}>
          <span style={{ background:'rgba(212,168,83,0.1)', border:'1px solid rgba(212,168,83,0.2)', color:'#d4a853', padding:'6px 14px', borderRadius:20, fontSize:12 }}>
            📧 {users.filter(u => u.email).length} email subscribers
          </span>
          <span style={{ background:'rgba(37,211,102,0.08)', border:'1px solid rgba(37,211,102,0.2)', color:'#25d366', padding:'6px 14px', borderRadius:20, fontSize:12 }}>
            📱 {users.filter(u => u.phone).length} with phone
          </span>
        </div>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍 Search by name, email or phone..."
        style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', color:'#fff', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif', marginBottom:16 }}
      />

      <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap:16 }}>
        {/* User list */}
        <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'rgba(212,168,83,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                {['User','Email','Phone','Login Via','Joined',''].map(hd => (
                  <th key={hd} style={{ textAlign:'left', padding:'10px 14px', color:'rgba(255,255,255,0.4)', fontWeight:600 }}>{hd}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}
                  onClick={() => setSelected(selected?._id === u._id ? null : u)}
                  style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer', background: selected?._id === u._id ? 'rgba(212,168,83,0.06)' : 'transparent', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = selected?._id===u._id ? 'rgba(212,168,83,0.06)' : 'transparent'}>
                  <td style={{ padding:'11px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      {u.photo
                        ? <img src={u.photo} alt="" style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover' }} />
                        : <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(212,168,83,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#d4a853' }}>{u.name?.[0]?.toUpperCase()}</div>
                      }
                      <span style={{ fontWeight:600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'11px 14px', color:'rgba(255,255,255,0.5)' }}>{u.email}</td>
                  <td style={{ padding:'11px 14px', color: u.phone ? '#25d366' : 'rgba(255,255,255,0.2)' }}>{u.phone || '—'}</td>
                  <td style={{ padding:'11px 14px' }}>{providerBadge(u.authProvider || 'local')}</td>
                  <td style={{ padding:'11px 14px', color:'rgba(255,255,255,0.35)', fontSize:12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding:'11px 14px' }}>
                    <button onClick={e => { e.stopPropagation(); del(u._id); }} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', padding:'4px 10px', borderRadius:6, fontSize:11, cursor:'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px', color:'rgba(255,255,255,0.3)', fontSize:14 }}>
              {search ? 'No users match your search.' : 'No users registered yet.'}
            </div>
          )}
        </div>

        {/* User detail panel */}
        {selected && (
          <div style={{ background:'#111', border:'1px solid rgba(212,168,83,0.2)', borderRadius:12, padding:20, alignSelf:'start' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15 }}>User Details</span>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:18 }}>✕</button>
            </div>
            <div style={{ textAlign:'center', marginBottom:16 }}>
              {selected.photo
                ? <img src={selected.photo} alt="" style={{ width:72, height:72, borderRadius:'50%', objectFit:'cover', border:'2px solid #d4a853' }} />
                : <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(212,168,83,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:700, color:'#d4a853', margin:'0 auto' }}>{selected.name?.[0]?.toUpperCase()}</div>
              }
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, marginTop:10 }}>{selected.name}</div>
              <div style={{ marginTop:6 }}>{providerBadge(selected.authProvider || 'local')}</div>
            </div>
            {[
              ['✉️ Email', selected.email],
              ['📱 Phone', selected.phone || 'Not provided'],
              ['📍 Location', selected.location || 'Not provided'],
              ['📅 Joined', new Date(selected.createdAt).toLocaleDateString()],
              ['🕐 Last Login', selected.lastLogin ? new Date(selected.lastLogin).toLocaleDateString() : 'Never'],
              ['✅ Verified', selected.isVerified ? 'Yes' : 'No'],
            ].map(([label, value]) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 }}>
                <span style={{ color:'rgba(255,255,255,0.4)' }}>{label}</span>
                <span style={{ color:'#fff', fontWeight:500, textAlign:'right', maxWidth:180, wordBreak:'break-all' }}>{value}</span>
              </div>
            ))}
            <div style={{ display:'flex', gap:8, marginTop:16 }}>
              {selected.email && (
                <a href={`mailto:${selected.email}`} style={{ flex:1, background:'rgba(212,168,83,0.1)', border:'1px solid rgba(212,168,83,0.2)', color:'#d4a853', padding:'9px', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:12, textAlign:'center' }}>✉️ Email</a>
              )}
              {selected.phone && (
                <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" style={{ flex:1, background:'rgba(37,211,102,0.08)', border:'1px solid rgba(37,211,102,0.2)', color:'#25d366', padding:'9px', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:12, textAlign:'center' }}>💬 WhatsApp</a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
