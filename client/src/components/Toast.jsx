import { useCart } from '../context/CartContext.jsx'

export default function Toast() {
  const { toast } = useCart()
  const clr = { success: '#f5c518', error: '#ff5252', info: '#2979ff' }
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%',
      transform: `translateX(-50%) translateY(${toast.show ? 0 : 20}px)`,
      background: '#111', border: `1px solid ${clr[toast.type] || '#f5c518'}`,
      color: clr[toast.type] || '#f5c518',
      padding: '11px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700,
      zIndex: 9999, opacity: toast.show ? 1 : 0,
      transition: 'all 0.25s', pointerEvents: 'none', whiteSpace: 'nowrap',
    }}>
      {toast.msg}
    </div>
  )
}
