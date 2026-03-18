import { useState } from 'react'
import API from '../api.js'

const STATUS_STYLE = {
  Pending:            { bg:'#fff8e1', color:'#f57f17', border:'#ffe082' },
  Confirmed:          { bg:'#f0fff4', color:'#0c831f', border:'#a5d6a7' },
  'Out for Delivery': { bg:'#e8f0fe', color:'#2979ff', border:'#90caf9' },
  Delivered:          { bg:'#e8f5e9', color:'#1b5e20', border:'#c8e6c9' },
  Cancelled:          { bg:'#fce4ec', color:'#e23744', border:'#f48fb1' },
}

const EMO = { snacks:'🍟', drinks:'🧃', instant:'🍜', dairy:'🥛', stationery:'✏️', medicines:'💊', hygiene:'🧴' }

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [searched, setSearched] = useState(false)

  const fetchOrders = async () => {
    if (!phone.trim()) return
    setLoading(true)
    try {
      const { data } = await API.get(`/orders/my/${phone.trim()}`)
      setOrders(data)
      setSearched(true)
    } catch {
      setOrders([])
      setSearched(true)
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth:800, margin:'0 auto', padding:24, background:'#f8f8f8', minHeight:'calc(100vh - 64px)' }}>
      <h1 style={{ fontSize:22, fontWeight:900, letterSpacing:-1, marginBottom:20, color:'#1a1a1a' }}>Track your orders</h1>

      {/* Search */}
      <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:14, padding:20, marginBottom:24, display:'flex', gap:10, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
        <input
          placeholder="Enter your phone number to see orders..."
          value={phone} onChange={e => setPhone(e.target.value)}
          onKeyDown={e => e.key==='Enter' && fetchOrders()}
          style={{ flex:1, background:'#f8f8f8', border:'1.5px solid #e0e0e0', color:'#1a1a1a', padding:'10px 14px', borderRadius:8, fontSize:14 }}
          onFocus={e=>e.target.style.borderColor='#0c831f'}
          onBlur={e=>e.target.style.borderColor='#e0e0e0'}
        />
        <button onClick={fetchOrders} style={{ background:'#0c831f', color:'#fff', border:'none', padding:'10px 22px', borderRadius:8, fontWeight:800, fontSize:14, cursor:'pointer' }}>
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {!searched ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#888' }}>
          <div style={{ fontSize:52, marginBottom:14 }}>📦</div>
          <div style={{ fontSize:15, fontWeight:600, color:'#555' }}>Enter your phone number to track orders</div>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0' }}>
          <div style={{ fontSize:52, marginBottom:14 }}>🔍</div>
          <div style={{ fontSize:15, fontWeight:600, color:'#555' }}>No orders found for this number</div>
        </div>
      ) : orders.map(order => {
        const s = STATUS_STYLE[order.status] || STATUS_STYLE.Pending
        return (
          <div key={order._id} style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:14, overflow:'hidden', marginBottom:12, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ padding:'16px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #e0e0e0' }}>
              <div>
                <div style={{ fontSize:11, color:'#888', fontWeight:600, marginBottom:3 }}>
                  #{order._id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleString()} · {order.paymentMethod}
                </div>
                <div style={{ fontSize:15, fontWeight:800, color:'#1a1a1a' }}>{order.customerName}</div>
              </div>
              <span style={{ padding:'5px 14px', borderRadius:20, fontSize:11, fontWeight:800, background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
                {order.status}
              </span>
            </div>
            <div style={{ padding:'14px 18px' }}>
              <div style={{ fontSize:13, color:'#555', lineHeight:1.8, marginBottom:10 }}>
                {order.items.map(i => `${EMO[i.category]||'📦'} ${i.name} ×${i.qty}`).join('  ·  ')}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:16, fontWeight:900, color:'#0c831f' }}>₹{order.totalAmount}</span>
                <span style={{ fontSize:12, color:'#888' }}>{order.hostelRoom}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}