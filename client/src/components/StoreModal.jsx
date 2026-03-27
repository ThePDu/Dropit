import React, { useState } from 'react';
import { FiX, FiPhoneCall, FiClock, FiMapPin, FiSearch, FiNavigation } from 'react-icons/fi';
import ProductRow from './ProductRow';

const StoreModal = ({ store, isOpen, onClose, userRoute }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  if (!isOpen || !store) return null;

  const categories = ['All', 'Snacks', 'Drinks', 'Dairy', 'Essentials'];

  const filteredProducts = store.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || p.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-0 md:p-8 bg-black/60 backdrop-blur-md transition-opacity duration-300">
      {/* Modal Container */}
      <div 
        className="bg-[#FFF8F0] w-full h-full md:h-[88vh] md:max-h-[850px] md:max-w-[70rem] md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-[slideUp_0.4s_ease-out] md:animate-[fadeIn_0.3s_ease-out_forwards] border border-orange-100"
      >
        {/* Mobile Close Button Overlay */}
        <button 
          onClick={onClose}
          className="md:hidden absolute top-5 right-5 z-20 bg-white/40 backdrop-blur-xl p-2.5 rounded-full shadow-lg text-gray-900 border border-white/20 hover:bg-white/60 transition-colors"
        >
          <FiX size={24} strokeWidth={3} />
        </button>

        {/* Left Panel - Store Info */}
        <div className="w-full md:w-[40%] bg-white flex flex-col overflow-y-auto border-r border-[#F5A623]/20 relative shadow-[4px_0_24px_rgba(245,166,35,0.05)] z-10">
          {/* Header Image */}
          <div className="h-[280px] w-full relative flex-shrink-0 bg-orange-50">
            <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
            
            {/* Supplied label */}
            <div className="absolute top-5 left-5 bg-gradient-to-r from-[#FF6B35] to-[#F5A623] text-white font-black uppercase tracking-wider px-4 py-1.5 text-xs rounded-[10px] shadow-[0_4px_12px_rgba(255,107,53,0.4)] border border-white/20">
              Supplied by {store.name}
            </div>
            
            <div className="absolute bottom-5 left-5 px-2">
              <h2 className="text-3xl font-heading font-black text-white drop-shadow-lg leading-tight mb-2">{store.name}</h2>
              <div className="flex gap-2 mb-2">
                <span className="bg-green-500/20 backdrop-blur-md text-green-300 text-[10px] uppercase font-black px-2 py-0.5 rounded border border-green-400/30">Verified</span>
                {store.featured && <span className="bg-[#FF6B35]/20 backdrop-blur-md text-[#FF6B35] text-[10px] uppercase font-black px-2 py-0.5 rounded border border-[#FF6B35]/30">⭐ Featured</span>}
              </div>
              <p className="text-sm font-bold text-gray-200 flex items-center gap-1.5 drop-shadow-md bg-black/20 px-2 py-1 inline-flex rounded-lg backdrop-blur-sm">
                <FiMapPin size={14} className="text-[#F5A623]" /> {store.area} &middot; {store.distance}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 flex-grow flex flex-col gap-6">
            {/* Quick Actions / Info */}
            <div className="flex items-center gap-4 bg-[#FFF8F0] p-4 rounded-2xl border border-orange-100 shadow-inner group">
              <a 
                href={`tel:${store.phone.replace(/[^0-9+]/g, '')}`} 
                className="flex items-center justify-center min-w-[50px] w-[50px] h-[50px] bg-[#F5A623] hover:bg-[#FF6B35] text-white rounded-full transition-all duration-300 shadow-[0_4px_12px_rgba(245,166,35,0.4)] hover:shadow-lg group-hover:scale-110"
                title="Call Store"
              >
                <FiPhoneCall size={20} className="ml-0.5" strokeWidth={2.5} />
              </a>
              <div>
                <p className="font-heading font-black text-gray-900 text-[18px] tracking-tight">{store.phone}</p>
                <div className="flex items-center text-[12px] text-gray-500 font-bold gap-1.5 mt-1">
                  <FiClock size={14} className="text-[#FF6B35]" />
                  <span>{store.hours}</span>
                  <span className={`px-1.5 py-0.5 rounded-[4px] ml-1 uppercase text-[9px] text-white ${store.isOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                    {store.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Google Maps Iframe */}
            <div className="flex-grow flex flex-col min-h-[250px]">
              <h3 className="font-heading font-black text-gray-900 mb-3 text-lg flex items-center gap-2">
                <FiNavigation className="text-[#F5A623]" /> Location Map
              </h3>
              <div className="w-full h-full rounded-[20px] overflow-hidden shadow-sm border border-orange-100 bg-[#FFF8F0]">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${userRoute ? userRoute.lat : store.lat},${userRoute ? userRoute.lng : store.lng}&z=15&output=embed`}
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Product Catalog */}
        <div className="w-full md:w-[60%] flex flex-col h-full bg-[#FAFAFA]">
          {/* Desktop Close Button */}
          <div className="hidden md:flex justify-end p-5 border-b border-gray-100 bg-white">
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50 transition-colors duration-200 p-2.5 rounded-full shadow-sm border border-transparent hover:border-orange-100"
            >
              <FiX size={24} strokeWidth={2.5} />
            </button>
          </div>

          <div className="p-5 md:p-8 bg-white border-b border-gray-100 z-10 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
            <h3 className="font-heading font-black text-2xl text-gray-900 mb-5 hidden md:block tracking-tight">Shop from this store</h3>
            
            {/* Search Bar */}
            <div className="relative mb-5">
              <input
                type="text"
                placeholder="Search products in this store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:bg-white focus:border-[#F5A623]/30 transition-all shadow-inner text-[15px] font-medium placeholder-gray-400"
              />
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#F5A623]" size={18} strokeWidth={3} />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5 md:mx-0 md:px-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap border-2 ${
                    activeTab === cat 
                      ? 'bg-[#F5A623] border-[#F5A623] text-white shadow-[0_4px_12px_rgba(245,166,35,0.3)] transform scale-105' 
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-orange-50 hover:border-[#F5A623]/30 hover:text-[#F5A623]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product List Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-[#FAFAFA]">
            {filteredProducts.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filteredProducts.map((p, i) => (
                  <div key={p.id} className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 80}ms` }}>
                    <ProductRow product={p} storeName={store.name} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                <span className="text-5xl mb-4 grayscale">🛒</span>
                <h4 className="text-xl font-heading font-black text-gray-800 mb-2">No products found</h4>
                <p className="text-gray-500 font-medium font-body text-[14px] max-w-xs leading-relaxed">We couldn't find any products matching your search right now.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveTab('All');}}
                  className="mt-6 text-[#F5A623] font-black uppercase tracking-wider text-sm hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreModal;
