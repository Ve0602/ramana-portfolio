import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#1a0a00,#0a0a0a)', padding:'80px 20px' }}>
      <div style={{ width:'100%', maxWidth:440, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:16, padding:40, boxShadow:'0 0 40px rgba(212,168,83,0.08)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#d4a853,#b8860b)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontFamily:'Syne,sans-serif', fontWeight:900, color:'#000', fontSize:20 }}>VC</div>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, color:'#fff', marginBottom:4 }}>Create Account ✨</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13 }}>Join Vemunoori Collections today</p>
        </div>

        {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', color:'#f87171', fontSize:14, marginBottom:16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            ['name',     'Full Name *',          'text',     'Ramana Vemunoori'],
            ['email',    'Email Address *',       'email',    'your@email.com'],
            ['phone',    'Phone Number',          'tel',      '+91 99999 99999'],
            ['password', 'Password *',            'password', 'Min 6 characters'],
          ].map(([key, label, type, placeholder]) => (
            <div key={key} style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:5 }}>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                required={key !== 'phone'}
                style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 14px', color:'#fff', fontSize:14, outline:'none', fontFamily:'DM Sans,sans-serif' }}
                onFocus={e => e.target.style.borderColor='#d4a853'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
              />
            </div>
          ))}

          <p style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginBottom:14 }}>
            📱 Phone number is optional but helps us send you offers via WhatsApp
          </p>

          <button type="submit" disabled={loading} style={{ width:'100%', background:'linear-gradient(135deg,#d4a853,#b8860b)', color:'#000', border:'none', borderRadius:10, padding:'13px', fontWeight:800, fontSize:15, cursor:loading?'not-allowed':'pointer', fontFamily:'Syne,sans-serif', opacity:loading?0.7:1 }}>
            {loading ? 'Creating account...' : '→ Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:18, fontSize:14, color:'rgba(255,255,255,0.4)' }}>
          Already have an account? <Link to="/" style={{ color:'#d4a853', fontWeight:600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
