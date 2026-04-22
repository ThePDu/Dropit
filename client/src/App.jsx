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
import Stores from './pages/Stores.jsx'
import Canteen from './pages/Canteen.jsx'
import CanteenAdmin from './pages/CanteenAdmin.jsx'
import SellerLogin from './pages/SellerLogin.jsx'
import SellerRegister from './pages/SellerRegister.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'

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
        <Route path="/stores"     element={<Stores />} />
        <Route path="/canteen"    element={<Canteen />} />
        <Route path="/canteen-admin" element={<CanteenAdmin />} />
        <Route path="/seller/login"      element={<SellerLogin />} />
        <Route path="/seller/register"   element={<SellerRegister />} />
        <Route path="/seller/dashboard"  element={<SellerDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
