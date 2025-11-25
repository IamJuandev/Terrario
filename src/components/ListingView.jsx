import React, { useState } from 'react';
import { ArrowLeft, Search, Star, Clock, X } from 'lucide-react';

const ListingView = ({ title, businesses, goBack, handleBusinessClick }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinesses = businesses.filter(biz => {
    const query = searchQuery.toLowerCase();
    return (
      biz.name.toLowerCase().includes(query) ||
      biz.category.toLowerCase().includes(query) ||
      biz.keywords.some(k => k.toLowerCase().includes(query))
    );
  });

  const toggleSearch = () => {
    if (isSearching) {
      setSearchQuery(''); // Limpiar al cerrar
    }
    setIsSearching(!isSearching);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col animate-fadeIn w-full">
      {/* Top bar */}
      <div className="bg-white p-4 sticky top-0 z-20 shadow-sm flex items-center gap-3">
        <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        
        {isSearching ? (
          <div className="flex-1 relative animate-fadeIn">
            <input 
              type="text" 
              autoFocus
              placeholder="Buscar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 py-2 pl-4 pr-10 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#193f3f]"
            />
            <button onClick={toggleSearch} className="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-bold text-gray-800 flex-1">{title}</h1>
            <button onClick={toggleSearch} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
               <Search size={20} className="text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Grid de Negocios */}
      <div className="p-4 md:p-8 md:max-w-7xl md:mx-auto w-full">
        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredBusinesses.map(biz => (
               <div key={biz.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleBusinessClick(biz)}>
                 <div className="h-32 w-full bg-gray-200 relative">
                   <img src={biz.image} className="w-full h-full object-cover" alt={biz.name} />
                   <div className="absolute top-2 right-2 bg-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow flex items-center gap-1">
                      <Star size={8} className="fill-yellow-400 text-yellow-400"/> 4.8
                   </div>
                 </div>
                 <div className="p-3 flex flex-col flex-1">
                   <h4 className="font-bold text-sm text-gray-800 truncate mb-0.5">{biz.name}</h4>
                   <p className="text-[10px] text-[#193f3f] truncate mb-1.5">{biz.specialty}</p>
                   
                   <div className="mt-auto">
                     <span className="text-[9px] text-gray-400 font-medium mb-0.5 block">Tiempo de entrega:</span>
                     <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1.5 rounded-lg w-fit">
                        <Clock size={12} className="text-[#193f3f]" />
                        <span className="text-[10px] font-bold text-gray-600">{biz.deliveryTime}</span>
                     </div>
                   </div>
                 </div>
               </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No encontramos resultados para "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingView;
