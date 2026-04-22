import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar from '../components/seller/SellerSidebar';
import SellerNavbar from '../components/seller/SellerNavbar';
import ProductManager from '../components/seller/ProductManager';
import OrderManager from '../components/seller/OrderManager';

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [store, setStore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('dropit_user');
    if (!userStr) { navigate('/seller/login'); return; }
    const user = JSON.parse(userStr);
    if (user.role !== 'seller') { navigate('/seller/login'); return; }
    setStore(user);
  }, [navigate]);

  if (!store) return <div className="p-5 text-center">Loading...</div>;

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <SellerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: 'hidden' }}>
        <SellerNavbar store={store} />
        <div className="p-4" style={{ flexGrow: 1 }}>
          {activeTab === 'dashboard' && <h4>Welcome back, {store.name}</h4>}
          {activeTab === 'products' && <ProductManager storeId={store._id} />}
          {activeTab === 'orders' && <OrderManager storeId={store._id} />}
          {activeTab === 'settings' && <h4>Settings Panel</h4>}
        </div>
      </div>
    </div>
  );
}
