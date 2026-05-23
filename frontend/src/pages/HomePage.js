import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeAdBanner, setActiveAdBanner] = useState(0);

  useEffect(() => {
    axios.get(`${API}/api/brand/site`).then(r => setBrand(r.data)).catch(() => {});
    axios.get(`${API}/api/shop/services`).then(r => setServices(r.data)).catch(() => setServices(defaultServices));
    axios.get(`${API}/api/shop/reviews?general=true`).then(r => setReviews(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveAdBanner(p => (p + 1) % adBanners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const b = brand || defaultBrand;
  const gold = b.primaryColor || '#d4a853';
  const shopServices = services.filter(s => s.category === 'shop');
  const otherServices = services.filter(s => s.category !== 'shop');

  return (
    <div style={{ background:'#0a0a0a', minHeight:'100vh', fontFamily:'DM Sans,sans-serif', paddingTop: 54 }}>

      {/* HERO BANNER */}
      <div style={{ position:'relative', overflow:'hidden', minHeight:380, display:'flex', alignItems:'center' }}>
        {b.homeBannerVideo ? (
          <>
            <video autoPlay muted loop playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.4 }}>
              <source src={b.homeBannerVideo} />
            </video>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(10,5,0,0.85),rgba(0,0,0,0.5))' }} />
          </>
        ) : (
          <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
            {adBanners.map((banner, i) => (
              <div key={i} style={{ position:'absolute', inset:0, transition:'opacity 1s', opacity: activeAdBanner===i ? 1 : 0, background: banner.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ textAlign:'center', padding:'40px 20px' }}>
                  <div style={{ fontSize:60, marginBottom:14 }}>{banner.icon}</div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(22px,4vw,44px)', fontWeight:900, color:gold, marginBottom:8 }}>{banner.title}</div>
                  <div style={{ color:'rgba(255,255,255,0.55)', fontSize:17 }}>{banner.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ position:'relative', zIndex:1, padding:'60px 60px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${gold}20`, border:`1px solid ${gold}40`, borderRadius:30, padding:'6px 16px', fontSize:12, color:gold, marginBottom:20, letterSpacing:2, textTransform:'uppercase' }}>
            ✨ Welcome to {b.name || 'Vemunoori Collections'}
          </div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'clamp(26px,5vw,52px)', lineHeight:1.1, marginBottom:14, color:'#fff', maxWidth:600 }}>
            {b.tagline || 'Fashion · Technology · Excellence'}
          </h1>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:15, lineHeight:1.7, maxWidth:480, marginBottom:26 }}>
            {b.aboutText || 'Your one-stop destination for beautiful fashion, expert tailoring, and modern technology services.'}
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <Link to="/shop" style={{ background:`linear-gradient(135deg,${gold},#b8860b)`, color:'#000', padding:'12px 26px', borderRadius:10, fontWeight:800, fontSize:14, textDecoration:'none' }}>👗 Shop Now</Link>
            <a href={`https://wa.me/${(b.whatsapp||'918499882843').replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" style={{ background:'rgba(37,211,102,0.15)', border:'1px solid rgba(37,211,102,0.3)', color:'#25d366', padding:'12px 26px', borderRadius:10, fontWeight:700, fontSize:14, textDecoration:'none' }}>💬 WhatsApp</a>
          </div>
        </div>

        {/* Banner dots */}
        <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', display:'flex', gap:8, zIndex:2 }}>
          {adBanners.map((_,i) => (
            <button key={i} onClick={() => setActiveAdBanner(i)} style={{ width: activeAdBanner===i ? 22 : 8, height:8, borderRadius:4, background: activeAdBanner===i ? gold : 'rgba(255,255,255,0.25)', border:'none', cursor:'pointer', transition:'all 0.3s' }} />
          ))}
        </div>
      </div>

      <div style={{ padding:'40px 40px' }}>

        {/* Shop Services */}
        <SH title="🛍️ Products & Services" sub="Explore what we offer" gold={gold} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:18, marginBottom:44 }}>
          {(shopServices.length > 0 ? shopServices : defaultServices.filter(s => s.category==='shop')).map(s => (
            <SC key={s._id||s.title} s={s} gold={gold} />
          ))}
        </div>

        {/* Portfolio & Other */}
        <SH title="💼 Portfolio & Professional" sub="AI, Freelance, and Career" gold={gold} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:18, marginBottom:44 }}>
          {(otherServices.length > 0 ? otherServices : defaultServices.filter(s => s.category!=='shop')).map(s => (
            <SC key={s._id||s.title} s={s} gold={gold} />
          ))}
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <>
            <SH title="⭐ Customer Reviews" sub="What people say about us" gold={gold} />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16, marginBottom:44 }}>
              {reviews.map(r => (
                <div key={r._id} style={{ background:'#111', border:`1px solid ${gold}20`, borderRadius:12, padding:'18px 20px' }}>
                  <div style={{ display:'flex', gap:2, marginBottom:8 }}>
                    {[...Array(5)].map((_,i) => <span key={i} style={{ fontSize:15, color: i<r.rating ? gold : 'rgba(255,255,255,0.12)' }}>★</span>)}
                  </div>
                  <p style={{ color:'rgba(255,255,255,0.65)', fontSize:13, lineHeight:1.6, marginBottom:10 }}>"{r.comment}"</p>
                  <div style={{ color:gold, fontWeight:700, fontSize:12 }}>— {r.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Contact strip */}
        <div style={{ background:`linear-gradient(135deg,#1a0800,#0d0500)`, border:`1px solid ${gold}25`, borderRadius:14, padding:'28px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:20, color:gold, marginBottom:4 }}>Get In Touch</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:13 }}>{b.location||'Warangal, Telangana'} · {b.openHours||'Mon-Sat: 9 AM – 8 PM'}</div>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {b.phone && <a href={`tel:${b.phone}`} style={cb(gold)}>📞 Call</a>}
            {b.whatsapp && <a href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" style={{ ...cb('#25d366'), background:'rgba(37,211,102,0.1)', borderColor:'rgba(37,211,102,0.3)' }}>💬 WhatsApp</a>}
            {b.email && <a href={`mailto:${b.email}`} style={{ ...cb('rgba(255,255,255,0.5)'), borderColor:'rgba(255,255,255,0.1)' }}>✉️ Email</a>}
          </div>
        </div>
      </div>

      <footer style={{ padding:'18px 40px', borderTop:`1px solid ${gold}15`, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <p style={{ color:'rgba(255,255,255,0.25)', fontSize:12 }}>© 2026 {b.name||'Vemunoori Collections'} · All rights reserved</p>
        <div style={{ display:'flex', gap:14 }}>
          {[['/shop','👗 Shop'],['/portfolio','🤖 Portfolio'],['/freelance','💼 Hire Me'],['/resume','📄 Resume']].map(([to,l]) => (
            <Link key={to} to={to} style={{ color:'rgba(255,255,255,0.25)', fontSize:12, textDecoration:'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}

function SH({ title, sub, gold }) {
  return (
    <div style={{ marginBottom:20 }}>
      <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:20, color:'#fff', marginBottom:4 }}>{title}</h2>
      <div style={{ width:44, height:3, background:gold, borderRadius:2, marginBottom:4 }} />
      <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13 }}>{sub}</p>
    </div>
  );
}

function SC({ s, gold }) {
  const color = s.color || gold;
  const inner = (
    <div style={{ background:'#111', border:`1px solid ${color}20`, borderRadius:13, padding:'22px 18px', cursor:'pointer', transition:'all 0.25s', position:'relative', overflow:'hidden', height:'100%' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 10px 28px ${color}20`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor=`${color}20`; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${color},transparent)` }} />
      {s.badge && <div style={{ position:'absolute', top:10, right:10, background:`${color}20`, border:`1px solid ${color}40`, color, fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:10, letterSpacing:1 }}>{s.badge}</div>}
      {s.image
        ? <img src={s.image} alt={s.title} style={{ width:'100%', height:100, objectFit:'cover', borderRadius:8, marginBottom:12 }} />
        : <div style={{ fontSize:36, marginBottom:12 }}>{s.icon}</div>
      }
      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15, color:'#fff', marginBottom:3 }}>{s.title}</div>
      <div style={{ fontSize:11, color, fontWeight:600, marginBottom:7, textTransform:'uppercase', letterSpacing:1 }}>{s.subtitle}</div>
      <div style={{ color:'rgba(255,255,255,0.45)', fontSize:12, lineHeight:1.6 }}>{s.description}</div>
      <div style={{ marginTop:14, color, fontSize:12, fontWeight:700 }}>Explore →</div>
    </div>
  );
  return s.isExternal
    ? <a href={s.link} target="_blank" rel="noreferrer" style={{ textDecoration:'none' }}>{inner}</a>
    : <Link to={s.link} style={{ textDecoration:'none' }}>{inner}</Link>;
}

const cb = color => ({ background:`${color}15`, border:`1px solid ${color}30`, color, padding:'10px 18px', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:13 });

const adBanners = [
  { icon:'👗', title:'New Arrivals', subtitle:'Kids dresses & Women jackets this season', bg:'linear-gradient(135deg,#1a0800,#2d0f00)' },
  { icon:'🧵', title:'Expert Tailoring', subtitle:'Custom stitching for every occasion', bg:'linear-gradient(135deg,#0a001a,#1a0030)' },
  { icon:'🤖', title:'AI & Tech Services', subtitle:'Prompt Engineering · Data Science · Web Dev', bg:'linear-gradient(135deg,#001a1a,#002d2d)' },
  { icon:'📚', title:'Learn Tailoring', subtitle:'Professional classes for beginners', bg:'linear-gradient(135deg,#001a0a,#002d15)' },
];

const defaultBrand = { name:'Vemunoori Collections', tagline:'Fashion · Technology · Excellence', logoText:'VC', primaryColor:'#d4a853', phone:'+91 8499882843', whatsapp:'+91 8499882843', email:'vemunooriramana0602@gmail.com', location:'Warangal, Telangana', openHours:'Mon-Sat: 9 AM – 8 PM', aboutText:'Your one-stop destination for beautiful fashion, expert tailoring, and modern technology services.' };

const defaultServices = [
  { title:'Fashion Boutique', subtitle:'Kids & Women Wear', description:'Beautiful kids dresses, women jackets, and sarees', icon:'👗', color:'#d4a853', link:'/shop', category:'shop', badge:'New' },
  { title:'Tailoring', subtitle:'Custom Stitching', description:'Professional tailoring for all occasions', icon:'🧵', color:'#e91e8c', link:'/shop?cat=tailoring', category:'shop' },
  { title:'Computer & Design', subtitle:'Tech Services', description:'Computer work and graphic design', icon:'💻', color:'#00d4ff', link:'/shop?cat=computer', category:'service' },
  { title:'Teaching', subtitle:'Learn Tailoring', description:'Professional tailoring classes', icon:'📚', color:'#7c3aed', link:'/shop?cat=teaching', category:'service' },
  { title:'AI Portfolio', subtitle:"Ramana's Work", description:'AI & Data Science portfolio', icon:'🤖', color:'#10b981', link:'/portfolio', category:'portfolio' },
  { title:'Freelance', subtitle:'Hire Ramana', description:'AI and web development', icon:'🎯', color:'#f59e0b', link:'/freelance', category:'portfolio' },
  { title:'Job Referrals', subtitle:'AI Job Links', description:'Exclusive AI platform referrals', icon:'🔗', color:'#6366f1', link:'/referrals', category:'portfolio' },
  { title:'Resume', subtitle:'Download CV', description:"View Ramana's resume", icon:'📄', color:'#14b8a6', link:'/resume', category:'portfolio' },
];
