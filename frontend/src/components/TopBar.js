import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Pages that require login to access
const PROTECTED_ROUTES = ['/home', '/shop', '/freelance', '/referrals', '/admin'];

// Pages that are public (no login needed)
const PUBLIC_ROUTES = ['/', '/portfolio', '/resume', '/register', '/auth/github'];

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/brand/site`).then(r => setBrand(r.data)).catch(() => {});
  }, []);

  const gold = brand?.primaryColor || '#d4a853';
  const isLoginPage = location.pathname === '/';

  // Don't show TopBar on login page at all
  if (isLoginPage) return null;

  // Handle click on protected nav links
  const handleProtectedClick = (e, path) => {
    if (!user) {
      e.preventDefault();
      navigate(`/?redirect=${path}`);
    }
  };

  // Protected nav link component
  const ProtectedLink = ({ to, children, style }) => (
    <Link
      to={to}
      style={style}
      onClick={e => handleProtectedClick(e, to)}>
      {children}
    </Link>
  );

  const isActive = (path) => location.pathname === path;

  const nb = (path, isProtected = false) => ({
    fontSize: 12,
    fontWeight: 500,
    padding: '6px 12px',
    borderRadius: 6,
    textDecoration: 'none',
    color: isActive(path) ? gold : 'rgba(255,255,255,0.5)',
    background: isActive(path) ? `${gold}15` : 'transparent',
    transition: 'all 0.2s',
    display: 'inline-block',
    fontFamily: 'DM Sans,sans-serif',
    cursor: 'pointer',
  });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      background: 'rgba(10,5,0,0.96)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${gold}20`,
      padding: '0 28px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 54,
    }}>

      {/* Logo */}
      <Link to={user ? '/home' : '/'} style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', flexShrink:0 }}>
        {brand?.logo
          ? <img src={brand.logo} alt="logo" style={{ height:30 }} />
          : <div style={{ width:30, height:30, borderRadius:'50%', background:`linear-gradient(135deg,${gold},#b8860b)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:900, color:'#000', fontSize:12 }}>{brand?.logoText || 'VC'}</div>
        }
        <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:13, color:gold }}>{brand?.name || 'VC'}</span>
      </Link>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{ ...nb('/'), background:'none', border:'none', cursor:'pointer', flexShrink:0 }}>
        ← Back
      </button>

      {/* Home — protected */}
      <ProtectedLink to="/home" style={nb('/home', true)}>🏠 Home</ProtectedLink>

      {/* Nav links */}
      <div style={{ flex:1, display:'flex', gap:2, justifyContent:'center', flexWrap:'wrap' }}>

        {/* Shop — protected */}
        <ProtectedLink to="/shop" style={nb('/shop', true)}>👗 Shop</ProtectedLink>

        {/* Portfolio — PUBLIC, no login needed */}
        <Link to="/portfolio" style={nb('/portfolio')}>🤖 Portfolio</Link>

        {/* Hire Me — protected */}
        <ProtectedLink to="/freelance" style={nb('/freelance', true)}>💼 Hire Me</ProtectedLink>

        {/* Resume — PUBLIC, no login needed */}
        <Link to="/resume" style={nb('/resume')}>📄 Resume</Link>

        {/* Referrals — protected */}
        <ProtectedLink
          to="/referrals"
          style={{
            ...nb('/referrals', true),
            background: `${gold}15`,
            border: `1px solid ${gold}30`,
            color: gold,
            fontWeight: 600,
          }}>
          🔗 Referrals
        </ProtectedLink>
      </div>

      {/* Right side */}
      <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
        {user ? (
          <>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', display:'flex', alignItems:'center', gap:6 }}>
              {user.photo && <img src={user.photo} alt="" style={{ width:22, height:22, borderRadius:'50%', objectFit:'cover' }} />}
              Hi, {user.name?.split(' ')[0]}
            </span>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ ...nb('/admin'), background:`${gold}20`, border:`1px solid ${gold}40`, color:gold, fontWeight:700 }}>⚙️ Admin</Link>
            )}
            <button
              onClick={() => { logout(); navigate('/'); }}
              style={{ ...nb('/'), background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', fontSize:12 }}>
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/"
            style={{ background:`linear-gradient(135deg,${gold},#b8860b)`, color:'#000', padding:'7px 18px', borderRadius:8, fontWeight:800, fontSize:13, textDecoration:'none', fontFamily:'Syne,sans-serif' }}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
