import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api.js'
import { useCart } from '../context/CartContext.jsx'

const EMO = { snacks:'🍟', drinks:'🧃', instant:'🍜', dairy:'🥛', stationery:'✏️', medicines:'💊', hygiene:'🧴', frozen:'🧊' }

const highlights = {
  snacks:      [['Type','Snack'],['Best Before','6 months'],['Storage','Cool & dry place'],['Country','India']],
  drinks:      [['Type','Beverage'],['Volume','As described'],['Storage','Refrigerate after open'],['Country','India']],
  instant:     [['Type','Instant Food'],['Cook Time','2-5 minutes'],['Storage','Cool & dry place'],['Country','India']],
  dairy:       [['Type','Dairy Product'],['Storage','Keep refrigerated'],['Best Before','Check pack'],['Country','India']],
  stationery:  [['Type','Stationery'],['Material','Premium quality'],['Pack','As described'],['Country','India']],
  medicines:   [['Type','Healthcare'],['Usage','As directed'],['Storage','Cool & dry place'],['Country','India']],
  hygiene:     [['Type','Personal Care'],['Skin Type','All skin types'],['Storage','Room temperature'],['Country','India']],
  frozen:      [['Type','Frozen Food'],['Storage','Keep frozen'],['Cook Time','As directed'],['Country','India']],
}

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cart, addToCart, changeQty } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgError, setImgError] = useState(false)
  const [activeTab, setActiveTab] = useState('highlights')
  const [pincode, setPincode] = useState('416805')

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(r => { setProduct(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh' }}>
      <div style={{ width:36, height:36, border:'3px solid #e8e8e8', borderTopColor:'#0c831f', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  )

  if (!product) return (
    <div style={{ textAlign:'center', padding:60 }}>
      <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
      <div style={{ fontSize:16, fontWeight:700 }}>Product not found</div>
      <button onClick={() => navigate('/')} style={{ background:'#0c831f', color:'#fff', border:'none', padding:'10px 24px', borderRadius:10, fontWeight:800, cursor:'pointer', marginTop:16 }}>Go back</button>
    </div>
  )

  const inCart = cart.find(i => i._id === product._id)
  const disc = product.mrp > product.price ? Math.round((product.mrp - product.price) / product.mrp * 100) : 0
  const info = highlights[product.category] || highlights.snacks

  return (
    <div style={{ background:'#f2f2f2', minHeight:'100vh', fontFamily:'sans-serif' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Breadcrumb */}
      <div style={{ background:'#fff', padding:'10px 24px', borderBottom:'1px solid #e8e8e8' }}>
        <span style={{ color:'#666', fontSize:13, cursor:'pointer' }} onClick={() => navigate('/')}>Home</span>
        <span style={{ color:'#ccc', margin:'0 6px' }}>›</span>
        <span style={{ color:'#666', fontSize:13, cursor:'pointer', textTransform:'capitalize' }} onClick={() => navigate('/')}>{product.category}</span>
        <span style={{ color:'#ccc', margin:'0 6px' }}>›</span>
        <span style={{ color:'#333', fontSize:13, fontWeight:600 }}>{product.name}</span>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'20px 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

        {/* LEFT - Images */}
        <div>
          {/* Main image */}
          <div style={{ background:'#fff', borderRadius:12, overflow:'hidden', border:'1px solid #e8e8e8', marginBottom:12 }}>
            <div style={{ display:'flex' }}>
              {/* Thumbnails */}
              <div style={{ width:72, padding:'12px 8px', display:'flex', flexDirection:'column', gap:8, borderRight:'1px solid #f0f0f0' }}>
                {[product.image, product.image, product.image].map((img, i) => (
                  <div key={i} style={{ width:52, height:52, border:'2px solid', borderColor: i===0 ? '#0c831f' : '#e8e8e8', borderRadius:8, overflow:'hidden', cursor:'pointer', background:'#f8f8f8', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {!imgError ? (
                      <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'contain', padding:4 }} onError={() => setImgError(true)} />
                    ) : (
                      <span style={{ fontSize:20 }}>{EMO[product.category]||'📦'}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Main image */}
              <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:32, minHeight:340, background:'#fff', position:'relative' }}>
                {disc > 0 && (
                  <div style={{ position:'absolute', top:12, left:12, background:'#0c831f', color:'#fff', fontSize:11, fontWeight:800, padding:'4px 10px', borderRadius:6 }}>
                    {disc}% OFF
                  </div>
                )}
                {!imgError ? (
                  <img src={product.image} alt={product.name} style={{ maxWidth:280, maxHeight:280, objectFit:'contain' }} onError={() => setImgError(true)} />
                ) : (
                  <div style={{ fontSize:100, textAlign:'center' }}>{EMO[product.category]||'📦'}</div>
                )}
              </div>
            </div>
          </div>

          {/* Offers */}
          <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e8e8', padding:16 }}>
            <div style={{ fontSize:14, fontWeight:800, color:'#1a1a1a', marginBottom:12 }}>🏷️ Available Offers</div>
            {[
              { icon:'💳', text:'5% cashback on DropIt Pay', sub:'Max ₹50 cashback per order' },
              { icon:'🎁', text:'Free delivery on orders above ₹199', sub:'No code needed' },
              { icon:'⚡', text:'Flash deal — Extra 10% off', sub:'Limited time offer' },
            ].map((o, i) => (
              <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom: i < 2 ? '1px solid #f5f5f5' : 'none' }}>
                <span style={{ fontSize:18 }}>{o.icon}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>{o.text}</div>
                  <div style={{ fontSize:11, color:'#888' }}>{o.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - Details */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

          {/* Product info card */}
          <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e8e8', padding:20 }}>
            {/* Brand & name */}
            <div style={{ fontSize:12, color:'#888', fontWeight:600, marginBottom:4, textTransform:'uppercase', letterSpacing:0.5 }}>
              {product.category}
            </div>
            <h1 style={{ fontSize:22, fontWeight:800, color:'#1a1a1a', lineHeight:1.3, marginBottom:6 }}>{product.name}</h1>
            <div style={{ fontSize:13, color:'#666', marginBottom:16 }}>{product.description}</div>

            {/* Delivery badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#f0fff4', border:'1px solid #c3e6cb', borderRadius:8, padding:'6px 12px', marginBottom:16 }}>
              <span style={{ fontSize:14 }}>⚡</span>
              <span style={{ fontSize:13, fontWeight:700, color:'#0c831f' }}>10 min delivery</span>
              <span style={{ fontSize:12, color:'#666' }}>· Sawantwadi</span>
            </div>

            {/* Price */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <span style={{ fontSize:28, fontWeight:900, color:'#1a1a1a' }}>₹{product.price}</span>
              {product.mrp > product.price && (
                <>
                  <span style={{ fontSize:16, color:'#aaa', textDecoration:'line-through' }}>₹{product.mrp}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:'#0c831f', background:'#f0fff4', padding:'3px 8px', borderRadius:6 }}>{disc}% off</span>
                </>
              )}
            </div>

            {/* Stock */}
            {product.stock < 10 && product.stock > 0 && (
              <div style={{ fontSize:12, color:'#e23744', fontWeight:600, marginBottom:12 }}>
                ⚠️ Only {product.stock} left in stock!
              </div>
            )}

            {/* Add to cart */}
            {product.stock === 0 ? (
              <div style={{ background:'#f5f5f5', color:'#999', padding:14, borderRadius:10, textAlign:'center', fontSize:14, fontWeight:700 }}>
                Out of Stock
              </div>
            ) : inCart ? (
              <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:12 }}>
                <button onClick={() => changeQty(product._id, -1)} style={{ flex:1, height:48, background:'#0c831f', color:'#fff', border:'none', borderRadius:'10px 0 0 10px', fontSize:24, fontWeight:900, cursor:'pointer' }}>−</button>
                <div style={{ width:60, height:48, background:'#f0fff4', border:'2px solid #0c831f', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:'#0c831f' }}>{inCart.qty}</div>
                <button onClick={() => addToCart(product)} style={{ flex:1, height:48, background:'#0c831f', color:'#fff', border:'none', borderRadius:'0 10px 10px 0', fontSize:24, fontWeight:900, cursor:'pointer' }}>+</button>
              </div>
            ) : (
              <button onClick={() => addToCart(product)} style={{ width:'100%', background:'#0c831f', color:'#fff', border:'none', padding:14, borderRadius:10, fontSize:16, fontWeight:800, cursor:'pointer', marginBottom:10 }}>
                + Add to cart
              </button>
            )}

            <button onClick={() => navigate('/cart')} style={{ width:'100%', background:'#fff', color:'#0c831f', border:'2px solid #0c831f', padding:12, borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer' }}>
              🛒 Go to cart
            </button>
          </div>

          {/* Delivery info */}
          <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e8e8', padding:16 }}>
            <div style={{ fontSize:14, fontWeight:800, marginBottom:12 }}>📍 Delivery Info</div>
            <div style={{ display:'flex', gap:8, marginBottom:10 }}>
              <input
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                style={{ flex:1, border:'1px solid #e8e8e8', borderRadius:8, padding:'8px 12px', fontSize:13, outline:'none' }}
                placeholder="Enter pincode"
              />
              <button style={{ background:'#0c831f', color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Check</button>
            </div>
            <div style={{ display:'flex', gap:16 }}>
              {[['⚡','10 min','Express'],['🔄','Easy','Returns'],['✅','100%','Genuine']].map(([icon,title,sub])=>(
                <div key={title} style={{ flex:1, textAlign:'center', padding:'10px 6px', background:'#f8f8f8', borderRadius:8 }}>
                  <div style={{ fontSize:20 }}>{icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#1a1a1a', marginTop:2 }}>{title}</div>
                  <div style={{ fontSize:10, color:'#888' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs - Highlights / Details */}
          <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e8e8', overflow:'hidden' }}>
            <div style={{ display:'flex', borderBottom:'1px solid #e8e8e8' }}>
              {['highlights','details'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  style={{ flex:1, padding:'12px', background:'none', border:'none', borderBottom: activeTab===t ? '2px solid #0c831f' : '2px solid transparent', color: activeTab===t ? '#0c831f' : '#888', fontSize:13, fontWeight:700, cursor:'pointer', textTransform:'capitalize' }}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ padding:16 }}>
              {activeTab === 'highlights' ? (
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <tbody>
                    {info.map(([key, val]) => (
                      <tr key={key} style={{ borderBottom:'1px solid #f5f5f5' }}>
                        <td style={{ padding:'10px 0', fontSize:13, color:'#888', width:'45%' }}>{key}</td>
                        <td style={{ padding:'10px 0', fontSize:13, color:'#1a1a1a', fontWeight:600 }}>{val}</td>
                      </tr>
                    ))}
                    <tr style={{ borderBottom:'1px solid #f5f5f5' }}>
                      <td style={{ padding:'10px 0', fontSize:13, color:'#888' }}>Category</td>
                      <td style={{ padding:'10px 0', fontSize:13, color:'#1a1a1a', fontWeight:600, textTransform:'capitalize' }}>{product.category}</td>
                    </tr>
                    <tr>
                      <td style={{ padding:'10px 0', fontSize:13, color:'#888' }}>Stock</td>
                      <td style={{ padding:'10px 0', fontSize:13, color: product.stock > 0 ? '#0c831f' : '#e23744', fontWeight:600 }}>{product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div>
                  <p style={{ fontSize:13, color:'#555', lineHeight:1.7 }}>
                    {product.name} is a premium quality product from the {product.category} category.
                    {product.description && ` ${product.description}.`}
                    {' '}Available at DropIt with express 10-minute delivery to your hostel room.
                    100% genuine product with easy returns policy.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
