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

      {/* TOP CATEGORY BAR */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 72, zIndex: 100, marginTop: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', padding: '0 16px' }}>
          {CATS.map(c => {
            const active = activeCat === c
            const color = active ? '#7c3aed' : '#555'
            return (
              <div key={c} onClick={() => setActiveCat(c)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 20px', cursor: 'pointer', borderBottom: active ? '3px solid #7c3aed' : '3px solid transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                <div style={{ marginBottom: 4 }}>{ICONS[c](color)}</div>
                <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color, whiteSpace: 'nowrap' }}>{LABEL[c]}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '0 16px 0' }}>

        {/* HERO */}
        <div style={{ 
          background: 'linear-gradient(135deg, #FFDE4D 0%, #FFB22C 100%)', 
          padding: '36px 36px', 
          marginBottom: 24, 
          borderRadius: 24, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          overflow: 'hidden', 
          position: 'relative', 
          boxShadow: '0 12px 24px rgba(255, 178, 44, 0.3)',
        }}>
          {/* Animated Background Elements */}
          <div style={{ position: 'absolute', right: '-5%', top: '-20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulse 4s infinite alternate' }} />
          <div style={{ position: 'absolute', left: '40%', bottom: '-30%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulse 3s infinite alternate-reverse' }} />
          
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '65%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: 'none', color: '#e65100', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 800, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 0.5, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <span style={{ width: 8, height: 8, background: '#ff3b30', borderRadius: '50%', display: 'inline-block', animation: 'pulseRing 1.5s infinite' }} />
              Live · Delivering to Sawantwadi
            </div>
            
            <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16, color: '#1a1a1a' }}>
              Hostel hunger ends<br />
              <div style={{ display: 'inline-block', marginTop: 8 }}>
                in <span style={{ background: '#1a1a1a', color: '#FFDE4D', padding: '0 12px', borderRadius: 12, display: 'inline-block', transform: 'rotate(-2deg)', boxShadow: '0 6px 15px rgba(0,0,0,0.1)' }}>10 minutes</span>
              </div>
            </h1>
            
            <p style={{ color: '#4a4a4a', fontSize: 16, fontWeight: 600, marginBottom: 26, maxWidth: '85%' }}>
              Snacks, daily essentials, and midnight cravings. Instant delivery to your room.
            </p>
            
            <div style={{ display: 'flex', gap: 16 }}>
              {[['⚡ fast','Delivery'],[`🛒 ${products.length||25}+`,'Products'],['🛵 ₹0','Delivery fee']].map(([num,label]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', padding: '10px 16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{num.split(' ')[0]}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#1a1a1a' }}>{num.split(' ')[1] || num.split(' ')[0]}</div>
                    <div style={{ fontSize: 11, color: '#4a4a4a', fontWeight: 700, marginTop: 1 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ width: 220, height: 220, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {/* Premium Image Card "Popup" */}
            <div style={{ 
              width: 170, 
              height: 190, 
              background: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80") center/cover', 
              position: 'absolute', 
              bottom: 10, 
              borderRadius: 22, 
              boxShadow: '0 24px 40px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.2)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flexDirection: 'column', 
              animation: 'bounceSlow 3s infinite ease-in-out',
              overflow: 'hidden'
            }}>
              {/* Premium dark gradient overlay for text readability */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.9) 100%)' }} />
              
              {/* Internal Content */}
              <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto', paddingBottom: 22, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#FFDE4D', letterSpacing: -1, textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>DropIt</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', opacity: 0.95, marginTop: 4, letterSpacing: 0.5, textTransform: 'uppercase' }}>Fresh & Fast</div>
              </div>
            </div>
            
            {/* Groceries Popping out */}
            <div style={{ fontSize: 44, position: 'absolute', top: 5, left: -5, animation: 'float 2.5s infinite ease-in-out', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.3))', transform: 'rotate(-15deg)' }}>🥦</div>
            <div style={{ fontSize: 50, position: 'absolute', top: -15, left: 60, animation: 'float 3s infinite ease-in-out', animationDelay: '0.2s', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.3))' }}>🍞</div>
            <div style={{ fontSize: 42, position: 'absolute', top: 15, right: -5, animation: 'float 2.8s infinite ease-in-out', animationDelay: '0.4s', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.3))', transform: 'rotate(20deg)' }}>🍎</div>
            <div style={{ fontSize: 36, position: 'absolute', top: 60, left: -20, animation: 'float 2.4s infinite ease-in-out', animationDelay: '0.1s', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.3))', transform: 'rotate(-10deg)' }}>🥛</div>
            <div style={{ fontSize: 40, position: 'absolute', top: 65, right: -15, animation: 'float 2.7s infinite ease-in-out', animationDelay: '0.5s', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.3))', transform: 'rotate(15deg)' }}>🍫</div>
            
            {/* Sparkles */}
            <div style={{ fontSize: 24, position: 'absolute', top: -5, left: -15, animation: 'pulse 1.5s infinite', color: '#ffeb3b', textShadow: '0 0 8px rgba(255,235,59,0.9)' }}>✨</div>
            <div style={{ fontSize: 28, position: 'absolute', top: 40, right: -25, animation: 'pulse 2s infinite', color: '#ffeb3b', textShadow: '0 0 8px rgba(255,235,59,0.9)', animationDelay: '0.3s' }}>✨</div>
          </div>
        </div>

        {/* OFFER STRIP */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { icon:'⚡', title:'Flash deals', sub:'Upto 30% off', badge:'HOT', bc:'#ff6d00' },
            { icon:'🎒', title:'Student special', sub:'Under ₹30', badge:'NEW', bc:'#7c4dff' },
            { icon:'🌙', title:'Midnight snacks', sub:'Always available', badge:'', bc:'' },
          ].map(o => (
            <div key={o.title} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#0c831f'; e.currentTarget.style.background='#f0fff4' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#e0e0e0'; e.currentTarget.style.background='#fff' }}>
              <span style={{ fontSize: 24 }}>{o.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{o.title}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{o.sub}</div>
              </div>
              {o.badge && <div style={{ background: o.bc, color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 5 }}>{o.badge}</div>}
            </div>
          ))}
        </div>

        {/* PRODUCTS HEADING */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, color: '#1a1a1a' }}>
              {searchQuery ? `Results for "${searchQuery}"` : LABEL[activeCat]}
            </h2>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{products.length} items</div>
          </div>
          {activeCat !== 'All' && (
            <button onClick={() => setActiveCat('All')} style={{ background: 'transparent', color: '#0c831f', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>See all →</button>
          )}
        </div>

        {/* PRODUCT GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 14, paddingBottom: 24 }}>
          {loading
            ? Array(8).fill(0).map((_,i) => <Skeleton key={i} />)
            : products.length === 0
              ? <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px 0' }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>No products found</div>
                </div>
              : products.map(p => <ProductCard key={p._id} product={p} />)
          }
        </div>

        {/* BANNERS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
          {[
            { bg:'linear-gradient(135deg,#e8f5e9,#c8e6c9)', title:'Free delivery', sub:'On orders above ₹199', icon:'🚀', color:'#1b5e20' },
            { bg:'linear-gradient(135deg,#e8f0fe,#c5d8fb)', title:'Always fresh', sub:'Stocked by local shops', icon:'✨', color:'#1a237e' },
          ].map(b => (
            <div key={b.title} style={{ background: b.bg, borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e0e0e0' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: b.color }}>{b.title}</div>
                <div style={{ fontSize: 13, color: '#555' }}>{b.sub}</div>
              </div>
              <span style={{ fontSize: 44 }}>{b.icon}</span>
            </div>
          ))}
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ background: '#fff', borderTop: '1px solid #e0e0e0' }}>
        <div style={{ padding: '28px 16px', borderBottom: '1px solid #e0e0e0' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', marginBottom: 16 }}>Popular Searches</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                      <span style={{ cursor:'pointer', color:'#555' }} onMouseEnter={e=>e.target.style.color='#f97316'} onMouseLeave={e=>e.target.style.color='#555'}>{item}</span>
                      {i < row.items.length-1 && <span style={{ color:'#ccc', margin:'0 6px' }}>|</span>}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '28px 16px', borderBottom: '1px solid #e0e0e0' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', marginBottom: 16 }}>Categories</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px 0' }}>
            {['Snacks & Munchies','Cold Drinks & Juices','Instant Food','Sweet Cravings','Dairy & Eggs','Stationery','Medicines & Health','Hygiene & Grooming','Breakfast & Sauces','Biscuits & Cookies','Energy Drinks','Water & Beverages','Chips & Crisps','Noodles & Pasta','Personal Care'].map(cat => (
              <div key={cat} style={{ fontSize:13, color:'#333', cursor:'pointer', padding:'3px 0' }} onMouseEnter={e=>e.target.style.color='#f97316'} onMouseLeave={e=>e.target.style.color='#333'}>{cat}</div>
            ))}
          </div>
        </div>

        <div style={{ padding: '32px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 32 }}>
          <div>
            <div style={{ marginBottom:16 }}>
              <span style={{ fontSize:28, fontWeight:900, letterSpacing:-1, background:'linear-gradient(135deg,#f97316,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Drop</span>
              <span style={{ fontSize:28, fontWeight:900, letterSpacing:-1, color:'#1a1a1a' }}>it</span>
            </div>
            <div style={{ display:'flex', gap:10, marginBottom:16 }}>
              {[
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.4 5.4 3.9 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              ].map((icon,i) => (
                <div key={i} style={{ width:34, height:34, border:'1px solid #e0e0e0', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='#f97316';e.currentTarget.style.background='#fff5f0'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='#e0e0e0';e.currentTarget.style.background='#fff'}}>{icon}</div>
              ))}
            </div>
            <div style={{ fontSize:11, color:'#aaa', lineHeight:1.8 }}>© DropIt — Sawantwadi<br/>CSE Mini Project 2024</div>
          </div>
          <div>
            {['Home','Delivery Areas','Careers','Customer Support','Press','About DropIt'].map(link => (
              <div key={link} style={{ fontSize:13, color:'#555', marginBottom:12, cursor:'pointer' }} onMouseEnter={e=>e.target.style.color='#f97316'} onMouseLeave={e=>e.target.style.color='#555'}>{link}</div>
            ))}
          </div>
          <div>
            {['Privacy Policy','Terms of Use','Refund Policy','Sell on DropIt','Deliver with DropIt','Partner with us'].map(link => (
              <div key={link} style={{ fontSize:13, color:'#555', marginBottom:12, cursor:'pointer' }} onMouseEnter={e=>e.target.style.color='#f97316'} onMouseLeave={e=>e.target.style.color='#555'}>{link}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:'#1a1a1a', marginBottom:14 }}>Download App</div>
            {['Get it on Play Store','Get it on App Store'].map(btn => (
              <div key={btn} style={{ display:'flex', alignItems:'center', gap:10, border:'1px solid #e0e0e0', borderRadius:10, padding:'10px 14px', marginBottom:10, cursor:'pointer' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#f97316';e.currentTarget.style.background='#fff5f0'}}
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
