import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import API from '../api.js'

const CATS = ['snacks','drinks','instant','dairy','stationery','medicines','hygiene','frozen']
const EMO  = { snacks:'🍟', drinks:'🧃', instant:'🍜', dairy:'🥛', stationery:'✏️', medicines:'💊', hygiene:'🧴', frozen:'🧊' }

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [orders, setOrders]     = useState([])
  const [tab, setTab]           = useState('products')
  const [msg, setMsg]           = useState({ text:'', ok:true })
  const [form, setForm] = useState({ name:'', price:'', mrp:'', category:'', stock:'100', description:'', badge:'', image:'' })

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return }
    fetchAll()
  }, [user])

  const fetchAll = async () => {
    const [p, o] = await Promise.all([
      API.get('/products').then(r=>r.data).catch(()=>[]),
      API.get('/orders').then(r=>r.data).catch(()=>[]),
    ])
    setProducts(p); setOrders(o)
  }

  const flash = (text, ok=true) => { setMsg({ text, ok }); setTimeout(()=>setMsg({text:'',ok:true}), 3000) }

  const addProduct = async () => {
    if (!form.name || !form.price || !form.category) { flash('Fill name, price and category', false); return }
    try {
      await API.post('/products', { ...form, price:Number(form.price), mrp:Number(form.mrp)||Number(form.price), stock:Number(form.stock)||100 })
      setForm({ name:'', price:'', mrp:'', category:'', stock:'100', description:'', badge:'', image:'' })
      flash('Product added!'); fetchAll()
    } catch (err) { flash(err.response?.data?.error || 'Error', false) }
  }

  const deleteProd = async (id) => {
    if (!window.confirm('Delete?')) return
    await API.delete(`/products/${id}`)
    fetchAll()
  }

  const updateStatus = async (id, orderStatus) => {
    await API.patch(`/orders/${id}/status`, { orderStatus })
    fetchAll()
  }

  const revenue = orders.reduce((a,o)=>a+o.totalPrice,0)
  const pending = orders.filter(o=>o.orderStatus==='Pending').length

  const box = { background:'#141414', border:'1px solid #2a2a2a', borderRadius:14, padding:20 }
  const inp = { display:'block', width:'100%', background:'#1c1c1c', border:'1px solid #2a2a2a', color:'#f0f0f0', padding:'9px 12px', borderRadius:8, fontSize:13, marginBottom:8 }

  return (
    <div style={{ padding:24 }}>
      <h1 style={{ fontSize:22, fontWeight:900, letterSpacing:-1, marginBottom:20 }}>Admin Panel</h1>

      {/* STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {[['Products',products.length,'#f5c518'],['Orders',orders.length,'#00c853'],['Revenue',`₹${revenue}`,'#2979ff'],['Pending',pending,'#ff5252']].map(([label,val,color])=>(
          <div key={label} style={box}>
            <div style={{ fontSize:26, fontWeight:900, color }}>{val}</div>
            <div style={{ fontSize:12, color:'#555', fontWeight:600, marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {['products','orders'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ background:tab===t?'#f5c518':'#1c1c1c', color:tab===t?'#000':'#aaa', border:`1px solid ${tab===t?'#f5c518':'#2a2a2a'}`, padding:'8px 20px', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer' }}>
            {t==='products'?`Products (${products.length})`:`Orders (${orders.length})`}
          </button>
        ))}
      </div>

      {tab==='products' && (
        <div style={{ display:'grid', gridTemplateColumns:'350px 1fr', gap:20 }}>
          <div style={box}>
            <div style={{ fontSize:14, fontWeight:800, marginBottom:14 }}>Add new product</div>
            {msg.text && <div style={{ fontSize:12, color:msg.ok?'#00c853':'#ff5252', marginBottom:10, padding:'8px 12px', background:msg.ok?'#002a0e':'#2a0000', borderRadius:6 }}>{msg.text}</div>}
            <input style={inp} placeholder="Product name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <input style={inp} type="number" placeholder="Price (₹)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
              <input style={inp} type="number" placeholder="MRP (₹)" value={form.mrp} onChange={e=>setForm({...form,mrp:e.target.value})} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <select style={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                <option value="">Category</option>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <input style={inp} type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} />
            </div>
            <input style={inp} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
            <input style={inp} placeholder="Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} />
            <select style={inp} value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}>
              <option value="">No badge</option>
              <option value="hot">🔥 Hot</option>
              <option value="new">NEW</option>
              <option value="deal">DEAL</option>
              <option value="bestseller">⭐ Bestseller</option>
            </select>
            <button onClick={addProduct} style={{ width:'100%', background:'#f5c518', color:'#000', border:'none', padding:10, borderRadius:8, fontWeight:800, fontSize:14, cursor:'pointer' }}>+ Add product</button>
          </div>

          <div style={{...box, maxHeight:580, overflowY:'auto'}}>
            <div style={{ fontSize:14, fontWeight:800, marginBottom:14 }}>All products ({products.length})</div>
            {products.map(p=>(
              <div key={p._id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #2a2a2a' }}>
                <div style={{ width:40, height:40, background:'#fff', borderRadius:6, overflow:'hidden', flexShrink:0 }}>
                  <img src={p.image} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'contain', padding:3 }}
                    onError={e=>{e.target.style.display='none'; e.target.parentNode.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:20px">${EMO[p.category]||'📦'}</div>`}} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize:11, color:'#555' }}>Stock: {p.stock} · {p.category}</div>
                </div>
                <span style={{ fontSize:13, fontWeight:900, color:'#f5c518', margin:'0 8px' }}>₹{p.price}</span>
                <button onClick={()=>deleteProd(p._id)} style={{ background:'#2a0000', color:'#ff5252', border:'none', padding:'4px 10px', borderRadius:6, cursor:'pointer', fontSize:11, fontWeight:700 }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='orders' && (
        <div style={{...box, maxHeight:650, overflowY:'auto'}}>
          <div style={{ fontSize:14, fontWeight:800, marginBottom:14 }}>All orders ({orders.length})</div>
          {orders.length===0 && <div style={{ color:'#555', fontSize:13 }}>No orders yet</div>}
          {orders.map(o=>(
            <div key={o._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #2a2a2a' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, color:'#555', fontWeight:600 }}>#{o._id.slice(-6).toUpperCase()} · {new Date(o.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
                <div style={{ fontSize:14, fontWeight:700 }}>{o.customerName}</div>
                <div style={{ fontSize:12, color:'#555' }}>{o.address} · ₹{o.totalPrice}</div>
                <div style={{ fontSize:11, color:'#444', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.items.map(i=>`${i.name} ×${i.quantity}`).join(', ')}</div>
              </div>
              <select value={o.orderStatus} onChange={e=>updateStatus(o._id,e.target.value)}
                style={{ background:'#1c1c1c', border:'1px solid #2a2a2a', color:'#f0f0f0', padding:'6px 8px', borderRadius:7, fontSize:12, cursor:'pointer' }}>
                {['Pending','Confirmed','Out for Delivery','Delivered','Cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
