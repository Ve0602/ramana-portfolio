import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FreelancePage() {
  const navigate = useNavigate();

  return (
    <div style={{ background:'#0a0a0a', minHeight:'100vh', fontFamily:'DM Sans,sans-serif', paddingTop:54 }}>

      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#1a0800,#0d0d0d)', padding:'60px 40px', textAlign:'center', borderBottom:'1px solid rgba(212,168,83,0.15)' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(212,168,83,0.1)', border:'1px solid rgba(212,168,83,0.25)', borderRadius:30, padding:'6px 16px', fontSize:12, color:'#d4a853', marginBottom:20, letterSpacing:2, textTransform:'uppercase' }}>
          ✨ Vemunoori Collections — Freelance Hub
        </div>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'clamp(28px,5vw,52px)', color:'#fff', marginBottom:14, lineHeight:1.1 }}>
          Work. Hire. <span style={{ color:'#d4a853' }}>Grow Together.</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:16, maxWidth:540, margin:'0 auto 40px', lineHeight:1.7 }}>
          Whether you want to find freelance work or hire an expert — you're in the right place. Choose your path below.
        </p>

        {/* Two big cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24, maxWidth:720, margin:'0 auto' }}>

          {/* Freelancer card */}
          <div
            onClick={() => navigate('/freelance/jobs')}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,168,83,0.25)', borderRadius:16, padding:'36px 28px', cursor:'pointer', transition:'all 0.25s', position:'relative', overflow:'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#d4a853'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.background='rgba(212,168,83,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(212,168,83,0.25)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#d4a853,#b8860b)' }} />
            <div style={{ fontSize:52, marginBottom:16 }}>💼</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#fff', marginBottom:10 }}>I'm a Freelancer</h2>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, lineHeight:1.7, marginBottom:20 }}>
              Find AI annotation jobs, referral opportunities, and freelance gigs. Register your profile to get matched.
            </p>
            <ul style={{ listStyle:'none', padding:0, marginBottom:24, textAlign:'left' }}>
              {['🔗 AI job referral links','📋 Auto-updated job listings','👤 Build your freelancer profile','💰 Earn through referrals'].map(item => (
                <li key={item} style={{ color:'rgba(255,255,255,0.6)', fontSize:13, padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{item}</li>
              ))}
            </ul>
            <div style={{ background:'linear-gradient(135deg,#d4a853,#b8860b)', color:'#000', padding:'12px 24px', borderRadius:8, fontWeight:800, fontSize:14, display:'inline-block' }}>
              Find Jobs & Referrals →
            </div>
          </div>

          {/* Client card */}
          <div
            onClick={() => navigate('/freelance/hire')}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:16, padding:'36px 28px', cursor:'pointer', transition:'all 0.25s', position:'relative', overflow:'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#6366f1'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.background='rgba(99,102,241,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(99,102,241,0.3)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
            <div style={{ fontSize:52, marginBottom:16 }}>🚀</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#fff', marginBottom:10 }}>I'm a Client</h2>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, lineHeight:1.7, marginBottom:20 }}>
              Hire Ramana for AI projects, web development, design, or any custom work. Tell us your requirements.
            </p>
            <ul style={{ listStyle:'none', padding:0, marginBottom:24, textAlign:'left' }}>
              {['🤖 AI & Prompt Engineering','💻 Full Stack Web Development','🎨 Design & Digital Services','📊 Data Annotation & Analysis'].map(item => (
                <li key={item} style={{ color:'rgba(255,255,255,0.6)', fontSize:13, padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{item}</li>
              ))}
            </ul>
            <div style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', padding:'12px 24px', borderRadius:8, fontWeight:800, fontSize:14, display:'inline-block' }}>
              Post a Project →
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ padding:'40px', display:'flex', justifyContent:'center', gap:48, flexWrap:'wrap', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        {[['2+','Years Experience'],['5+','Projects Delivered'],['100%','Client Satisfaction'],['24hr','Response Time']].map(([num, label]) => (
          <div key={label} style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:30, fontWeight:900, color:'#d4a853' }}>{num}</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginTop:4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Services preview */}
      <div style={{ padding:'40px' }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#fff', marginBottom:6 }}>⚡ Services I Offer</h2>
        <div style={{ width:40, height:3, background:'#d4a853', borderRadius:2, marginBottom:28 }} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
          {SERVICES.map(s => (
            <div key={s.title} style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'20px', cursor:'pointer', transition:'all 0.2s' }}
              onClick={() => navigate('/freelance/hire')}
              onMouseEnter={e => { e.currentTarget.style.borderColor=s.color; e.currentTarget.style.transform='translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.transform='translateY(0)'; }}>
              <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, color:'#fff', marginBottom:4 }}>{s.title}</div>
              <div style={{ fontSize:12, color:s.color, marginBottom:8, fontWeight:600 }}>{s.rate}</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:12, lineHeight:1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SERVICES = [
  { icon:'🤖', title:'AI Prompt Engineering', rate:'₹500/hr', color:'#00d4ff', desc:'LLM fine-tuning, SFT data, RLHF, model evaluation' },
  { icon:'🏷️', title:'Data Annotation', rate:'₹400/hr', color:'#7c3aed', desc:'Audio, OCR, image, handwriting annotation' },
  { icon:'💻', title:'Full Stack Web Dev', rate:'₹600/hr', color:'#10b981', desc:'React, Node.js, MongoDB, REST APIs' },
  { icon:'🎨', title:'Graphic Design', rate:'₹300/hr', color:'#f59e0b', desc:'Logos, banners, social media creatives' },
  { icon:'📊', title:'Data Science', rate:'₹550/hr', color:'#e91e8c', desc:'ML models, analysis, visualization' },
  { icon:'🧵', title:'Tailoring Consultation', rate:'₹200/hr', color:'#d4a853', desc:'Fashion design, pattern making advice' },
];
