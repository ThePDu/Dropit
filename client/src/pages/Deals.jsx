import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import API from '../api.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Deals() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const type = searchParams.get('type') || 'flash'
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const config = {
    flash: { title: 'Flash Deals ⚡', sub: 'Upto 30% off on your favourite items', bg: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)' },
    student: { title: 'Student Special 🎒', sub: 'Everything under ₹30', bg: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)' },
    midnight: { title: 'Midnight Snacks 🍌', sub: 'Always available to kill those cravings', bg: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)' },
  }

  const currentDeal = config[type] || config.flash

  useEffect(() => {
    fetchProducts()
  }, [type])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/products')
      
      let filtered = data
      if (type === 'flash') {
        filtered = data.filter(p => p.badge === 'deal' || p.badge === 'hot' || (p.mrp > p.price))
      } else if (type === 'student') {
        filtered = data.filter(p => p.price <= 30)
      } else if (type === 'midnight') {
        filtered = data.filter(p => ['snacks', 'drinks', 'instant'].includes(p.category))
      }
      
      setProducts(filtered)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', background: '#f8f8f8', paddingBottom: 40 }}>
      {/* Banner Header */}
      <div style={{ 
        background: currentDeal.bg, 
        padding: '60px 24px', 
        textAlign: 'center',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        marginBottom: 32
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', left: 24, top: 96, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, backdropFilter: 'blur(4px)' }}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1, marginBottom: 8, textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          {currentDeal.title}
        </h1>
        <p style={{ fontSize: 18, fontWeight: 600, opacity: 0.9 }}>
          {currentDeal.sub}
        </p>
      </div>

      <style>{`
        @keyframes dealSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>Curated for you</h2>
          <span style={{ fontSize: 14, color: '#666', fontWeight: 600 }}>{products.length} items found</span>
        </div>

        {/* PRODUCT GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} style={{ background: '#fff', height: 280, borderRadius: 16, animation: 'pulse 1.5s infinite', border: '1px solid #e0e0e0' }} />
            ))
          ) : products.length > 0 ? (
            products.map((p, index) => (
              <div key={p._id} style={{ animation: 'dealSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards', animationDelay: `${index * 0.06}s`, opacity: 0 }}>
                <ProductCard product={p} />
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>😢</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>No deals found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
