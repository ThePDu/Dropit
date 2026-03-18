import { createContext, useContext, useReducer, useEffect, useState } from 'react'

const CartContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const ex = state.find(i => i._id === action.product._id)
      if (ex) return state.map(i => i._id === action.product._id ? { ...i, qty: i.qty + 1 } : i)
      return [...state, { ...action.product, qty: 1 }]
    }
    case 'REMOVE':     return state.filter(i => i._id !== action.id)
    case 'CHANGE_QTY': return state.map(i => i._id === action.id ? { ...i, qty: i.qty + action.delta } : i).filter(i => i.qty > 0)
    case 'CLEAR':      return []
    default:           return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(reducer, [], () => {
    try { return JSON.parse(localStorage.getItem('dropit_cart')) || [] } catch { return [] }
  })
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' })

  useEffect(() => { localStorage.setItem('dropit_cart', JSON.stringify(cart)) }, [cart])

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type })
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 2500)
  }

  const addToCart    = (p)        => { dispatch({ type: 'ADD', product: p }); showToast(`${p.name} added!`) }
  const removeFromCart = (id)     => dispatch({ type: 'REMOVE', id })
  const changeQty    = (id, delta) => dispatch({ type: 'CHANGE_QTY', id, delta })
  const clearCart    = ()         => dispatch({ type: 'CLEAR' })

  const cartCount   = cart.reduce((a, i) => a + i.qty, 0)
  const cartTotal   = cart.reduce((a, i) => a + i.price * i.qty, 0)
  const cartSavings = cart.reduce((a, i) => a + (i.mrp - i.price) * i.qty, 0)
  const deliveryFee = cartTotal >= 199 ? 0 : cartTotal > 0 ? 25 : 0

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQty, clearCart, cartCount, cartTotal, cartSavings, deliveryFee, toast, showToast }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
