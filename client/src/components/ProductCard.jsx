import { useCart } from '../context/CartContext.jsx'
import { useNavigate } from 'react-router-dom'

const categoryEmoji = {
  snacks:      { emoji: '🍟', bg: '#fff8e1', color: '#f57f17' },
  drinks:      { emoji: '🥤', bg: '#e3f2fd', color: '#1565c0' },
  instant:     { emoji: '🍜', bg: '#fce4ec', color: '#c62828' },
  dairy:       { emoji: '🥛', bg: '#f3e5f5', color: '#6a1b9a' },
  stationery:  { emoji: '✏️', bg: '#e8f5e9', color: '#2e7d32' },
  medicines:   { emoji: '💊', bg: '#e0f7fa', color: '#00695c' },
  hygiene:     { emoji: '🧴', bg: '#fff3e0', color: '#e65100' },
  frozen:      { emoji: '🧊', bg: '#e8eaf6', color: '#283593' },
}

export default function ProductCard({ product }) {
  const { cart, addToCart, changeQty } = useCart()
  const navigate = useNavigate()
  const inCart = cart.find(i => i._id === product._id)
  const disc = product.mrp > product.price ? Math.round((product.mrp - product.price) / product.mrp * 100) : 0
  const badgeColor = { hot: '#ff6d00', new: '#7c4dff', deal: '#e23744', bestseller: '#0c831f' }
  const cat = categoryEmoji[product.category] || { emoji: '📦', bg: '#f5f5f5', color: '#888' }

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer', position: 'relative' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#0c831f' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e8e8e8' }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', background: '#f8f8f8', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 12 }}>
        <img
          src={product.image || ''}
          alt={product.name}
          loading="lazy"
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
          onError={e => {
            e.target.style.display = 'none'
            const placeholder = e.target.parentNode.querySelector('.cat-placeholder')
            if (placeholder) placeholder.style.display = 'flex'
          }}
        />

        {/* Category placeholder */}
        <div
          className="cat-placeholder"
          style={{ display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'absolute', inset: 0, background: cat.bg, borderRadius: 8 }}
        >
          <div style={{ fontSize: 52 }}>{cat.emoji}</div>
          <div style={{ fontSize: 10, color: cat.color, fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{product.category}</div>
        </div>

        {/* Discount badge */}
        {disc > 0 && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#0c831f', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, zIndex: 2 }}>
            {disc}% off
          </div>
        )}

        {/* Product badge */}
        {product.badge && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: badgeColor[product.badge] || '#888', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, zIndex: 2 }}>
            {product.badge === 'hot' ? '🔥 Hot' : product.badge === 'new' ? 'NEW' : product.badge === 'bestseller' ? '⭐ Best' : 'DEAL'}
          </div>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
            <span style={{ color: '#888', fontSize: 12, fontWeight: 700, background: '#f0f0f0', padding: '4px 12px', borderRadius: 6, border: '1px solid #e0e0e0' }}>Out of stock</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px 14px' }}>
        {product.description && (
          <div style={{ fontSize: 11, color: '#aaa', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.description}
          </div>
        )}
        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35, marginBottom: 10, color: '#1a1a1a', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 900, color: '#1a1a1a' }}>₹{product.price}</span>
            {product.mrp > product.price && (
              <span style={{ fontSize: 11, color: '#aaa', textDecoration: 'line-through', marginLeft: 5 }}>₹{product.mrp}</span>
            )}
          </div>

          {product.stock === 0 ? null : inCart ? (
            <div
              onClick={e => e.stopPropagation()}
              style={{ display: 'flex', alignItems: 'center', background: '#f0fff4', borderRadius: 8, overflow: 'hidden', border: '1.5px solid #0c831f' }}
            >
              <button onClick={() => changeQty(product._id, -1)} style={{ width: 30, height: 30, background: '#0c831f', color: '#fff', border: 'none', fontSize: 18, fontWeight: 900, cursor: 'pointer' }}>−</button>
              <span style={{ fontSize: 13, fontWeight: 800, minWidth: 28, textAlign: 'center', color: '#0c831f' }}>{inCart.qty}</span>
              <button onClick={() => addToCart(product)} style={{ width: 30, height: 30, background: '#0c831f', color: '#fff', border: 'none', fontSize: 18, fontWeight: 900, cursor: 'pointer' }}>+</button>
            </div>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); addToCart(product) }}
              style={{ width: 34, height: 34, background: '#fff', border: '1.5px solid #0c831f', borderRadius: 8, color: '#0c831f', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0c831f'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0c831f' }}
            >+</button>
          )}
        </div>
      </div>
    </div>
  )
}
