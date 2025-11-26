import React from 'react';
import { ArrowLeft, Search, ImageIcon } from 'lucide-react';

const RestaurantView = ({ selectedBusiness, goBack }) => {
  if (!selectedBusiness) return null;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col animate-fadeIn w-full">
      {/* Top bar */}
      <div className="bg-white p-4 sticky top-0 z-20 shadow-sm flex items-center gap-3">
        <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div className="flex-1 relative">
           <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
           <input 
             type="text" 
             placeholder={`Buscar en ${selectedBusiness.name}...`}
             className="w-full bg-gray-100 py-2 pl-9 pr-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#193f3f]"
           />
        </div>
      </div>

      <div className="p-4 flex-1 pb-24 md:p-8 md:max-w-6xl md:mx-auto">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 md:p-8">
          <p className="text-gray-600 text-sm leading-relaxed md:text-lg">
            {selectedBusiness.description}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-4">
           <ImageIcon size={20} className="text-[#193f3f] md:w-6 md:h-6" />
           <h3 className="text-lg font-bold text-gray-800 md:text-2xl">Galería</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {selectedBusiness.gallery && selectedBusiness.gallery.length > 0 ? (
            selectedBusiness.gallery.map((imgUrl, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 aspect-square bg-gray-200 cursor-pointer">
                 <img 
                    src={imgUrl} 
                    alt={`Foto ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-gray-400 md:col-span-4">No hay fotos disponibles.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantView;
