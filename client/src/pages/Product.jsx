import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api.js'
import { useCart } from '../context/CartContext.jsx'

const EMO = { snacks:'🍟', drinks:'🧃', instant:'🍜', dairy:'🥛', stationery:'✏️', medicines:'💊', hygiene:'🧴', frozen:'🧊' }

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cart, addToCart, changeQty } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(r => { setProduct(r.data); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [id])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 64px)' }}>
      <div style={{ width:40, height:40, border:'3px solid #2a2a2a', borderTopColor:'#f5c518', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  )

  if (!product) return (
    <div style={{ textAlign:'center', padding:60 }}>
      <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
      <div style={{ fontSize:16, fontWeight:700 }}>Product not found</div>
      <button onClick={() => navigate('/')} style={{ background:'#f5c518', color:'#000', border:'none', padding:'10px 24px', borderRadius:10, fontWeight:800, fontSize:14, cursor:'pointer', marginTop:16 }}>
        Go back
      </button>
    </div>
  )

  const inCart = cart.find(i => i._id === product._id)
  const disc = product.mrp > product.price ? Math.round((product.mrp - product.price) / product.mrp * 100) : 0

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:28 }}>
      <button onClick={() => navigate(-1)} style={{ background:'#1c1c1c', color:'#aaa', border:'1px solid #2a2a2a', padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', marginBottom:24 }}>
        ← Back
      </button>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, background:'#141414', border:'1px solid #2a2a2a', borderRadius:16, overflow:'hidden' }}>
        <div style={{ background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', padding:32, minHeight:320 }}>
          <img src={product.image} alt={product.name} style={{ width:'100%', maxHeight:280, objectFit:'contain' }} onError={e => e.target.style.display='none'} />
        </div>
        <div style={{ padding:28 }}>
          <h1 style={{ fontSize:24, fontWeight:900, marginBottom:8 }}>{product.name}</h1>
          <p style={{ color:'#aaa', fontSize:14, marginBottom:20 }}>{product.description}</p>
          <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:24 }}>
            <span style={{ fontSize:28, fontWeight:900, color:'#f5c518' }}>₹{product.price}</span>
            {product.mrp > product.price && <span style={{ fontSize:16, color:'#555', textDecoration:'line-through' }}>₹{product.mrp}</span>}
          </div>
          {product.stock > 0 && (inCart ? (
            <div style={{ display:'flex', alignItems:'center', marginBottom:16 }}>
              <button onClick={() => changeQty(product._id, -1)} style={{ width:44, height:44, background:'#f5c518', color:'#000', border:'none', borderRadius:'8px 0 0 8px', fontSize:20, fontWeight:900, cursor:'pointer' }}>−</button>
              <span style={{ width:60, height:44, background:'#252525', border:'1px solid #2a2a2a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800 }}>{inCart.qty}</span>
              <button onClick={() => addToCart(product)} style={{ width:44, height:44, background:'#f5c518', color:'#000', border:'none', borderRadius:'0 8px 8px 0', fontSize:20, fontWeight:900, cursor:'pointer' }}>+</button>
            </div>
          ) : (
            <button onClick={() => addToCart(product)} style={{ width:'100%', background:'#f5c518', color:'#000', border:'none', padding:14, borderRadius:10, fontSize:16, fontWeight:900, cursor:'pointer', marginBottom:12 }}>
              + Add to cart
            </button>
          ))}
          <button onClick={() => navigate('/cart')} style={{ width:'100%', background:'transparent', color:'#f5c518', border:'1px solid #f5c518', padding:12, borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer' }}>
            View cart
          </button>
        </div>
      </div>
    </div>
  )
}