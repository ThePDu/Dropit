export default function SellerSidebar({ activeTab, setActiveTab, newOrderBadge = 0 }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orders',    label: 'Orders',    icon: '🛍️', badge: newOrderBadge },
    { id: 'products',  label: 'Products',  icon: '📦' },
    { id: 'settings',  label: 'Settings',  icon: '⚙️' },
  ];

  return (
    <div style={{ width: 260, background: '#111827', color: '#fff', padding: '28px 20px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48, paddingLeft: 8 }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #F5A623 0%, #FF6B35 100%)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245,166,35,0.3)' }}>
          <span style={{ fontSize: 18, color: '#fff' }}>D</span>
        </div>
        <h4 style={{ margin: 0, fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>Partner Hub</h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, position: 'relative',
              background: activeTab === tab.id ? 'rgba(245,166,35,0.15)' : 'transparent',
              color:      activeTab === tab.id ? '#F5A623' : '#9CA3AF',
              border:     activeTab === tab.id ? '1px solid rgba(245,166,35,0.3)' : '1px solid transparent',
              padding: '12px 16px', borderRadius: 12,
              fontSize: 15, fontWeight: activeTab === tab.id ? 700 : 600,
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%',
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; } }}
            onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; } }}
          >
            <span style={{ fontSize: 18, filter: activeTab !== tab.id ? 'grayscale(100%) opacity(0.6)' : 'none' }}>{tab.icon}</span>
            {tab.label}
            {/* Notification badge */}
            {tab.badge > 0 && (
              <span style={{
                marginLeft: 'auto',
                background: '#EF4444', color: '#fff',
                fontSize: 11, fontWeight: 900,
                padding: '2px 7px', borderRadius: 20,
                boxShadow: '0 0 0 2px rgba(239,68,68,0.3)',
                animation: 'badgePulse 1.5s infinite',
              }}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => { localStorage.removeItem('dropit_user'); window.location.href = '/seller/login'; }}
          style={{ width: '100%', background: 'transparent', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', padding: '12px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          Sign Out
        </button>
      </div>

      <style>{`
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(239,68,68,0.3); }
          50%       { box-shadow: 0 0 0 5px rgba(239,68,68,0);   }
        }
      `}</style>
    </div>
  );
}
