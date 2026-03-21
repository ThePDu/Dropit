import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import API from '../api.js'
import ProductCard from '../components/ProductCard.jsx'

const CATS  = ['All','snacks','drinks','instant','dairy','stationery','medicines','hygiene']
const LABEL = { All:'All', snacks:'Snacks', drinks:'Drinks', instant:'Instant Food', dairy:'Dairy', stationery:'Stationery', medicines:'Medicines', hygiene:'Hygiene' }

const ICONS = {
  All: (color) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>),
  snacks: (color) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>),
  drinks: (color) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="2" x2="8" y2="6"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/><path d="M5 8l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2L19 8z"/><path d="M5 8h14"/></svg>),
  instant: (color) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><path d="M18 2l4 4-4 4"/><path d="M22 2h-4"/></svg>),
  dairy: (color) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l2 6H6L8 2z"/><path d="M6 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/><path d="M12 12v4"/><path d="M10 14h4"/></svg>),
  stationery: (color) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="2" x2="22" y2="6"/><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"/></svg>),
  medicines: (color) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>),
  hygiene: (color) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>),
}

function Skeleton() {
  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 14, overflow: 'hidden' }}>
      <div className="shimmer-box" style={{ height: 130 }} />
      <div style={{ padding: 12 }}>
        <div className="shimmer-box" style={{ height: 11, marginBottom: 8 }} />
        <div className="shimmer-box" style={{ height: 11, width: '70%', marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="shimmer-box" style={{ height: 18, width: 50 }} />
          <div className="shimmer-box" style={{ height: 32, width: 32, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [activeCat, setActiveCat] = useState('All')
  const location  = useLocation()
  const searchQuery = new URLSearchParams(location.search).get('search') || ''

  useEffect(() => { fetchProducts() }, [activeCat, searchQuery])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeCat !== 'All') params.category = activeCat
      if (searchQuery) params.search = searchQuery
      const { data } = await API.get('/products', { params })
      setProducts(data)
    } catch { setProducts([]) }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: '#f8f8f8' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* TOP CATEGORY BAR */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 72, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', padding: '0 16px' }}>
          {CATS.map(c => {
            const active = activeCat === c
            const color = active ? '#0c831f' : '#555'
            return (
              <div key={c} onClick={() => setActiveCat(c)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 20px', cursor: 'pointer', borderBottom: active ? '3px solid #0c831f' : '3px solid transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                <div style={{ marginBottom: 4 }}>{ICONS[c](color)}</div>
                <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color, whiteSpace: 'nowrap' }}>{LABEL[c]}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '0 16px 0' }}>

        {/* ── HERO SECTION ── */}
        <div style={{ margin:'16px 0', borderRadius:20, overflow:'hidden', position:'relative', background:'linear-gradient(135deg, #0c831f 0%, #064e12 100%)', minHeight:200 }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:220, height:220, background:'rgba(255,255,255,0.05)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', bottom:-60, left:200, width:180, height:180, background:'rgba(255,255,255,0.04)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', top:20, right:160, width:80, height:80, background:'rgba(255,255,255,0.06)', borderRadius:'50%' }} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', padding:'28px 32px', position:'relative', zIndex:1 }}>
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', padding:'5px 14px', borderRadius:20, fontSize:11, fontWeight:700, marginBottom:16 }}>
                <span style={{ width:7, height:7, background:'#4cff72', borderRadius:'50%', display:'inline-block', animation:'pulse 1.5s infinite', boxShadow:'0 0 6px #4cff72' }} />
                Live · Delivering now in Sawantwadi
              </div>
              <h1 style={{ fontSize:36, fontWeight:900, letterSpacing:-1.5, lineHeight:1.1, marginBottom:10, color:'#fff' }}>
                Delivery in <span style={{ color:'#ffd54f' }}>10 minutes</span><br/>
                <span style={{ fontSize:28, fontWeight:700, color:'rgba(255,255,255,0.85)' }}>to your hostel room 🚀</span>
              </h1>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:14, marginBottom:24, lineHeight:1.6 }}>
                Snacks, drinks & essentials — always available, zero delivery fee
              </p>
              <div style={{ display:'flex', gap:0, background:'rgba(255,255,255,0.1)', backdropFilter:'blur(8px)', borderRadius:12, overflow:'hidden', border:'1px solid rgba(255,255,255,0.15)', width:'fit-content' }}>
                {[{val:'⚡ 10 min',label:'Avg delivery'},{val:`🛍️ ${products.length||'13'}+`,label:'Products'},{val:'₹0',label:'Delivery fee'}].map((s,i)=>(
                  <div key={s.label} style={{ padding:'12px 20px', borderRight:i<2?'1px solid rgba(255,255,255,0.15)':'none', textAlign:'center' }}>
                    <div style={{ fontSize:16, fontWeight:900, color:'#fff', whiteSpace:'nowrap' }}>{s.val}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.6)', fontWeight:600, marginTop:2, whiteSpace:'nowrap' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, marginLeft:32 }}>
              <div style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:20, padding:'24px 32px', textAlign:'center', animation:'float 3s ease-in-out infinite' }}>
                <div style={{ fontSize:32, fontWeight:900, color:'#fff', letterSpacing:2, marginBottom:4 }}>DROPIT</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontWeight:600, marginBottom:2 }}>Fast delivery</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>Sawantwadi 📍</div>
              </div>
              <div style={{ background:'#ffd54f', color:'#1a1a1a', padding:'8px 20px', borderRadius:20, fontSize:12, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 12px rgba(0,0,0,0.2)' }}>
                Order Now →
              </div>
            </div>
          </div>
        </div>

        {/* ── OFFER CARDS ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
          {[
            { icon:'⚡', title:'Flash deals', sub:'Upto 30% off', badge:'HOT', bc:'#ff6d00', bg:'linear-gradient(135deg,#fff8f0,#fff0e0)', border:'#ffd0a0' },
            { icon:'🎒', title:'Student special', sub:'Under ₹30', badge:'NEW', bc:'#7c4dff', bg:'linear-gradient(135deg,#f5f0ff,#ede0ff)', border:'#d0b8ff' },
            { icon:'🌙', title:'Midnight snacks', sub:'Always available', badge:'', bc:'', bg:'linear-gradient(135deg,#f0f4ff,#e8eeff)', border:'#c8d4ff' },
          ].map(o => (
            <div key={o.title}
              style={{ background: o.bg, border:`1px solid ${o.border}`, borderRadius:14, padding:'16px 18px', display:'flex', alignItems:'center', gap:12, cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
              <div style={{ width:44, height:44, background:'#fff', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>{o.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:800, color:'#1a1a1a' }}>{o.title}</div>
                <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{o.sub}</div>
              </div>
              {o.badge && <div style={{ background:o.bc, color:'#fff', fontSize:10, fontWeight:800, padding:'4px 10px', borderRadius:6, boxShadow:`0 2px 8px ${o.bc}55` }}>{o.badge}</div>}
            </div>
          ))}
        </div>

        {/* PRODUCTS HEADING */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div>
            <h2 style={{ fontSize:18, fontWeight:800, letterSpacing:-0.5, color:'#1a1a1a' }}>
              {searchQuery ? `Results for "${searchQuery}"` : LABEL[activeCat]}
            </h2>
            <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{products.length} items</div>
          </div>
          {activeCat !== 'All' && (
            <button onClick={() => setActiveCat('All')} style={{ background:'#f0fff4', color:'#0c831f', fontSize:13, fontWeight:700, border:'1px solid #0c831f', padding:'6px 14px', borderRadius:8, cursor:'pointer' }}>See all →</button>
          )}
        </div>

        {/* PRODUCT GRID */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:14, paddingBottom:24 }}>
          {loading
            ? Array(8).fill(0).map((_,i) => <Skeleton key={i} />)
            : products.length === 0
              ? <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px 0' }}>
                  <div style={{ fontSize:52, marginBottom:12 }}>🔍</div>
                  <div style={{ fontSize:16, fontWeight:700, color:'#1a1a1a' }}>No products found</div>
                </div>
              : products.map(p => <ProductCard key={p._id} product={p} />)
          }
        </div>

        {/* BANNERS */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:28 }}>
          {[
            { bg:'linear-gradient(135deg,#0c831f,#064e12)', title:'Free delivery', sub:'On orders above ₹199', icon:'🚀', color:'#fff', subColor:'rgba(255,255,255,0.7)' },
            { bg:'linear-gradient(135deg,#1565c0,#0d47a1)', title:'Always fresh', sub:'Stocked by local shops', icon:'✨', color:'#fff', subColor:'rgba(255,255,255,0.7)' },
          ].map(b => (
            <div key={b.title} style={{ background:b.bg, borderRadius:16, padding:'22px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', transition:'all 0.2s', boxShadow:'0 4px 16px rgba(0,0,0,0.1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)' }}>
              <div>
                <div style={{ fontSize:18, fontWeight:800, marginBottom:4, color:b.color }}>{b.title}</div>
                <div style={{ fontSize:13, color:b.subColor }}>{b.sub}</div>
              </div>
              <span style={{ fontSize:48 }}>{b.icon}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background:'#fff', borderTop:'1px solid #e0e0e0' }}>
        <div style={{ padding:'28px 16px', borderBottom:'1px solid #e0e0e0' }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:'#1a1a1a', marginBottom:16 }}>Popular Searches</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { label:'Products', items:['Maggi','Lays','Kurkure','Bisleri','Amul Butter','Dark Fantasy','Red Bull','Frooti','Glucose-D','Dettol','Colgate','Top Ramen'] },
              { label:'Brands', items:['Amul','Lays','Maggi','Kurkure','Bisleri','Dettol','Colgate','Red Bull','Sunfeast','Parle','Dabur','Vicks'] },
              { label:'Categories', items:['Snacks','Drinks','Instant Food','Dairy','Stationery','Medicines','Hygiene','Chips','Noodles','Biscuits','Water','Energy Drinks'] },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', alignItems:'flex-start', gap:8, flexWrap:'wrap' }}>
                <span style={{ fontSize:13, fontWeight:800, color:'#1a1a1a', flexShrink:0 }}>{row.label}</span>
                <span style={{ fontSize:13, color:'#555' }}>:&nbsp;
                  {row.items.map((item,i) => (
                    <span key={item}>
                      <span style={{ cursor:'pointer', color:'#555' }} onMouseEnter={e=>e.target.style.color='#0c831f'} onMouseLeave={e=>e.target.style.color='#555'}>{item}</span>
                      {i < row.items.length-1 && <span style={{ color:'#ccc', margin:'0 6px' }}>|</span>}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding:'28px 16px', borderBottom:'1px solid #e0e0e0' }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:'#1a1a1a', marginBottom:16 }}>Categories</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'12px 0' }}>
            {['Snacks & Munchies','Cold Drinks & Juices','Instant Food','Sweet Cravings','Dairy & Eggs','Stationery','Medicines & Health','Hygiene & Grooming','Breakfast & Sauces','Biscuits & Cookies','Energy Drinks','Water & Beverages','Chips & Crisps','Noodles & Pasta','Personal Care'].map(cat => (
              <div key={cat} style={{ fontSize:13, color:'#333', cursor:'pointer', padding:'3px 0' }} onMouseEnter={e=>e.target.style.color='#0c831f'} onMouseLeave={e=>e.target.style.color='#333'}>{cat}</div>
            ))}
          </div>
        </div>

        <div style={{ padding:'32px 16px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:32 }}>
          <div>
            <div style={{ marginBottom:16 }}>
              <span style={{ fontSize:28, fontWeight:900, letterSpacing:-1, color:'#0c831f' }}>Drop</span>
              <span style={{ fontSize:28, fontWeight:900, letterSpacing:-1, color:'#1a1a1a' }}>it</span>
            </div>
            <div style={{ fontSize:11, color:'#aaa', lineHeight:1.8 }}>© DropIt — Sawantwadi<br/>CSE Mini Project 2024</div>
          </div>
          <div>
            {['Home','Delivery Areas','Careers','Customer Support','Press','About DropIt'].map(link => (
              <div key={link} style={{ fontSize:13, color:'#555', marginBottom:12, cursor:'pointer' }} onMouseEnter={e=>e.target.style.color='#0c831f'} onMouseLeave={e=>e.target.style.color='#555'}>{link}</div>
            ))}
          </div>
          <div>
            {['Privacy Policy','Terms of Use','Refund Policy','Sell on DropIt','Deliver with DropIt','Partner with us'].map(link => (
              <div key={link} style={{ fontSize:13, color:'#555', marginBottom:12, cursor:'pointer' }} onMouseEnter={e=>e.target.style.color='#0c831f'} onMouseLeave={e=>e.target.style.color='#555'}>{link}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:'#1a1a1a', marginBottom:14 }}>Download App</div>
            {['Get it on Play Store','Get it on App Store'].map(btn => (
              <div key={btn} style={{ display:'flex', alignItems:'center', gap:10, border:'1px solid #e0e0e0', borderRadius:10, padding:'10px 14px', marginBottom:10, cursor:'pointer' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#0c831f';e.currentTarget.style.background='#f0fff4'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='#e0e0e0';e.currentTarget.style.background='#fff'}}>
                <span style={{ fontSize:12, fontWeight:600, color:'#1a1a1a' }}>{btn}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:'#f8f8f8', borderTop:'1px solid #e0e0e0', padding:'12px 16px', display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontSize:12, color:'#aaa' }}>© 2024 DropIt. All rights reserved. Made with ❤️ for Sawantwadi</span>
          <span style={{ fontSize:12, color:'#aaa' }}>Powered by React + Node.js + MongoDB</span>
        </div>
      </footer>
    </div>
  )
}