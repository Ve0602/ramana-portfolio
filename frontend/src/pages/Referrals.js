import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Referrals() {
  const { token } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/referrals`)
      .then(r => {
        console.log('Referrals loaded:', r.data);
        setReferrals(r.data || []);
      })
      .catch(err => {
        console.error('Failed to load referrals:', err);
        setError('Failed to load referrals. Please refresh the page.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleClick = async (ref) => {
    try {
      const { data } = await axios.post(`${API}/api/referrals/${ref._id}/click`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.open(data.url, '_blank');
    } catch {
      window.open(ref.url, '_blank');
    }
  };

  const annotation = referrals.filter(r => r && r.category === 'annotation');
  const jobs = referrals.filter(r => r && r.category === 'jobs');

  if (loading) return (
    <div style={{ paddingTop: 120, textAlign: 'center', color: 'var(--accent)', fontSize: 18 }}>
      Loading referrals...
    </div>
  );

  if (error) return (
    <div style={{ paddingTop: 120, textAlign: 'center', color: '#f87171', fontSize: 16, padding: '120px 40px' }}>
      {error}
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '100px 60px 60px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div className="section-label">Opportunities</div>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, marginBottom: 16 }}>
          Apply Through<br /><span style={{ color: 'var(--accent)' }}>Ramana's Referral Links</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 560, margin: '0 auto 16px', lineHeight: 1.7 }}>
          These are platforms and jobs Ramana personally works on or recommends. Apply through these referral links — it helps get your application noticed faster!
        </p>
        <div style={{ display: 'inline-block', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, padding: '10px 20px', fontSize: 13, color: 'var(--accent)' }}>
          💡 Referral links boost your application priority on most platforms
        </div>
      </div>

      {/* Annotation Platforms */}
      {annotation.length > 0 && (
        <>
          <SectionTitle>🏷️ AI Annotation & Data Labeling Platforms</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 22, marginBottom: 48 }}>
            {annotation.map(ref => (
              <RefCard key={ref._id} data={ref} onClick={() => handleClick(ref)} />
            ))}
          </div>
        </>
      )}

      {/* Job Opportunities */}
      {jobs.length > 0 && (
        <>
          <SectionTitle>💼 AI & ML Job Opportunities</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 22, marginBottom: 48 }}>
            {jobs.map(ref => (
              <RefCard key={ref._id} data={ref} onClick={() => handleClick(ref)} />
            ))}
          </div>
        </>
      )}

      {referrals.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '60px 20px', fontSize: 16 }}>
          No referral links added yet. Check back soon!
        </div>
      )}

      {/* Share box */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 32, textAlign: 'center', marginTop: 40 }}>
        <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 10 }}>📤 Share This Page</h3>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>Know someone looking for AI/Data Science jobs? Share the portfolio link!</p>
        <a href="mailto:vemunooriramana0602@gmail.com?subject=Referral%20Enquiry"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,var(--accent),#0099cc)', color: '#000', padding: '11px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          ✉️ Contact Ramana Directly
        </a>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: '0 0 20px', paddingBottom: 10, borderBottom: '2px solid var(--accent2)' }}>
      {children}
    </div>
  );
}

function RefCard({ data, onClick }) {
  if (!data) return null;

  const badgeColors = {
    work: { bg: 'rgba(0,212,255,0.15)', border: 'rgba(0,212,255,0.3)', color: 'var(--accent)' },
    hot: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', color: '#f87171' },
    recommended: { bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.3)', color: '#a78bfa' }
  };

  const badgeType = data.badgeType || '';
  const bc = badgeColors[badgeType] || { bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.2)', color: 'var(--accent)' };
  const perks = Array.isArray(data.perks) ? data.perks : [];
  const clicks = data.clicks || 0;

  return (
    <div
      style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, position: 'relative', overflow: 'hidden', transition: 'all 0.25s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,var(--accent),var(--accent2))' }} />

      {data.badge && (
        <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1, background: bc.bg, border: `1px solid ${bc.border}`, color: bc.color }}>
          {data.badge}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
          {data.icon || '🔗'}
        </div>
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16 }}>{data.platform}</div>
          <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>{data.type}</div>
        </div>
      </div>

      <p style={{ color: '#9ca3af', fontSize: 13.5, lineHeight: 1.6, marginBottom: 14 }}>{data.description}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {perks.map((p, i) => (
          <span key={i} style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', color: '#7dd3fc', fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>{p}</span>
        ))}
      </div>

      <button
        onClick={onClick}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg,var(--accent),#0099cc)', color: '#000', padding: '11px 22px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}
      >
        🚀 Apply Now →
      </button>

      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
        {clicks} click{clicks !== 1 ? 's' : ''} so far
      </div>
    </div>
  );
}
