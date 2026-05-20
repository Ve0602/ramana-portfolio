import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  const navLink = (to, label, isHash = false) => (
    isHash
      ? <a href={to} style={{ ...nb, color: 'var(--muted)' }} onClick={() => setMenuOpen(false)}>{label}</a>
      : <Link to={to} style={{ ...nb, color: isActive(to) ? 'var(--accent)' : 'var(--muted)' }} onClick={() => setMenuOpen(false)}>{label}</Link>
  );

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '14px 40px', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', background: 'rgba(5,7,15,0.95)',
      backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)'
    }}>
      <Link to="/" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: 1, color: 'var(--accent)', textDecoration: 'none' }}>RV</Link>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
        {navLink('/#experience', 'Experience', true)}
        {navLink('/#skills', 'Skills', true)}
        {navLink('/#projects', 'Projects', true)}
        {navLink('/resume', '📄 Resume')}
        {navLink('/freelance', '💼 Hire Me')}

        <Link to="/referrals" style={{ ...nb, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: 'var(--accent)', fontWeight: 600 }}>
          🔗 Referrals
        </Link>

        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ ...nb, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', fontWeight: 600 }}>
                ⚙️ Admin
              </Link>
            )}
            <button onClick={handleLogout} style={{ ...nb, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={nb}>Login</Link>
            <Link to="/register" style={{ ...nb, background: 'var(--accent)', color: '#000', fontWeight: 700 }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const nb = {
  fontSize: 13, fontWeight: 500, padding: '7px 12px', borderRadius: 6,
  transition: 'all 0.2s', display: 'inline-block', textDecoration: 'none',
  fontFamily: 'DM Sans,sans-serif', color: 'var(--muted)'
};
