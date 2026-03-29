import React, { useState, useEffect } from 'react';
import { useLocation } from '../context/LocationContext';

const LocationEditModal = ({ isOpen, onClose }) => {
  const { location, updateLocation, detectLocation } = useLocation();
  const [address, setAddress] = useState(location.address || '');
  const [city, setCity] = useState(location.city || '');

  // Sync inputs when modal opens or location changes externally
  useEffect(() => {
    if (isOpen) {
      setAddress(location.address || '')
      setCity(location.city || '')
    }
  }, [isOpen, location])


  if (!isOpen) return null;

  const handleSave = () => {
    updateLocation({ address, city, isAutoDetected: false });
    onClose();
  };

  const handleAutoDetect = async () => {
    await detectLocation();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-xl font-bold">&times;</button>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">📍 Edit Location</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">City / Town</label>
            <input 
              type="text" 
              value={city} 
              onChange={e => setCity(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623]"
              placeholder="e.g. Sawantwadi"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Address / Area</label>
            <input 
              type="text" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623]"
              placeholder="e.g. Main Road, Subhash Chowk"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={handleAutoDetect} 
            className="flex-1 bg-green-50 text-green-700 font-bold py-2.5 rounded-xl border border-green-200 hover:bg-green-100 transition-colors"
          >
            Auto Detect
          </button>
          <button 
            onClick={handleSave} 
            className="flex-1 bg-[#F5A623] hover:bg-[#E0961E] text-white font-bold py-2.5 rounded-xl transition-colors shadow-md"
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationEditModal;
