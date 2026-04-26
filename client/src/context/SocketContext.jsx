import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Create socket once — use singleton pattern safe for StrictMode
    if (socketRef.current?.connected) return;

    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })
    socketRef.current = socket

    socket.on('connect',    () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  // ── Utilities ────────────────────────────────────────────────────────────
  const emit = (event, data) => socketRef.current?.emit(event, data)

  /** Generic one-shot listener — returns unsubscribe fn */
  const on = (event, cb) => {
    const s = socketRef.current
    if (!s) return () => {}
    s.on(event, cb)
    return () => s.off(event, cb)
  }

  // ── Customer helpers ─────────────────────────────────────────────────────
  const joinOrderRoom     = (orderId) => emit('join_order',  orderId)
  const onOrderStatusUpdate = (cb)    => on('order_status_update', cb)

  // ── Seller helpers ───────────────────────────────────────────────────────
  const joinStoreRoom     = (storeId) => emit('join_store',  storeId)
  const leaveStoreRoom    = (storeId) => emit('leave_store', storeId)

  const onNewOrderRequest    = (cb) => on('newOrderRequest',    cb)
  const onOrderTaken         = (cb) => on('orderTaken',         cb)
  const onOrderAcceptedConfirm = (cb) => on('orderAcceptedConfirm', cb)
  const onOrderExpired       = (cb) => on('orderExpired',       cb)

  return (
    <SocketContext.Provider value={{
      connected, socket: socketRef,
      // customer
      joinOrderRoom, onOrderStatusUpdate,
      // seller
      joinStoreRoom, leaveStoreRoom,
      onNewOrderRequest, onOrderTaken, onOrderAcceptedConfirm, onOrderExpired,
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
