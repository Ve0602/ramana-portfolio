import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };
  const active = (path) => location.pathname === path ? { color: 'var(--accent)' } : {};

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '16px 48px', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', background: 'rgba(5,7,15,0.92)',
      backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)'
    }}>
      <Link to="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: 1, color: 'var(--accent)' }}>RV</Link>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        {[['/', 'Portfolio'], ['/#experience', 'Experience'], ['/#skills', 'Skills'], ['/#projects', 'Projects']].map(([href, label]) => (
          <a key={label} href={href} style={{ ...navBtn, ...active(href === '/' ? '/' : '') }}>{label}</a>
        ))}

        {user ? (
          <>
            <Link to="/referrals" style={{ ...navBtn, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: 'var(--accent)', fontWeight: 600 }}>
              🔗 Job Referrals
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ ...navBtn, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', fontWeight: 600 }}>
                ⚙️ Admin
              </Link>
            )}
            <button onClick={handleLogout} style={{ ...navBtn, color: 'var(--muted)' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/referrals" style={{ ...navBtn, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: 'var(--accent)', fontWeight: 600 }}>
              🔗 Job Referrals
            </Link>
            <Link to="/login" style={navBtn}>Login</Link>
            <Link to="/register" style={{ ...navBtn, background: 'var(--accent)', color: '#000', fontWeight: 700 }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const navBtn = {
  background: 'none', border: 'none', color: 'var(--muted)',
  fontSize: 13, fontWeight: 500, padding: '7px 12px', borderRadius: 6,
  transition: 'all 0.2s', display: 'inline-block', cursor: 'pointer'
};
