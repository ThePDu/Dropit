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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Orders</h4>
        <button onClick={fetchOrders} className="btn btn-outline-dark btn-sm">Refresh</button>
      </div>

      {loading ? (
        <div>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center p-5 text-muted bg-white shadow-sm rounded">
          <i className="bi bi-cart-x fs-1"></i>
          <p className="mt-2 mb-0">No orders yet.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map(order => (
            <div key={order._id} className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <div>
                    <span className="fw-bold">Order #{order._id.toString().slice(-6).toUpperCase()}</span>
                    <br/>
                    <small className="text-muted">{new Date(order.createdAt).toLocaleString()}</small>
                  </div>
                  <div>
                    <span className={`badge ${getStatusBadge(order.orderStatus)} fs-6`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 border-end">
                    <h6 className="fw-bold mb-2">Customer Details</h6>
                    <p className="mb-1"><i className="bi bi-person me-2"></i>{order.customerName}</p>
                    <p className="mb-1"><i className="bi bi-telephone me-2"></i>{order.phone}</p>
                    <p className="mb-0"><i className="bi bi-geo-alt me-2"></i>{order.hostelRoom}</p>
                  </div>
                  <div className="col-md-6 ps-3">
                    <h6 className="fw-bold mb-2">Items</h6>
                    <ul className="list-unstyled mb-2">
                      {order.items.map((item, i) => (
                        <li key={i} className="mb-1 text-muted">
                          {item.qty}x {item.name} <span className="float-end">₹{item.price * item.qty}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="fw-bold text-end mt-2 pt-2 border-top">
                      Total: ₹{order.totalAmount}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-top d-flex gap-2 justify-content-end">
                  {order.orderStatus === 'Pending' && (
                    <>
                      <button onClick={() => updateStatus(order._id, 'rejected')} className="btn btn-outline-danger btn-sm">Reject</button>
                      <button onClick={() => updateStatus(order._id, 'accepted')} className="btn btn-success btn-sm">Accept Order</button>
                    </>
                  )}
                  {order.orderStatus === 'accepted' && (
                    <button onClick={() => updateStatus(order._id, 'preparing')} className="btn btn-primary btn-sm">Mark as Preparing</button>
                  )}
                  {order.orderStatus === 'preparing' && (
                    <button onClick={() => updateStatus(order._id, 'out_for_delivery')} className="btn btn-info btn-sm">Out for Delivery</button>
                  )}
                  {order.orderStatus === 'out_for_delivery' && (
                    <button onClick={() => updateStatus(order._id, 'delivered')} className="btn btn-success btn-sm">Mark Delivered</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
