import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const FACEBOOK_APP_ID  = process.env.REACT_APP_FACEBOOK_APP_ID  || '';
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || '';

export default function Login() {
  const { login, loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/home';
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/brand/site`).then(r => setBrand(r.data)).catch(() => {});
  }, []);

  // Load Google Identity Services script
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Load Facebook SDK
  useEffect(() => {
    if (!FACEBOOK_APP_ID) return;
    window.fbAsyncInit = () => {
      window.FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: true, version: 'v18.0' });
    };
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const initGoogle = useCallback(() => {
    if (!window.google || !GOOGLE_CLIENT_ID) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
  }, []);

  const handleGoogleResponse = async (response) => {
    setLoading('google'); setError('');
    try {
      const { data } = await axios.post(`${API}/api/auth/social/google`, { credential: response.credential });
      loginWithToken(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
    } finally { setLoading(''); }
  };

  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) { setError('Google login not configured yet. Use email/password for now.'); return; }
    window.google?.accounts.id.prompt();
  };

  const handleFacebookClick = async () => {
    if (!FACEBOOK_APP_ID) { setError('Facebook login not configured yet. Use email/password for now.'); return; }
    setLoading('facebook'); setError('');
    window.FB?.login(async (response) => {
      if (response.authResponse) {
        try {
          const { data } = await axios.post(`${API}/api/auth/social/facebook`, {
            accessToken: response.authResponse.accessToken,
            userID: response.authResponse.userID,
          });
          loginWithToken(data.token, data.user);
          navigate(data.user.role === 'admin' ? '/admin' : redirect);
        } catch (err) {
          setError(err.response?.data?.message || 'Facebook login failed');
        }
      } else {
        setError('Facebook login cancelled');
      }
      setLoading('');
    }, { scope: 'email,public_profile' });
  };

  const handleGitHubClick = () => {
    if (!GITHUB_CLIENT_ID) { setError('GitHub login not configured yet. Use email/password for now.'); return; }
    // Save redirect in localStorage so we can use it after GitHub callback
    localStorage.setItem('gh_redirect', redirect);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading('email'); setError('');
    try {
      if (tab === 'login') {
        const user = await login(form.email, form.password);
        navigate(user.role === 'admin' ? '/admin' : redirect);
      } else {
        const { data } = await axios.post(`${API}/api/auth/register`, { name: form.name, email: form.email, password: form.password });
        loginWithToken(data.token, data.user);
        navigate(redirect);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally { setLoading(''); }
  };

  const b = brand || defaultBrand;
  const gold = b.primaryColor || '#d4a853';

  return (
    <div style={{ minHeight:'100vh', display:'flex', position:'relative', overflow:'hidden' }}>

      {/* Background */}
      <div style={{ position:'absolute', inset:0, background: b.loginBgGradient || 'linear-gradient(135deg,#1a0a00,#2d1500,#1a0505)', zIndex:0 }} />

      {/* Animated circles */}
      <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none' }}>
        {[...Array(5)].map((_,i) => (
          <div key={i} style={{ position:'absolute', borderRadius:'50%', background:`radial-gradient(circle, ${gold}18, transparent 70%)`, width:`${180+i*70}px`, height:`${180+i*70}px`, top:`${[10,60,30,75,5][i]}%`, left:`${[5,70,40,15,80][i]}%`, transform:'translate(-50%,-50%)', animation:`float${i%3} ${8+i*2}s ease-in-out infinite` }} />
        ))}
      </div>

      {/* Background video */}
      {b.loginVideo && (
        <video autoPlay muted loop playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.18, zIndex:0 }}>
          <source src={b.loginVideo} />
        </video>
      )}

      {/* LEFT — Brand */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'60px 40px', position:'relative', zIndex:1, display:'none' }} className="login-left">
        <div style={{ textAlign:'center', marginBottom:28 }}>
          {b.logo
            ? <img src={b.logo} alt="logo" style={{ height:90, marginBottom:14 }} />
            : <div style={{ width:90, height:90, borderRadius:'50%', background:`linear-gradient(135deg,${gold},#b8860b)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', boxShadow:`0 0 36px ${gold}40`, fontSize:32, fontWeight:900, color:'#fff', fontFamily:'Syne,sans-serif' }}>{b.logoText||'VC'}</div>
          }
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'clamp(26px,4vw,44px)', color:gold, marginBottom:6, textShadow:`0 0 28px ${gold}50` }}>{b.name||'Vemunoori Collections'}</h1>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, letterSpacing:2, textTransform:'uppercase' }}>{b.tagline||'Fashion · Technology · Excellence'}</p>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', maxWidth:440 }}>
          {['👗 Fashion Boutique','🧵 Tailoring','💻 Digital Services','📚 Training','🤖 AI Portfolio','🔗 Job Referrals'].map(s => (
            <div key={s} style={{ background:'rgba(255,255,255,0.06)', border:`1px solid ${gold}25`, borderRadius:20, padding:'5px 13px', fontSize:12, color:'rgba(255,255,255,0.6)' }}>{s}</div>
          ))}
        </div>
        {b.aboutText && <p style={{ color:'rgba(255,255,255,0.35)', fontSize:12, textAlign:'center', maxWidth:360, marginTop:20, lineHeight:1.7 }}>{b.aboutText}</p>}
      </div>

      {/* RIGHT — Form (centred on mobile, right panel on desktop) */}
      <div style={{ width:'100%', maxWidth:460, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 28px', position:'relative', zIndex:1, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(22px)' }}>
        <div style={{ width:'100%' }}>

          {/* Logo (mobile / always visible) */}
          <div style={{ textAlign:'center', marginBottom:22 }}>
            {b.logo
              ? <img src={b.logo} alt="logo" style={{ height:60, marginBottom:10 }} />
              : <div style={{ width:60, height:60, borderRadius:'50%', background:`linear-gradient(135deg,${gold},#b8860b)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:22, fontWeight:900, color:'#fff', fontFamily:'Syne,sans-serif' }}>{b.logoText||'VC'}</div>
            }
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:20, color:gold }}>{b.name||'Vemunoori Collections'}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', letterSpacing:2 }}>{b.tagline||'FASHION · TECHNOLOGY'}</div>
          </div>

          <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, marginBottom:4, color:'#fff' }}>
            {tab==='login' ? 'Welcome Back 👋' : 'Create Account ✨'}
          </h2>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:20 }}>
            {tab==='login' ? 'Sign in to access all services' : 'Join Vemunoori Collections today'}
          </p>

          {/* Tab switch */}
          <div style={{ display:'flex', background:'rgba(255,255,255,0.06)', borderRadius:10, padding:3, marginBottom:20 }}>
            {['login','register'].map(t => (
              <button key={t} onClick={()=>{setTab(t);setError('');}} style={{ flex:1, padding:'9px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, background: tab===t ? gold : 'transparent', color: tab===t ? '#000' : 'rgba(255,255,255,0.4)', transition:'all 0.2s' }}>
                {t==='login' ? '🔑 Login' : '✨ Sign Up'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && <div style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'9px 13px', color:'#f87171', fontSize:13, marginBottom:14 }}>{error}</div>}

          {/* ── SOCIAL LOGIN BUTTONS ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
            <SocialBtn icon="G" label={loading==='google' ? 'Connecting...' : 'Continue with Google'} bg="#fff" color="#1f1f1f" onClick={handleGoogleClick} disabled={!!loading} />
            <SocialBtn icon="f" label={loading==='facebook' ? 'Connecting...' : 'Continue with Facebook'} bg="#1877f2" color="#fff" onClick={handleFacebookClick} disabled={!!loading} />
            <SocialBtn icon="⌥" label={loading==='github' ? 'Connecting...' : 'Continue with GitHub'} bg="#24292e" color="#fff" onClick={handleGitHubClick} disabled={!!loading} />
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
              <Inp type="text" placeholder="Full Name" value={form.name} onChange={v=>setForm({...form,name:v})} gold={gold} required />
            )}
            <Inp type="email" placeholder="Email Address" value={form.email} onChange={v=>setForm({...form,email:v})} gold={gold} required />
            <Inp type="password" placeholder="Password" value={form.password} onChange={v=>setForm({...form,password:v})} gold={gold} required />
            <button type="submit" disabled={!!loading} style={{ width:'100%', background:`linear-gradient(135deg,${gold},#b8860b)`, color:'#000', border:'none', borderRadius:10, padding:'13px', fontWeight:800, fontSize:15, cursor:loading?'not-allowed':'pointer', fontFamily:'Syne,sans-serif', marginTop:4, opacity:loading?0.7:1 }}>
              {loading==='email' ? 'Please wait...' : tab==='login' ? '→ Sign In' : '→ Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:16, fontSize:12, color:'rgba(255,255,255,0.25)' }}>
            By continuing you agree to our Terms of Service
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float0{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-60%) scale(1.1);}}
        @keyframes float1{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-60%,-50%) scale(1.05);}}
        @keyframes float2{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-40%,-55%) scale(1.08);}}
        @media(min-width:768px){.login-left{display:flex !important;}}
      `}</style>
    </div>
  );
}

function SocialBtn({ icon, label, bg, color, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width:'100%', background:bg, color, border:'none', borderRadius:10, padding:'11px 16px', fontWeight:700, fontSize:14, cursor:disabled?'not-allowed':'pointer', fontFamily:'DM Sans,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:10, opacity:disabled?0.7:1, transition:'all 0.2s', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}
      onMouseEnter={e=>!disabled && (e.currentTarget.style.transform='translateY(-2px)')}
      onMouseLeave={e=>(e.currentTarget.style.transform='translateY(0)')}>
      <span style={{ fontWeight:900, fontSize:16, width:20, textAlign:'center' }}>{icon}</span>
      {label}
    </button>
  );
}

function Inp({ type, placeholder, value, onChange, gold, required }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} required={required}
      style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 14px', color:'#fff', fontSize:14, outline:'none', fontFamily:'DM Sans,sans-serif', display:'block', marginBottom:10 }}
      onFocus={e=>e.target.style.borderColor=gold}
      onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />
  );
}

const defaultBrand = { name:'Vemunoori Collections', tagline:'Fashion · Technology · Excellence', logoText:'VC', primaryColor:'#d4a853', loginBgGradient:'linear-gradient(135deg,#1a0a00,#2d1500,#1a0505)' };
