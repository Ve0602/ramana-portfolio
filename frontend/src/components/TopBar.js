import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/brand/site`).then(r => setBrand(r.data)).catch(() => {});
  }, []);

  const gold = brand?.primaryColor || '#d4a853';
  const isHome = location.pathname === '/home';
  const isLogin = location.pathname === '/';

  // Don't show on login page
  if (isLogin) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      background: 'rgba(10,5,0,0.95)', backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${gold}20`, padding: '0 32px',
      display: 'flex', alignItems: 'center', gap: 12, height: 54
    }}>
      {/* Logo */}
      <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
        {brand?.logo
          ? <img src={brand.logo} alt="logo" style={{ height: 32 }} />
          : <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg,${gold},#b8860b)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 900, color: '#000', fontSize: 12 }}>{brand?.logoText || 'VC'}</div>
        }
        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, color: gold }}>{brand?.name || 'VC'}</span>
      </Link>

      {/* Back button */}
      {!isHome && (
        <button onClick={() => navigate(-1)} style={nb}>← Back</button>
      )}

      {/* Home button */}
      {!isHome && (
        <Link to="/home" style={nb}>🏠 Home</Link>
      )}

      {/* Nav links */}
      <div style={{ flex: 1, display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          ['/shop', '👗 Shop'],
          ['/portfolio', '🤖 Portfolio'],
          ['/freelance', '💼 Hire Me'],
          ['/resume', '📄 Resume'],
        ].map(([to, label]) => (
          <Link key={to} to={to} style={{ ...nb, color: location.pathname === to ? gold : 'rgba(255,255,255,0.4)', background: location.pathname === to ? `${gold}15` : 'transparent' }}>{label}</Link>
        ))}
        <Link to="/referrals" style={{ ...nb, background: `${gold}15`, border: `1px solid ${gold}30`, color: gold, fontWeight: 600 }}>🔗 Referrals</Link>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {user ? (
          <>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Hi, {user.name?.split(' ')[0]}</span>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ ...nb, background: `${gold}20`, border: `1px solid ${gold}40`, color: gold, fontWeight: 700 }}>⚙️ Admin</Link>
            )}
            <button onClick={() => { logout(); navigate('/'); }} style={{ ...nb, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>Logout</button>
          </>
        ) : (
          <Link to="/" style={{ ...nb, background: `linear-gradient(135deg,${gold},#b8860b)`, color: '#000', fontWeight: 700 }}>Login</Link>
        )}
      </div>
    </div>
  );
}

const nb = {
  fontSize: 12, fontWeight: 500, padding: '6px 12px', borderRadius: 6,
  textDecoration: 'none', color: 'rgba(255,255,255,0.5)',
  transition: 'all 0.2s', display: 'inline-block', fontFamily: 'DM Sans,sans-serif',
  background: 'transparent', border: 'none', cursor: 'pointer'
};
