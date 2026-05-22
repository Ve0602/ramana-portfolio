import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const categories = [
  { key: 'all', label: '🛍️ All', color: '#d4a853' },
  { key: 'kids-dresses', label: '👧 Kids Dresses', color: '#e91e8c' },
  { key: 'women-jackets', label: '🧥 Women Jackets', color: '#7c3aed' },
  { key: 'sarees', label: '👘 Sarees', color: '#f59e0b' },
  { key: 'tailoring', label: '🧵 Tailoring', color: '#10b981' },
  { key: 'computer', label: '💻 Computer & Design', color: '#00d4ff' },
  { key: 'teaching', label: '📚 Teaching', color: '#6366f1' },
];

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const defaultCat = searchParams.get('cat') || 'all';
  const [activeCategory, setActiveCategory] = useState(defaultCat);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/brand/site`).then(r => setBrand(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = activeCategory === 'all' ? `${API}/api/products` : `${API}/api/products?category=${activeCategory}`;
    axios.get(url).then(r => setProducts(r.data)).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [activeCategory]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/shop/reviews`, { ...reviewForm, isGeneral: true });
      setReviewMsg('✅ Thank you! Your review will appear after approval.');
      setReviewForm({ name: '', rating: 5, comment: '' });
    } catch { setReviewMsg('❌ Failed to submit. Please try again.'); }
  };

  const gold = brand?.primaryColor || '#d4a853';

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'DM Sans,sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1a0800,#0d0d0d)', borderBottom: '1px solid rgba(212,168,83,0.2)', padding: '80px 40px 40px' }}>
        <Link to="/home" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>← Back to Home</Link>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(28px,4vw,48px)', color: '#fff', marginBottom: 8 }}>
          <span style={{ color: gold }}>Vemunoori</span> Collections
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>Handcrafted fashion & professional services from Warangal</p>
      </div>

      {/* Category Filter */}
      <div style={{ padding: '24px 40px 0', display: 'flex', gap: 10, flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {categories.map(cat => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{ padding: '9px 18px', borderRadius: 24, border: `1px solid ${activeCategory === cat.key ? cat.color : 'rgba(255,255,255,0.1)'}`, background: activeCategory === cat.key ? `${cat.color}20` : 'transparent', color: activeCategory === cat.key ? cat.color : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s', marginBottom: 12 }}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div style={{ padding: '32px 40px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: gold, padding: 60, fontSize: 18 }}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🛍️</div>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 8 }}>Coming Soon!</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>Products in this category will be added soon. Contact us to enquire!</p>
            <a href={`https://wa.me/${(brand?.whatsapp || '918499882843').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 20, background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>
              💬 WhatsApp to Enquire
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} gold={gold} onOpen={setSelectedProduct} brand={brand} />
            ))}
          </div>
        )}
      </div>

      {/* Leave a Review section */}
      <div style={{ padding: '40px', background: 'linear-gradient(135deg,#0d0800,#0a0a0a)', borderTop: '1px solid rgba(212,168,83,0.15)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: '#fff', marginBottom: 6 }}>⭐ Leave a Review</h2>
          <div style={{ width: 40, height: 3, background: gold, borderRadius: 2, marginBottom: 20 }} />
          {reviewMsg && <div style={{ background: reviewMsg.startsWith('✅') ? 'rgba(0,212,100,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${reviewMsg.startsWith('✅') ? 'rgba(0,212,100,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 8, padding: '10px 14px', color: reviewMsg.startsWith('✅') ? '#4ade80' : '#f87171', fontSize: 14, marginBottom: 16 }}>{reviewMsg}</div>}
          <form onSubmit={submitReview}>
            <input value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} placeholder="Your name" required style={inputStyle} />
            <div style={{ display: 'flex', gap: 6, margin: '12px 0' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, alignSelf: 'center' }}>Rating:</span>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', color: n <= reviewForm.rating ? gold : 'rgba(255,255,255,0.2)', transition: 'transform 0.1s' }}>★</button>
              ))}
            </div>
            <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share your experience..." rows={4} required style={{ ...inputStyle, resize: 'vertical' }} />
            <button type="submit" style={{ marginTop: 14, background: `linear-gradient(135deg,${gold},#b8860b)`, color: '#000', border: 'none', borderRadius: 10, padding: '13px 28px', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>Submit Review</button>
          </form>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && <ProductModal product={selectedProduct} gold={gold} brand={brand} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}

function ProductCard({ product, gold, onOpen, brand }) {
  const catColor = categories.find(c => c.key === product.category)?.color || gold;
  return (
    <div onClick={() => onOpen(product)} style={{ background: '#111', border: `1px solid ${catColor}20`, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = catColor; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 30px ${catColor}20`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${catColor}20`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
      {product.images?.[0]
        ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: 200, background: `linear-gradient(135deg,${catColor}15,${catColor}05)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>{categories.find(c => c.key === product.category)?.label?.split(' ')[0] || '🛍️'}</div>
      }
      <div style={{ padding: '16px' }}>
        {!product.inStock && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12, display: 'inline-block', marginBottom: 8 }}>OUT OF STOCK</div>}
        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{product.name}</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}>{product.description?.substring(0, 60)}{product.description?.length > 60 ? '...' : ''}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {product.price && <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: gold }}>{product.price}</div>}
            {product.originalPrice && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>{product.originalPrice}</div>}
          </div>
          <div style={{ background: `${catColor}15`, border: `1px solid ${catColor}30`, color: catColor, padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>View →</div>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, gold, brand, onClose }) {
  const [activeImg, setActiveImg] = useState(0);
  const catColor = categories.find(c => c.key === product.category)?.color || gold;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#111', border: `1px solid ${catColor}30`, borderRadius: 16, maxWidth: 700, width: '100%', maxHeight: '90vh', overflow: 'auto', zIndex: 1 }}>
        <button onClick={onClose} style={{ position: 'sticky', top: 12, right: 12, float: 'right', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, margin: 12 }}>✕</button>
        <div style={{ display: 'flex', flexDirection: 'column', padding: 28 }}>
          {(product.images || []).length > 0 ? (
            <>
              <img src={product.images[activeImg]} alt={product.name} style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 10, marginBottom: 12 }} />
              {product.images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {product.images.map((img, i) => <img key={i} src={img} alt="" onClick={() => setActiveImg(i)} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: `2px solid ${i === activeImg ? gold : 'transparent'}`, opacity: i === activeImg ? 1 : 0.6 }} />)}
                </div>
              )}
            </>
          ) : (
            <div style={{ width: '100%', height: 200, background: `${catColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, borderRadius: 10, marginBottom: 20 }}>{categories.find(c => c.key === product.category)?.label?.split(' ')[0] || '🛍️'}</div>
          )}
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: '#fff', marginBottom: 8 }}>{product.name}</h2>
          {product.price && <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 28, color: gold, marginBottom: 4 }}>{product.price}</div>}
          {product.originalPrice && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', marginBottom: 12 }}>MRP {product.originalPrice}</div>}
          {product.description && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>{product.description}</p>}
          {(product.colors || []).length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Available Colors</div>
              <div style={{ display: 'flex', gap: 8 }}>{product.colors.map(c => <span key={c} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '4px 12px', fontSize: 13, color: '#fff' }}>{c}</span>)}</div>
            </div>
          )}
          {(product.sizes || []).length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Available Sizes</div>
              <div style={{ display: 'flex', gap: 8 }}>{product.sizes.map(s => <span key={s} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '4px 12px', fontSize: 13, color: '#fff' }}>{s}</span>)}</div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <a href={`https://wa.me/${(brand?.whatsapp || '918499882843').replace(/[^0-9]/g, '')}?text=Hi! I'm interested in ${encodeURIComponent(product.name)}`} target="_blank" rel="noreferrer" style={{ flex: 1, background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366', padding: '13px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14, textAlign: 'center' }}>
              💬 Order on WhatsApp
            </a>
            <a href={`tel:${brand?.phone || '+918499882843'}`} style={{ flex: 1, background: `${gold}15`, border: `1px solid ${gold}30`, color: gold, padding: '13px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14, textAlign: 'center' }}>
              📞 Call to Order
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', display: 'block' };
