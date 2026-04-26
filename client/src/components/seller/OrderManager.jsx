import { useState, useEffect } from 'react';
import API from '../../api';

export default function OrderManager({ storeId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/orders/store/${storeId}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [storeId]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { orderStatus: newStatus });
      alert(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'accepted': return 'bg-info text-dark';
      case 'preparing': return 'bg-primary';
      case 'out_for_delivery': return 'bg-primary';
      case 'delivered': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h4 style={{ margin: 0, fontWeight: 900, color: '#111827', fontSize: 24, letterSpacing: '-0.5px' }}>Orders Pipeline</h4>
        <button onClick={fetchOrders} style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='#F9FAFB'} onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
          <span>↻</span> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#6B7280', fontWeight: 600 }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 24, border: '1px dashed #D1D5DB' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#111827', fontWeight: 800 }}>No orders yet</h3>
          <p style={{ margin: 0, color: '#6B7280' }}>When customers buy from your store, their orders will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F3F4F6' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #F3F4F6', paddingBottom: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>Order #{order._id.toString().slice(-6).toUpperCase()}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, ...getStatusBadge(order.orderStatus) }}>
                  {order.orderStatus.replace(/_/g, ' ')}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ paddingRight: 24, borderRight: '1px solid #F3F4F6' }}>
                  <h6 style={{ fontSize: 12, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Customer Details</h6>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 8 }}><span>👤</span> {order.customerName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#4B5563', marginBottom: 8 }}><span>📞</span> {order.phone}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#4B5563' }}><span>📍</span> {order.hostelRoom}</div>
                </div>
                
                <div>
                  <h6 style={{ fontSize: 12, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Order Items</h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: '#4B5563' }}><strong style={{ color: '#111827' }}>{item.qty}x</strong> {item.name}</span>
                        <span style={{ fontWeight: 700, color: '#111827' }}>₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px dashed #E5E7EB' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#6B7280' }}>Total Amount</span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
                {order.orderStatus === 'Pending' && (
                  <>
                    <button onClick={() => updateStatus(order._id, 'rejected')} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, background: '#fff', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='#FEF2F2'} onMouseLeave={e=>e.currentTarget.style.background='#fff'}>Reject Order</button>
                    <button onClick={() => updateStatus(order._id, 'accepted')} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, background: '#10B981', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', transition: 'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>Accept Order</button>
                  </>
                )}
                {order.orderStatus === 'accepted' && (
                  <button onClick={() => updateStatus(order._id, 'preparing')} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, background: '#3B82F6', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)', transition: 'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>Mark as Preparing</button>
                )}
                {order.orderStatus === 'preparing' && (
                  <button onClick={() => updateStatus(order._id, 'out_for_delivery')} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, background: '#8B5CF6', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139,92,246,0.3)', transition: 'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>Out for Delivery</button>
                )}
                {order.orderStatus === 'out_for_delivery' && (
                  <button onClick={() => updateStatus(order._id, 'delivered')} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, background: '#10B981', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', transition: 'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>Mark Delivered</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
