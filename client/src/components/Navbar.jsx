import { useNavigate, useLocation as useRouteLocation } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLocation } from '../context/LocationContext.jsx'

import LocationEditModal from './LocationEditModal.jsx'

export default function Navbar() {
  const navigate = useNavigate()
  const routeLocation = useRouteLocation()
  const { cartCount, cartTotal } = useCart()
  const { user, logout } = useAuth()
  const { location, detectLocation, loading: locLoading } = useLocation()
  const [search, setSearch] = useState('')
  const [isLocModalOpen, setIsLocModalOpen] = useState(false)

  const at = (p) => routeLocation.pathname === p

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <>
    <LocationEditModal isOpen={isLocModalOpen} onClose={() => setIsLocModalOpen(false)} />
    <nav style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
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
      <div onClick={() => setIsLocModalOpen(true)} style={{ flexShrink: 0, borderLeft: '1px solid #e0e0e0', paddingLeft: 20, cursor: 'pointer', opacity: locLoading ? 0.6 : 1, transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '2px' }} onMouseEnter={e => e.currentTarget.style.opacity=0.8} onMouseLeave={e => e.currentTarget.style.opacity=locLoading?0.6:1}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f97316', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>📍</span> Location
        </div>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#1a1a1a', letterSpacing: -0.3 }}>
          {locLoading ? 'Detecting...' : (location.city || 'Sawantwadi')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, maxWidth: 150 }}>
          <span style={{ fontSize: 11, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {locLoading ? 'Wait a moment' : (location.address || 'Select Address')}
          </span>
          <span style={{ fontSize: 10, color: '#f97316' }}>▼</span>
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

        {/* COINS */}
        <div onClick={() => navigate('/coins')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: 4 }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: at('/coins') ? '#F5A623' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: at('/coins') ? '#fff' : '#555', border: `2px solid ${at('/coins') ? '#F5A623' : '#555'}` }}>
            ₹
          </div>
          <span style={{ fontSize: 11, color: at('/coins') ? '#F5A623' : '#555', fontWeight: 600 }}>Coins</span>
        </div>

        {/* STORES */}
        <div onClick={() => navigate('/stores')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: 4 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={at('/stores') ? '#F5A623' : '#555'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
          </svg>
          <span style={{ fontSize: 11, color: at('/stores') ? '#F5A623' : '#555', fontWeight: 600 }}>Stores</span>
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
        <div onClick={() => navigate('/cart')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 10, background: '#0c831f', color: '#fff', padding: '10px 18px', borderRadius: 12, fontWeight: 800, transition: 'all 0.15s', boxShadow: '0 4px 12px rgba(12,131,31,0.2)' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {cartCount > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 11, lineHeight: 1, opacity: 0.9 }}>{cartCount} items</span>
              <span style={{ fontSize: 14, lineHeight: 1, marginTop: 3 }}>₹{cartTotal}</span>
            </div>
          ) : (
            <span style={{ fontSize: 14 }}>My Cart</span>
          )}
        </div>

      </div>
    </nav>
    </>
  )
}
