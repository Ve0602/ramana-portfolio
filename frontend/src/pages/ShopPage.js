import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CATS = [
  { key:'all',           label:'🛍️ All',              color:'#d4a853' },
  { key:'kids-dresses',  label:'👧 Kids Dresses',      color:'#e91e8c' },
  { key:'women-jackets', label:'🧥 Women Jackets',     color:'#7c3aed' },
  { key:'sarees',        label:'👘 Sarees',            color:'#f59e0b' },
  { key:'tailoring',     label:'🧵 Tailoring',         color:'#10b981' },
  { key:'computer',      label:'💻 Computer & Design', color:'#00d4ff' },
  { key:'teaching',      label:'📚 Teaching',          color:'#6366f1' },
];

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [cat, setCat] = useState(searchParams.get('cat') || 'all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState(null);
  const [selected, setSelected] = useState(null);
  const [rForm, setRForm] = useState({ name:'', rating:5, comment:'' });
  const [rMsg, setRMsg] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/brand/site`).then(r => setBrand(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = cat==='all' ? `${API}/api/products` : `${API}/api/products?category=${cat}`;
    axios.get(url).then(r => setProducts(r.data)).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [cat]);

  const submitReview = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/shop/reviews`, { ...rForm, isGeneral:true });
      setRMsg('✅ Thank you! Review will appear after approval.');
      setRForm({ name:'', rating:5, comment:'' });
    } catch { setRMsg('❌ Failed. Please try again.'); }
  };

  const gold = brand?.primaryColor || '#d4a853';
  const wa = (brand?.whatsapp || '918499882843').replace(/[^0-9]/g, '');

  return (
    <div style={{ background:'#0a0a0a', minHeight:'100vh', fontFamily:'DM Sans,sans-serif', paddingTop:54 }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1a0800,#0d0d0d)', borderBottom:'1px solid rgba(212,168,83,0.15)', padding:'32px 40px 24px' }}>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'clamp(24px,4vw,42px)', color:'#fff', marginBottom:6 }}>
          <span style={{ color:gold }}>Vemunoori</span> Collections
        </h1>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:14 }}>Handcrafted fashion & professional services · Warangal</p>
      </div>

      {/* Category pills */}
      <div style={{ padding:'18px 40px 0', display:'flex', gap:8, flexWrap:'wrap', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        {CATS.map(c => (
          <button key={c.key} onClick={() => setCat(c.key)} style={{ padding:'8px 16px', borderRadius:22, border:`1px solid ${cat===c.key ? c.color : 'rgba(255,255,255,0.08)'}`, background: cat===c.key ? `${c.color}18` : 'transparent', color: cat===c.key ? c.color : 'rgba(255,255,255,0.45)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans,sans-serif', transition:'all 0.2s', marginBottom:12 }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Products */}
      <div style={{ padding:'28px 40px' }}>
        {loading ? (
          <div style={{ textAlign:'center', color:gold, padding:60, fontSize:16 }}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:52, marginBottom:14 }}>🛍️</div>
            <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:20, color:'#fff', marginBottom:8 }}>Coming Soon!</h3>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginBottom:20 }}>Products in this category will be added soon. Contact us to enquire!</p>
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" style={{ display:'inline-block', background:'rgba(37,211,102,0.15)', border:'1px solid rgba(37,211,102,0.3)', color:'#25d366', padding:'12px 24px', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:14 }}>
              💬 WhatsApp to Enquire
            </a>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:18 }}>
            {products.map(p => <PCard key={p._id} p={p} gold={gold} onOpen={setSelected} />)}
          </div>
        )}
      </div>

      {/* Review form */}
      <div style={{ padding:'36px 40px', background:'linear-gradient(135deg,#0d0800,#0a0a0a)', borderTop:'1px solid rgba(212,168,83,0.1)' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:20, color:'#fff', marginBottom:4 }}>⭐ Leave a Review</h2>
          <div style={{ width:36, height:3, background:gold, borderRadius:2, marginBottom:18 }} />
          {rMsg && <div style={{ background: rMsg.startsWith('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border:`1px solid ${rMsg.startsWith('✅') ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius:8, padding:'10px 14px', color: rMsg.startsWith('✅') ? '#4ade80' : '#f87171', fontSize:14, marginBottom:14 }}>{rMsg}</div>}
          <form onSubmit={submitReview}>
            <input value={rForm.name} onChange={e => setRForm({...rForm,name:e.target.value})} placeholder="Your name" required style={inp} />
            <div style={{ display:'flex', gap:6, margin:'12px 0', alignItems:'center' }}>
              <span style={{ color:'rgba(255,255,255,0.4)', fontSize:13 }}>Rating:</span>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setRForm({...rForm,rating:n})} style={{ fontSize:22, background:'none', border:'none', cursor:'pointer', color: n<=rForm.rating ? gold : 'rgba(255,255,255,0.15)' }}>★</button>
              ))}
            </div>
            <textarea value={rForm.comment} onChange={e => setRForm({...rForm,comment:e.target.value})} placeholder="Share your experience..." rows={3} required style={{ ...inp, resize:'vertical' }} />
            <button type="submit" style={{ marginTop:12, background:`linear-gradient(135deg,${gold},#b8860b)`, color:'#000', border:'none', borderRadius:9, padding:'12px 26px', fontWeight:800, fontSize:14, cursor:'pointer', fontFamily:'Syne,sans-serif' }}>Submit Review</button>
          </form>
        </div>
      </div>

      {/* Modal */}
      {selected && <PModal p={selected} gold={gold} brand={brand} onClose={() => setSelected(null)} />}
    </div>
  );
}

function PCard({ p, gold, onOpen }) {
  const c = CATS.find(x => x.key===p.category)?.color || gold;
  return (
    <div onClick={() => onOpen(p)} style={{ background:'#111', border:`1px solid ${c}18`, borderRadius:13, overflow:'hidden', cursor:'pointer', transition:'all 0.25s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor=c; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 10px 28px ${c}18`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor=`${c}18`; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
      {p.images?.[0]
        ? <img src={p.images[0]} alt={p.name} style={{ width:'100%', height:190, objectFit:'cover' }} />
        : <div style={{ width:'100%', height:190, background:`${c}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:52 }}>{CATS.find(x=>x.key===p.category)?.label?.split(' ')[0]||'🛍️'}</div>
      }
      <div style={{ padding:'14px' }}>
        {!p.inStock && <div style={{ background:'rgba(239,68,68,0.1)', color:'#f87171', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, display:'inline-block', marginBottom:6 }}>OUT OF STOCK</div>}
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, color:'#fff', marginBottom:4 }}>{p.name}</div>
        <div style={{ color:'rgba(255,255,255,0.35)', fontSize:12, marginBottom:8, lineHeight:1.5 }}>{p.description?.substring(0,55)}{p.description?.length>55?'...':''}</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            {p.price && <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:17, color:gold }}>{p.price}</div>}
            {p.originalPrice && <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', textDecoration:'line-through' }}>{p.originalPrice}</div>}
          </div>
          <div style={{ background:`${c}15`, border:`1px solid ${c}30`, color:c, padding:'5px 12px', borderRadius:7, fontSize:12, fontWeight:700 }}>View →</div>
        </div>
      </div>
    </div>
  );
}

function PModal({ p, gold, brand, onClose }) {
  const [img, setImg] = useState(0);
  const c = CATS.find(x=>x.key===p.category)?.color || gold;
  const wa = (brand?.whatsapp||'918499882843').replace(/[^0-9]/g,'');
  return (
    <div style={{ position:'fixed', inset:0, zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(10px)' }} onClick={onClose} />
      <div style={{ position:'relative', background:'#111', border:`1px solid ${c}30`, borderRadius:16, maxWidth:680, width:'100%', maxHeight:'90vh', overflow:'auto', zIndex:1 }}>
        <button onClick={onClose} style={{ position:'sticky', top:10, right:10, float:'right', background:'rgba(255,255,255,0.08)', border:'none', color:'#fff', width:34, height:34, borderRadius:'50%', cursor:'pointer', fontSize:16, margin:12 }}>✕</button>
        <div style={{ padding:26 }}>
          {(p.images||[]).length>0 ? (
            <>
              <img src={p.images[img]} alt={p.name} style={{ width:'100%', height:260, objectFit:'cover', borderRadius:10, marginBottom:10 }} />
              {p.images.length>1 && (
                <div style={{ display:'flex', gap:7, marginBottom:18 }}>
                  {p.images.map((im,i) => <img key={i} src={im} alt="" onClick={()=>setImg(i)} style={{ width:56, height:56, objectFit:'cover', borderRadius:7, cursor:'pointer', border:`2px solid ${i===img?gold:'transparent'}`, opacity:i===img?1:0.55 }} />)}
                </div>
              )}
            </>
          ) : (
            <div style={{ width:'100%', height:180, background:`${c}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:60, borderRadius:10, marginBottom:18 }}>{CATS.find(x=>x.key===p.category)?.label?.split(' ')[0]||'🛍️'}</div>
          )}
          <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#fff', marginBottom:6 }}>{p.name}</h2>
          {p.price && <div style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:26, color:gold, marginBottom:3 }}>{p.price}</div>}
          {p.originalPrice && <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)', textDecoration:'line-through', marginBottom:10 }}>MRP {p.originalPrice}</div>}
          {p.description && <p style={{ color:'rgba(255,255,255,0.55)', fontSize:14, lineHeight:1.7, marginBottom:14 }}>{p.description}</p>}
          {(p.colors||[]).length>0 && <Chips label="Colors" items={p.colors} />}
          {(p.sizes||[]).length>0 && <Chips label="Sizes" items={p.sizes} />}
          <div style={{ display:'flex', gap:10, marginTop:14 }}>
            <a href={`https://wa.me/${wa}?text=Hi! I'm interested in ${encodeURIComponent(p.name)}`} target="_blank" rel="noreferrer" style={{ flex:1, background:'rgba(37,211,102,0.12)', border:'1px solid rgba(37,211,102,0.25)', color:'#25d366', padding:'12px', borderRadius:9, textDecoration:'none', fontWeight:700, fontSize:13, textAlign:'center' }}>💬 Order via WhatsApp</a>
            <a href={`tel:${brand?.phone||'+918499882843'}`} style={{ flex:1, background:`${gold}12`, border:`1px solid ${gold}25`, color:gold, padding:'12px', borderRadius:9, textDecoration:'none', fontWeight:700, fontSize:13, textAlign:'center' }}>📞 Call to Order</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chips({ label, items }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11, marginBottom:5, textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {items.map(i => <span key={i} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:6, padding:'3px 10px', fontSize:12, color:'#fff' }}>{i}</span>)}
      </div>
    </div>
  );
}

const inp = { width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:9, padding:'11px 13px', color:'#fff', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif', display:'block', marginBottom:6 };
