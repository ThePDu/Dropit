import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = io('http://localhost:5000', { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('connect',    () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    return () => socket.disconnect()
  }, [])

  const joinOrderRoom = (orderId) => {
    socketRef.current?.emit('join_order', orderId)
  }

  const onOrderStatusUpdate = (cb) => {
    socketRef.current?.on('order_status_update', cb)
    return () => socketRef.current?.off('order_status_update', cb)
  }

  return (
    <SocketContext.Provider value={{ connected, joinOrderRoom, onOrderStatusUpdate, socket: socketRef }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
