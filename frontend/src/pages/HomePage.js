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

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => setActiveAdBanner(p => (p + 1) % adBanners.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const b = brand || defaultBrand;
  const gold = b.primaryColor || '#d4a853';
  const shopServices = services.filter(s => s.category === 'shop');
  const portfolioServices = services.filter(s => s.category !== 'shop');

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'DM Sans,sans-serif' }}>

      {/* TOP NAV BAR */}
      <div style={{ background: `linear-gradient(135deg, #1a0a00, #2d1500)`, borderBottom: `2px solid ${gold}30`, padding: '0 40px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 60 }}>
          <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            {b.logo
              ? <img src={b.logo} alt="logo" style={{ height: 40 }} />
              : <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${gold},#b8860b)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 900, color: '#000', fontSize: 15 }}>{b.logoText || 'VC'}</div>
            }
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, color: gold }}>{b.name || 'Vemunoori Collections'}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 }}>{b.tagline || 'FASHION · TECHNOLOGY'}</div>
            </div>
          </Link>

          <div style={{ flex: 1, margin: '0 20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${gold}30`, borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>🔍</span>
              <input placeholder="Search products, services..." style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14, width: '100%', fontFamily: 'DM Sans,sans-serif' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {b.phone && <a href={`tel:${b.phone}`} style={{ color: gold, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>📞 {b.phone}</a>}
            {user ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Hi, {user.name?.split(' ')[0]}</span>
                {user.role === 'admin' && <Link to="/admin" style={{ background: `${gold}20`, border: `1px solid ${gold}40`, color: gold, padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>⚙️ Admin</Link>}
                <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.5)', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Logout</button>
              </div>
            ) : (
              <Link to="/" style={{ background: `linear-gradient(135deg,${gold},#b8860b)`, color: '#000', padding: '8px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Login / Sign Up</Link>
            )}
          </div>
        </div>
      </div>

      {/* HERO BANNER / VIDEO */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 380, display: 'flex', alignItems: 'center' }}>
        {b.homeBannerVideo ? (
          <>
            <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}>
              <source src={b.homeBannerVideo} />
            </video>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(10,5,0,0.8),rgba(0,0,0,0.5))' }} />
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #1a0800, #0d0d0d, #1a0008)` }}>
            {/* Animated banner */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              {adBanners.map((banner, i) => (
                <div key={i} style={{ position: 'absolute', inset: 0, transition: 'opacity 1s', opacity: activeAdBanner === i ? 1 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: banner.bg }}>
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: 60, marginBottom: 16 }}>{banner.icon}</div>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(24px,4vw,48px)', fontWeight: 900, color: gold, marginBottom: 8 }}>{banner.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>{banner.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 1, padding: '60px 60px', maxWidth: 700 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${gold}20`, border: `1px solid ${gold}40`, borderRadius: 30, padding: '6px 16px', fontSize: 12, color: gold, marginBottom: 20, letterSpacing: 2, textTransform: 'uppercase' }}>
            ✨ Welcome to {b.name || 'Vemunoori Collections'}
          </div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(28px,5vw,56px)', lineHeight: 1.1, marginBottom: 16, color: '#fff' }}>
            {b.tagline || 'Fashion · Technology · Excellence'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 500, marginBottom: 28 }}>
            {b.aboutText || 'Your one-stop destination for beautiful fashion, expert tailoring, and modern technology services.'}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/shop" style={{ background: `linear-gradient(135deg,${gold},#b8860b)`, color: '#000', padding: '13px 28px', borderRadius: 10, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
              👗 Shop Now
            </Link>
            <a href={`https://wa.me/${(b.whatsapp || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366', padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>

        {/* Banner dots */}
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 2 }}>
          {adBanners.map((_, i) => (
            <button key={i} onClick={() => setActiveAdBanner(i)} style={{ width: activeAdBanner === i ? 24 : 8, height: 8, borderRadius: 4, background: activeAdBanner === i ? gold : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>

      {/* SHOP SERVICES */}
      <div style={{ padding: '48px 40px' }}>
        <SectionHeader title="🛍️ Our Products & Services" subtitle="Explore what we offer" gold={gold} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20, marginBottom: 48 }}>
          {(shopServices.length > 0 ? shopServices : defaultServices.filter(s => s.category === 'shop')).map(service => (
            <ServiceCard key={service._id || service.title} service={service} gold={gold} />
          ))}
        </div>

        {/* PORTFOLIO & OTHER SERVICES */}
        <SectionHeader title="💼 Portfolio & Professional Services" subtitle="AI, Freelance, and Career" gold={gold} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20, marginBottom: 48 }}>
          {(portfolioServices.length > 0 ? portfolioServices : defaultServices.filter(s => s.category !== 'shop')).map(service => (
            <ServiceCard key={service._id || service.title} service={service} gold={gold} />
          ))}
        </div>

        {/* REVIEWS */}
        {reviews.length > 0 && (
          <>
            <SectionHeader title="⭐ Customer Reviews" subtitle="What people say about us" gold={gold} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18, marginBottom: 48 }}>
              {reviews.map(r => (
                <div key={r._id} style={{ background: '#111', border: `1px solid ${gold}20`, borderRadius: 12, padding: '20px 22px' }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                    {[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: 16, color: i < r.rating ? gold : 'rgba(255,255,255,0.15)' }}>★</span>)}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>"{r.comment}"</p>
                  <div style={{ color: gold, fontWeight: 700, fontSize: 13 }}>— {r.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CONTACT STRIP */}
        <div style={{ background: `linear-gradient(135deg, #1a0800, #0d0500)`, border: `1px solid ${gold}30`, borderRadius: 16, padding: '36px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: gold, marginBottom: 6 }}>Get In Touch</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{b.location || 'Warangal, Telangana'} · {b.openHours || 'Mon-Sat: 9 AM – 8 PM'}</div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {b.phone && <a href={`tel:${b.phone}`} style={{ background: `${gold}20`, border: `1px solid ${gold}40`, color: gold, padding: '11px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>📞 Call</a>}
            {b.whatsapp && <a href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366', padding: '11px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>💬 WhatsApp</a>}
            {b.email && <a href={`mailto:${b.email}`} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '11px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>✉️ Email</a>}
          </div>
        </div>
      </div>

      <footer style={{ padding: '20px 40px', borderTop: `1px solid ${gold}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>© 2026 {b.name || 'Vemunoori Collections'} · All rights reserved</div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[['/', '🏠 Home'], ['/shop', '👗 Shop'], ['/portfolio', '🤖 Portfolio'], ['/freelance', '💼 Hire Me']].map(([to, label]) => (
            <Link key={to} to={to} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ title, subtitle, gold }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: '#fff', marginBottom: 4 }}>{title}</h2>
      <div style={{ width: 48, height: 3, background: gold, borderRadius: 2, marginBottom: 4 }} />
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{subtitle}</p>
    </div>
  );
}

function ServiceCard({ service, gold }) {
  const color = service.color || gold;
  const content = (
    <div style={{ background: '#111', border: `1px solid ${color}25`, borderRadius: 14, padding: '24px 20px', cursor: 'pointer', transition: 'all 0.25s', position: 'relative', overflow: 'hidden', height: '100%' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 30px ${color}20`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}25`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      {service.badge && <div style={{ position: 'absolute', top: 12, right: 12, background: `${color}20`, border: `1px solid ${color}40`, color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 12, letterSpacing: 1 }}>{service.badge}</div>}
      {service.image
        ? <img src={service.image} alt={service.title} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 14 }} />
        : <div style={{ fontSize: 40, marginBottom: 14 }}>{service.icon}</div>
      }
      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>{service.title}</div>
      <div style={{ fontSize: 12, color, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{service.subtitle}</div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6 }}>{service.description}</div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color, fontSize: 13, fontWeight: 700 }}>Explore <span>→</span></div>
    </div>
  );

  return service.isExternal
    ? <a href={service.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>{content}</a>
    : <Link to={service.link} style={{ textDecoration: 'none' }}>{content}</Link>;
}

const adBanners = [
  { icon: '👗', title: 'New Arrivals', subtitle: 'Kids dresses & Women jackets this season', bg: 'linear-gradient(135deg,#1a0800,#2d0f00)' },
  { icon: '🧵', title: 'Expert Tailoring', subtitle: 'Custom stitching for every occasion', bg: 'linear-gradient(135deg,#0a001a,#1a0030)' },
  { icon: '🤖', title: 'AI & Tech Services', subtitle: 'Prompt Engineering · Data Science · Web Dev', bg: 'linear-gradient(135deg,#001a1a,#002d2d)' },
  { icon: '📚', title: 'Learn Tailoring', subtitle: 'Professional classes for beginners', bg: 'linear-gradient(135deg,#001a0a,#002d15)' },
];

const defaultBrand = { name: 'Vemunoori Collections', tagline: 'Fashion · Technology · Excellence', logoText: 'VC', primaryColor: '#d4a853', phone: '+91 8499882843', whatsapp: '+91 8499882843', email: 'vemunooriramana0602@gmail.com', location: 'Warangal, Telangana', openHours: 'Mon-Sat: 9 AM – 8 PM', aboutText: 'Your one-stop destination for beautiful fashion, expert tailoring, and modern technology services.' };

const defaultServices = [
  { title: 'Fashion Boutique', subtitle: 'Kids & Women Wear', description: 'Beautiful kids dresses, women jackets, and sarees', icon: '👗', color: '#d4a853', link: '/shop', category: 'shop', badge: 'New' },
  { title: 'Tailoring Services', subtitle: 'Custom Stitching', description: 'Professional tailoring for all occasions', icon: '🧵', color: '#e91e8c', link: '/shop?cat=tailoring', category: 'shop' },
  { title: 'Computer & Design', subtitle: 'Tech Services', description: 'Computer work and graphic design services', icon: '💻', color: '#00d4ff', link: '/shop?cat=computer', category: 'service' },
  { title: 'Teaching', subtitle: 'Learn Tailoring', description: 'Professional tailoring classes', icon: '📚', color: '#7c3aed', link: '/shop?cat=teaching', category: 'service' },
  { title: 'AI Portfolio', subtitle: "Ramana's Work", description: 'AI & Data Science professional portfolio', icon: '🤖', color: '#10b981', link: '/portfolio', category: 'portfolio' },
  { title: 'Freelance', subtitle: 'Hire Ramana', description: 'AI and web development services', icon: '🎯', color: '#f59e0b', link: '/freelance', category: 'portfolio' },
  { title: 'Job Referrals', subtitle: 'AI Job Links', description: 'Exclusive referral links to AI platforms', icon: '🔗', color: '#6366f1', link: '/referrals', category: 'portfolio' },
  { title: 'Resume', subtitle: 'Download CV', description: "View Ramana's professional resume", icon: '📄', color: '#14b8a6', link: '/resume', category: 'portfolio' },
];
