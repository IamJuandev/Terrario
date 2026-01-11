import React, { useState } from 'react';
import { ArrowLeft, Search, Clock, MapPin, Bike, Car } from 'lucide-react';
import { DEFAULT_IMAGES } from '../constants/defaultImages';

const ListingView = ({ title, businesses, goBack, handleBusinessClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getImageUrl = (url, type = 'business') => {
    if (!url) {
      return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.business;
    }
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || ''}${url}`;
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
                  <div className="flex items-center gap-1 text-[#193f3f] font-bold">
                    <Clock size={12} />
                    <span>Tiempo de espera: {biz.deliveryTime || '15-20 min'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-gray-400 text-xs pr-2">
                   <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-person-walking" viewBox="0 0 16 16">
                        <path d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613-.435.489-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z"/>
                        <path d="M6.25 11.745v-1.418l1.204 1.375.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215-.494-.494.205-1.843.006-.067 1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z"/>
                      </svg>
                      <span>{biz.distances?.walk || '10 min'}</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <Bike size={12} />
                      <span>{biz.distances?.bike || '5 min'}</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <Car size={12} />
                      <span>{biz.distances?.car || '3 min'}</span>
                   </div>
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
