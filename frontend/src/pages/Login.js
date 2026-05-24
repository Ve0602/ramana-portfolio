import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const GOOGLE_CLIENT_ID  = process.env.REACT_APP_GOOGLE_CLIENT_ID  || '';
const FACEBOOK_APP_ID   = process.env.REACT_APP_FACEBOOK_APP_ID   || '';
const GITHUB_CLIENT_ID  = process.env.REACT_APP_GITHUB_CLIENT_ID  || '';

export default function Login() {
  const { login, loginWithToken, user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/home';

  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const [brand, setBrand] = useState(null);
  const [fbReady, setFbReady] = useState(false);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : redirect);
  }, [user]);

  useEffect(() => {
    axios.get(`${API}/api/brand/site`).then(r => setBrand(r.data)).catch(() => {});
  }, []);

  // ── Load Google SDK ──────────────────────────────────────────
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    if (document.getElementById('google-gsi')) return;
    const script = document.createElement('script');
    script.id = 'google-gsi';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.body.appendChild(script);
  }, []);

  const initGoogle = useCallback(() => {
    if (!window.google || !GOOGLE_CLIENT_ID) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
  }, []);

  // ── Load Facebook SDK ────────────────────────────────────────
  useEffect(() => {
    if (!FACEBOOK_APP_ID) return;
    if (document.getElementById('facebook-sdk')) {
      // SDK already loaded, just init
      if (window.FB) {
        window.FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: false, version: 'v18.0' });
        setFbReady(true);
      }
      return;
    }
    window.fbAsyncInit = () => {
      window.FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: false, version: 'v18.0' });
      setFbReady(true);
    };
    const script = document.createElement('script');
    script.id = 'facebook-sdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // ── Google handler ───────────────────────────────────────────
  const handleGoogleResponse = async (response) => {
    setLoading('google'); setError('');
    try {
      const { data } = await axios.post(`${API}/api/auth/social/google`, { credential: response.credential });
      loginWithToken(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
    } finally { setLoading(''); }
  };

  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google login is not set up yet. Please use email/password for now.');
      return;
    }
    // Re-init in case it wasn't ready
    if (window.google) {
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleResponse });
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: render button in hidden div and click it
          setError('Google popup was blocked. Please allow popups and try again.');
        }
      });
    } else {
      setError('Google SDK not loaded. Please refresh the page.');
    }
  };

  // ── Facebook handler ─────────────────────────────────────────
  const handleFacebookClick = () => {
    if (!FACEBOOK_APP_ID) {
      setError('Facebook login is not set up yet. Please use email/password for now.');
      return;
    }
    if (!fbReady || !window.FB) {
      setError('Facebook SDK is still loading. Please wait a moment and try again.');
      return;
    }
    setLoading('facebook'); setError('');
    window.FB.login((response) => {
      if (response.status === 'connected' && response.authResponse) {
        const { accessToken, userID } = response.authResponse;
        axios.post(`${API}/api/auth/social/facebook`, { accessToken, userID })
          .then(({ data }) => {
            loginWithToken(data.token, data.user);
            navigate(data.user.role === 'admin' ? '/admin' : redirect);
          })
          .catch(err => {
            setError(err.response?.data?.message || 'Facebook login failed. Please try again.');
          })
          .finally(() => setLoading(''));
      } else if (response.status === 'not_authorized') {
        setError('You did not authorize the app. Please try again and click OK.');
        setLoading('');
      } else {
        setError('Facebook login cancelled or failed. Please try again.');
        setLoading('');
      }
    }, { scope: 'email,public_profile', return_scopes: true });
  };

  // ── GitHub handler ───────────────────────────────────────────
  const handleGitHubClick = () => {
    if (!GITHUB_CLIENT_ID) {
      setError('GitHub login is not set up yet. Please use email/password for now.');
      return;
    }
    localStorage.setItem('gh_redirect', redirect);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`;
  };

  // ── Email form submit ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading('email'); setError('');
    try {
      if (tab === 'login') {
        const user = await login(form.email, form.password);
        navigate(user.role === 'admin' ? '/admin' : redirect);
      } else {
        const { data } = await axios.post(`${API}/api/auth/register`, {
          name: form.name, email: form.email, password: form.password
        });
        loginWithToken(data.token, data.user);
        navigate(redirect);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally { setLoading(''); }
  };

  const b = brand || defaultBrand;
  const gold = b.primaryColor || '#d4a853';

  return (
    <div style={{ minHeight:'100vh', display:'flex', position:'relative', overflow:'hidden', fontFamily:'DM Sans,sans-serif' }}>

      {/* Background */}
      <div style={{ position:'absolute', inset:0, background: b.loginBgGradient || 'linear-gradient(135deg,#1a0a00,#2d1500,#1a0505)', zIndex:0 }} />

      {/* Background video */}
      {b.loginVideo && (
        <video autoPlay muted loop playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.15, zIndex:0 }}>
          <source src={b.loginVideo} />
        </video>
      )}

      {/* Animated glow circles */}
      <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none' }}>
        {[...Array(5)].map((_,i) => (
          <div key={i} style={{
            position:'absolute', borderRadius:'50%',
            background:`radial-gradient(circle, ${gold}15, transparent 70%)`,
            width:`${160+i*80}px`, height:`${160+i*80}px`,
            top:`${[10,60,30,75,5][i]}%`, left:`${[5,70,40,15,80][i]}%`,
            transform:'translate(-50%,-50%)',
            animation:`float${i%3} ${8+i*2}s ease-in-out infinite`
          }} />
        ))}
      </div>

      {/* LEFT — Brand panel (visible on desktop) */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'60px 40px', position:'relative', zIndex:1 }}
        className="login-left-panel">
        <div style={{ textAlign:'center', marginBottom:28 }}>
          {b.logo
            ? <img src={b.logo} alt="logo" style={{ height:90, marginBottom:14 }} />
            : <div style={{ width:90, height:90, borderRadius:'50%', background:`linear-gradient(135deg,${gold},#b8860b)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', boxShadow:`0 0 36px ${gold}40`, fontSize:32, fontWeight:900, color:'#fff', fontFamily:'Syne,sans-serif' }}>{b.logoText||'VC'}</div>
          }
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'clamp(26px,4vw,44px)', color:gold, marginBottom:6, textShadow:`0 0 28px ${gold}50` }}>{b.name||'Vemunoori Collections'}</h1>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, letterSpacing:2, textTransform:'uppercase' }}>{b.tagline||'Fashion · Technology · Excellence'}</p>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', maxWidth:420 }}>
          {['👗 Fashion Boutique','🧵 Tailoring','💻 Digital Services','📚 Training','🤖 AI Portfolio','🔗 Job Referrals'].map(s => (
            <div key={s} style={{ background:'rgba(255,255,255,0.06)', border:`1px solid ${gold}20`, borderRadius:20, padding:'5px 13px', fontSize:12, color:'rgba(255,255,255,0.55)' }}>{s}</div>
          ))}
        </div>
        {b.aboutText && <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12, textAlign:'center', maxWidth:360, marginTop:20, lineHeight:1.7 }}>{b.aboutText}</p>}
      </div>

      {/* RIGHT — Form panel */}
      <div style={{ width:'100%', maxWidth:460, display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 28px', position:'relative', zIndex:1, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(22px)', borderLeft:`1px solid ${gold}15` }}>
        <div style={{ width:'100%' }}>

          {/* Mobile logo */}
          <div style={{ textAlign:'center', marginBottom:20 }} className="mobile-logo">
            {b.logo
              ? <img src={b.logo} alt="logo" style={{ height:52, marginBottom:8 }} />
              : <div style={{ width:52, height:52, borderRadius:'50%', background:`linear-gradient(135deg,${gold},#b8860b)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 8px', fontSize:18, fontWeight:900, color:'#fff', fontFamily:'Syne,sans-serif' }}>{b.logoText||'VC'}</div>
            }
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:18, color:gold }}>{b.name||'Vemunoori Collections'}</div>
          </div>

          <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, marginBottom:4, color:'#fff' }}>
            {tab==='login' ? 'Welcome Back 👋' : 'Create Account ✨'}
          </h2>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:20 }}>
            {tab==='login' ? 'Sign in to access all services' : 'Join Vemunoori Collections today'}
          </p>

          {/* Redirect notice */}
          {params.get('redirect') && (
            <div style={{ background:'rgba(212,168,83,0.1)', border:'1px solid rgba(212,168,83,0.25)', borderRadius:8, padding:'9px 13px', color:'#d4a853', fontSize:13, marginBottom:14 }}>
              🔒 Please sign in to access this page
            </div>
          )}

          {/* Tab switcher */}
          <div style={{ display:'flex', background:'rgba(255,255,255,0.06)', borderRadius:10, padding:3, marginBottom:20 }}>
            {['login','register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }} style={{ flex:1, padding:'9px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, background: tab===t ? gold : 'transparent', color: tab===t ? '#000' : 'rgba(255,255,255,0.4)', transition:'all 0.2s' }}>
                {t==='login' ? '🔑 Login' : '✨ Sign Up'}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'9px 13px', color:'#f87171', fontSize:13, marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>{error}</span>
              <button onClick={() => setError('')} style={{ background:'none', border:'none', color:'#f87171', cursor:'pointer', fontSize:16, padding:0 }}>✕</button>
            </div>
          )}

          {/* ── SOCIAL LOGIN BUTTONS ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:18 }}>

            {/* Google */}
            <SocialBtn
              icon={<GoogleIcon />}
              label={loading==='google' ? '⏳ Connecting...' : 'Continue with Google'}
              bg="#fff" color="#1f1f1f"
              onClick={handleGoogleClick}
              disabled={!!loading}
            />

            {/* Facebook */}
            <SocialBtn
              icon={<span style={{ fontWeight:900, fontSize:18, color:'#fff' }}>f</span>}
              label={loading==='facebook' ? '⏳ Connecting...' : 'Continue with Facebook'}
              bg="#1877f2" color="#fff"
              onClick={handleFacebookClick}
              disabled={!!loading}
            />

            {/* GitHub */}
            <SocialBtn
              icon={<span style={{ fontWeight:900, fontSize:16, color:'#fff' }}>⌥</span>}
              label={loading==='github' ? '⏳ Connecting...' : 'Continue with GitHub'}
              bg="#24292e" color="#fff"
              onClick={handleGitHubClick}
              disabled={!!loading}
            />
          </div>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }} />
            <span style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>or continue with email</span>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit}>
            {tab==='register' && (
              <Inp type="text" placeholder="Full Name" value={form.name} onChange={v => setForm({...form,name:v})} gold={gold} required />
            )}
            <Inp type="email" placeholder="Email Address" value={form.email} onChange={v => setForm({...form,email:v})} gold={gold} required />
            <Inp type="password" placeholder="Password" value={form.password} onChange={v => setForm({...form,password:v})} gold={gold} required />

            <button type="submit" disabled={!!loading} style={{ width:'100%', background:`linear-gradient(135deg,${gold},#b8860b)`, color:'#000', border:'none', borderRadius:10, padding:'13px', fontWeight:800, fontSize:15, cursor:loading?'not-allowed':'pointer', fontFamily:'Syne,sans-serif', marginTop:4, opacity:loading?0.7:1, transition:'all 0.2s' }}>
              {loading==='email' ? '⏳ Please wait...' : tab==='login' ? '→ Sign In' : '→ Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:14, fontSize:12, color:'rgba(255,255,255,0.25)' }}>
            By continuing you agree to our Terms of Service
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float0{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-60%) scale(1.1);}}
        @keyframes float1{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-60%,-50%) scale(1.05);}}
        @keyframes float2{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-40%,-55%) scale(1.08);}}
        .login-left-panel { display: none; }
        .mobile-logo { display: block; }
        @media(min-width:768px) {
          .login-left-panel { display: flex; }
          .mobile-logo { display: none; }
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────

function SocialBtn({ icon, label, bg, color, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ width:'100%', background:bg, color, border:'none', borderRadius:10, padding:'11px 16px', fontWeight:600, fontSize:14, cursor:disabled?'not-allowed':'pointer', fontFamily:'DM Sans,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:10, opacity:disabled?0.7:1, transition:'all 0.2s', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}
      onMouseEnter={e => { if(!disabled) e.currentTarget.style.transform='translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}>
      <span style={{ width:20, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center' }}>{icon}</span>
      {label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
    </svg>
  );
}

function Inp({ type, placeholder, value, onChange, gold, required }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 14px', color:'#fff', fontSize:14, outline:'none', fontFamily:'DM Sans,sans-serif', display:'block', marginBottom:10 }}
      onFocus={e => e.target.style.borderColor=gold}
      onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
    />
  );
}

const defaultBrand = {
  name: 'Vemunoori Collections',
  tagline: 'Fashion · Technology · Excellence',
  logoText: 'VC',
  primaryColor: '#d4a853',
  loginBgGradient: 'linear-gradient(135deg,#1a0a00,#2d1500,#1a0505)'
};
