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
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('highlights')
  const [pincode, setPincode] = useState('416805')

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(r => { setProduct(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
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

  const allImages = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : [])
  const inCart = cart.find(i => i._id === product._id)
  const disc = product.mrp > product.price ? Math.round((product.mrp - product.price) / product.mrp * 100) : 0
  const info = highlights[product.category] || highlights.snacks

  return (
    <div style={{ background:'#fff', minHeight:'100vh', fontFamily:'sans-serif' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}`}</style>

      {/* Breadcrumb */}
      <div style={{ padding:'12px 40px', borderBottom:'1px solid #f0f0f0' }}>
        <span style={{ color:'#888', fontSize:13, cursor:'pointer' }} onClick={() => navigate('/')}>Home</span>
        <span style={{ color:'#ccc', margin:'0 6px' }}>›</span>
        <span style={{ color:'#888', fontSize:13, cursor:'pointer', textTransform:'capitalize' }} onClick={() => navigate('/')}>{product.category}</span>
        <span style={{ color:'#ccc', margin:'0 6px' }}>›</span>
        <span style={{ color:'#333', fontSize:13, fontWeight:600 }}>{product.name}</span>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px 40px', display:'grid', gridTemplateColumns:'520px 1fr', gap:48, alignItems:'start' }}>

        {/* LEFT - Big Image like Blinkit */}
        <div style={{ position:'sticky', top:80 }}>

          {/* Main big image */}
          <div style={{ background:'#f8f8f8', borderRadius:16, overflow:'hidden', position:'relative', height:480, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #f0f0f0', marginBottom:16 }}>
            {disc > 0 && (
              <div style={{ position:'absolute', top:16, left:16, background:'#0c831f', color:'#fff', fontSize:12, fontWeight:800, padding:'5px 12px', borderRadius:8, zIndex:2 }}>
                {disc}% OFF
              </div>
            )}

            {allImages.length > 0 ? (
              <img
                key={activeImg}
                src={allImages[activeImg]}
                alt={product.name}
                style={{ width:'85%', height:'85%', objectFit:'contain', animation:'fadeIn 0.2s ease' }}
                onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML += `<div style="font-size:120px;text-align:center">${EMO[product.category]||'📦'}</div>` }}
              />
            ) : (
              <div style={{ fontSize:120, textAlign:'center' }}>{EMO[product.category]||'📦'}</div>
            )}

            {/* Arrow nav */}
            {allImages.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => Math.max(0, i-1))}
                  style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', background:'#fff', border:'1px solid #e0e0e0', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:18, display:activeImg===0?'none':'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}>‹</button>
                <button onClick={() => setActiveImg(i => Math.min(allImages.length-1, i+1))}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'#fff', border:'1px solid #e0e0e0', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:18, display:activeImg===allImages.length-1?'none':'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}>›</button>
              </>
            )}

            {/* Counter */}
            {allImages.length > 1 && (
              <div style={{ position:'absolute', bottom:12, right:12, background:'rgba(0,0,0,0.4)', color:'#fff', fontSize:11, padding:'3px 8px', borderRadius:10, fontWeight:600 }}>
                {activeImg+1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnails row - horizontal below image like Blinkit */}
          {allImages.length > 1 && (
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              {allImages.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)}
                  style={{ width:72, height:72, border:'2px solid', borderColor: i===activeImg ? '#0c831f' : '#e8e8e8', borderRadius:10, overflow:'hidden', cursor:'pointer', background:'#f8f8f8', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s', flexShrink:0 }}>
                  <img src={img} alt={`view-${i+1}`} style={{ width:'100%', height:'100%', objectFit:'contain', padding:4 }}
                    onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML=`<span style="font-size:24px">${EMO[product.category]||'📦'}</span>` }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT - Product Details */}
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>

          {/* Name & price */}
          <div style={{ paddingBottom:20, borderBottom:'1px solid #f0f0f0', marginBottom:20 }}>
            <div style={{ fontSize:12, color:'#888', fontWeight:600, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>{product.category}</div>
            <h1 style={{ fontSize:24, fontWeight:800, color:'#1a1a1a', lineHeight:1.3, marginBottom:8 }}>{product.name}</h1>
            {product.description && <div style={{ fontSize:14, color:'#666', marginBottom:16 }}>{product.description}</div>}

            {/* Delivery badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#f0fff4', border:'1px solid #c3e6cb', borderRadius:8, padding:'6px 14px', marginBottom:20 }}>
              <span style={{ fontSize:14 }}>⚡</span>
              <span style={{ fontSize:13, fontWeight:700, color:'#0c831f' }}>10 min delivery</span>
              <span style={{ fontSize:12, color:'#666' }}>· Sawantwadi</span>
            </div>

            {/* Price */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
              <span style={{ fontSize:32, fontWeight:900, color:'#1a1a1a' }}>₹{product.price}</span>
              {product.mrp > product.price && (
                <>
                  <span style={{ fontSize:18, color:'#bbb', textDecoration:'line-through' }}>₹{product.mrp}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:'#0c831f', background:'#f0fff4', padding:'4px 10px', borderRadius:6 }}>{disc}% off</span>
                </>
              )}
            </div>
            <div style={{ fontSize:12, color:'#aaa' }}>Inclusive of all taxes</div>

            {product.stock < 10 && product.stock > 0 && (
              <div style={{ fontSize:12, color:'#e23744', fontWeight:600, marginTop:10 }}>⚠️ Only {product.stock} left!</div>
            )}
          </div>

          {/* Add to cart - BIG like Blinkit */}
          <div style={{ marginBottom:24 }}>
            {product.stock === 0 ? (
              <div style={{ background:'#f5f5f5', color:'#999', padding:16, borderRadius:12, textAlign:'center', fontSize:15, fontWeight:700 }}>Out of Stock</div>
            ) : inCart ? (
              <div style={{ display:'flex', alignItems:'center', gap:0, height:52 }}>
                <button onClick={() => changeQty(product._id, -1)} style={{ flex:1, height:'100%', background:'#0c831f', color:'#fff', border:'none', borderRadius:'12px 0 0 12px', fontSize:26, fontWeight:900, cursor:'pointer' }}>−</button>
                <div style={{ width:70, height:'100%', background:'#f0fff4', border:'2px solid #0c831f', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:900, color:'#0c831f' }}>{inCart.qty}</div>
                <button onClick={() => addToCart(product)} style={{ flex:1, height:'100%', background:'#0c831f', color:'#fff', border:'none', borderRadius:'0 12px 12px 0', fontSize:26, fontWeight:900, cursor:'pointer' }}>+</button>
              </div>
            ) : (
              <button onClick={() => addToCart(product)}
                style={{ width:'100%', background:'#0c831f', color:'#fff', border:'none', padding:'16px', borderRadius:12, fontSize:16, fontWeight:800, cursor:'pointer', letterSpacing:0.3 }}
                onMouseEnter={e => e.currentTarget.style.background='#0a6b19'}
                onMouseLeave={e => e.currentTarget.style.background='#0c831f'}>
                Add to cart
              </button>
            )}
          </div>

          {/* Why shop from DropIt - like Blinkit */}
          <div style={{ background:'#f8f8f8', borderRadius:12, padding:'16px 20px', marginBottom:20 }}>
            <div style={{ fontSize:15, fontWeight:800, color:'#1a1a1a', marginBottom:14 }}>Why shop from DropIt?</div>
            {[
              { icon:'⚡', title:'10 Minute Delivery', sub:'Get items delivered to your hostel room, whenever you need them' },
              { icon:'💰', title:'Best Prices & Offers', sub:'Best price destination with offers directly from local shops' },
              { icon:'🛍️', title:'Wide Assortment', sub:'Choose from snacks, drinks, dairy, stationery, medicines & more' },
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', gap:14, padding:'10px 0', borderBottom: i < 2 ? '1px solid #efefef' : 'none', alignItems:'flex-start' }}>
                <div style={{ width:44, height:44, background:'#fff', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:2 }}>{item.title}</div>
                  <div style={{ fontSize:12, color:'#888', lineHeight:1.5 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery info */}
          <div style={{ border:'1px solid #f0f0f0', borderRadius:12, padding:16, marginBottom:20 }}>
            <div style={{ fontSize:14, fontWeight:800, marginBottom:12 }}>📍 Check Delivery</div>
            <div style={{ display:'flex', gap:8, marginBottom:12 }}>
              <input value={pincode} onChange={e => setPincode(e.target.value)}
                style={{ flex:1, border:'1px solid #e0e0e0', borderRadius:8, padding:'9px 12px', fontSize:13, outline:'none' }} placeholder="Enter pincode" />
              <button style={{ background:'#0c831f', color:'#fff', border:'none', borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Check</button>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              {[['⚡','10 min','Express'],['🔄','Easy','Returns'],['✅','100%','Genuine']].map(([icon,title,sub])=>(
                <div key={title} style={{ flex:1, textAlign:'center', padding:'10px 6px', background:'#f8f8f8', borderRadius:8 }}>
                  <div style={{ fontSize:20 }}>{icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#1a1a1a', marginTop:2 }}>{title}</div>
                  <div style={{ fontSize:10, color:'#888' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights / Details tabs */}
          <div style={{ border:'1px solid #f0f0f0', borderRadius:12, overflow:'hidden' }}>
            <div style={{ display:'flex', borderBottom:'1px solid #f0f0f0' }}>
              {['highlights','details'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  style={{ flex:1, padding:'13px', background:'none', border:'none', borderBottom: activeTab===t ? '2px solid #0c831f' : '2px solid transparent', color: activeTab===t ? '#0c831f' : '#888', fontSize:13, fontWeight:700, cursor:'pointer', textTransform:'capitalize' }}>
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
                <p style={{ fontSize:13, color:'#555', lineHeight:1.8, margin:0 }}>
                  {product.name} is a premium quality product in the {product.category} category. {product.description && `${product.description}.`} Available at DropIt with express 10-minute delivery to your hostel room. 100% genuine product with easy returns.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}