import React, { useState, useEffect } from 'react';
import { FiSearch, FiMapPin, FiLoader, FiEdit3 } from 'react-icons/fi';
import StoreCard from '../components/StoreCard';
import StoreModal from '../components/StoreModal';
import LocationEditModal from '../components/LocationEditModal';
import { storesData } from '../data/storesData';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';

const Stores = () => {
  const { location: userLocation, detectLocation, loading: locLoading } = useLocation();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleUseLocation = async () => {
    setIsLoading(true);
    await detectLocation();
    setIsLoading(false);
  };

  const filters = ['All', 'Open Now', 'Fast Delivery', 'Nearest', 'Popular'];

  // Filter Logic
  const filteredStores = storesData.filter(store => {
    // Search match
    const matchesSearch = 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      store.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Chip match
    let matchesFilter = true;
    if (activeFilter === 'Open Now') matchesFilter = store.isOpen;
    else if (activeFilter !== 'All') matchesFilter = store.tags.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  const featuredStores = storesData.filter(store => store.featured);

  // Get cheapest products across start for the "Best Prices" section
  const allProducts = storesData.flatMap(store => 
    store.products.map(p => ({ ...p, storeName: store.name }))
  );
  const cheapestProducts = allProducts
    .filter(p => p.inStock)
    .sort((a, b) => a.price - b.price)
    .slice(0, 8); // top 8 cheapest

  if (isLoading || locLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] bg-[#FFF8F0]">
        <FiLoader className="animate-spin text-[#F5A623] w-14 h-14 mb-4" />
        <p className="text-gray-700 font-bold animate-pulse text-lg flex items-center gap-2">
          <span>📍</span> Locating you...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24 font-body">
      <LocationEditModal isOpen={isLocModalOpen} onClose={() => setIsLocModalOpen(false)} />
      <StoreModal 
        store={selectedStore} 
        isOpen={!!selectedStore} 
        onClose={() => setSelectedStore(null)}
        userRoute={userLocation?.lat ? userLocation : {lat: 16.8524, lng: 73.9812}}
      />

      {/* Hero Section Banner */}
      <div className="bg-gradient-to-r from-[#F5A623] to-[#FF6B35] pt-10 pb-20 px-6 rounded-b-[40px] shadow-[0_10px_30px_rgba(255,107,53,0.15)] mb-[-50px] relative z-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-heading font-black text-white tracking-tight leading-tight mb-2 drop-shadow-md">
              Nearby Kirana Stores <span className="inline-block hover:animate-bounce">🏪</span>
            </h1>
            <p className="text-white/90 text-sm md:text-lg font-medium drop-shadow-sm max-w-lg mb-2">
              Fresh stock, fast delivery — straight from your neighbourhood
            </p>
            <button 
              onClick={() => setIsLocModalOpen(true)}
              className="text-white bg-white/20 hover:bg-white/30 transition-colors inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-sm border border-white/20 shadow-sm"
            >
              <FiMapPin /> {userLocation.address?.split(',')[0] || userLocation.city || 'Sawantwadi'} <FiEdit3 className="ml-1 opacity-80" />
            </button>
          </div>
          <button onClick={handleUseLocation} className="flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-[#E65100] border-2 border-white/40 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all duration-300 backdrop-blur-md">
            <FiMapPin size={18} />
            Use Auto Location
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-10">
        
        {/* Search Bar & Filters Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-orange-50 animate-[slideUp_0.4s_ease-out]">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search stores, products, areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:bg-white focus:border-[#F5A623]/60 transition-all shadow-inner text-[16px] font-medium placeholder-gray-400"
            />
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#F5A623] w-5 h-5" />
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 whitespace-nowrap border-2 ${
                  activeFilter === f 
                    ? 'bg-[#F5A623] border-[#F5A623] text-white shadow-[0_4px_16px_rgba(245,166,35,0.4)] transform scale-105' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-[#F5A623]/50 hover:text-[#F5A623]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Stores Scroll */}
        {searchQuery === '' && activeFilter === 'All' && featuredStores.length > 0 && (
          <div className="animate-[fadeIn_0.5s_ease-out] delay-[100ms] fill-mode-both">
            <h2 className="text-2xl font-heading font-black text-gray-900 mb-5 px-1 flex items-center gap-2">
              <span className="text-[#F5A623]">⭐</span> Featured Near You
            </h2>
            <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
              {featuredStores.map((store, i) => (
                <div key={store.id} className="min-w-[260px] max-w-[260px] flex-shrink-0">
                  <StoreCard store={store} onClick={setSelectedStore} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Prices Near You - Horizontal Scroll */}
        {searchQuery === '' && activeFilter === 'All' && cheapestProducts.length > 0 && (
          <div className="animate-[fadeIn_0.5s_ease-out] delay-[200ms] fill-mode-both">
            <h2 className="text-2xl font-heading font-black text-gray-900 mb-5 px-1 flex items-center gap-2">
              <span className="text-green-500">🔥</span> Best Prices Near You
            </h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
              {cheapestProducts.map((p, i) => (
                <div key={`${p.id}-${i}`} className="bg-white rounded-[20px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] min-w-[200px] border border-orange-50 flex-shrink-0 hover:shadow-[0_8px_24px_rgba(245,166,35,0.15)] transition-all duration-300 relative group">
                  <h4 className="font-heading font-bold text-[15px] text-gray-900 leading-tight mb-2 truncate group-hover:text-[#F5A623] transition-colors">{p.name}</h4>
                  <div className="flex items-end justify-between mb-3 border-b border-gray-50 pb-3">
                    <p className="font-extrabold text-[#FF6B35] text-xl">₹{p.price}</p>
                    <span className="text-2xl">
                      {p.category === 'Dairy' ? '🥛' : p.category === 'Snacks' ? '🍪' : p.category === 'Drinks' ? '🥤' : '🛍️'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="inline-flex max-w-[120px] overflow-hidden px-2 py-1.5 rounded-lg bg-[#FFF8F0] text-[10px] sm:text-[11px] font-bold text-[#E65100] border border-orange-100/50">
                      <span className="truncate">📍 {p.storeName}</span>
                    </div>
                    <button 
                      onClick={() => addToCart({ ...p, _id: `store-${p.id}`, mrp: p.price, store: p.storeName })}
                      className="bg-[#F5A623] text-white hover:bg-[#FF6B35] transition-colors p-1.5 rounded-lg shadow-sm"
                      title="Add to cart"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Stores Grid */}
        <div className="animate-[fadeIn_0.5s_ease-out] delay-[300ms] fill-mode-both">
          <h2 className="text-2xl font-heading font-black text-gray-900 mb-5 px-1">
            {searchQuery || activeFilter !== 'All' ? 'Search Results' : 'All Nearby Stores'}
          </h2>
          
          {filteredStores.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredStores.map((store, i) => (
                <StoreCard 
                  key={store.id} 
                  store={store} 
                  onClick={setSelectedStore} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[24px] p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-orange-50 mt-4">
              <div className="text-6xl mb-6 opacity-40">🏪</div>
              <h3 className="text-xl font-heading font-black text-gray-800 mb-3">No stores found</h3>
              <p className="text-gray-500 text-[15px] max-w-sm mx-auto">Try adjusting your filters, searching for a different product, or checking another area.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveFilter('All');}}
                className="mt-8 px-8 py-3 bg-[#FFF8F0] text-[#E65100] hover:bg-[#F5A623] hover:text-white border border-[#F5A623]/20 font-bold rounded-xl transition-colors shadow-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stores;
