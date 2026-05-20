import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    axios.get(`${API}/api/projects/${id}`)
      .then(r => setProject(r.data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!project) return (
    <div style={{ paddingTop: 120, textAlign: 'center', color: 'var(--muted)', padding: '120px 40px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, marginBottom: 12 }}>Project coming soon</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>This project is being set up. Check back soon!</p>
      <Link to="/#projects" style={{ background: 'var(--accent)', color: '#000', padding: '12px 24px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>← Back to Projects</Link>
    </div>
  );

  const tabs = ['overview', 'explanation', 'tech stack'];
  if (project.videoUrl) tabs.push('video');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '100px 0 60px' }}>
      {/* Hero */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '48px 60px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link to="/#projects" style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>← Back to Projects</Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 36 }}>{project.icon || '🚀'}</div>
                <div>
                  <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800 }}>{project.title}</h1>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>{project.category || 'Machine Learning'}</div>
                </div>
              </div>
              <p style={{ color: '#9ca3af', fontSize: 15, lineHeight: 1.7, maxWidth: 600 }}>{project.shortDesc}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{ background: 'var(--accent)', color: '#000', padding: '12px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', textAlign: 'center' }}>
                  🚀 Try Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ background: 'transparent', color: 'var(--text)', padding: '12px 24px', borderRadius: 8, fontWeight: 500, fontSize: 14, textDecoration: 'none', border: '1px solid var(--border)', textAlign: 'center' }}>
                  🐙 View on GitHub
                </a>
              )}
              {!project.liveUrl && (
                <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', padding: '10px 16px', borderRadius: 8, fontSize: 13, textAlign: 'center' }}>
                  🔧 Live demo coming soon
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            {(project.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, borderBottom: 'none' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background: 'none', border: 'none', padding: '12px 20px', fontSize: 14, fontWeight: 600,
                color: activeTab === tab ? 'var(--accent)' : 'var(--muted)',
                borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', textTransform: 'capitalize'
              }}>{tab}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 60px' }}>

        {activeTab === 'overview' && (
          <div>
            {project.thumbnail && (
              <img src={project.thumbnail} alt={project.title} style={{ width: '100%', borderRadius: 12, marginBottom: 32, border: '1px solid var(--border)', maxHeight: 400, objectFit: 'cover' }} />
            )}
            <div style={contentCard}>
              <h3 style={cardH}>📋 Project Overview</h3>
              <p style={bodyText}>{project.overview || project.shortDesc}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginTop: 24 }}>
              {(project.highlights || []).map((h, i) => (
                <div key={i} style={{ ...contentCard, textAlign: 'center', padding: 20 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{h.icon}</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{h.title}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>{h.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'explanation' && (
          <div>
            <div style={contentCard}>
              <h3 style={cardH}>🎯 Problem Statement</h3>
              <p style={bodyText}>{project.problem || 'Problem statement will be added soon.'}</p>
            </div>
            <div style={{ ...contentCard, marginTop: 20 }}>
              <h3 style={cardH}>💡 My Solution</h3>
              <p style={bodyText}>{project.solution || 'Solution explanation will be added soon.'}</p>
            </div>
            {(project.steps || []).length > 0 && (
              <div style={{ ...contentCard, marginTop: 20 }}>
                <h3 style={cardH}>📝 How It Works — Step by Step</h3>
                {project.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,212,255,0.1)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}>{step.title}</div>
                      <p style={{ ...bodyText, margin: 0 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {(project.results || []).length > 0 && (
              <div style={{ ...contentCard, marginTop: 20 }}>
                <h3 style={cardH}>📊 Results & Outcomes</h3>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {project.results.map((r, i) => <li key={i} style={{ ...bodyText, marginBottom: 8 }}>{r}</li>)}
                </ul>
              </div>
            )}
            {project.liveUrl && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{ background: 'var(--accent)', color: '#000', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  🚀 Experience It Live →
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tech stack' && (
          <div>
            <div style={contentCard}>
              <h3 style={cardH}>⚙️ Technologies Used</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginTop: 16 }}>
                {(project.techStack || []).map((t, i) => (
                  <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{t.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{t.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>{t.purpose}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'video' && project.videoUrl && (
          <div>
            <div style={contentCard}>
              <h3 style={cardH}>🎬 Project Walkthrough Video</h3>
              <p style={{ ...bodyText, marginBottom: 20 }}>Watch how I built this project from scratch — including the code, thought process, and final result.</p>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 12, overflow: 'hidden', background: 'var(--surface)' }}>
                {project.videoUrl.includes('youtube') || project.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={project.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
                    allowFullScreen title="Project video"
                  />
                ) : (
                  <a href={project.videoUrl} target="_blank" rel="noreferrer" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'var(--accent)', color: '#000', padding: '14px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
                    ▶️ Watch Video
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const contentCard = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px' };
const cardH = { fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 14, color: 'var(--text)' };
const bodyText = { color: '#9ca3af', fontSize: 14, lineHeight: 1.8 };
const Loader = () => <div style={{ paddingTop: 120, textAlign: 'center', color: 'var(--accent)', fontSize: 18 }}>Loading project...</div>;
