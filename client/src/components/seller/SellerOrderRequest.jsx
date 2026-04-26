import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import API from '../../api';

export default function SellerOrderRequest({ storeId, onOrderAccepted }) {
  const { joinStoreRoom, leaveStoreRoom, onNewOrderRequest, onOrderTaken, onOrderAcceptedConfirm, onOrderExpired } = useSocket();
  const [queue, setQueue] = useState([]);
  const [toast, setToast] = useState(null);
  const timersRef  = useRef({});
  const toastTimer = useRef(null);

  // ── Join / leave store room ─────────────────────────────────────────────
  useEffect(() => {
    if (!storeId) return;
    joinStoreRoom(storeId);
    return () => leaveStoreRoom(storeId);
  }, [storeId]); // eslint-disable-line

  // ── Helpers ─────────────────────────────────────────────────────────────
  const showToast = useCallback((msg, color = '#111') => {
    setToast({ msg, color });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const removeOrder = useCallback((orderId, toastMsg) => {
    clearInterval(timersRef.current[orderId]);
    delete timersRef.current[orderId];
    setQueue(q => q.filter(o => o.orderId !== String(orderId)));
    if (toastMsg) showToast(toastMsg, '#6B7280');
  }, [showToast]);

  // ── Socket listeners ────────────────────────────────────────────────────
  useEffect(() => {
    const unsubNew = onNewOrderRequest((data) => {
      const oid = String(data.orderId);
      // Dedup: ignore if already in queue
      setQueue(q => {
        if (q.find(o => o.orderId === oid)) return q;
        return [{ ...data, orderId: oid, timeLeft: 30 }, ...q];
      });

      // Start 30-second countdown for this specific order
      if (!timersRef.current[oid]) {
        timersRef.current[oid] = setInterval(() => {
          setQueue(q => {
            const exists = q.find(o => o.orderId === oid);
            if (!exists) {
              clearInterval(timersRef.current[oid]);
              delete timersRef.current[oid];
              return q;
            }
            return q.map(o =>
              o.orderId === oid ? { ...o, timeLeft: Math.max(0, o.timeLeft - 1) } : o
            );
          });
        }, 1000);
      }
    });

    const unsubTaken   = onOrderTaken(({ orderId }) => removeOrder(String(orderId), '⚡ Order taken by another store'));
    const unsubConfirm = onOrderAcceptedConfirm(({ orderId }) => {
      removeOrder(String(orderId));
      showToast("✅ Order accepted! It's yours.", '#10B981');
      onOrderAccepted?.();
    });
    const unsubExpired = onOrderExpired(({ orderId }) => removeOrder(String(orderId), '⏰ Order expired'));

    return () => {
      unsubNew(); unsubTaken(); unsubConfirm(); unsubExpired();
    };
  }, [removeOrder, showToast, onOrderAccepted]); // eslint-disable-line

  // ── Accept / Reject handlers ────────────────────────────────────────────
  const handleAccept = async (orderId) => {
    try {
      await API.post(`/orders/${orderId}/accept`);
      // Server fires orderAcceptedConfirm → listener above handles it
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to accept';
      if (msg.toLowerCase().includes('already')) {
        removeOrder(orderId, '⚡ Order was already taken by another store');
      } else {
        showToast(`❌ ${msg}`, '#EF4444');
      }
    }
  };

  const handleReject = async (orderId) => {
    try { await API.post(`/orders/${orderId}/reject`); } catch {}
    removeOrder(orderId);
    showToast('Skipped.', '#6B7280');
  };

  // Nothing to show
  if (queue.length === 0 && !toast) return null;

  return (
    <>
      {/* ── Toast notification ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 10000,
          background: toast.color, color: '#fff',
          padding: '14px 24px', borderRadius: 14,
          fontSize: 15, fontWeight: 700,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          animation: 'slideInRight 0.3s ease-out',
          pointerEvents: 'none',
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Order request cards ── */}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column-reverse', gap: 16,
        maxWidth: 400, width: '100%',
        maxHeight: '85vh', overflowY: 'auto',
        pointerEvents: 'none',
      }}>
        {queue.map((order) => (
          <div key={order.orderId} style={{ pointerEvents: 'auto' }}>
            <OrderCard
              order={order}
              onAccept={() => handleAccept(order.orderId)}
              onReject={() => handleReject(order.orderId)}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </>
  );
}

// ── OrderCard ──────────────────────────────────────────────────────────────
function OrderCard({ order, onAccept, onReject }) {
  const pct         = (order.timeLeft / 30) * 100;
  const urgentColor = order.timeLeft <= 8  ? '#EF4444'
                    : order.timeLeft <= 18 ? '#F59E0B'
                    :                        '#10B981';

  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
      border: `2px solid ${urgentColor}`,
      overflow: 'hidden',
      animation: 'popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    }}>
      {/* Progress bar */}
      <div style={{ height: 5, background: '#F3F4F6' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: urgentColor,
          transition: 'width 1s linear, background 0.5s ease',
          borderRadius: '0 4px 4px 0',
        }} />
      </div>

      <div style={{ padding: '18px 20px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 22 }}>🔔</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>New Order!</span>
            </div>
            {parseFloat(order.distanceKm) > 0 && (
              <div style={{ fontSize: 12, color: '#6B7280', paddingLeft: 30 }}>📍 {order.distanceKm} km away</div>
            )}
          </div>
          {/* Countdown badge */}
          <div style={{
            fontSize: 20, fontWeight: 900, color: urgentColor,
            background: urgentColor + '18', borderRadius: 10,
            padding: '4px 12px', minWidth: 52, textAlign: 'center',
            border: `1.5px solid ${urgentColor}40`,
          }}>
            {order.timeLeft}s
          </div>
        </div>

        {/* Customer info */}
        <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '10px 14px', marginBottom: 14, border: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 2 }}>👤 {order.customerName}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>📍 {order.hostelRoom}</div>
        </div>

        {/* Items */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            Items ({order.items?.length || 0})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {(order.items || []).slice(0, 4).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#374151' }}>
                  <strong style={{ color: '#111827' }}>{item.qty}×</strong> {item.name}
                </span>
                <span style={{ fontWeight: 700, color: '#111827' }}>₹{item.price * item.qty}</span>
              </div>
            ))}
            {(order.items?.length || 0) > 4 && (
              <div style={{ fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' }}>
                +{order.items.length - 4} more items…
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 12, marginBottom: 16,
          borderTop: '1.5px dashed #E5E7EB',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#6B7280' }}>Total</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#059669' }}>₹{order.totalAmount}</span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
          <button
            onClick={onReject}
            style={{
              padding: '12px 8px', borderRadius: 12, fontSize: 14, fontWeight: 700,
              background: '#fff', color: '#EF4444',
              border: '1.5px solid rgba(239,68,68,0.3)',
              cursor: 'pointer', transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderColor = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
          >
            Skip
          </button>
          <button
            onClick={onAccept}
            style={{
              padding: '12px', borderRadius: 12, fontSize: 15, fontWeight: 800,
              background: '#10B981', color: '#fff', border: 'none',
              cursor: 'pointer', transition: 'all 0.18s',
              boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
              letterSpacing: '-0.3px',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.35)'; }}
          >
            ⚡ Accept Order
          </button>
        </div>
      </div>
    </div>
  );
}
