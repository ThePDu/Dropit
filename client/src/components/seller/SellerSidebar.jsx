export default function SellerSidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-house' },
    { id: 'orders', label: 'Orders', icon: 'bi-cart' },
    { id: 'products', label: 'Products', icon: 'bi-box' },
    { id: 'settings', label: 'Settings', icon: 'bi-gear' }
  ];

  return (
    <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px' }}>
      <h4 className="mb-4 text-center fw-bold" style={{ color: '#f59e0b' }}>DropIt Partner</h4>
      <div className="d-flex flex-column gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn text-start p-2 border-0 ${activeTab === tab.id ? 'fw-bold' : 'text-light'}`}
            style={{ 
              backgroundColor: activeTab === tab.id ? '#f59e0b' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'inherit',
              borderRadius: '8px'
            }}
          >
            <i className={`bi ${tab.icon} me-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-auto">
        <button 
          className="btn btn-outline-light w-100"
          onClick={() => {
            localStorage.removeItem('dropit_user');
            window.location.href = '/seller/login';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
