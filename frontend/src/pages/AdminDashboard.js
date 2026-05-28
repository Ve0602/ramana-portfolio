import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import NotificationsTab from './NotificationsTab';

const TABS = ['Dashboard','Brand Settings','Login Page','Home Page','Products','Services','Referrals','Resume','Freelance','Portfolio','Reviews','📧 Notifications','Users'];
const ICONS = { Dashboard:'📊', 'Brand Settings':'🎨', 'Login Page':'🔐', 'Home Page':'🏠', Products:'🛍️', Services:'⚙️', Referrals:'🔗', Resume:'📄', Freelance:'💼', Portfolio:'📝', Reviews:'⭐', '📧 Notifications':'📧', Users:'👥' };

export default function AdminDashboard() {
  const { token, API } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Dashboard');
  const h = { Authorization: `Bearer ${token}` };

  return (
    <div style={{ background:'#0a0a0a', minHeight:'100vh', fontFamily:'DM Sans,sans-serif' }}>
      {/* Top bar */}
      <div style={{ background:'linear-gradient(135deg,#1a0800,#0d0d0d)', borderBottom:'1px solid rgba(212,168,83,0.2)', padding:'0 24px', display:'flex', alignItems:'center', gap:16, height:56, position:'sticky', top:0, zIndex:100 }}>
        <button onClick={() => navigate('/home')} style={navBtn}>🏠 Home</button>
        <button onClick={() => navigate(-1)} style={navBtn}>← Back</button>
        <div style={{ flex:1, fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:16, color:'#d4a853', textAlign:'center' }}>⚙️ Admin Dashboard</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>Vemunoori Collections</div>
      </div>

      {/* Tab strip */}
      <div style={{ background:'#111', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'0 24px', display:'flex', gap:0, overflowX:'auto', scrollbarWidth:'none' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background:'none', border:'none', padding:'12px 14px', fontSize:12, fontWeight:600, color: tab===t ? '#d4a853' : 'rgba(255,255,255,0.4)', borderBottom: tab===t ? '2px solid #d4a853' : '2px solid transparent', cursor:'pointer', fontFamily:'DM Sans,sans-serif', whiteSpace:'nowrap', transition:'color 0.2s' }}>
            {ICONS[t]} {t.replace('📧 ','')}
          </button>
        ))}
      </div>

      <div style={{ padding:'28px 32px' }}>
        {tab==='Dashboard'          && <DashboardTab h={h} API={API} />}
        {tab==='Brand Settings'     && <BrandSettingsTab h={h} API={API} />}
        {tab==='Login Page'         && <LoginPageTab h={h} API={API} />}
        {tab==='Home Page'          && <HomePageTab h={h} API={API} />}
        {tab==='Products'           && <ProductsTab h={h} API={API} />}
        {tab==='Services'           && <ServicesTab h={h} API={API} />}
        {tab==='Referrals'          && <ReferralsTab h={h} API={API} />}
        {tab==='Resume'             && <ResumeTab h={h} API={API} />}
        {tab==='Freelance'          && <FreelanceTab h={h} API={API} />}
        {tab==='Portfolio'          && <PortfolioTab h={h} API={API} />}
        {tab==='Reviews'            && <ReviewsTab h={h} API={API} />}
        {tab==='📧 Notifications'   && <NotificationsTab h={h} API={API} />}
        {tab==='Users'              && <UsersTab h={h} API={API} />}
      </div>
    </div>
  );
}

/* ── DASHBOARD ─────────────────────────────────────── */
function DashboardTab({ h, API }) {
  const [data, setData] = useState(null);
  useEffect(() => { axios.get(`${API}/api/analytics/dashboard`, { headers:h }).then(r => setData(r.data)); }, []);
  if (!data) return <Loader />;
  return (
    <div>
      <AT>📊 Dashboard Overview</AT>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:28 }}>
        {[['Total Clicks', data.totalClicks,'🖱️'],['Users', data.totalUsers,'👥'],['Referrals', data.totalReferrals,'🔗']].map(([l,v,i])=>(
          <div key={l} style={{...card, textAlign:'center', padding:20}}>
            <div style={{fontSize:28,marginBottom:6}}>{i}</div>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:30,fontWeight:800,color:'#d4a853'}}>{v}</div>
            <div style={{color:'rgba(255,255,255,0.4)',fontSize:12}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
        <div style={card}>
          <h3 style={ct}>Clicks Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.clicksByDay}>
              <XAxis dataKey="_id" tick={{fill:'#666',fontSize:10}} />
              <YAxis tick={{fill:'#666',fontSize:10}} />
              <Tooltip contentStyle={{background:'#111',border:'1px solid #333',borderRadius:8,fontSize:12}} />
              <Bar dataKey="count" fill="#d4a853" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <h3 style={ct}>Top Referrals</h3>
          {data.topReferrals.map(r=>(
            <div key={r._id} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
              <span style={{fontSize:13}}>{r.icon} {r.platform}</span>
              <span style={{background:'rgba(212,168,83,0.1)',color:'#d4a853',fontSize:11,padding:'2px 8px',borderRadius:12}}>{r.clicks}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── BRAND SETTINGS ────────────────────────────────── */
function BrandSettingsTab({ h, API }) {
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  useEffect(() => { axios.get(`${API}/api/brand/site`).then(r => setForm(r.data||{})).catch(()=>{}); }, []);
  const save = async () => {
    try { await axios.put(`${API}/api/brand/site`, form, { headers:h }); setMsg('✅ Brand settings saved!'); }
    catch { setMsg('❌ Save failed'); }
  };
  const f = (k,v) => setForm(p => ({...p,[k]:v}));
  return (
    <div>
      <AT>🎨 Brand Settings</AT>
      <Msg text={msg} onClose={()=>setMsg('')} />
      <div style={card}>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:20}}>These settings control your brand identity across the entire portal.</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <F label="Brand Name" value={form.name} onChange={v=>f('name',v)} />
          <F label="Tagline" value={form.tagline} onChange={v=>f('tagline',v)} />
          <F label="Logo Text (shown when no logo image)" value={form.logoText} onChange={v=>f('logoText',v)} />
          <F label="Logo Image URL" value={form.logo} onChange={v=>f('logo',v)} placeholder="https://..." />
          <F label="Primary Color (hex)" value={form.primaryColor} onChange={v=>f('primaryColor',v)} placeholder="#d4a853" />
          <F label="Accent Color (hex)" value={form.accentColor} onChange={v=>f('accentColor',v)} placeholder="#b8860b" />
          <F label="Phone Number" value={form.phone} onChange={v=>f('phone',v)} />
          <F label="WhatsApp Number" value={form.whatsapp} onChange={v=>f('whatsapp',v)} />
          <F label="Email" value={form.email} onChange={v=>f('email',v)} />
          <F label="Location" value={form.location} onChange={v=>f('location',v)} />
          <F label="Open Hours" value={form.openHours} onChange={v=>f('openHours',v)} />
          <F label="Google Maps Link" value={form.mapLink} onChange={v=>f('mapLink',v)} placeholder="https://maps.google.com/..." />
          <F label="Instagram URL" value={form.instagram} onChange={v=>f('instagram',v)} />
          <F label="Facebook URL" value={form.facebook} onChange={v=>f('facebook',v)} />
          <F label="YouTube URL" value={form.youtube} onChange={v=>f('youtube',v)} />
          <F label="About Text" value={form.aboutText} onChange={v=>f('aboutText',v)} textarea span={2} />
        </div>
        <div style={{marginTop:8,padding:'10px 14px',background:'rgba(212,168,83,0.06)',border:'1px solid rgba(212,168,83,0.2)',borderRadius:8,fontSize:12,color:'#d4a853'}}>
          💡 Color preview: <span style={{display:'inline-block',width:16,height:16,borderRadius:'50%',background:form.primaryColor||'#d4a853',verticalAlign:'middle',marginLeft:6}} /> {form.primaryColor}
        </div>
        <Btn onClick={save} style={{marginTop:16}}>💾 Save Brand Settings</Btn>
      </div>
    </div>
  );
}

/* ── LOGIN PAGE EDITOR ─────────────────────────────── */
function LoginPageTab({ h, API }) {
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  useEffect(() => { axios.get(`${API}/api/brand/site`).then(r => setForm(r.data||{})).catch(()=>{}); }, []);
  const save = async () => {
    try { await axios.put(`${API}/api/brand/site`, form, { headers:h }); setMsg('✅ Login page saved!'); }
    catch { setMsg('❌ Save failed'); }
  };
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <div>
      <AT>🔐 Edit Login Page</AT>
      <Msg text={msg} onClose={()=>setMsg('')} />
      <div style={card}>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:20}}>Customize what visitors see on the login/landing page (Page 1 of your portal).</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <F label="Login Background Gradient (CSS)" value={form.loginBgGradient} onChange={v=>f('loginBgGradient',v)} placeholder="linear-gradient(135deg, #1a0a00, #2d1500)" span={2} />
          <F label="Login Background Video URL (optional)" value={form.loginVideo} onChange={v=>f('loginVideo',v)} placeholder="https://your-video.mp4" span={2} />
          <F label="Login Page Brand Name (override)" value={form.name} onChange={v=>f('name',v)} />
          <F label="Login Tagline" value={form.tagline} onChange={v=>f('tagline',v)} />
          <F label="About / Welcome Text (shown on left side)" value={form.aboutText} onChange={v=>f('aboutText',v)} textarea span={2} />
          <F label="Logo Image URL" value={form.logo} onChange={v=>f('logo',v)} placeholder="https://..." />
          <F label="Logo Text (if no image)" value={form.logoText} onChange={v=>f('logoText',v)} />
          <F label="Primary Color" value={form.primaryColor} onChange={v=>f('primaryColor',v)} placeholder="#d4a853" />
        </div>
        <div style={{marginTop:14,padding:'12px 16px',background:'rgba(0,0,0,0.3)',borderRadius:8,fontSize:12,color:'rgba(255,255,255,0.5)'}}>
          <strong style={{color:'#d4a853'}}>Preview tip:</strong> After saving, open <strong>/</strong> in a new tab to see your login page changes live.
        </div>
        <Btn onClick={save} style={{marginTop:16}}>💾 Save Login Page</Btn>
      </div>
    </div>
  );
}

/* ── HOME PAGE EDITOR ──────────────────────────────── */
function HomePageTab({ h, API }) {
  const [brand, setBrand] = useState({});
  const [msg, setMsg] = useState('');
  useEffect(() => { axios.get(`${API}/api/brand/site`).then(r => setBrand(r.data||{})).catch(()=>{}); }, []);
  const save = async () => {
    try { await axios.put(`${API}/api/brand/site`, brand, { headers:h }); setMsg('✅ Home page saved!'); }
    catch { setMsg('❌ Save failed'); }
  };
  const f = (k,v) => setBrand(p=>({...p,[k]:v}));
  return (
    <div>
      <AT>🏠 Edit Home Page (Page 2)</AT>
      <Msg text={msg} onClose={()=>setMsg('')} />
      <div style={card}>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:20}}>Edit the home dashboard — banner, video, contact strip, and info. To add/remove service cards, go to the <strong style={{color:'#d4a853'}}>Services</strong> tab.</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <F label="Home Banner Video URL (optional)" value={brand.homeBannerVideo} onChange={v=>f('homeBannerVideo',v)} placeholder="https://your-banner-video.mp4" span={2} />
          <F label="Home Tagline (hero headline)" value={brand.tagline} onChange={v=>f('tagline',v)} span={2} />
          <F label="About / Description text" value={brand.aboutText} onChange={v=>f('aboutText',v)} textarea span={2} />
          <F label="Phone" value={brand.phone} onChange={v=>f('phone',v)} />
          <F label="WhatsApp" value={brand.whatsapp} onChange={v=>f('whatsapp',v)} />
          <F label="Email" value={brand.email} onChange={v=>f('email',v)} />
          <F label="Location" value={brand.location} onChange={v=>f('location',v)} />
          <F label="Open Hours" value={brand.openHours} onChange={v=>f('openHours',v)} />
          <F label="Google Maps Link" value={brand.mapLink} onChange={v=>f('mapLink',v)} />
          <F label="Instagram" value={brand.instagram} onChange={v=>f('instagram',v)} />
          <F label="Facebook" value={brand.facebook} onChange={v=>f('facebook',v)} />
          <F label="YouTube" value={brand.youtube} onChange={v=>f('youtube',v)} />
        </div>
        <Btn onClick={save} style={{marginTop:16}}>💾 Save Home Page</Btn>
      </div>
    </div>
  );
}

/* ── PRODUCTS TAB ──────────────────────────────────── */
function ProductsTab({ h, API }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProd);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const load = () => axios.get(`${API}/api/products/all`,{headers:h}).then(r=>setProducts(r.data));
  useEffect(()=>{load();},[]);
  const save = async () => {
    try {
      const p = { ...form, tags: toArr(form.tags), images: toArr(form.images), colors: toArr(form.colors), sizes: toArr(form.sizes) };
      if (editing) await axios.put(`${API}/api/products/${editing}`,p,{headers:h});
      else await axios.post(`${API}/api/products`,p,{headers:h});
      setMsg('✅ Saved!'); setShow(false); setEditing(null); setForm(emptyProd); load();
    } catch(e){ setMsg('❌ '+e.response?.data?.message); }
  };
  const del = async id => { if(window.confirm('Delete?')){ await axios.delete(`${API}/api/products/${id}`,{headers:h}); load(); }};
  const edit = p => { setEditing(p._id); setForm({...p, tags:(p.tags||[]).join(', '), images:(p.images||[]).join('\n'), colors:(p.colors||[]).join(', '), sizes:(p.sizes||[]).join(', ')}); setShow(true); };
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <AT>🛍️ Products ({products.length})</AT>
        <Btn onClick={()=>{setShow(true);setEditing(null);setForm(emptyProd);}}>+ Add Product</Btn>
      </div>
      <Msg text={msg} onClose={()=>setMsg('')} />
      {show && (
        <div style={{...card,marginBottom:24,border:'1px solid rgba(212,168,83,0.3)'}}>
          <h3 style={ct}>{editing?'✏️ Edit':'➕ Add'} Product</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <F label="Product Name *" value={form.name} onChange={v=>setForm({...form,name:v})} />
            <F label="Category *" value={form.category} onChange={v=>setForm({...form,category:v})} />
            <F label="Price (e.g. ₹499)" value={form.price} onChange={v=>setForm({...form,price:v})} />
            <F label="Original Price (e.g. ₹699)" value={form.originalPrice} onChange={v=>setForm({...form,originalPrice:v})} />
            <F label="Description" value={form.description} onChange={v=>setForm({...form,description:v})} textarea span={2} />
            <F label="Image URLs (one per line)" value={form.images} onChange={v=>setForm({...form,images:v})} textarea placeholder="https://image1.jpg&#10;https://image2.jpg" span={2} />
            <F label="Tags (comma separated)" value={form.tags} onChange={v=>setForm({...form,tags:v})} />
            <F label="Colors (comma separated)" value={form.colors} onChange={v=>setForm({...form,colors:v})} placeholder="Red, Blue, Green" />
            <F label="Sizes (comma separated)" value={form.sizes} onChange={v=>setForm({...form,sizes:v})} placeholder="S, M, L, XL" />
            <F label="Display Order" value={form.order} onChange={v=>setForm({...form,order:v})} />
            <div><label style={ls}>In Stock?</label><select value={form.inStock} onChange={e=>setForm({...form,inStock:e.target.value==='true'})} style={is}><option value="true">Yes</option><option value="false">No</option></select></div>
            <div><label style={ls}>Featured?</label><select value={form.featured} onChange={e=>setForm({...form,featured:e.target.value==='true'})} style={is}><option value="false">No</option><option value="true">Yes</option></select></div>
            <div><label style={ls}>Active?</label><select value={form.isActive} onChange={e=>setForm({...form,isActive:e.target.value==='true'})} style={is}><option value="true">Yes</option><option value="false">No (Hidden)</option></select></div>
          </div>
          <div style={{display:'flex',gap:10,marginTop:14}}>
            <Btn onClick={save}>💾 Save</Btn>
            <Btn onClick={()=>{setShow(false);setEditing(null);}} ghost>Cancel</Btn>
          </div>
        </div>
      )}
      <div style={{display:'grid',gap:10}}>
        {products.map(p=>(
          <div key={p._id} style={{...card,display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,opacity:p.isActive?1:0.5,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              {p.images?.[0] ? <img src={p.images[0]} alt="" style={{width:48,height:48,borderRadius:8,objectFit:'cover'}} /> : <div style={{width:48,height:48,borderRadius:8,background:'rgba(212,168,83,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🛍️</div>}
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{p.name}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{p.category} · {p.price||'No price'} · {p.inStock?'In Stock':'Out of Stock'}</div>
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <Btn onClick={()=>edit(p)} small>✏️ Edit</Btn>
              <Btn onClick={()=>del(p._id)} small danger>🗑️</Btn>
            </div>
          </div>
        ))}
        {products.length===0 && <Empty text="No products yet. Add your first product!" />}
      </div>
    </div>
  );
}

/* ── SERVICES TAB (home dashboard cards) ──────────── */
function ServicesTab({ h, API }) {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptySvc);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const load = () => axios.get(`${API}/api/shop/services/all`,{headers:h}).then(r=>setServices(r.data));
  useEffect(()=>{load();},[]);
  const save = async () => {
    try {
      if(editing) await axios.put(`${API}/api/shop/services/${editing}`,form,{headers:h});
      else await axios.post(`${API}/api/shop/services`,form,{headers:h});
      setMsg('✅ Saved!'); setShow(false); setEditing(null); setForm(emptySvc); load();
    } catch(e){ setMsg('❌ '+e.response?.data?.message); }
  };
  const del = async id => { if(window.confirm('Delete?')){ await axios.delete(`${API}/api/shop/services/${id}`,{headers:h}); load(); }};
  const edit = s => { setEditing(s._id); setForm({...s}); setShow(true); };
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <AT>⚙️ Home Page Service Cards</AT>
        <Btn onClick={()=>{setShow(true);setEditing(null);setForm(emptySvc);}}>+ Add Card</Btn>
      </div>
      <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:20}}>These are the cards shown on your home dashboard (like Amazon categories). Add, edit or remove any service card.</p>
      <Msg text={msg} onClose={()=>setMsg('')} />
      {show && (
        <div style={{...card,marginBottom:24,border:'1px solid rgba(212,168,83,0.3)'}}>
          <h3 style={ct}>{editing?'✏️ Edit':'➕ Add'} Service Card</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <F label="Title *" value={form.title} onChange={v=>setForm({...form,title:v})} />
            <F label="Subtitle" value={form.subtitle} onChange={v=>setForm({...form,subtitle:v})} />
            <F label="Icon (emoji)" value={form.icon} onChange={v=>setForm({...form,icon:v})} />
            <F label="Color (hex)" value={form.color} onChange={v=>setForm({...form,color:v})} placeholder="#d4a853" />
            <F label="Link (page URL) *" value={form.link} onChange={v=>setForm({...form,link:v})} placeholder="/shop or https://..." />
            <F label="Badge (e.g. New, Hot)" value={form.badge} onChange={v=>setForm({...form,badge:v})} />
            <F label="Description" value={form.description} onChange={v=>setForm({...form,description:v})} textarea span={2} />
            <F label="Image URL (optional)" value={form.image} onChange={v=>setForm({...form,image:v})} span={2} />
            <div><label style={ls}>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={is}><option value="shop">Shop</option><option value="service">Service</option><option value="portfolio">Portfolio</option><option value="social">Social</option></select></div>
            <div><label style={ls}>External Link?</label><select value={form.isExternal} onChange={e=>setForm({...form,isExternal:e.target.value==='true'})} style={is}><option value="false">No (internal page)</option><option value="true">Yes (opens new tab)</option></select></div>
            <F label="Order" value={form.order} onChange={v=>setForm({...form,order:v})} />
            <div><label style={ls}>Active?</label><select value={form.isActive} onChange={e=>setForm({...form,isActive:e.target.value==='true'})} style={is}><option value="true">Yes</option><option value="false">No (Hidden)</option></select></div>
          </div>
          <div style={{display:'flex',gap:10,marginTop:14}}>
            <Btn onClick={save}>💾 Save</Btn>
            <Btn onClick={()=>{setShow(false);setEditing(null);}} ghost>Cancel</Btn>
          </div>
        </div>
      )}
      <div style={{display:'grid',gap:10}}>
        {services.map(s=>(
          <div key={s._id} style={{...card,display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,opacity:s.isActive?1:0.5,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{fontSize:28}}>{s.icon}</div>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{s.title}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{s.subtitle} · {s.link} · {s.category}</div>
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <Btn onClick={()=>edit(s)} small>✏️ Edit</Btn>
              <Btn onClick={()=>del(s._id)} small danger>🗑️</Btn>
            </div>
          </div>
        ))}
        {services.length===0 && <Empty text="No service cards yet." />}
      </div>
    </div>
  );
}

/* ── REFERRALS ─────────────────────────────────────── */
function ReferralsTab({ h, API }) {
  const [refs, setRefs] = useState([]);
  const [form, setForm] = useState(emptyRef);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const load = () => axios.get(`${API}/api/referrals/all`,{headers:h}).then(r=>setRefs(r.data));
  useEffect(()=>{load();},[]);
  const save = async () => {
    try {
      const p = {...form, perks: toArr(form.perks)};
      if(editing) await axios.put(`${API}/api/referrals/${editing}`,p,{headers:h});
      else await axios.post(`${API}/api/referrals`,p,{headers:h});
      setMsg('✅ Saved!'); setShow(false); setEditing(null); setForm(emptyRef); load();
    } catch(e){ setMsg('❌ '+e.response?.data?.message); }
  };
  const del = async id => { if(window.confirm('Delete?')){ await axios.delete(`${API}/api/referrals/${id}`,{headers:h}); load(); }};
  const edit = r => { setEditing(r._id); setForm({...r, perks:(r.perks||[]).join(', ')}); setShow(true); };
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <AT>🔗 Referral Links ({refs.length})</AT>
        <Btn onClick={()=>{setShow(true);setEditing(null);setForm(emptyRef);}}>+ Add Referral</Btn>
      </div>
      <Msg text={msg} onClose={()=>setMsg('')} />
      {show && (
        <div style={{...card,marginBottom:24,border:'1px solid rgba(212,168,83,0.3)'}}>
          <h3 style={ct}>{editing?'✏️ Edit':'➕ Add'} Referral</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <F label="Platform Name *" value={form.platform} onChange={v=>setForm({...form,platform:v})} />
            <F label="Type" value={form.type} onChange={v=>setForm({...form,type:v})} />
            <F label="Icon (emoji)" value={form.icon} onChange={v=>setForm({...form,icon:v})} />
            <F label="Referral URL *" value={form.url} onChange={v=>setForm({...form,url:v})} placeholder="https://..." />
            <F label="Description" value={form.description} onChange={v=>setForm({...form,description:v})} textarea span={2} />
            <F label="Perks (comma separated)" value={form.perks} onChange={v=>setForm({...form,perks:v})} />
            <F label="Badge Text" value={form.badge} onChange={v=>setForm({...form,badge:v})} />
            <div><label style={ls}>Badge Type</label><select value={form.badgeType} onChange={e=>setForm({...form,badgeType:e.target.value})} style={is}><option value="">None</option><option value="work">I Work Here</option><option value="hot">Hot</option><option value="recommended">Recommended</option></select></div>
            <div><label style={ls}>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={is}><option value="annotation">AI Annotation</option><option value="jobs">Jobs</option></select></div>
          </div>
          <div style={{display:'flex',gap:10,marginTop:14}}>
            <Btn onClick={save}>💾 Save</Btn>
            <Btn onClick={()=>{setShow(false);setEditing(null);}} ghost>Cancel</Btn>
          </div>
        </div>
      )}
      <div style={{display:'grid',gap:10}}>
        {refs.map(r=>(
          <div key={r._id} style={{...card,display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,opacity:r.isActive?1:0.5,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:22}}>{r.icon}</span>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{r.platform}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{r.type} · {r.clicks} clicks</div>
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <Btn onClick={()=>edit(r)} small>✏️ Edit</Btn>
              <Btn onClick={()=>del(r._id)} small danger>🗑️</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── RESUME ────────────────────────────────────────── */
function ResumeTab({ h, API }) {
  const [form, setForm] = useState({pdfUrl:'',email:'',phone:'',location:'',linkedin:'',github:''});
  const [msg, setMsg] = useState('');
  useEffect(() => { axios.get(`${API}/api/portfolio/resume`).then(r=>setForm(f=>({...f,...r.data}))).catch(()=>{}); }, []);
  const save = async () => {
    try { await axios.put(`${API}/api/portfolio/resume`, form, {headers:h}); setMsg('✅ Saved!'); }
    catch { setMsg('❌ Save failed'); }
  };
  return (
    <div>
      <AT>📄 Resume Settings</AT>
      <Msg text={msg} onClose={()=>setMsg('')} />
      <div style={card}>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:20}}>Upload your PDF to Google Drive, get the shareable link, paste it here. Users can view, download and print.</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <F label="📎 Resume PDF URL" value={form.pdfUrl} onChange={v=>setForm({...form,pdfUrl:v})} placeholder="https://drive.google.com/..." span={2} />
          <F label="Email" value={form.email} onChange={v=>setForm({...form,email:v})} />
          <F label="Phone" value={form.phone} onChange={v=>setForm({...form,phone:v})} />
          <F label="Location" value={form.location} onChange={v=>setForm({...form,location:v})} />
          <F label="LinkedIn URL" value={form.linkedin} onChange={v=>setForm({...form,linkedin:v})} />
          <F label="GitHub URL" value={form.github} onChange={v=>setForm({...form,github:v})} span={2} />
        </div>
        <div style={{marginTop:10,padding:'10px 14px',background:'rgba(212,168,83,0.06)',border:'1px solid rgba(212,168,83,0.2)',borderRadius:8,fontSize:12,color:'#d4a853'}}>
          💡 Google Drive tip: Share → Anyone with link → Copy → change "open?id=" to "uc?id=" for direct download.
        </div>
        <Btn onClick={save} style={{marginTop:16}}>💾 Save Resume</Btn>
      </div>
    </div>
  );
}

/* ── FREELANCE ─────────────────────────────────────── */
function FreelanceTab({ h, API }) {
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  useEffect(() => { axios.get(`${API}/api/portfolio/freelance`).then(r=>setText(JSON.stringify(r.data,null,2))).catch(()=>setText('{\n  \n}')); }, []);
  const save = async () => {
    try { const p = JSON.parse(text); await axios.put(`${API}/api/portfolio/freelance`,p,{headers:h}); setMsg('✅ Saved!'); }
    catch { setMsg('❌ Invalid JSON or save failed'); }
  };
  return (
    <div>
      <AT>💼 Freelance Page</AT>
      <Msg text={msg} onClose={()=>setMsg('')} />
      <div style={card}>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:14}}>Edit freelance page content — headline, services, prices, "Why Me" points.</p>
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={26} style={{...is,fontFamily:'monospace',fontSize:12,resize:'vertical',width:'100%'}} />
        <Btn onClick={save} style={{marginTop:12}}>💾 Save Freelance Page</Btn>
      </div>
    </div>
  );
}

/* ── PORTFOLIO ─────────────────────────────────────── */
function PortfolioTab({ h, API }) {
  const [sections, setSections] = useState({});
  const [active, setActive] = useState('hero');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(() => { axios.get(`${API}/api/portfolio`).then(r=>{ setSections(r.data); setText(JSON.stringify(r.data['hero']||{},null,2)); }); }, []);
  const select = s => { setActive(s); setText(JSON.stringify(sections[s]||{},null,2)); setMsg(''); };
  const save = async () => {
    setSaving(true); setMsg('');
    try { const p=JSON.parse(text); await axios.put(`${API}/api/portfolio/${active}`,p,{headers:h}); setSections({...sections,[active]:p}); setMsg('✅ Saved!'); }
    catch(e){ setMsg('❌ '+(e.response?.data?.message||'Invalid JSON')); }
    finally{ setSaving(false); }
  };
  return (
    <div>
      <AT>📝 Portfolio Sections</AT>
      <Msg text={msg} onClose={()=>setMsg('')} />
      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
        {['hero','experience','skills','projects','annotation','contact'].map(s=>(
          <Btn key={s} onClick={()=>select(s)} style={{padding:'6px 14px',fontSize:12,background:active===s?'#d4a853':'rgba(212,168,83,0.1)',color:active===s?'#000':'#d4a853'}}>{s}</Btn>
        ))}
      </div>
      <div style={card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h3 style={ct}>Editing: <span style={{color:'#d4a853'}}>{active}</span></h3>
          <Btn onClick={save} disabled={saving}>{saving?'Saving...':'💾 Save'}</Btn>
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={22} style={{...is,fontFamily:'monospace',fontSize:12,resize:'vertical',width:'100%'}} />
      </div>
    </div>
  );
}

/* ── REVIEWS ───────────────────────────────────────── */
function ReviewsTab({ h, API }) {
  const [reviews, setReviews] = useState([]);
  const [msg, setMsg] = useState('');
  const load = () => axios.get(`${API}/api/shop/reviews/all`,{headers:h}).then(r=>setReviews(r.data));
  useEffect(()=>{load();},[]);
  const approve = async id => { await axios.put(`${API}/api/shop/reviews/${id}/approve`,{},{headers:h}); setMsg('✅ Approved!'); load(); };
  const del = async id => { if(window.confirm('Delete?')){ await axios.delete(`${API}/api/shop/reviews/${id}`,{headers:h}); load(); }};
  return (
    <div>
      <AT>⭐ Reviews ({reviews.length})</AT>
      <Msg text={msg} onClose={()=>setMsg('')} />
      <div style={{display:'grid',gap:10}}>
        {reviews.map(r=>(
          <div key={r._id} style={{...card,display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,flexWrap:'wrap',borderLeft:`3px solid ${r.isApproved?'#4ade80':'#f59e0b'}`}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',gap:4,marginBottom:4}}>{[...Array(5)].map((_,i)=><span key={i} style={{fontSize:14,color:i<r.rating?'#d4a853':'rgba(255,255,255,0.15)'}}>★</span>)}</div>
              <div style={{fontSize:14,color:'rgba(255,255,255,0.7)',marginBottom:6}}>"{r.comment}"</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>— {r.name} · {new Date(r.createdAt).toLocaleDateString()} · {r.isApproved ? <span style={{color:'#4ade80'}}>Approved</span> : <span style={{color:'#f59e0b'}}>Pending</span>}</div>
            </div>
            <div style={{display:'flex',gap:8,flexShrink:0}}>
              {!r.isApproved && <Btn onClick={()=>approve(r._id)} small>✅ Approve</Btn>}
              <Btn onClick={()=>del(r._id)} small danger>🗑️</Btn>
            </div>
          </div>
        ))}
        {reviews.length===0 && <Empty text="No reviews yet." />}
      </div>
    </div>
  );
}

/* ── USERS ─────────────────────────────────────────── */
function UsersTab({ h, API }) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/admin/users`, { headers:h }).then(r => setUsers(r.data));
  }, []);

  const del = async id => {
    if (window.confirm('Delete this user?')) {
      await axios.delete(`${API}/api/admin/users/${id}`, { headers:h });
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
      <span style={{ background:`${colors[p]||'#333'}25`, border:`1px solid ${colors[p]||'#333'}50`, color:colors[p]||'#888', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10 }}>
        {labels[p] || p}
      </span>
    );
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <AT>👥 Users ({users.length})</AT>
        <div style={{ display:'flex', gap:8 }}>
          <span style={{ background:'rgba(212,168,83,0.1)', border:'1px solid rgba(212,168,83,0.2)', color:'#d4a853', padding:'6px 14px', borderRadius:20, fontSize:12 }}>
            📧 {users.filter(u => u.email).length} email subscribers
          </span>
          <span style={{ background:'rgba(37,211,102,0.08)', border:'1px solid rgba(37,211,102,0.2)', color:'#25d366', padding:'6px 14px', borderRadius:20, fontSize:12 }}>
            📱 {users.filter(u => u.phone).length} with phone
          </span>
        </div>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍 Search by name, email or phone..."
        style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', color:'#fff', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif', marginBottom:16 }}
      />

      <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 320px' : '1fr', gap:16 }}>
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
                  style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer', background: selected?._id===u._id ? 'rgba(212,168,83,0.06)' : 'transparent', transition:'background 0.15s' }}
                  onMouseEnter={e => { if(selected?._id!==u._id) e.currentTarget.style.background='rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if(selected?._id!==u._id) e.currentTarget.style.background='transparent'; }}>
                  <td style={{ padding:'11px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      {u.photo
                        ? <img src={u.photo} alt="" style={{ width:30, height:30, borderRadius:'50%', objectFit:'cover' }} />
                        : <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(212,168,83,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#d4a853' }}>{u.name?.[0]?.toUpperCase()}</div>
                      }
                      <span style={{ fontWeight:600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'11px 14px', color:'rgba(255,255,255,0.5)' }}>{u.email}</td>
                  <td style={{ padding:'11px 14px', color: u.phone ? '#25d366' : 'rgba(255,255,255,0.2)' }}>{u.phone || '—'}</td>
                  <td style={{ padding:'11px 14px' }}>{providerBadge(u.authProvider || 'local')}</td>
                  <td style={{ padding:'11px 14px', color:'rgba(255,255,255,0.35)', fontSize:12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding:'11px 14px' }}>
                    <Btn onClick={e => { e.stopPropagation(); del(u._id); }} small danger>Delete</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <Empty text={search ? 'No users match your search.' : 'No users registered yet.'} />}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background:'#111', border:'1px solid rgba(212,168,83,0.2)', borderRadius:12, padding:20, alignSelf:'start' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15 }}>User Details</span>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:18 }}>✕</button>
            </div>
            <div style={{ textAlign:'center', marginBottom:16 }}>
              {selected.photo
                ? <img src={selected.photo} alt="" style={{ width:68, height:68, borderRadius:'50%', objectFit:'cover', border:'2px solid #d4a853' }} />
                : <div style={{ width:68, height:68, borderRadius:'50%', background:'rgba(212,168,83,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:700, color:'#d4a853', margin:'0 auto' }}>{selected.name?.[0]?.toUpperCase()}</div>
              }
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, marginTop:10 }}>{selected.name}</div>
              <div style={{ marginTop:6 }}>{providerBadge(selected.authProvider || 'local')}</div>
            </div>
            {[
              ['✉️ Email',      selected.email],
              ['📱 Phone',      selected.phone || 'Not provided'],
              ['📅 Joined',     new Date(selected.createdAt).toLocaleDateString()],
              ['🕐 Last Login', selected.lastLogin ? new Date(selected.lastLogin).toLocaleDateString() : 'Never'],
              ['✅ Verified',   selected.isVerified ? 'Yes' : 'No'],
            ].map(([label, value]) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 }}>
                <span style={{ color:'rgba(255,255,255,0.4)' }}>{label}</span>
                <span style={{ color:'#fff', fontWeight:500, textAlign:'right', maxWidth:160, wordBreak:'break-all' }}>{value}</span>
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

// ── Shared helpers ──────────────────────────────────
const toArr = v => typeof v==='string' ? v.split(/[,\n]/).map(s=>s.trim()).filter(Boolean) : (v||[]);
const AT = ({children}) => <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,marginBottom:20,color:'#fff'}}>{children}</h2>;
const Loader = () => <div style={{textAlign:'center',color:'#d4a853',padding:60,fontSize:16}}>Loading...</div>;
const Empty = ({text}) => <p style={{textAlign:'center',color:'rgba(255,255,255,0.3)',padding:40,fontSize:14}}>{text}</p>;
const Msg = ({text,onClose}) => text ? <div style={{marginBottom:14,padding:'10px 14px',borderRadius:8,background:text.startsWith('✅')?'rgba(74,222,128,0.1)':'rgba(239,68,68,0.1)',color:text.startsWith('✅')?'#4ade80':'#f87171',fontSize:14,display:'flex',justifyContent:'space-between'}}><span>{text}</span><button onClick={onClose} style={{background:'none',border:'none',color:'inherit',cursor:'pointer'}}>✕</button></div> : null;
const F = ({label,value,onChange,textarea,span,placeholder}) => (
  <div style={span===2?{gridColumn:'1/-1'}:{}}>
    <label style={ls}>{label}</label>
    {textarea ? <textarea value={value||''} onChange={e=>onChange(e.target.value)} rows={3} placeholder={placeholder} style={{...is,resize:'vertical'}} /> : <input value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={is} />}
  </div>
);
const Btn = ({children,onClick,disabled,style,small,ghost,danger}) => (
  <button onClick={onClick} disabled={disabled} style={{background:ghost?'rgba(255,255,255,0.05)':danger?'rgba(239,68,68,0.15)':'#d4a853',color:ghost?'rgba(255,255,255,0.5)':danger?'#f87171':'#000',border:danger?'1px solid rgba(239,68,68,0.3)':'none',borderRadius:8,padding:small?'6px 12px':'10px 18px',fontWeight:700,fontSize:small?12:13,cursor:disabled?'not-allowed':'pointer',fontFamily:'DM Sans,sans-serif',opacity:disabled?0.7:1,...style}}>
    {children}
  </button>
);
const navBtn = {background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.6)',borderRadius:8,padding:'6px 14px',fontSize:13,cursor:'pointer',fontFamily:'DM Sans,sans-serif'};
const card = {background:'#111',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:20};
const ct = {fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:15,marginBottom:14,color:'#fff'};
const ls = {display:'block',fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:5};
const is = {width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:13,outline:'none',fontFamily:'DM Sans,sans-serif'};
const emptyProd = {name:'',category:'kids-dresses',description:'',price:'',originalPrice:'',images:'',tags:'',colors:'',sizes:'',inStock:true,featured:false,isActive:true,order:0};
const emptySvc = {title:'',subtitle:'',description:'',icon:'🔗',color:'#d4a853',link:'',badge:'',category:'shop',isExternal:false,isActive:true,order:0,image:''};
const emptyRef = {platform:'',type:'',icon:'🔗',description:'',perks:'',url:'',badge:'',badgeType:'',category:'annotation',order:0,isActive:true};
