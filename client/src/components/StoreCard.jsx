import React from 'react';
import { FiClock, FiMapPin, FiArrowRight } from 'react-icons/fi';

const StoreCard = ({ store, onClick, style }) => {
  return (
    <div 
      className="group bg-white rounded-[16px] overflow-hidden cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.025] hover:shadow-[0_12px_32px_rgba(245,166,35,0.15)] shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-orange-50 flex flex-col h-full opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
      style={style}
      onClick={() => onClick(store)}
    >
      {/* Header Image Section */}
      <div className="relative h-[160px] w-full bg-orange-50 overflow-hidden rounded-t-[16px]">
        <img 
          src={store.image} 
          alt={store.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Distance Pill */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#E65100] text-[11px] font-black px-2.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center gap-1.5 animate-pulse-ring border border-orange-100">
          <FiMapPin size={12} className="text-[#F5A623] group-hover:animate-bounce" />
          {store.distance}
        </div>

        {/* Featured Label */}
        {store.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#FF6B35] to-[#F5A623] text-white text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md shadow-md">
            Featured ⭐
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="font-heading font-black text-[16px] text-gray-900 leading-tight group-hover:text-[#FF6B35] transition-colors">
            {store.name}
          </h3>
          {/* Status Dot */}
          <div 
            className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 border-2 border-white shadow-sm ${
              store.isOpen ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
            }`} 
            title={store.isOpen ? "Open Now" : "Closed"}
          />
        </div>

        <p className="text-[12px] text-gray-400 font-medium mb-3 flex items-center gap-1.5 line-clamp-1">
          <FiMapPin size={12} className="text-gray-300" />
          {store.area}
        </p>

        {/* Timing & Tags */}
        <div className="flex flex-col gap-2mt-auto mb-4">
          <div className="flex items-center text-[11px] font-bold text-gray-400 gap-1.5 mb-2">
            <FiClock size={12} className="text-[#F5A623]" />
            <span>{store.hours}</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {store.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wide uppercase ${
                  tag === 'Fast Delivery' ? 'bg-green-50 text-green-700 border border-green-100' :
                  tag === 'Nearest' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                  'bg-orange-50 text-[#FF6B35] border border-orange-100'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-[12px] font-bold text-gray-700 bg-[#FFF8F0] rounded-xl py-2 px-2.5 mt-3 border border-orange-100 shadow-inner flex items-center gap-2">
            <span className="text-[14px]">🛵</span> Delivers in <span className="font-black text-green-600 ml-auto">~{store.eta}</span>
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-auto transform transition-transform duration-200 group-hover:-translate-y-1">
          <button className="w-full bg-[#F5A623] hover:bg-[#FF6B35] text-white font-black text-[14px] py-3.5 rounded-[12px] flex items-center justify-center gap-2 transition-colors duration-300 shadow-[0_4px_12px_rgba(245,166,35,0.3)] group-hover:shadow-[0_8px_16px_rgba(255,107,53,0.4)] tracking-wide">
            View Store <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
