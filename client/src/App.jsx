import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar   from './components/Navbar.jsx'
import Toast    from './components/Toast.jsx'
import Home     from './pages/Home.jsx'
import Cart     from './pages/Cart.jsx'
import Orders   from './pages/Orders.jsx'
import Admin    from './pages/Admin.jsx'
import Login    from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Product  from './pages/Product.jsx'
import DropCoins from './pages/DropCoins.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toast />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart"       element={<Cart />} />
        <Route path="/orders"     element={<Orders />} />
        <Route path="/admin"      element={<Admin />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/coins"      element={<DropCoins />} />
      </Routes>
    </BrowserRouter>
  )
}
