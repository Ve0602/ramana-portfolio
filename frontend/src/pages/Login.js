import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/home';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState(null);
  const [tab, setTab] = useState('login');

  useEffect(() => {
    axios.get(`${API}/api/brand/site`).then(r => setBrand(r.data)).catch(() => {});
  }, []);

  const b = brand || defaultBrand;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>

      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: b.loginBgGradient || 'linear-gradient(135deg,#1a0a00,#2d1500,#1a0505)', zIndex: 0 }} />

      {/* Animated bg circles */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${b.primaryColor || '#d4a853'}20, transparent 70%)`,
            width: `${200 + i * 80}px`, height: `${200 + i * 80}px`,
            top: `${[10, 60, 30, 70, 5, 50][i]}%`,
            left: `${[5, 70, 40, 15, 80, 55][i]}%`,
            transform: 'translate(-50%,-50%)',
            animation: `float${i % 3} ${8 + i * 2}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      {/* Background video if set */}
      {b.loginVideo && (
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2, zIndex: 0 }}>
          <source src={b.loginVideo} />
        </video>
      )}

      {/* Left — Brand info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 40px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          {b.logo
            ? <img src={b.logo} alt="logo" style={{ height: 100, marginBottom: 16 }} />
            : (
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: `linear-gradient(135deg, ${b.primaryColor || '#d4a853'}, ${b.accentColor || '#b8860b'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: `0 0 40px ${b.primaryColor || '#d4a853'}50`, fontSize: 36, fontWeight: 900, color: '#fff', fontFamily: 'Syne,sans-serif' }}>
                {b.logoText || 'VC'}
              </div>
            )
          }
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(28px,4vw,48px)', color: b.primaryColor || '#d4a853', marginBottom: 8, textShadow: `0 0 30px ${b.primaryColor || '#d4a853'}60` }}>
            {b.name || 'Vemunoori Collections'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, letterSpacing: 3, textTransform: 'uppercase' }}>{b.tagline || 'Fashion · Technology · Excellence'}</p>
        </div>

        {/* Services preview */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 480 }}>
          {['👗 Fashion Boutique', '🧵 Tailoring', '💻 Digital Services', '📚 Training', '🤖 AI Portfolio', '🔗 Job Referrals'].map(s => (
            <div key={s} style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${b.primaryColor || '#d4a853'}30`, borderRadius: 20, padding: '6px 14px', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{s}</div>
          ))}
        </div>

        {b.aboutText && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', maxWidth: 380, marginTop: 24, lineHeight: 1.7 }}>{b.aboutText}</p>
        )}
      </div>

      {/* Right — Login/Register form */}
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', borderLeft: `1px solid ${b.primaryColor || '#d4a853'}20` }}>
        <div style={{ width: '100%' }}>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, marginBottom: 6, color: '#fff' }}>
            {tab === 'login' ? 'Welcome Back 👋' : 'Create Account'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 28 }}>
            {tab === 'login' ? 'Sign in to access all services' : 'Join Vemunoori Collections'}
          </p>

          {/* Tab switcher */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }} style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 600, background: tab === t ? (b.primaryColor || '#d4a853') : 'transparent', color: tab === t ? '#000' : 'rgba(255,255,255,0.5)', transition: 'all 0.2s' }}>
                {t === 'login' ? '🔑 Login' : '✨ Sign Up'}
              </button>
            ))}
          </div>

          {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 14, marginBottom: 16 }}>{error}</div>}

          {tab === 'login' ? (
            <LoginForm form={form} setForm={setForm} onSubmit={handleLogin} loading={loading} brandColor={b.primaryColor || '#d4a853'} />
          ) : (
            <RegisterForm brandColor={b.primaryColor || '#d4a853'} onSuccess={() => navigate('/home')} setError={setError} />
          )}

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            By continuing you agree to our Terms of Service
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float0{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-60%) scale(1.1);}}
        @keyframes float1{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-60%,-50%) scale(1.05);}}
        @keyframes float2{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-40%,-55%) scale(1.08);}}
      `}</style>
    </div>
  );
}

function LoginForm({ form, setForm, onSubmit, loading, brandColor }) {
  return (
    <form onSubmit={onSubmit}>
      {[['email', 'Email Address', 'email'], ['password', 'Password', 'password']].map(([key, label, type]) => (
        <div key={key} style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{label}</label>
          <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
            style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif' }}
            onFocus={e => e.target.style.borderColor = brandColor}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            required />
        </div>
      ))}
      <button type="submit" disabled={loading} style={{ width: '100%', background: `linear-gradient(135deg, ${brandColor}, #b8860b)`, color: '#000', border: 'none', borderRadius: 10, padding: 14, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Syne,sans-serif', marginTop: 4, opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Signing in...' : '→ Sign In'}
      </button>
    </form>
  );
}

function RegisterForm({ brandColor, onSuccess, setError }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      {[['name', 'Full Name', 'text'], ['email', 'Email Address', 'email'], ['password', 'Password', 'password']].map(([key, label, type]) => (
        <div key={key} style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>{label}</label>
          <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
            style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif' }}
            onFocus={e => e.target.style.borderColor = brandColor}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            required />
        </div>
      ))}
      <button type="submit" disabled={loading} style={{ width: '100%', background: `linear-gradient(135deg, ${brandColor}, #b8860b)`, color: '#000', border: 'none', borderRadius: 10, padding: 14, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Syne,sans-serif', marginTop: 4, opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Creating...' : '→ Create Account'}
      </button>
    </form>
  );
}

const defaultBrand = { name: 'Vemunoori Collections', tagline: 'Fashion · Technology · Excellence', logoText: 'VC', primaryColor: '#d4a853', accentColor: '#b8860b', loginBgGradient: 'linear-gradient(135deg,#1a0a00,#2d1500,#1a0505)' };
