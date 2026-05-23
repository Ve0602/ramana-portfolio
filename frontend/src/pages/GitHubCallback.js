import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function GitHubCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [status, setStatus] = useState('Connecting with GitHub...');

  useEffect(() => {
    const code = params.get('code');
    if (!code) { setStatus('No code received from GitHub.'); return; }

    axios.post(`${API}/api/auth/social/github`, { code })
      .then(({ data }) => {
        loginWithToken(data.token, data.user);
        const redirect = localStorage.getItem('gh_redirect') || '/home';
        localStorage.removeItem('gh_redirect');
        navigate(data.user.role === 'admin' ? '/admin' : redirect);
      })
      .catch(err => {
        setStatus('GitHub login failed: ' + (err.response?.data?.message || 'Please try again.'));
        setTimeout(() => navigate('/'), 3000);
      });
  }, []);

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0500', flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:48 }}>⌥</div>
      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:20, color:'#d4a853' }}>{status}</div>
      <div style={{ color:'rgba(255,255,255,0.4)', fontSize:14 }}>Please wait...</div>
    </div>
  );
}
