import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const ProductRow = ({ product, storeName }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product.inStock) return;
    setIsAdding(true);
    
    // Add to real cart
    addToCart({ 
      ...product, 
      _id: `store-${product.id}`, 
      mrp: product.price, 
      store: storeName 
    });

    setTimeout(() => setIsAdding(false), 300); // Reset after bounce animation
  };

  return (
    <div className="flex flex-col p-4 bg-white border border-orange-50 rounded-2xl shadow-sm hover:shadow-[0_8px_20px_rgba(245,166,35,0.1)] transition-all duration-300 mb-3 group">
      {/* 📍 Available at Store Badge */}
      <div className="self-start mb-2 px-2.5 py-1 rounded-lg bg-[#FFF8F0] text-[#E65100] text-[11px] font-black border border-orange-100 flex items-center gap-1.5 shadow-inner">
        <span>📍</span> Available at {storeName}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 pr-4">
          <h3 className="font-heading font-black text-gray-900 text-[15px] leading-tight mb-1 tracking-tight group-hover:text-[#F5A623] transition-colors">{product.name}</h3>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-extrabold text-[#FF6B35] text-[15px]">₹{product.price}</span>
            {product.inStock ? (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider text-green-600 border border-green-200 bg-green-50 shadow-sm">
                In Stock
              </span>
            ) : (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider text-red-600 border border-red-200 bg-red-50 shadow-sm">
                Out of Stock
              </span>
            )}
          </div>
          
          <p className="text-xs font-bold text-gray-400 capitalize">{product.category || 'Essentials'}</p>
        </div>

        <div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`
              flex items-center justify-center w-10 h-10 rounded-full
              transition-all duration-200 focus:outline-none
              ${product.inStock 
                ? 'bg-primary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
              ${isAdding ? 'animate-bounce' : ''}
            `}
            aria-label="Add to cart"
          >
            <FiPlus size={20} className={isAdding ? 'opacity-0' : 'opacity-100'} />
            {isAdding && <span className="absolute text-xs font-bold">✓</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductRow;
