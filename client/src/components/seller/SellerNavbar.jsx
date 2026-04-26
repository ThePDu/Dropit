import { useSocket } from '../../context/SocketContext';

export default function SellerNavbar({ store }) {
  const { connected } = useSocket();

  return (
    <nav style={{
      background: '#fff',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.5px' }}>
        Dashboard Overview
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Live socket status */}
        <div style={{
          background: connected ? '#ECFDF5' : '#FEF2F2',
          border: `1px solid ${connected ? '#A7F3D0' : '#FECACA'}`,
          padding: '6px 12px', borderRadius: 20,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{
            width: 8, height: 8,
            background: connected ? '#10B981' : '#EF4444',
            borderRadius: '50%',
            boxShadow: `0 0 0 2px ${connected ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            animation: connected ? 'pulse 2s infinite' : 'none',
          }} />
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: connected ? '#059669' : '#DC2626',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>

        <div style={{ height: 32, width: 1, background: '#E5E7EB' }} />

        {/* Store info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: '#F3F4F6',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', border: '1px solid #E5E7EB',
          }}>
            <span style={{ fontSize: 16 }}>🏪</span>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{store?.name}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Store Owner</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </nav>
  );
}
