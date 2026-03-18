import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import API from '../api.js'

const EMO = { snacks:'🍟', drinks:'🧃', instant:'🍜', dairy:'🥛', stationery:'✏️', medicines:'💊', hygiene:'🧴' }

export default function Cart() {
  const { cart, changeQty, removeFromCart, clearCart, cartTotal, cartSavings, deliveryFee, showToast } = useCart()
  const [form, setForm]     = useState({ customerName:'', phone:'', hostelRoom:'', note:'' })
  const [payMethod, setPay] = useState('COD')
  const [loading, setLoading] = useState(false)
  const [placed, setPlaced]   = useState(null)
  const navigate = useNavigate()
  const totalAmount = cartTotal + deliveryFee

  const inp = {
    display:'block', width:'100%',
    background:'#f8f8f8', border:'1px solid #e0e0e0',
    color:'#1a1a1a', padding:'10px 13px',
    borderRadius:8, fontSize:13, marginBottom:8,
  }

  const placeOrder = async () => {
    if (!form.customerName || !form.phone || !form.hostelRoom) {
      showToast('Please fill all delivery details!', 'error'); return
    }
    setLoading(true)
    try {
      const { data } = await API.post('/orders', {
        ...form,
        items: cart.map(i => ({ productId: i._id, name: i.name, price: i.price, qty: i.qty, image: i.image, category: i.category })),
        subtotal: cartTotal, deliveryFee, totalAmount, paymentMethod: payMethod,
      })
      clearCart()
      setPlaced(data)
    } catch (err) { showToast(err.response?.data?.error || 'Failed to place order', 'error') }
    setLoading(false)
  }

  if (placed) return (
    <div style={{ minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40, background:'#f8f8f8' }}>
      <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:20, padding:48, textAlign:'center', maxWidth:460, width:'100%', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize:72, marginBottom:18 }}>✅</div>
        <h2 style={{ fontSize:26, fontWeight:900, letterSpacing:-1, marginBottom:8, color:'#1a1a1a' }}>Order placed!</h2>
        <p style={{ color:'#555', fontSize:14, marginBottom:16, lineHeight:1.7 }}>
          Preparing your order for<br /><strong style={{ color:'#0c831f' }}>{placed.hostelRoom}</strong>
        </p>
        <div style={{ display:'inline-block', background:'#f0fff4', border:'1px solid #0c831f', padding:'8px 20px', borderRadius:8, fontSize:13, fontWeight:700, color:'#0c831f', marginBottom:24 }}>
          Order #{placed._id?.slice(-6).toUpperCase()}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          {['Placed','Preparing','Out for delivery','Delivered'].map((s, i) => (
            <div key={s} style={{ flex:1, textAlign:'center' }}>
              <div style={{ width:10, height:10, borderRadius:'50%', margin:'0 auto 5px', background: i===0?'#0c831f':'#e0e0e0', border:`2px solid ${i===0?'#0c831f':'#e0e0e0'}` }} />
              <div style={{ fontSize:9, color:'#888', fontWeight:600 }}>{s}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'#f0f0f0', borderRadius:20, height:5, marginBottom:22, overflow:'hidden' }}>
          <div style={{ height:'100%', background:'#0c831f', borderRadius:20, width:'20%' }} />
        </div>
        <p style={{ fontSize:12, color:'#888', marginBottom:24 }}>Estimated: 10–15 min · {payMethod}</p>
        <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
          <button onClick={() => navigate('/')} style={{ background:'#0c831f', color:'#fff', border:'none', padding:'11px 22px', borderRadius:10, fontWeight:800, fontSize:14, cursor:'pointer' }}>Continue shopping</button>
          <button onClick={() => navigate('/orders')} style={{ background:'#f8f8f8', color:'#555', border:'1px solid #e0e0e0', padding:'11px 22px', borderRadius:10, fontWeight:600, fontSize:14, cursor:'pointer' }}>View orders</button>
        </div>
      </div>
    </div>
  )

  if (!cart.length) return (
    <div style={{ minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8f8f8' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:72, marginBottom:16 }}>🛒</div>
        <h2 style={{ fontSize:22, fontWeight:800, marginBottom:8, color:'#1a1a1a' }}>Cart is empty</h2>
        <p style={{ color:'#888', marginBottom:24 }}>Add some snacks to get started!</p>
        <button onClick={() => navigate('/')} style={{ background:'#0c831f', color:'#fff', border:'none', padding:'12px 28px', borderRadius:10, fontWeight:800, fontSize:14, cursor:'pointer' }}>Shop now</button>
      </div>
    </div>
  )

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', minHeight:'calc(100vh - 64px)' }}>

      {/* CART ITEMS */}
      <div style={{ padding:24, borderRight:'1px solid #e0e0e0', background:'#f8f8f8' }}>
        <h1 style={{ fontSize:22, fontWeight:900, letterSpacing:-1, marginBottom:20, color:'#1a1a1a' }}>
          My Cart <span style={{ fontSize:14, color:'#888', fontWeight:400 }}>({cart.reduce((a,i)=>a+i.qty,0)} items)</span>
        </h1>

        {cart.map(item => (
          <div key={item._id} style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:10, padding:14, marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:56, height:56, background:'#f8f8f8', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0, border:'1px solid #e0e0e0', overflow:'hidden' }}>
              <img src={item.image || ''} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'contain', padding:4 }}
                onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML=`<div style="font-size:24px">${EMO[item.category]||'📦'}</div>` }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'#1a1a1a' }}>{item.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{item.description}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8 }}>
                <button onClick={() => changeQty(item._id,-1)} style={{ width:26, height:26, background:'#f0fff4', border:'1px solid #0c831f', color:'#0c831f', borderRadius:6, fontSize:15, fontWeight:700, cursor:'pointer' }}>−</button>
                <span style={{ fontSize:13, fontWeight:800, minWidth:22, textAlign:'center', color:'#1a1a1a' }}>{item.qty}</span>
                <button onClick={() => changeQty(item._id,1)} style={{ width:26, height:26, background:'#f0fff4', border:'1px solid #0c831f', color:'#0c831f', borderRadius:6, fontSize:15, fontWeight:700, cursor:'pointer' }}>+</button>
              </div>
            </div>
            <div style={{ fontSize:15, fontWeight:900, minWidth:55, textAlign:'right', color:'#1a1a1a' }}>₹{item.price*item.qty}</div>
            <button onClick={() => removeFromCart(item._id)} style={{ background:'transparent', border:'none', color:'#ccc', fontSize:22, cursor:'pointer', padding:'2px 4px', transition:'color 0.15s' }}
              onMouseEnter={e=>e.target.style.color='#e23744'} onMouseLeave={e=>e.target.style.color='#ccc'}>×</button>
          </div>
        ))}
      </div>

      {/* SIDEBAR */}
      <div style={{ padding:24, background:'#fff', borderLeft:'1px solid #e0e0e0', position:'sticky', top:64, height:'calc(100vh - 64px)', overflowY:'auto' }}>

        {/* Bill */}
        <div style={{ background:'#f8f8f8', border:'1px solid #e0e0e0', borderRadius:12, padding:16, marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:0.8, marginBottom:12 }}>Bill details</div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#555', padding:'6px 0' }}><span>Item total</span><span>₹{cartTotal}</span></div>
          {cartSavings > 0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#0c831f', padding:'6px 0' }}><span>Your savings</span><span>-₹{cartSavings}</span></div>}
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color: deliveryFee===0?'#0c831f':'#555', padding:'6px 0' }}>
            <span>Delivery fee</span><span>{deliveryFee===0?'FREE':'₹'+deliveryFee}</span>
          </div>
          {cartTotal < 199 && cartTotal > 0 && <div style={{ fontSize:11, color:'#888', padding:'4px 0' }}>Add ₹{199-cartTotal} more for free delivery</div>}
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:800, borderTop:'1px solid #e0e0e0', marginTop:8, paddingTop:14, color:'#1a1a1a' }}>
            <span>To pay</span><span style={{ color:'#0c831f' }}>₹{totalAmount}</span>
          </div>
        </div>

        {/* Form */}
        <div style={{ background:'#f8f8f8', border:'1px solid #e0e0e0', borderRadius:12, padding:16, marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:0.8, marginBottom:12 }}>Delivery details</div>
          {[
            ['customerName','Full name'],
            ['hostelRoom','Hostel block & room (e.g. Block A, Room 204)'],
            ['phone','Phone number'],
            ['note','Delivery note (optional)'],
          ].map(([key,ph]) => (
            <input key={key} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
              style={inp}
              onFocus={e=>e.target.style.borderColor='#0c831f'}
              onBlur={e=>e.target.style.borderColor='#e0e0e0'}
            />
          ))}

          <div style={{ fontSize:12, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:0.8, marginBottom:10, marginTop:4 }}>Payment</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[['COD','💵','Cash on delivery'],['UPI','📱','UPI (soon)']].map(([val,icon,label]) => (
              <div key={val} onClick={() => setPay(val)} style={{ background: payMethod===val?'#f0fff4':'#fff', border:`1.5px solid ${payMethod===val?'#0c831f':'#e0e0e0'}`, borderRadius:8, padding:10, textAlign:'center', cursor:'pointer', transition:'all 0.15s' }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
                <div style={{ fontSize:11, fontWeight:700, color: payMethod===val?'#0c831f':'#888' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={placeOrder} disabled={loading} style={{ width:'100%', background: loading?'#ccc':'#0c831f', color:'#fff', border:'none', padding:15, borderRadius:10, fontSize:15, fontWeight:900, cursor: loading?'not-allowed':'pointer', transition:'all 0.15s' }}
          onMouseEnter={e=>{ if(!loading) e.target.style.background='#0a6b19' }}
          onMouseLeave={e=>{ if(!loading) e.target.style.background='#0c831f' }}>
          {loading ? 'Placing order...' : `Place order · ₹${totalAmount}`}
        </button>
      </div>
    </div>
  )
}