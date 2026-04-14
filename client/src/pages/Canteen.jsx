import { useEffect, useMemo, useState } from 'react'
import API from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Canteen() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [tray, setTray] = useState([])
  const [form, setForm] = useState({ name: '', phone: '', paymentMethod: 'CASH', note: '' })
  const [placing, setPlacing] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  useEffect(() => {
    setForm(f => ({
      ...f,
      name: user?.name || f.name,
      phone: f.phone
    }))
  }, [user])

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/canteen/items', { params: { available: true } })
      setItems(data)
    } finally { setLoading(false) }
  }

  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.category))
    return Array.from(set)
  }, [items])

  const addToTray = (item) => {
    setTray(prev => {
      const found = prev.find(p => p._id === item._id)
      if (found) return prev.map(p => p._id === item._id ? { ...p, qty: p.qty + 1 } : p)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const changeQty = (id, delta) => {
    setTray(prev => prev.map(p => p._id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p))
  }

  const removeItem = (id) => setTray(prev => prev.filter(p => p._id !== id))

  const total = tray.reduce((a, i) => a + i.price * i.qty, 0)

  const placeOrder = async () => {
    if (!form.name || !form.phone) { alert('Add your name and phone'); return }
    if (tray.length === 0) { alert('Add at least one item'); return }
    setPlacing(true)
    try {
      const payload = {
        customerName: form.name,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
        pickupNote: form.note,
        items: tray.map(i => ({ itemId: i._id, qty: i.qty }))
      }
      const { data } = await API.post('/canteen/orders', payload)
      setPlacedOrder(data)
      setTray([])
    } catch (err) {
      alert(err.response?.data?.error || 'Could not place order')
    }
    setPlacing(false)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:18 }}>
        Loading canteen menu...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 48px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 22 }}>
      <div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -1 }}>Campus Canteen</div>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 13 }}>Order online · pay at counter · pick up when ready</div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <span key={c} style={{ background:'#f3f4f6', padding:'8px 12px', borderRadius:12, fontWeight:700, fontSize:12, color:'#374151' }}>{c}</span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
          {items.map(item => (
            <div key={item._id} style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:14, boxShadow:'0 4px 12px rgba(0,0,0,0.04)', display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ display:'flex', gap:12 }}>
                <div style={{ width:68, height:68, borderRadius:12, background:`url(${item.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=60'}) center/cover`, flexShrink:0 }} />
                <div>
                  <div style={{ fontWeight:800, fontSize:15, color:'#111827' }}>{item.name}</div>
                  <div style={{ fontSize:12, color:'#6b7280', marginTop:2 }}>{item.description || 'Quick bite from canteen'}</div>
                  <div style={{ fontWeight:800, marginTop:6 }}>₹{item.price}</div>
                  <div style={{ fontSize:11, color:'#10b981', fontWeight:700 }}>~{item.prepTime || 10} min</div>
                </div>
              </div>
              <button onClick={() => addToTray(item)} style={{ marginTop:'auto', background:'#111827', color:'#fff', border:'none', padding:'10px 12px', borderRadius:10, fontWeight:800, cursor:'pointer' }}>Add to tray</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position:'sticky', top:86, alignSelf:'flex-start' }}>
        <div style={{ background:'#0b1120', color:'#fff', borderRadius:16, padding:18, marginBottom:14, boxShadow:'0 12px 24px rgba(0,0,0,0.25)' }}>
          <div style={{ fontWeight:900, fontSize:18 }}>Pickup Counter</div>
          <div style={{ fontSize:12, color:'#cbd5e1', marginTop:4 }}>Pay at counter · Show pickup code</div>
          <div style={{ marginTop:14, display:'grid', gap:10 }}>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" style={inputStyle} />
            <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone number" style={inputStyle} />
            <textarea value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Notes (no onion, extra cheese...)" style={{ ...inputStyle, height:70, resize:'vertical' }} />
            <div style={{ display:'flex', gap:8 }}>
              {['CASH','UPI'].map(p => (
                <button key={p} onClick={()=>setForm({...form,paymentMethod:p})} style={{ flex:1, padding:'10px 12px', borderRadius:10, border: form.paymentMethod===p ? '2px solid #f97316' : '1px solid #334155', background: form.paymentMethod===p ? '#111827' : '#0f172a', color:'#fff', fontWeight:800, cursor:'pointer' }}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e5e7eb', padding:16, boxShadow:'0 6px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ fontWeight:900, fontSize:16, marginBottom:10 }}>Tray ({tray.length})</div>
          {tray.length === 0 && <div style={{ color:'#6b7280', fontWeight:600, fontSize:13 }}>Add items to begin</div>}
          <div style={{ display:'grid', gap:10 }}>
            {tray.map(item => (
              <div key={item._id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800 }}>{item.name}</div>
                  <div style={{ fontSize:12, color:'#6b7280' }}>₹{item.price}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <button onClick={()=>changeQty(item._id,-1)} style={qtyBtn}>-</button>
                  <span style={{ minWidth:18, textAlign:'center', fontWeight:800 }}>{item.qty}</span>
                  <button onClick={()=>changeQty(item._id,1)} style={qtyBtn}>+</button>
                </div>
                <div style={{ width:60, textAlign:'right', fontWeight:800 }}>₹{item.price * item.qty}</div>
                <button onClick={()=>removeItem(item._id)} style={{ border:'none', background:'transparent', cursor:'pointer', color:'#ef4444', fontWeight:900 }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, display:'flex', justifyContent:'space-between', fontWeight:900, fontSize:16 }}>
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <button disabled={placing || tray.length===0} onClick={placeOrder} style={{ marginTop:12, width:'100%', background:'#111827', color:'#fff', border:'none', padding:'12px', borderRadius:12, fontWeight:900, cursor: placing ? 'not-allowed' : 'pointer', opacity: placing ? 0.7 : 1 }}>
            {placing ? 'Placing...' : 'Place pickup order'}
          </button>

          {placedOrder && (
            <div style={{ marginTop:14, padding:12, borderRadius:12, background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
              <div style={{ fontWeight:900, color:'#065f46' }}>Order placed!</div>
              <div style={{ fontSize:13, color:'#065f46', marginTop:4 }}>Show this code at counter:</div>
              <div style={{ fontSize:30, fontWeight:900, letterSpacing:2, color:'#111827', marginTop:6 }}>{placedOrder.pickupCode}</div>
              <div style={{ fontSize:12, color:'#334155', marginTop:4 }}>Status: {placedOrder.orderStatus}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle = { width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #1f2937', background:'#0f172a', color:'#fff', fontWeight:700, outline:'none' }
const qtyBtn = { width:28, height:28, borderRadius:8, border:'1px solid #e5e7eb', background:'#fff', cursor:'pointer', fontWeight:900 }
