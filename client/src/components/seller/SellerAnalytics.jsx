import { useState, useEffect } from 'react';
import API from '../../api.js';

export default function SellerAnalytics({ storeId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get(`/orders/store/${storeId}`);
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [storeId]);

  if (loading) return <div>Loading analytics...</div>;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
  
  // Calculate earnings (only from Delivered orders, assuming 90% payout)
  const earnings = orders
    .filter(o => o.orderStatus === 'Delivered')
    .reduce((acc, curr) => acc + curr.totalAmount * 0.9, 0)
    .toFixed(2);

  // Calculate generic wallet balance (Earnings minus withdrawals - mock logic for now)
  const walletBalance = earnings;

  const stats = [
    { label: 'Total Orders', value: totalOrders, icon: '📦', color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Pending Orders', value: pendingOrders, icon: '⏳', color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Earnings', value: `₹${earnings}`, icon: '📈', color: '#10B981', bg: '#ECFDF5' },
    { label: 'Wallet Balance', value: `₹${walletBalance}`, icon: '💰', color: '#8B5CF6', bg: '#F5F3FF' }
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 32 }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{ background: '#fff', borderRadius: 20, padding: 24, display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F3F4F6', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* RECENT ORDERS TABLE */}
      <div style={{ background: '#fff', borderRadius: 24, padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F3F4F6' }}>
        <h5 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: 800, color: '#111827' }}>Recent Orders</h5>
        {orders.slice(0, 5).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>📋</span>
            <p style={{ margin: 0, fontWeight: 600 }}>No recent orders found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0 16px 16px', fontSize: 12, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #E5E7EB' }}>Order ID</th>
                  <th style={{ padding: '0 16px 16px', fontSize: 12, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #E5E7EB' }}>Customer</th>
                  <th style={{ padding: '0 16px 16px', fontSize: 12, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #E5E7EB' }}>Amount</th>
                  <th style={{ padding: '0 16px 16px', fontSize: 12, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #E5E7EB' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px', fontSize: 14, fontWeight: 700, color: '#6B7280' }}>#{o._id.slice(-6).toUpperCase()}</td>
                    <td style={{ padding: '16px', fontSize: 15, fontWeight: 700, color: '#111827' }}>{o.customerName}</td>
                    <td style={{ padding: '16px', fontSize: 15, fontWeight: 800, color: '#059669' }}>₹{o.totalAmount}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: 20, 
                        fontSize: 12, 
                        fontWeight: 800, 
                        background: o.orderStatus === 'Delivered' ? '#D1FAE5' : o.orderStatus === 'Pending' ? '#FEF3C7' : '#DBEAFE',
                        color: o.orderStatus === 'Delivered' ? '#065F46' : o.orderStatus === 'Pending' ? '#92400E' : '#1E40AF',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5
                      }}>
                        {o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
