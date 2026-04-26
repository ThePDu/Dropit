import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar   from '../components/seller/SellerSidebar';
import SellerNavbar    from '../components/seller/SellerNavbar';
import ProductManager  from '../components/seller/ProductManager';
import OrderManager    from '../components/seller/OrderManager';
import SellerAnalytics from '../components/seller/SellerAnalytics';
import SellerOrderRequest from '../components/seller/SellerOrderRequest';

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [store, setStore]         = useState(null);
  const [newOrderBadge, setNewOrderBadge] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('dropit_user');
    if (!userStr) { navigate('/seller/login'); return; }
    const user = JSON.parse(userStr);
    if (user.role !== 'seller') { navigate('/seller/login'); return; }
    setStore(user);
  }, [navigate]);

  if (!store) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F9FAFB' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#6B7280' }}>Loading dashboard...</div>
      </div>
    </div>
  );

  const handleOrderAccepted = () => {
    setNewOrderBadge(0);
    // Auto-switch to orders tab so seller sees what they accepted
    setActiveTab('orders');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F6F8' }}>
      {/* ── Real-time Uber-style popup (always mounted) ── */}
      <SellerOrderRequest
        storeId={store._id}
        onOrderAccepted={handleOrderAccepted}
      />

      <SellerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        newOrderBadge={newOrderBadge}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden', height: '100vh', overflowY: 'auto' }}>
        <SellerNavbar store={store} />
        <div style={{ padding: '32px', flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          {activeTab === 'dashboard' && <SellerAnalytics storeId={store._id} />}
          {activeTab === 'products'  && <ProductManager  storeId={store._id} />}
          {activeTab === 'orders'    && <OrderManager    storeId={store._id} />}
          {activeTab === 'settings'  && <StoreSettings   store={store} />}
        </div>
      </div>
    </div>
  );
}

// ── Quick Store Settings panel (set lat/lng so nearby search works) ────────
function StoreSettings({ store }) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const detectMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => { setLat(pos.coords.latitude.toFixed(6)); setLng(pos.coords.longitude.toFixed(6)); },
      () => setMsg('Could not detect location.')
    );
  };

  const saveLocation = async () => {
    setSaving(true); setMsg('');
    try {
      const { default: API } = await import('../api.js');
      await API.patch('/seller/location', { lat: parseFloat(lat), lng: parseFloat(lng) });
      setMsg('✅ Location saved! Your store will now receive nearby order pings.');
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.error || 'Failed to save.'));
    }
    setSaving(false);
  };

  const inp = {
    width: '100%', padding: '12px 16px', background: '#F9FAFB',
    border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 15,
    fontWeight: 600, outline: 'none', boxSizing: 'border-box',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h4 style={{ margin: '0 0 8px 0', fontWeight: 900, fontSize: 24, color: '#111827' }}>Store Settings</h4>
      <p style={{ margin: '0 0 28px 0', color: '#6B7280', fontSize: 15 }}>
        Set your store's GPS location so customers within 5 km receive order matches from you.
      </p>

      <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F3F4F6' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Latitude</label>
            <input value={lat} onChange={e => setLat(e.target.value)} placeholder="e.g. 16.8524" style={inp}
              onFocus={e => { e.target.style.borderColor = '#F5A623'; e.target.style.background = '#fff'; }}
              onBlur={e  => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Longitude</label>
            <input value={lng} onChange={e => setLng(e.target.value)} placeholder="e.g. 73.9812" style={inp}
              onFocus={e => { e.target.style.borderColor = '#F5A623'; e.target.style.background = '#fff'; }}
              onBlur={e  => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={detectMyLocation} style={{ flex: 1, background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
            onMouseLeave={e => e.currentTarget.style.background = '#F9FAFB'}>
            📍 Detect my location
          </button>
          <button onClick={saveLocation} disabled={saving || !lat || !lng} style={{ flex: 2, background: saving ? '#9CA3AF' : '#111827', color: '#fff', border: 'none', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#374151'; }}
            onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#111827'; }}>
            {saving ? 'Saving...' : 'Save Location'}
          </button>
        </div>

        {msg && (
          <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: msg.startsWith('✅') ? '#ECFDF5' : '#FEF2F2', color: msg.startsWith('✅') ? '#065F46' : '#991B1B', fontSize: 14, fontWeight: 600 }}>
            {msg}
          </div>
        )}
      </div>

      <div style={{ marginTop: 24, background: '#FFF7ED', borderRadius: 16, padding: 20, border: '1px solid #FED7AA' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#92400E', marginBottom: 8 }}>⚡ How Order Matching Works</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: '#78350F', fontSize: 13, lineHeight: 1.8 }}>
          <li>When a customer places an order, your store gets pinged if they're within 5 km.</li>
          <li>You have <strong>30 seconds</strong> to accept before the request expires.</li>
          <li>The first store to accept gets the order — just like Uber.</li>
          <li>If you skip, the order stays live for other nearby stores.</li>
        </ul>
      </div>
    </div>
  );
}
