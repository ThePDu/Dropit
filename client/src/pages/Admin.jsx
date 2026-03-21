import { useEffect, useState, useRef } from 'react'
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

  const [form, setForm] = useState({ name:'', price:'', mrp:'', category:'', stock:'100', description:'', badge:'' })
  const [imageUrls, setImageUrls] = useState(['','','',''])
  const [imageFiles, setImageFiles] = useState([null,null,null,null])
  const [previews, setPreviews] = useState(['','','',''])
  const [uploading, setUploading] = useState(false)
  const [activePreview, setActivePreview] = useState(0)
  const fileRef0 = useRef(); const fileRef1 = useRef(); const fileRef2 = useRef(); const fileRef3 = useRef()
  const fileRefs = [fileRef0, fileRef1, fileRef2, fileRef3]

  const [editProduct, setEditProduct] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editSaving, setEditSaving] = useState(false)
  const [stockFilter, setStockFilter] = useState('all')
  const [searchQ, setSearchQ] = useState('')

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

  const handleImageFile = (index, e) => {
    const file = e.target.files[0]; if (!file) return
    const nf=[...imageFiles]; nf[index]=file
    const np=[...previews]; np[index]=URL.createObjectURL(file)
    const nu=[...imageUrls]; nu[index]=''
    setImageFiles(nf); setPreviews(np); setImageUrls(nu); setActivePreview(index)
  }
  const handleUrlChange = (index, val) => {
    const nu=[...imageUrls]; nu[index]=val
    const np=[...previews]; np[index]=val
    const nf=[...imageFiles]; nf[index]=null
    setImageUrls(nu); setPreviews(np); setImageFiles(nf)
    if (val) setActivePreview(index)
  }
  const clearImage = (index) => {
    const nu=[...imageUrls]; nu[index]=''
    const nf=[...imageFiles]; nf[index]=null
    const np=[...previews]; np[index]=''
    setImageUrls(nu); setImageFiles(nf); setPreviews(np)
  }
  const uploadSingleImage = async (file) => {
    const data = new FormData(); data.append('image', file)
    const res = await API.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data.url
  }

  const addProduct = async () => {
    if (!form.name || !form.price || !form.category) { flash('Fill name, price and category', false); return }
    setUploading(true)
    try {
      const allImages = []
      for (let i = 0; i < 4; i++) {
        if (imageFiles[i]) { const url = await uploadSingleImage(imageFiles[i]); if (url) allImages.push(url) }
        else if (imageUrls[i]) allImages.push(imageUrls[i])
      }
      await API.post('/products', { ...form, image: allImages[0]||'', images: allImages, price: Number(form.price), mrp: Number(form.mrp)||Number(form.price), stock: Number(form.stock)||100 })
      setForm({ name:'', price:'', mrp:'', category:'', stock:'100', description:'', badge:'' })
      setImageUrls(['','','','']); setImageFiles([null,null,null,null]); setPreviews(['','','','']); setActivePreview(0)
      flash('Product added! ✅'); fetchAll()
    } catch (err) { flash(err.response?.data?.error || 'Error', false) }
    setUploading(false)
  }

  const deleteProd = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await API.delete(`/products/${id}`); fetchAll()
  }

  const openEdit = (p) => {
    setEditProduct(p)
    setEditForm({ name: p.name, price: p.price, mrp: p.mrp, category: p.category, stock: p.stock, description: p.description, badge: p.badge || '', image: p.image || '' })
  }

  const saveEdit = async () => {
    setEditSaving(true)
    try {
      await API.put(`/products/${editProduct._id}`, { ...editForm, price: Number(editForm.price), mrp: Number(editForm.mrp)||Number(editForm.price), stock: Number(editForm.stock) })
      flash('Product updated! ✅'); setEditProduct(null); fetchAll()
    } catch (err) { flash(err.response?.data?.error || 'Update failed', false) }
    setEditSaving(false)
  }

  const quickStock = async (id, newStock) => {
    if (newStock < 0) return
    await API.put(`/products/${id}`, { stock: newStock })
    setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p))
  }

  const updateStatus = async (id, orderStatus) => {
    await API.patch(`/orders/${id}/status`, { orderStatus }); fetchAll()
  }

  const revenue = orders.reduce((a,o)=>a+o.totalPrice,0)
  const pending = orders.filter(o=>o.orderStatus==='Pending').length

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQ.toLowerCase())
    const matchStock = stockFilter==='all' ? true : stockFilter==='low' ? p.stock<10 : stockFilter==='out' ? p.stock===0 : true
    return matchSearch && matchStock
  })

  // ── WHITE THEME STYLES ──
  const box = { background:'#fff', border:'1px solid #e8e8e8', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }
  const inp = { display:'block', width:'100%', background:'#f7f7f7', border:'1px solid #e0e0e0', color:'#1a1a1a', padding:'9px 12px', borderRadius:8, fontSize:13, marginBottom:8, boxSizing:'border-box', outline:'none' }
  const einp = { display:'block', width:'100%', background:'#f7f7f7', border:'1px solid #e0e0e0', color:'#1a1a1a', padding:'8px 12px', borderRadius:8, fontSize:13, marginBottom:8, boxSizing:'border-box', outline:'none' }

  return (
    <div style={{ padding:24, background:'#f2f2f2', minHeight:'100vh', color:'#1a1a1a' }}>
      <h1 style={{ fontSize:22, fontWeight:900, letterSpacing:-1, marginBottom:20, color:'#1a1a1a' }}>Admin Panel</h1>

      {/* STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {[['Products',products.length,'#0c831f'],['Orders',orders.length,'#2979ff'],['Revenue',`₹${revenue}`,'#7c4dff'],['Pending',pending,'#e23744']].map(([label,val,color])=>(
          <div key={label} style={box}>
            <div style={{ fontSize:26, fontWeight:900, color }}>{val}</div>
            <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Low stock warning */}
      {products.filter(p=>p.stock<10).length > 0 && (
        <div style={{ background:'#fff8e1', border:'1px solid #ffca28', borderRadius:10, padding:'10px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:18 }}>⚠️</span>
          <span style={{ fontSize:13, color:'#f57f17', fontWeight:600 }}>
            {products.filter(p=>p.stock===0).length} out of stock · {products.filter(p=>p.stock>0&&p.stock<10).length} low stock products
          </span>
          <button onClick={()=>{ setTab('stock'); setStockFilter('low') }} style={{ marginLeft:'auto', background:'#ff6d00', color:'#fff', border:'none', padding:'4px 12px', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer' }}>View</button>
        </div>
      )}

      {/* TABS */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {['products','stock','orders'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ background:tab===t?'#0c831f':'#fff', color:tab===t?'#fff':'#666', border:`1px solid ${tab===t?'#0c831f':'#e0e0e0'}`, padding:'8px 20px', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer', textTransform:'capitalize', boxShadow: tab===t?'none':'0 1px 3px rgba(0,0,0,0.06)' }}>
            {t==='products'?`Products (${products.length})`:t==='stock'?`📦 Stock`:`Orders (${orders.length})`}
          </button>
        ))}
      </div>

      {/* ── PRODUCTS TAB ── */}
      {tab==='products' && (
        <div style={{ display:'grid', gridTemplateColumns:'420px 1fr', gap:20 }}>

          {/* ADD FORM */}
          <div style={box}>
            <div style={{ fontSize:14, fontWeight:800, marginBottom:14, color:'#1a1a1a' }}>➕ Add new product</div>
            {msg.text && <div style={{ fontSize:12, color:msg.ok?'#0c831f':'#e23744', marginBottom:10, padding:'8px 12px', background:msg.ok?'#f0fff4':'#fff5f5', border:`1px solid ${msg.ok?'#c3e6cb':'#f5c6cb'}`, borderRadius:6 }}>{msg.text}</div>}
            <input style={inp} placeholder="Product name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <input style={inp} type="number" placeholder="Price (₹) *" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
              <input style={inp} type="number" placeholder="MRP (₹)" value={form.mrp} onChange={e=>setForm({...form,mrp:e.target.value})} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <select style={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                <option value="">Category *</option>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <input style={inp} type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} />
            </div>
            <input style={inp} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
            <select style={inp} value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}>
              <option value="">No badge</option>
              <option value="hot">🔥 Hot</option><option value="new">NEW</option>
              <option value="deal">DEAL</option><option value="bestseller">⭐ Bestseller</option>
            </select>

            {/* Images */}
            <div style={{ marginTop:8, background:'#f7f7f7', borderRadius:10, padding:14, border:'1px solid #e8e8e8' }}>
              <div style={{ fontSize:12, color:'#0c831f', fontWeight:700, marginBottom:10 }}>🖼️ PRODUCT IMAGES (up to 4)</div>
              <div style={{ width:'100%', height:180, background:'#fff', borderRadius:10, marginBottom:10, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #e8e8e8', position:'relative', overflow:'hidden' }}>
                {previews[activePreview]
                  ? <img src={previews[activePreview]} alt="preview" style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain' }} onError={e=>e.target.src=''} />
                  : <div style={{ textAlign:'center', color:'#ccc' }}><div style={{ fontSize:36 }}>📷</div><div style={{ fontSize:11, marginTop:4 }}>Image {activePreview+1} preview</div></div>}
                <div style={{ position:'absolute', bottom:6, right:6, background:'rgba(0,0,0,0.15)', color:'#555', fontSize:10, padding:'2px 6px', borderRadius:4 }}>IMG {activePreview+1}/4</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:10 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} onClick={()=>setActivePreview(i)} style={{ border:`2px solid ${activePreview===i?'#0c831f':'#e8e8e8'}`, borderRadius:8, cursor:'pointer', background:'#fff', aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                    {previews[i]
                      ? <img src={previews[i]} alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} onError={e=>e.target.style.display='none'} />
                      : <span style={{ color:'#ccc', fontSize:10, fontWeight:700 }}>IMG {i+1}</span>}
                    {previews[i] && <div onClick={e=>{e.stopPropagation();clearImage(i)}} style={{ position:'absolute', top:2, right:2, background:'#e23744', color:'#fff', borderRadius:'50%', width:15, height:15, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, cursor:'pointer' }}>×</div>}
                  </div>
                ))}
              </div>
              <input style={{...inp, marginBottom:6}} placeholder={`📋 Paste URL for image ${activePreview+1}`} value={imageUrls[activePreview]} onChange={e=>handleUrlChange(activePreview,e.target.value)} />
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <div style={{ flex:1, height:1, background:'#e0e0e0' }}/><span style={{ fontSize:11, color:'#aaa' }}>OR</span><div style={{ flex:1, height:1, background:'#e0e0e0' }}/>
              </div>
              <button onClick={()=>fileRefs[activePreview].current.click()} style={{ width:'100%', background:'#fff', color:'#888', border:'1px dashed #ccc', padding:'7px', borderRadius:7, fontSize:12, cursor:'pointer', fontWeight:600 }}>
                📷 Upload image {activePreview+1} {imageFiles[activePreview]?`· ✅ ${imageFiles[activePreview].name}`:''}
              </button>
              {[0,1,2,3].map(i=><input key={i} ref={fileRefs[i]} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>handleImageFile(i,e)} />)}
              <div style={{ display:'flex', gap:6, marginTop:10 }}>
                {[0,1,2,3].map(i=>(
                  <button key={i} onClick={()=>setActivePreview(i)} style={{ flex:1, padding:'5px 0', background:activePreview===i?'#0c831f':'#fff', color:activePreview===i?'#fff':'#888', border:`1px solid ${activePreview===i?'#0c831f':'#e0e0e0'}`, borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                    {previews[i]?'✅':`IMG ${i+1}`}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={addProduct} disabled={uploading} style={{ width:'100%', background:uploading?'#ccc':'#0c831f', color:'#fff', border:'none', padding:12, borderRadius:8, fontWeight:800, fontSize:14, cursor:uploading?'not-allowed':'pointer', marginTop:14 }}>
              {uploading?'⏳ Uploading...':'+ Add product'}
            </button>
          </div>

          {/* PRODUCTS LIST */}
          <div style={{...box, maxHeight:700, overflowY:'auto'}}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ fontSize:14, fontWeight:800 }}>All products ({products.length})</div>
              <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="🔍 Search..." style={{ background:'#f7f7f7', border:'1px solid #e0e0e0', color:'#1a1a1a', padding:'6px 12px', borderRadius:8, fontSize:12, outline:'none', width:160 }} />
            </div>
            {filteredProducts.map(p=>(
              <div key={p._id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #f0f0f0' }}>
                <div style={{ width:46, height:46, background:'#f7f7f7', borderRadius:8, overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #e8e8e8' }}>
                  <img src={p.image} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'contain', padding:3 }}
                    onError={e=>{e.target.style.display='none';e.target.parentNode.innerHTML=`<div style="font-size:20px;display:flex;align-items:center;justify-content:center;width:100%;height:100%">${EMO[p.category]||'📦'}</div>`}} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'#1a1a1a' }}>{p.name}</div>
                  <div style={{ fontSize:11, color: p.stock===0?'#e23744':p.stock<10?'#ff6d00':'#888' }}>
                    Stock: <b>{p.stock}</b> · {p.category}
                    {p.stock===0 && <span style={{ marginLeft:4 }}>⚠️ Out</span>}
                    {p.stock>0 && p.stock<10 && <span style={{ marginLeft:4 }}>⚡ Low</span>}
                  </div>
                </div>
                <span style={{ fontSize:13, fontWeight:900, color:'#0c831f' }}>₹{p.price}</span>
                <button onClick={()=>openEdit(p)} style={{ background:'#f0fff4', color:'#0c831f', border:'1px solid #0c831f', padding:'4px 10px', borderRadius:6, cursor:'pointer', fontSize:11, fontWeight:700 }}>✏️ Edit</button>
                <button onClick={()=>deleteProd(p._id)} style={{ background:'#fff5f5', color:'#e23744', border:'1px solid #e23744', padding:'4px 10px', borderRadius:6, cursor:'pointer', fontSize:11, fontWeight:700 }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STOCK TAB ── */}
      {tab==='stock' && (
        <div style={box}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, flexWrap:'wrap' }}>
            <div style={{ fontSize:14, fontWeight:800 }}>📦 Stock Management</div>
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="🔍 Search product..." style={{ background:'#f7f7f7', border:'1px solid #e0e0e0', color:'#1a1a1a', padding:'7px 12px', borderRadius:8, fontSize:12, outline:'none', width:200 }} />
            <div style={{ display:'flex', gap:6, marginLeft:'auto' }}>
              {[['all','All'],['low','⚡ Low Stock'],['out','❌ Out of Stock']].map(([val,label])=>(
                <button key={val} onClick={()=>setStockFilter(val)} style={{ background:stockFilter===val?'#0c831f':'#fff', color:stockFilter===val?'#fff':'#666', border:`1px solid ${stockFilter===val?'#0c831f':'#e0e0e0'}`, padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer' }}>{label}</button>
              ))}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
            {[['Total Products',products.length,'#0c831f'],['Low Stock (< 10)',products.filter(p=>p.stock>0&&p.stock<10).length,'#ff6d00'],['Out of Stock',products.filter(p=>p.stock===0).length,'#e23744']].map(([label,val,color])=>(
              <div key={label} style={{ background:'#f7f7f7', border:'1px solid #e8e8e8', borderRadius:10, padding:14, textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:900, color }}>{val}</div>
                <div style={{ fontSize:11, color:'#888', marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'2px solid #e8e8e8', background:'#f7f7f7' }}>
                  {['Product','Category','Price','Stock','Quick Update','Action'].map(h=>(
                    <th key={h} style={{ padding:'10px 8px', textAlign:'left', fontSize:11, color:'#888', fontWeight:700, textTransform:'uppercase', letterSpacing:0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p=>(
                  <tr key={p._id} style={{ borderBottom:'1px solid #f0f0f0' }}>
                    <td style={{ padding:'10px 8px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:36, height:36, background:'#f7f7f7', borderRadius:6, overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #e8e8e8' }}>
                          <img src={p.image} alt="" style={{ width:'100%', height:'100%', objectFit:'contain', padding:2 }} onError={e=>{e.target.style.display='none';e.target.parentNode.innerHTML=`<span style="font-size:16px">${EMO[p.category]||'📦'}</span>`}} />
                        </div>
                        <div style={{ fontSize:13, fontWeight:600, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'#1a1a1a' }}>{p.name}</div>
                      </div>
                    </td>
                    <td style={{ padding:'10px 8px', fontSize:12, color:'#888', textTransform:'capitalize' }}>{p.category}</td>
                    <td style={{ padding:'10px 8px', fontSize:13, fontWeight:700, color:'#0c831f' }}>₹{p.price}</td>
                    <td style={{ padding:'10px 8px' }}>
                      <span style={{ fontSize:14, fontWeight:900, color: p.stock===0?'#e23744':p.stock<10?'#ff6d00':'#0c831f' }}>{p.stock}</span>
                      {p.stock===0 && <span style={{ fontSize:10, color:'#e23744', marginLeft:4, fontWeight:600 }}>OUT</span>}
                      {p.stock>0 && p.stock<10 && <span style={{ fontSize:10, color:'#ff6d00', marginLeft:4, fontWeight:600 }}>LOW</span>}
                    </td>
                    <td style={{ padding:'10px 8px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <button onClick={()=>quickStock(p._id,p.stock-1)} style={{ width:26, height:26, background:'#fff5f5', color:'#e23744', border:'1px solid #e23744', borderRadius:6, fontWeight:900, cursor:'pointer', fontSize:14 }}>−</button>
                        <input type="number" value={p.stock} onChange={e=>quickStock(p._id,Number(e.target.value))} style={{ width:56, background:'#f7f7f7', border:'1px solid #e0e0e0', color:'#1a1a1a', padding:'4px 6px', borderRadius:6, fontSize:13, fontWeight:700, textAlign:'center', outline:'none' }} />
                        <button onClick={()=>quickStock(p._id,p.stock+1)} style={{ width:26, height:26, background:'#f0fff4', color:'#0c831f', border:'1px solid #0c831f', borderRadius:6, fontWeight:900, cursor:'pointer', fontSize:14 }}>+</button>
                        <button onClick={()=>quickStock(p._id,p.stock+10)} style={{ background:'#f0fff4', color:'#0c831f', border:'1px solid #0c831f', padding:'3px 8px', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>+10</button>
                        <button onClick={()=>quickStock(p._id,p.stock+50)} style={{ background:'#f0fff4', color:'#0c831f', border:'1px solid #0c831f', padding:'3px 8px', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>+50</button>
                      </div>
                    </td>
                    <td style={{ padding:'10px 8px' }}>
                      <button onClick={()=>openEdit(p)} style={{ background:'#f0fff4', color:'#0c831f', border:'1px solid #0c831f', padding:'4px 10px', borderRadius:6, cursor:'pointer', fontSize:11, fontWeight:700 }}>✏️ Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {tab==='orders' && (
        <div style={{...box, maxHeight:650, overflowY:'auto'}}>
          <div style={{ fontSize:14, fontWeight:800, marginBottom:14 }}>All orders ({orders.length})</div>
          {orders.length===0 && <div style={{ color:'#888', fontSize:13 }}>No orders yet</div>}
          {orders.map(o=>(
            <div key={o._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #f0f0f0' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, color:'#aaa', fontWeight:600 }}>#{o._id.slice(-6).toUpperCase()} · {new Date(o.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
                <div style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>{o.customerName}</div>
                <div style={{ fontSize:12, color:'#888' }}>{o.address} · ₹{o.totalPrice}</div>
                <div style={{ fontSize:11, color:'#aaa', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.items.map(i=>`${i.name} ×${i.quantity}`).join(', ')}</div>
              </div>
              <select value={o.orderStatus} onChange={e=>updateStatus(o._id,e.target.value)} style={{ background:'#f7f7f7', border:'1px solid #e0e0e0', color:'#1a1a1a', padding:'6px 8px', borderRadius:7, fontSize:12, cursor:'pointer', outline:'none' }}>
                {['Pending','Confirmed','Out for Delivery','Delivered','Cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editProduct && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}>
          <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:16, padding:24, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 8px 32px rgba(0,0,0,0.15)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <div style={{ fontSize:15, fontWeight:800, color:'#1a1a1a' }}>✏️ Edit Product</div>
              <button onClick={()=>setEditProduct(null)} style={{ background:'#f0f0f0', color:'#888', border:'none', width:28, height:28, borderRadius:'50%', cursor:'pointer', fontSize:16, fontWeight:700 }}>×</button>
            </div>

            {editForm.image && (
              <div style={{ width:'100%', height:140, background:'#f7f7f7', borderRadius:10, marginBottom:14, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #e8e8e8' }}>
                <img src={editForm.image} alt="" style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain' }} onError={e=>e.target.style.display='none'} />
              </div>
            )}

            <input style={einp} placeholder="Product name" value={editForm.name||''} onChange={e=>setEditForm({...editForm,name:e.target.value})} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <input style={einp} type="number" placeholder="Price (₹)" value={editForm.price||''} onChange={e=>setEditForm({...editForm,price:e.target.value})} />
              <input style={einp} type="number" placeholder="MRP (₹)" value={editForm.mrp||''} onChange={e=>setEditForm({...editForm,mrp:e.target.value})} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <select style={einp} value={editForm.category||''} onChange={e=>setEditForm({...editForm,category:e.target.value})}>
                <option value="">Category</option>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <input style={einp} type="number" placeholder="Stock" value={editForm.stock||''} onChange={e=>setEditForm({...editForm,stock:e.target.value})} />
            </div>
            <input style={einp} placeholder="Description" value={editForm.description||''} onChange={e=>setEditForm({...editForm,description:e.target.value})} />
            <input style={einp} placeholder="Image URL" value={editForm.image||''} onChange={e=>setEditForm({...editForm,image:e.target.value})} />
            <select style={einp} value={editForm.badge||''} onChange={e=>setEditForm({...editForm,badge:e.target.value})}>
              <option value="">No badge</option>
              <option value="hot">🔥 Hot</option><option value="new">NEW</option>
              <option value="deal">DEAL</option><option value="bestseller">⭐ Bestseller</option>
            </select>

            <div style={{ background:'#f7f7f7', borderRadius:8, padding:12, marginBottom:12, border:'1px solid #e8e8e8' }}>
              <div style={{ fontSize:11, color:'#888', marginBottom:8, fontWeight:600 }}>QUICK STOCK UPDATE</div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {[0,10,25,50,100].map(n=>(
                  <button key={n} onClick={()=>setEditForm({...editForm,stock:n})} style={{ background:editForm.stock==n?'#0c831f':'#fff', color:editForm.stock==n?'#fff':'#666', border:`1px solid ${editForm.stock==n?'#0c831f':'#e0e0e0'}`, padding:'5px 12px', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                    {n===0?'Out of Stock':`Set ${n}`}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setEditProduct(null)} style={{ flex:1, background:'#f7f7f7', color:'#666', border:'1px solid #e0e0e0', padding:11, borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer' }}>Cancel</button>
              <button onClick={saveEdit} disabled={editSaving} style={{ flex:2, background:editSaving?'#ccc':'#0c831f', color:'#fff', border:'none', padding:11, borderRadius:8, fontWeight:800, fontSize:14, cursor:editSaving?'not-allowed':'pointer' }}>
                {editSaving?'Saving...':'💾 Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
