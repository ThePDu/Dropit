import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount, cartTotal } = useCart()
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')

  const at = (p) => location.pathname === p

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #e0e0e0',
      height: 72,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 20,
      position: 'sticky',
      top: 0,
      zIndex: 500,
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    }}>

      {/* LOGO */}
      <div onClick={() => navigate('/')} style={{ cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <div style={{ lineHeight: 1 }}>
          <div>
            <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1.5, background: 'linear-gradient(135deg, #f97316, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Drop
            </span>
            <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1.5, color: '#1a1a1a' }}>
              it
            </span>
          </div>
          <div style={{ fontSize: 9, color: '#aaa', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>
            Sawantwadi
          </div>
        </div>
      </div>

      {/* LOCATION */}
      <div style={{ flexShrink: 0, borderLeft: '1px solid #e0e0e0', paddingLeft: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a', letterSpacing: -0.3 }}>
          Delivery in 10 minutes
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <span style={{ fontSize: 12, color: '#555' }}>Sawantwadi, Maharashtra</span>
          <span style={{ fontSize: 11, color: '#555' }}>▼</span>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ flex: 1, maxWidth: 620, position: 'relative' }}>
        <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          placeholder='Search "paneer", "maggi", "lays"...'
          style={{
            width: '100%',
            background: '#f3f3f3',
            border: '1.5px solid #e8e8e8',
            color: '#1a1a1a',
            padding: '12px 18px 12px 44px',
            borderRadius: 12,
            fontSize: 14,
            transition: 'all 0.15s',
          }}
          onFocus={e => {
            e.target.style.borderColor = '#f97316'
            e.target.style.background = '#fff'
            e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)'
          }}
          onBlur={e => {
            e.target.style.borderColor = '#e8e8e8'
            e.target.style.background = '#f3f3f3'
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* RIGHT ICONS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginLeft: 'auto', flexShrink: 0 }}>

        {/* ADMIN */}
        {user?.role === 'admin' && (
          <div onClick={() => navigate('/admin')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: 4 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={at('/admin') ? '#f97316' : '#555'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
            </svg>
            <span style={{ fontSize: 11, color: at('/admin') ? '#f97316' : '#555', fontWeight: 600 }}>Admin</span>
          </div>
        )}

        {/* ORDERS */}
        <div onClick={() => navigate('/orders')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: 4 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={at('/orders') ? '#f97316' : '#555'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <path d="M9 12h6M9 16h4"/>
          </svg>
          <span style={{ fontSize: 11, color: at('/orders') ? '#f97316' : '#555', fontWeight: 600 }}>Orders</span>
        </div>

        {/* LOGIN / LOGOUT */}
        {user ? (
          <div onClick={() => { logout(); navigate('/') }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: 4 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>Logout</span>
          </div>
        ) : (
          <div onClick={() => navigate('/login')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: 4 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>Login</span>
          </div>
        )}

        {/* CART */}
        <div onClick={() => navigate('/cart')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: 4 }}>
          <div style={{ position: 'relative' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <div style={{
                position: 'absolute', top: -7, right: -9,
                background: '#f97316', color: '#fff',
                width: 20, height: 20, borderRadius: '50%',
                fontSize: 11, fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #fff',
              }}>
                {cartCount}
              </div>
            )}
          </div>
          <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>Cart</span>
        </div>

      </div>
    </nav>
  )
}
