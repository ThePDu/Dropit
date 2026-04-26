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
import Deals from './pages/Deals.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toast />
      <Routes>
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/seller/login"      element={<SellerLogin />} />
        <Route path="/seller/register"   element={<SellerRegister />} />
        
        <Route path="/"           element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><Product /></ProtectedRoute>} />
        <Route path="/cart"       element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders"     element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/admin"      element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/coins"      element={<ProtectedRoute><DropCoins /></ProtectedRoute>} />
        <Route path="/deals"      element={<ProtectedRoute><Deals /></ProtectedRoute>} />
        <Route path="/stores"     element={<ProtectedRoute><Stores /></ProtectedRoute>} />
        <Route path="/canteen"    element={<ProtectedRoute><Canteen /></ProtectedRoute>} />
        <Route path="/canteen-admin" element={<ProtectedRoute><CanteenAdmin /></ProtectedRoute>} />
        <Route path="/seller/dashboard"  element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
