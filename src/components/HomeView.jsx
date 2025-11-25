import React from 'react';
import { Search, Clock, Star } from 'lucide-react';
import { CATEGORIES, BUSINESSES } from '../data/mockData';
import logoWhite from '../assets/logo-white.svg';

const HomeView = ({ handleBusinessClick, onSeeMore, onCategoryClick }) => {
  return (
    <div className="flex flex-col pb-20 animate-fadeIn relative min-h-screen w-full">
      {/* Header + Buscador */}
      <header className="bg-white p-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* LOGO EN CABECERA */}
            <div className="w-10 h-10 bg-[#193f3f] rounded-full flex items-center justify-center text-white overflow-hidden p-1.5">
                <img src={logoWhite} alt="Logo" className="w-full h-full object-contain" />
            </div>
            {/* CAMBIO: Nombre actualizado a Directorio Terrario */}
            <span className="font-bold text-xl text-[#193f3f]">Directorio Terrario</span>
          </div>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="¿Qué quieres buscar hoy?" 
            className="w-full bg-gray-100 py-3 pl-10 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#193f3f] text-sm text-gray-700"
          />
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        </div>
      </header>

      {/* Banner */}
      <div className="px-4 mb-6 mt-2">
        <div className="bg-gradient-to-r from-[#193f3f] to-[#255050] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            {/* CAMBIO: text-3xl para más tamaño */}
            <h2 className="text-3xl font-bold mb-1">Bienvenido/a a Terrario</h2>
            {/* CAMBIO: font-medium para quitar negrita (menos peso) */}
            <p className="text-[#a8babb] text-2xl mb-4 font-medium">Las Acacias</p>
            {/* CAMBIO: Texto de búsqueda actualizado */}
            <p className="font-medium text-lg">Encuentra aquí todo lo que necesitas</p>
          </div>
          
          {/* NUEVO ICONO PERSONALIZADO (SVG GRANDE CORTADO) - Posicionado más a la derecha */}
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none transform translate-y-10 translate-x-12">
            <img src={logoWhite} alt="Terrario Logo" className="w-[220px] h-[220px]" />
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="px-4 mb-8">
        <div className="flex justify-between overflow-x-auto gap-4 pb-2 scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="flex flex-col items-center min-w-[70px] gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onCategoryClick(cat.name)}>
              <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-[#193f3f] border border-[#193f3f]/10">
                {cat.icon}
              </div>
              <span className="text-xs text-center font-medium text-gray-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cerca de ti */}
      <section className="px-4 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-800">Cerca de ti</h3>
          <button className="text-[#193f3f] text-xs font-semibold" onClick={() => onSeeMore('nearby')}>Ver más</button>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible md:pb-0">
          {BUSINESSES.map(biz => (
             <div key={biz.id} className="min-w-[160px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleBusinessClick(biz)}>
               <div className="h-24 w-full bg-gray-200 relative">
                 <img src={biz.image} className="w-full h-full object-cover" alt={biz.name} />
                 <div className="absolute top-2 right-2 bg-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow flex items-center gap-1">
                    <Star size={8} className="fill-yellow-400 text-yellow-400"/> 4.8
                 </div>
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

      {/* Carrusel de Negocios (Destacado) */}
      <section className="px-4 mb-4">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-800">Los más populares</h3>
          <button className="text-[#193f3f] text-xs font-semibold" onClick={() => onSeeMore('popular')}>Ver más</button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0">
           {BUSINESSES.slice(0,4).map((biz) => (
             <div key={biz.id} className="snap-center min-w-[280px] bg-white rounded-2xl shadow-md overflow-hidden flex flex-col relative border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-40 w-full bg-gray-200">
                  <img src={biz.image} className="w-full h-full object-cover" alt={biz.name} />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                     <h3 className="font-bold text-lg text-gray-900 leading-tight w-3/4">{biz.name}</h3>
                     <div className="bg-gray-100 p-1 rounded-lg">
                        <img src={biz.logo} className="w-8 h-8 rounded-md object-cover" alt="logo" />
                     </div>
                  </div>
                  
                  <p className="text-xs text-[#193f3f] font-medium mb-3">{biz.specialty}</p>

                  <div className="flex gap-2 mb-4 items-center">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{biz.category}</span>
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-gray-600">
                       <Clock size={12} className="text-[#193f3f]" />
                       <span className="text-xs font-bold">{biz.deliveryTime}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleBusinessClick(biz)}
                    className="w-full bg-[#193f3f] text-white py-2 rounded-xl font-medium text-sm hover:bg-[#122d2d] transition-colors"
                  >
                    Ver
                  </button>
                </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
