import React, { useState } from 'react';
import { ArrowLeft, Search, Star, Clock, MapPin } from 'lucide-react';
import { DEFAULT_IMAGES } from '../constants/defaultImages';

const ListingView = ({ title, businesses, goBack, handleBusinessClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getImageUrl = (url, type = 'business') => {
    if (!url) {
      return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.business;
    }
    if (url.startsWith('http')) return url;
    return `http://localhost:3001${url}`;
  };

  const filteredBusinesses = businesses.filter(biz => {
    const term = searchTerm.toLowerCase();
    return (
      biz.name.toLowerCase().includes(term) ||
      biz.category.toLowerCase().includes(term) ||
      biz.keywords.some(k => k.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-gray-50 min-h-screen animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar en esta lista..." 
            className="w-full bg-gray-100 py-3 pl-10 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="p-6 space-y-4 pb-20">
        {filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((biz) => (
            <div 
              key={biz.id} 
              onClick={() => handleBusinessClick(biz)}
              className="bg-white p-3 rounded-2xl shadow-sm flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img src={getImageUrl(biz.image, 'business')} alt={biz.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 py-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800">{biz.name}</h3>
                  <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${biz.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {biz.status === 'open' ? 'Abierto' : 'Cerrado'}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">{biz.specialty}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star size={12} className="fill-current" />
                    <span>4.8</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{biz.deliveryTime}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-400 text-xs">
                  <MapPin size={12} className="mr-1" />
                  {biz.distances?.walk || '1.2 km'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No encontramos resultados para "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingView;
