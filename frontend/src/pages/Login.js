import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/referrals';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'80px 20px' }}>
      <div style={{ width:'100%', maxWidth:420, background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:40, boxShadow:'0 0 40px rgba(0,212,255,0.1)' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:32, fontWeight:800, color:'var(--accent)', marginBottom:8 }}>RV</div>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:24, fontWeight:800, marginBottom:8 }}>Welcome Back</h2>
          <p style={{ color:'var(--muted)', fontSize:14 }}>Log in to access job referrals</p>
        </div>
        {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', color:'#f87171', fontSize:14, marginBottom:20 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[['email','Email Address','email'],['password','Password','password']].map(([key, label, type]) => (
            <div key={key} style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:13, color:'var(--muted)', marginBottom:6 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm({...form, [key]:e.target.value})}
                style={{ width:'100%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'12px 14px', color:'var(--text)', fontSize:14, outline:'none' }}
                onFocus={e => e.target.style.borderColor='var(--accent)'}
                onBlur={e => e.target.style.borderColor='var(--border)'}
                required />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width:'100%', background:'var(--accent)', color:'#000', border:'none', borderRadius:8, padding:'13px', fontWeight:700, fontSize:15, marginTop:8, opacity:loading?0.7:1 }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--muted)' }}>
          Don't have an account? <Link to="/register" style={{ color:'var(--accent)', fontWeight:600 }}>Sign Up Free</Link>
        </p>
        <p style={{ textAlign:'center', marginTop:8, fontSize:14, color:'var(--muted)' }}>
          <Link to="/" style={{ color:'var(--muted)' }}>← Back to Portfolio</Link>
        </p>
      </div>
    </div>
  );
}
