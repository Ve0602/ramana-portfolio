import { useEffect, useState } from 'react';
import axios from 'axios';

const FESTIVAL_PRESETS = [
  { name:'Diwali',       emoji:'🪔', bg:'#1a0800', msg:'Wishing you joy and prosperity this Diwali! 🎆 Explore our festive collection of beautiful sarees, dresses, and more.' },
  { name:'Eid',          emoji:'🌙', bg:'#001a0a', msg:'Eid Mubarak from all of us! 🌟 Celebrate in style with our exclusive collection.' },
  { name:'Christmas',    emoji:'🎄', bg:'#001a00', msg:'Merry Christmas! 🎅 Make it special with our handcrafted fashion and services.' },
  { name:'New Year',     emoji:'🎆', bg:'#00001a', msg:'Happy New Year! 🥳 New year, new style! Explore our latest collections.' },
  { name:'Ugadi',        emoji:'🌸', bg:'#0a1a00', msg:'Happy Ugadi! 🌿 Start the new year with beautiful new outfits from our collection.' },
  { name:'Sankranti',    emoji:'🪁', bg:'#1a1000', msg:'Happy Sankranti! 🌞 Celebrate the harvest festival with vibrant sarees and dresses.' },
  { name:'Independence Day', emoji:'🇮🇳', bg:'#001a00', msg:'Happy Independence Day! 🎉 Proud to serve you. Explore our tricolor-inspired collection.' },
  { name:'Summer Sale',  emoji:'☀️', bg:'#1a0a00', msg:'Summer is here! ☀️ Enjoy exclusive offers on our latest collection. Limited time!' },
  { name:'Monsoon',      emoji:'🌧️', bg:'#001020', msg:'Monsoon season is here! 🌈 Stay stylish with our cosy collection. Special offers inside!' },
  { name:'Winter',       emoji:'❄️', bg:'#000a1a', msg:'Winter is here! 🧥 Warm up with our beautiful jackets and winter collection.' },
];

export default function NotificationsTab({ h, API }) {
  const [campaigns, setCampaigns]     = useState([]);
  const [settings, setSettings]       = useState({});
  const [activeView, setActiveView]   = useState('send'); // send | history | settings
  const [template, setTemplate]       = useState('general');
  const [msg, setMsg]                 = useState('');
  const [sending, setSending]         = useState(false);
  const [userCount, setUserCount]     = useState(0);

  // Form state
  const [form, setForm] = useState({
    title: '', subject: '', message: '',
    ctaText: 'Visit Now', ctaLink: 'https://ramana-portfolio-one.vercel.app/home',
    productName: '', productDesc: '', price: '', imageUrl: '',
    platform: '', description: '', perks: '',
    serviceTitle: '', serviceDesc: '',
    festivalName: '', festivalEmoji: '🎉', festivalBg: '#1a0800', offerText: '',
    testEmail: '',
  });

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [campRes, settRes, usersRes] = await Promise.all([
        axios.get(`${API}/api/notifications/campaigns`, { headers: h }),
        axios.get(`${API}/api/notifications/settings`, { headers: h }),
        axios.get(`${API}/api/admin/users`, { headers: h }),
      ]);
      setCampaigns(campRes.data);
      setSettings(settRes.data);
      setUserCount(usersRes.data.length);
    } catch (e) {
      console.error('Load notifications error:', e.message);
    }
  };

  const saveSettings = async () => {
    try {
      await axios.put(`${API}/api/notifications/settings`, settings, { headers: h });
      setMsg('✅ Settings saved!');
    } catch { setMsg('❌ Save failed'); }
  };

  const buildPayload = () => {
    const base = { title: form.title, subject: form.subject, template };
    if (template === 'general')   return { ...base, templateData: { message: form.message, ctaText: form.ctaText, ctaLink: form.ctaLink } };
    if (template === 'product')   return { ...base, templateData: { productName: form.productName, productDesc: form.productDesc, price: form.price, imageUrl: form.imageUrl, category: 'Fashion' } };
    if (template === 'referral')  return { ...base, templateData: { platform: form.platform, description: form.description, perks: form.perks.split(',').map(s => s.trim()).filter(Boolean) } };
    if (template === 'freelance') return { ...base, templateData: { serviceTitle: form.serviceTitle, serviceDesc: form.serviceDesc, price: form.price } };
    if (template === 'festival')  return { ...base, templateData: { festivalName: form.festivalName, festivalEmoji: form.festivalEmoji, bgColor: form.festivalBg, message: form.message, offerText: form.offerText, ctaText: form.ctaText, ctaLink: form.ctaLink } };
    return base;
  };

  const sendTest = async () => {
    if (!form.testEmail) { setMsg('❌ Enter a test email address first'); return; }
    setSending(true); setMsg('');
    try {
      const payload = { ...buildPayload(), testEmail: form.testEmail };
      const { data } = await axios.post(`${API}/api/notifications/send`, payload, { headers: h });
      setMsg(data.message);
    } catch (e) { setMsg('❌ ' + (e.response?.data?.message || 'Failed')); }
    finally { setSending(false); }
  };

  const sendAll = async () => {
    if (!window.confirm(`Send this campaign to all ${userCount} users?`)) return;
    setSending(true); setMsg('');
    try {
      const { data } = await axios.post(`${API}/api/notifications/send`, buildPayload(), { headers: h });
      setMsg(data.message);
      setTimeout(loadData, 2000);
    } catch (e) { setMsg('❌ ' + (e.response?.data?.message || 'Failed')); }
    finally { setSending(false); }
  };

  const applyFestivalPreset = (preset) => {
    setTemplate('festival');
    f('festivalName', preset.name);
    f('festivalEmoji', preset.emoji);
    f('festivalBg', preset.bg);
    f('message', preset.msg);
    f('title', `${preset.emoji} Happy ${preset.name} from Vemunoori Collections!`);
    f('subject', `${preset.emoji} Happy ${preset.name}! Special message from us`);
    f('ctaText', `Shop ${preset.name} Collection`);
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#fff' }}>📧 Email Notifications</h2>
        <div style={{ display:'flex', gap:8 }}>
          <span style={{ background:'rgba(212,168,83,0.1)', border:'1px solid rgba(212,168,83,0.3)', color:'#d4a853', padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:700 }}>
            👥 {userCount} subscribers
          </span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:20, background:'rgba(255,255,255,0.04)', borderRadius:10, padding:4 }}>
        {[['send','✉️ Send Campaign'],['history','📋 History'],['settings','⚙️ Settings']].map(([v, l]) => (
          <button key={v} onClick={() => setActiveView(v)} style={{ flex:1, padding:'9px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, background: activeView===v ? '#d4a853' : 'transparent', color: activeView===v ? '#000' : 'rgba(255,255,255,0.4)', transition:'all 0.2s' }}>{l}</button>
        ))}
      </div>

      {msg && (
        <div style={{ marginBottom:14, padding:'10px 14px', borderRadius:8, background: msg.startsWith('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', color: msg.startsWith('✅') ? '#4ade80' : '#f87171', fontSize:14, display:'flex', justifyContent:'space-between' }}>
          <span>{msg}</span>
          <button onClick={() => setMsg('')} style={{ background:'none', border:'none', color:'inherit', cursor:'pointer' }}>✕</button>
        </div>
      )}

      {/* ── SEND CAMPAIGN ── */}
      {activeView === 'send' && (
        <div>
          {/* Festival quick presets */}
          <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:20, marginBottom:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.6)', marginBottom:12, textTransform:'uppercase', letterSpacing:1 }}>⚡ Quick Festival Templates</h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {FESTIVAL_PRESETS.map(p => (
                <button key={p.name} onClick={() => applyFestivalPreset(p)} style={{ background:'rgba(212,168,83,0.08)', border:'1px solid rgba(212,168,83,0.2)', color:'#d4a853', padding:'7px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans,sans-serif', transition:'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(212,168,83,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(212,168,83,0.08)'}>
                  {p.emoji} {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Template selector */}
          <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:20, marginBottom:16 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.6)', marginBottom:12, textTransform:'uppercase', letterSpacing:1 }}>📋 Email Type</h3>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {[['general','📢 General'],['product','🛍️ New Product'],['referral','💼 New Job'],['freelance','🚀 Freelance'],['festival','🎉 Festival']].map(([v, l]) => (
                <button key={v} onClick={() => setTemplate(v)} style={{ padding:'8px 16px', borderRadius:8, border:`1px solid ${template===v ? '#d4a853' : 'rgba(255,255,255,0.1)'}`, background: template===v ? 'rgba(212,168,83,0.15)' : 'transparent', color: template===v ? '#d4a853' : 'rgba(255,255,255,0.4)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>{l}</button>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:20 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <FI label="Campaign Title *" value={form.title} onChange={v => f('title', v)} placeholder="e.g. Diwali Sale 2026" />
              <FI label="Email Subject Line *" value={form.subject} onChange={v => f('subject', v)} placeholder="e.g. 🪔 Happy Diwali! Special offer inside" />
            </div>

            {/* Template-specific fields */}
            {template === 'general' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <FI label="Message *" value={form.message} onChange={v => f('message', v)} textarea span={2} />
                <FI label="Button Text" value={form.ctaText} onChange={v => f('ctaText', v)} placeholder="Visit Now" />
                <FI label="Button Link" value={form.ctaLink} onChange={v => f('ctaLink', v)} placeholder="https://..." />
              </div>
            )}
            {template === 'product' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <FI label="Product Name *" value={form.productName} onChange={v => f('productName', v)} />
                <FI label="Price (e.g. ₹499)" value={form.price} onChange={v => f('price', v)} />
                <FI label="Product Description" value={form.productDesc} onChange={v => f('productDesc', v)} textarea span={2} />
                <FI label="Product Image URL (optional)" value={form.imageUrl} onChange={v => f('imageUrl', v)} span={2} placeholder="https://..." />
              </div>
            )}
            {template === 'referral' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <FI label="Platform Name *" value={form.platform} onChange={v => f('platform', v)} placeholder="e.g. Mercor" />
                <FI label="Perks (comma separated)" value={form.perks} onChange={v => f('perks', v)} placeholder="Remote, Good Pay, Flexible" />
                <FI label="Description *" value={form.description} onChange={v => f('description', v)} textarea span={2} />
              </div>
            )}
            {template === 'freelance' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <FI label="Service Title *" value={form.serviceTitle} onChange={v => f('serviceTitle', v)} />
                <FI label="Starting Price (e.g. ₹500/hr)" value={form.price} onChange={v => f('price', v)} />
                <FI label="Description *" value={form.serviceDesc} onChange={v => f('serviceDesc', v)} textarea span={2} />
              </div>
            )}
            {template === 'festival' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <FI label="Festival Name *" value={form.festivalName} onChange={v => f('festivalName', v)} placeholder="Diwali" />
                <FI label="Emoji" value={form.festivalEmoji} onChange={v => f('festivalEmoji', v)} placeholder="🪔" />
                <FI label="Message *" value={form.message} onChange={v => f('message', v)} textarea span={2} />
                <FI label="Special Offer Text (optional)" value={form.offerText} onChange={v => f('offerText', v)} placeholder="20% off on all orders!" />
                <FI label="Button Text" value={form.ctaText} onChange={v => f('ctaText', v)} placeholder="Shop Now" />
                <FI label="Button Link" value={form.ctaLink} onChange={v => f('ctaLink', v)} placeholder="https://..." />
              </div>
            )}

            {/* Test + Send buttons */}
            <div style={{ marginTop:20, padding:'16px', background:'rgba(255,255,255,0.03)', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:12 }}>💡 Test before sending to all users:</p>
              <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                <input value={form.testEmail} onChange={e => f('testEmail', e.target.value)} placeholder="your@email.com (test email)" style={{ flex:1, minWidth:200, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 12px', color:'#fff', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif' }} />
                <button onClick={sendTest} disabled={sending} style={sBtnOutline}>
                  {sending ? '⏳ Sending...' : '🧪 Send Test'}
                </button>
                <button onClick={sendAll} disabled={sending || userCount === 0} style={sBtnGold}>
                  {sending ? '⏳ Sending...' : `📧 Send to All ${userCount} Users`}
                </button>
              </div>
              {userCount === 0 && <p style={{ color:'#f87171', fontSize:12, marginTop:8 }}>⚠️ No users registered yet. Ask people to sign up first!</p>}
            </div>
          </div>

          {/* WhatsApp channel box */}
          <div style={{ background:'linear-gradient(135deg,rgba(37,211,102,0.08),rgba(0,0,0,0))', border:'1px solid rgba(37,211,102,0.2)', borderRadius:12, padding:20, marginTop:16 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color:'#25d366', marginBottom:8 }}>💬 WhatsApp Channel (Free)</h3>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, lineHeight:1.7, marginBottom:14 }}>
              Create a free WhatsApp Channel to broadcast messages to all followers — no cost, no SMS charges. Your website already has a WhatsApp button. To create a channel:
            </p>
            <ol style={{ paddingLeft:18, color:'rgba(255,255,255,0.5)', fontSize:13, lineHeight:2 }}>
              <li>Open WhatsApp on your phone</li>
              <li>Tap <strong style={{ color:'#25d366' }}>Updates</strong> tab at the bottom</li>
              <li>Tap <strong style={{ color:'#25d366' }}>+</strong> → <strong style={{ color:'#25d366' }}>New Channel</strong></li>
              <li>Name it: <strong style={{ color:'#25d366' }}>Vemunoori Collections</strong></li>
              <li>Share the channel link on your website</li>
            </ol>
            <div style={{ marginTop:14 }}>
              <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Paste your WhatsApp Channel link here to show it on the website:</label>
              <input placeholder="https://whatsapp.com/channel/your-channel-link" style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(37,211,102,0.2)', borderRadius:8, padding:'10px 12px', color:'#fff', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif' }} />
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORY ── */}
      {activeView === 'history' && (
        <div>
          <h3 style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.6)', marginBottom:16 }}>Sent Campaigns ({campaigns.length})</h3>
          {campaigns.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 20px', color:'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
              <p>No campaigns sent yet. Send your first one!</p>
            </div>
          ) : (
            <div style={{ display:'grid', gap:10 }}>
              {campaigns.map(c => (
                <div key={c._id} style={{ background:'#111', border:`1px solid ${c.status==='sent' ? 'rgba(74,222,128,0.15)' : c.status==='failed' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'}`, borderRadius:12, padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{c.title}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>
                      {c.template} template · {c.autoTriggered ? '⚡ Auto' : '✋ Manual'} · {c.sentTo} sent
                      {c.sentAt ? ` · ${new Date(c.sentAt).toLocaleString()}` : ''}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:12, background: c.status==='sent' ? 'rgba(74,222,128,0.1)' : c.status==='failed' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.06)', color: c.status==='sent' ? '#4ade80' : c.status==='failed' ? '#f87171' : '#888' }}>
                      {c.status.toUpperCase()}
                    </span>
                    <button onClick={async () => { if(window.confirm('Delete?')){ await axios.delete(`${API}/api/notifications/campaigns/${c._id}`,{headers:h}); loadData(); }}} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', padding:'5px 10px', borderRadius:6, fontSize:12, cursor:'pointer' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SETTINGS ── */}
      {activeView === 'settings' && (
        <div>
          <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:20, marginBottom:16 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:4 }}>⚡ Auto-Notify Settings</h3>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:20 }}>When enabled, emails are automatically sent to all users when you add something new from the admin panel.</p>
            {[
              ['autoNotifyProduct',  '🛍️ New Product Added',   'Send email when you add a new product to the shop'],
              ['autoNotifyService',  '⚙️ New Service Added',   'Send email when you add a new service card on home page'],
              ['autoNotifyReferral', '🔗 New Referral Added',  'Send email when you add a new referral/job link'],
              ['autoNotifyFreelance','💼 New Freelance Service','Send email when you update freelance services'],
              ['welcomeEmail',       '👋 Welcome Email',       'Send a welcome email when someone creates a new account'],
            ].map(([key, label, desc]) => (
              <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{label}</div>
                  <div style={{ color:'rgba(255,255,255,0.35)', fontSize:12 }}>{desc}</div>
                </div>
                <button onClick={() => setSettings(p => ({ ...p, [key]: !p[key] }))} style={{ width:48, height:26, borderRadius:13, border:'none', cursor:'pointer', background: settings[key] !== false ? '#d4a853' : 'rgba(255,255,255,0.1)', transition:'all 0.2s', position:'relative' }}>
                  <span style={{ position:'absolute', top:3, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'all 0.2s', left: settings[key] !== false ? 25 : 3 }} />
                </button>
              </div>
            ))}
            <button onClick={saveSettings} style={{ ...sBtnGold, marginTop:16 }}>💾 Save Settings</button>
          </div>

          <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:20 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:8 }}>📧 Gmail SMTP Status</h3>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, lineHeight:1.7 }}>
              Emails are sent via Gmail SMTP (free). Make sure you have added <strong style={{ color:'#d4a853' }}>GMAIL_USER</strong> and <strong style={{ color:'#d4a853' }}>GMAIL_APP_PASSWORD</strong> to your Render environment variables.
            </p>
            <div style={{ marginTop:14, padding:'12px 16px', background:'rgba(212,168,83,0.06)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:8, fontSize:13, color:'#d4a853' }}>
              💡 <strong>Limit:</strong> Gmail free plan allows 500 emails/day. For more users, switch to SendGrid (free 100/day) or Brevo (free 300/day) later — just ask Claude!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared helpers ──────────────────────────────────────────
function FI({ label, value, onChange, textarea, span, placeholder }) {
  const is = { width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 12px', color:'#fff', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif' };
  return (
    <div style={span===2 ? { gridColumn:'1/-1' } : {}}>
      <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>{label}</label>
      {textarea
        ? <textarea value={value||''} onChange={e => onChange(e.target.value)} rows={3} placeholder={placeholder} style={{ ...is, resize:'vertical' }} />
        : <input value={value||''} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={is} />}
    </div>
  );
}

const sBtnGold    = { background:'#d4a853', color:'#000', border:'none', borderRadius:8, padding:'10px 20px', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'DM Sans,sans-serif' };
const sBtnOutline = { background:'transparent', color:'#d4a853', border:'1px solid rgba(212,168,83,0.4)', borderRadius:8, padding:'10px 20px', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'DM Sans,sans-serif' };
