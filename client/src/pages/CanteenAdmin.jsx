import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

const STATUSES = ['Pending','In Kitchen','Ready for Pickup','Completed','Cancelled']

export default function CanteenAdmin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name:'', price:'', category:'Snacks', description:'', prepTime:'10', image:'' })

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return }
    fetchAll()
  }, [user])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [i, o] = await Promise.all([
        API.get('/canteen/items').then(r=>r.data),
        API.get('/canteen/orders').then(r=>r.data)
      ])
      setItems(i); setOrders(o)
    } finally { setLoading(false) }
  }

  const addItem = async () => {
    if (!form.name || !form.price) return
    setAdding(true)
    try {
      await API.post('/canteen/items', { ...form, price: Number(form.price), prepTime: Number(form.prepTime) || 10 })
      setForm({ name:'', price:'', category:'Snacks', description:'', prepTime:'10', image:'' })
      fetchAll()
    } catch (err) { alert(err.response?.data?.error || 'Failed to add item') }
    setAdding(false)
  }

  const toggleAvailability = async (item) => {
    await API.put(`/canteen/items/${item._id}`, { isAvailable: !item.isAvailable })
    setItems(prev => prev.map(p => p._id === item._id ? { ...p, isAvailable: !item.isAvailable } : p))
  }

  const updateStatus = async (orderId, status) => {
    await API.patch(`/canteen/orders/${orderId}/status`, { orderStatus: status })
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o))
  }

  if (loading) return <div style={{ padding:24 }}>Loading kitchen...</div>

  return (
    <div style={{ padding:24, background:'#f5f5f5', minHeight:'100vh' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <h1 style={{ margin:0, fontSize:22, fontWeight:900 }}>Canteen Kitchen</h1>
        <span style={{ fontSize:12, color:'#6b7280', fontWeight:700 }}>Pickup-only flow (separate from delivery)</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'400px 1fr', gap:18, alignItems:'start' }}>
        <div style={card}>
          <div style={{ fontWeight:800, marginBottom:10 }}>Add / Update Menu</div>
          <input style={inp} placeholder="Item name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <input style={inp} type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
            <input style={inp} placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/>
          </div>
          <textarea style={{ ...inp, height:64 }} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <input style={inp} type="number" placeholder="Prep time (min)" value={form.prepTime} onChange={e=>setForm({...form,prepTime:e.target.value})}/>
            <input style={inp} placeholder="Image URL (optional)" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/>
          </div>
          <button onClick={addItem} disabled={adding} style={btnPrimary}>{adding ? 'Saving...' : 'Save item'}</button>

          <div style={{ marginTop:14, fontWeight:800, fontSize:13 }}>Current menu</div>
          <div style={{ maxHeight:320, overflow:'auto', marginTop:8, display:'grid', gap:8 }}>
            {items.map(i => (
              <div key={i._id} style={{ padding:10, border:'1px solid #e5e7eb', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontWeight:800 }}>{i.name}</div>
                  <div style={{ fontSize:12, color:'#6b7280' }}>₹{i.price} · {i.category}</div>
                </div>
                <button onClick={()=>toggleAvailability(i)} style={{ ...pill, background: i.isAvailable ? '#dcfce7' : '#fee2e2', color: i.isAvailable ? '#166534' : '#b91c1c' }}>
                  {i.isAvailable ? 'Available' : 'Hidden'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gap:14 }}>
          <div style={card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ fontWeight:900 }}>Incoming orders</div>
              <button onClick={fetchAll} style={{ ...pill, background:'#e0f2fe', color:'#075985' }}>Refresh</button>
            </div>
            <div style={{ display:'grid', gap:10 }}>
              {orders.map(o => (
                <div key={o._id} style={{ border:'1px solid #e5e7eb', borderRadius:12, padding:12, background:'#fff' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <div>
                      <div style={{ fontWeight:900 }}>#{o.pickupCode} · {o.customerName}</div>
                      <div style={{ fontSize:12, color:'#6b7280' }}>{o.phone}</div>
                    </div>
                    <span style={{ ...pill, background:'#eef2ff', color:'#4338ca' }}>{o.orderStatus}</span>
                  </div>
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap', fontSize:13 }}>
                    {o.items.map(it => (
                      <span key={it._id || it.name} style={{ ...pill, background:'#f3f4f6', color:'#111827' }}>{it.qty} × {it.name}</span>
                    ))}
                  </div>
                  <div style={{ marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontWeight:800 }}>₹{o.totalAmount}</div>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {STATUSES.map(s => (
                        <button key={s} onClick={()=>updateStatus(o._id, s)} style={{ ...pill, background: o.orderStatus===s ? '#0f172a' : '#e5e7eb', color: o.orderStatus===s ? '#fff' : '#111827' }}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <div style={{ color:'#6b7280', fontWeight:700 }}>No pickup orders yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const card = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:16, boxShadow:'0 6px 16px rgba(0,0,0,0.05)' }
const inp = { width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', background:'#fff', fontWeight:700, outline:'none', boxSizing:'border-box' }
const btnPrimary = { width:'100%', marginTop:8, padding:'10px 12px', borderRadius:10, border:'none', background:'#0f172a', color:'#fff', fontWeight:900, cursor:'pointer' }
const pill = { padding:'6px 10px', borderRadius:999, border:'none', fontWeight:800, cursor:'pointer', fontSize:12 }
