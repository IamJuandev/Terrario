import React, { useState } from 'react';
import { Search, Clock, MapPin, ArrowRight } from 'lucide-react';
import logoWhite from '../assets/logo-white.svg';
import { CATEGORIES } from '../data/mockData';
import { DEFAULT_IMAGES } from '../constants/defaultImages';

const HomeView = ({ businesses, handleBusinessClick, onSeeMore, onCategoryClick, zone }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getImageUrl = (url, type = 'business') => {
    if (!url) {
      return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.business;
    }
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || ''}${url}`;
  };

  // Helper to format zone slug to display name and DB value
  // e.g. "las-acacias" -> "Las Acacias"
  // e.g. "labota" -> "La Bota" 
  const getZoneInfo = (slug) => {
    if (!slug) return { name: "Las Acacias", filter: "Las Acacias" }; // Default 
    
    const normalized = slug.toLowerCase().replace(/-/g, '').replace(/ /g, '');
    
    if (normalized.includes("acacias")) return { name: "Las Acacias", filter: "Las Acacias" };
    if (normalized.includes("cecilia")) return { name: "Nueva Cecilia", filter: "Nueva Cecilia" };
    if (normalized.includes("bota")) return { name: "La Bota", filter: "La Bota" };

    // Fallback: capitalize
    const formatted = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return { name: formatted, filter: formatted };
  };

  const currentZone = getZoneInfo(zone);

  // Filter businesses by zone and search term
  const filteredBusinesses = businesses.filter(biz => {
    // Filter by Zone
    const bizZone = biz.zone || 'Las Acacias'; // Default old records to Las Acacias
    const matchZone = bizZone === currentZone.filter;
    
    if (!matchZone) return false;

    // Filter by Search
    if (!searchTerm) return true;
    const lowerTerm = searchTerm.toLowerCase();
    return (
      biz.name.toLowerCase().includes(lowerTerm) ||
      biz.specialty.toLowerCase().includes(lowerTerm) ||
      (biz.keywords && Array.isArray(biz.keywords) && biz.keywords.some(k => k && k.toLowerCase().includes(lowerTerm)))
    );
  });
  
  // Use filteredBusinesses instead of businesses for the lists sections? 
  // The original code passed 'businesses' to sections and did .filter() inside.
  // We should pass 'filteredBusinesses' to those sections or apply the filter there too.
  // Actually, filtering by Zone should happen BEFORE section filtering (IsNearby, IsPopular).
  // So 'businesses' in the map below should be 'filteredBusinesses'.

  return (
    <div className="flex flex-col pb-20 animate-fadeIn relative min-h-screen w-full bg-gray-50">
      {/* Header + Buscador */}
      <header className="bg-white p-4 sticky top-0 z-20 shadow-sm rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* LOGO EN CABECERA */}
            <div className="w-10 h-10 bg-[#193f3f] rounded-full flex items-center justify-center text-white overflow-hidden p-1.5">
                <img src={logoWhite} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl text-[#193f3f]">Directorio Terrario</span>
          </div>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="¿Qué quieres buscar hoy?" 
            className="w-full bg-gray-100 py-3 pl-10 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#193f3f] text-sm text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        </div>
      </header>

      {/* Banner */}
      <div className="px-4 mb-6 mt-2">
        <div className="bg-gradient-to-r from-[#193f3f] to-[#255050] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-1">Bienvenido/a a Terrario</h2>
            <p className="text-[#a8babb] text-2xl mb-4 font-medium">{currentZone.name}</p>
            <p className="font-medium text-lg">Encuentra aquí todo lo que necesitas</p>
          </div>
          
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none transform translate-y-10 translate-x-12">
            <img src={logoWhite} alt="Terrario Logo" className="w-[220px] h-[220px]" />
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="px-4 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Categorías</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-8 px-1">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => onCategoryClick(cat.name)}
            >
              <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-[#193f3f] border border-[#193f3f]/10 text-2xl">
                {cat.icon}
              </div>
              <span className="text-[10px] text-center font-bold text-gray-600 leading-tight w-full break-words">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cerca de ti */}
      <section className="px-4 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-800">Cerca de ti</h3>
          <button className="text-[#193f3f] text-xs font-semibold flex items-center" onClick={() => onSeeMore('nearby')}>
            Ver todos <ArrowRight size={14} className="ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:flex md:overflow-x-auto md:gap-4 md:pb-4 md:scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {filteredBusinesses.filter(biz => biz.is_nearby == 1).slice(0, 4).map(biz => (
             <div 
               key={biz.id} 
               className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer md:min-w-[160px]" 
               onClick={() => handleBusinessClick(biz)}
             >
               <div className="h-24 w-full bg-gray-200 relative">
                 <img src={getImageUrl(biz.image, 'business')} className="w-full h-full object-cover" alt={biz.name} />

               </div>
               <div className="p-3 flex flex-col">
                 <h4 className="font-bold text-sm text-gray-800 truncate mb-0.5">{biz.name}</h4>
                 <p className="text-[10px] text-[#193f3f] truncate mb-1.5">{biz.specialty}</p>
                 
                 <div>
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
      </section>

      {/* Los más populares */}
      <section className="px-4 mb-4">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-800">Los más populares</h3>
          <button className="text-[#193f3f] text-xs font-semibold flex items-center" onClick={() => onSeeMore('popular')}>
            Ver todos <ArrowRight size={14} className="ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 md:flex md:overflow-x-auto md:gap-4 md:pb-4 md:scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
           {filteredBusinesses.filter(biz => biz.is_popular == 1).slice(0,4).map((biz) => (
             <div 
               key={biz.id} 
               className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer md:min-w-[160px]"
               onClick={() => handleBusinessClick(biz)}
             >
               <div className="h-24 w-full bg-gray-200 relative">
                 <img src={getImageUrl(biz.image, 'business')} className="w-full h-full object-cover" alt={biz.name} />
               </div>
               <div className="p-3 flex flex-col">
                 <h4 className="font-bold text-sm text-gray-800 truncate mb-0.5">{biz.name}</h4>
                 <p className="text-[10px] text-[#193f3f] truncate mb-1.5">{biz.specialty}</p>
                 
                 <div>
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
      </section>
    </div>
  );
};

export default HomeView;
