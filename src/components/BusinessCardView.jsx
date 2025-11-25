import React from 'react';
import { ArrowLeft, Clock, Bike, Navigation, MessageCircle, Car } from 'lucide-react';
import { DEFAULT_IMAGES } from '../constants/defaultImages';

const BusinessCardView = ({ selectedBusiness, goBack, openGoogleMaps }) => {
  if (!selectedBusiness) return null;

  // Helper to resolve image URL with type-specific defaults
  const getImageUrl = (url, type = 'business') => {
    if (!url) {
      // Return specific default based on type
      return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.business;
    }
    if (url.startsWith('http')) return url;
    return `http://localhost:3001${url}`;
  };

  // Helper to format time from 24h to 12h with AM/PM
  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Format business hours
  const getFormattedHours = () => {
    if (selectedBusiness.opening_time && selectedBusiness.closing_time) {
      return `${formatTime(selectedBusiness.opening_time)} - ${formatTime(selectedBusiness.closing_time)}`;
    }
    return selectedBusiness.hours || 'No especificado';
  };

  return (
    <div className="bg-gray-50 min-h-screen animate-fadeIn w-full md:p-8">
      <div className="md:max-w-6xl md:mx-auto md:bg-white md:rounded-3xl md:shadow-xl md:overflow-hidden md:flex">
        {/* Imagen Grande Superior (Izquierda en Desktop) */}
        <div className="relative h-64 w-full md:h-auto md:w-1/2 md:min-h-[500px]">
          <img src={getImageUrl(selectedBusiness.image, 'business')} alt={selectedBusiness.name} className="w-full h-full object-cover" />
          <button onClick={goBack} className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-lg backdrop-blur-sm hover:bg-white transition-colors">
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
          {/* Logo */}
          <div className="absolute -bottom-8 left-4 bg-white p-1 rounded-2xl shadow-md md:bottom-4 md:left-4">
            <img src={getImageUrl(selectedBusiness.logo, 'logo')} alt="logo" className="w-16 h-16 rounded-xl object-cover" />
          </div>
        </div>

        {/* Info Contenido Compacto (Derecha en Desktop) */}
        <div className="pt-10 px-5 pb-20 md:w-1/2 md:p-8 md:flex md:flex-col md:justify-center">
          {/* BLOQUE DE INFORMACIÓN: Espaciado reducido al mínimo (gap-0.5) */}
          <div className="flex flex-col gap-0.5 mb-5">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight md:text-4xl md:mb-2">{selectedBusiness.name}</h1>
              <p className="text-[#193f3f] font-medium text-sm leading-tight md:text-lg">{selectedBusiness.specialty}</p>
              
              {/* Wrapper para meta info con espaciado mínimo */}
              <div className="flex flex-col gap-0.5 mt-1 md:gap-2 md:mt-4">
                  
                  {/* Fila 1: Horario y Estado */}
                  <div className="flex items-center text-gray-500 text-xs md:text-sm">
                    <Clock size={14} className="mr-1.5 md:w-5 md:h-5" />
                    <span>{getFormattedHours()}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    
                    {(() => {
                       const st = selectedBusiness.status;
                       let color = "text-gray-500";
                       let dot = "bg-gray-400";
                       let label = "";
                       
                       if (st === 'open') {
                         color = "text-green-600";
                         dot = "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]";
                         label = "Abierto";
                       } else if (st === 'closing') {
                         color = "text-yellow-600";
                         dot = "bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)]";
                         label = "Cierra pronto";
                       } else {
                         color = "text-red-600";
                         dot = "bg-red-500";
                         label = "Cerrado";
                       }

                       return (
                         <div className={`flex items-center gap-1.5 font-bold ${color}`}>
                            <div className={`w-2 h-2 rounded-full ${dot}`}></div>
                            <span>{label}</span>
                         </div>
                       )
                    })()}
                  </div>

                  {/* Fila 2: Tiempo de Entrega */}
                  <div className="flex items-center text-[#193f3f] text-xs font-bold md:text-sm">
                     <Bike size={14} className="mr-1.5 md:w-5 md:h-5" strokeWidth={2.5} />
                     <span>Tiempo de entrega: {selectedBusiness.deliveryTime}</span>
                  </div>
              </div>
          </div>

          {/* Indicador de Distancia + COMO LLEGAR (Google Maps) */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-5 md:bg-gray-50 md:p-4">
            <div className="flex justify-between items-center mb-2">
               <h3 className="text-xs font-bold text-gray-700 md:text-sm">Distancia estimada</h3>
               
               {/* BOTÓN COMO LLEGAR (GOOGLE MAPS) */}
               <button
                 onClick={() => openGoogleMaps(selectedBusiness)}
                 className="flex items-center gap-1 text-[10px] font-bold text-[#193f3f] hover:underline bg-[#193f3f]/5 px-2 py-1 rounded-lg transition-colors md:text-xs md:px-3 md:py-1.5"
               >
                 <Navigation size={10} className="fill-current md:w-3 md:h-3" />
                 Cómo llegar
               </button>
            </div>
            
            <div className="flex justify-between items-center px-2">
              <div className="flex flex-col items-center gap-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-walking text-[#193f3f] md:w-6 md:h-6" viewBox="0 0 16 16">
                  <path d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613-.435.489-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z"/>
                  <path d="M6.25 11.745v-1.418l1.204 1.375.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215-.494-.494.205-1.843.006-.067 1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z"/>
                </svg>
                <span className="text-[10px] font-medium text-gray-600 md:text-xs">{selectedBusiness.distances.walk}</span>
              </div>
              <div className="h-6 w-px bg-gray-200 md:h-8"></div>
              <div className="flex flex-col items-center gap-0.5">
                <Bike size={20} className="text-[#193f3f] md:w-6 md:h-6" />
                <span className="text-[10px] font-medium text-gray-600 md:text-xs">{selectedBusiness.distances.bike}</span>
              </div>
              <div className="h-6 w-px bg-gray-200 md:h-8"></div>
              <div className="flex flex-col items-center gap-0.5">
                <Car size={20} className="text-[#193f3f] md:w-6 md:h-6" />
                <span className="text-[10px] font-medium text-gray-600 md:text-xs">{selectedBusiness.distances.car}</span>
              </div>
            </div>
          </div>

          {/* Palabras Clave */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {selectedBusiness.keywords.map((kw, idx) => (
              <span key={idx} className="px-2.5 py-0.5 bg-[#193f3f]/10 text-[#193f3f] text-[10px] rounded-full font-medium border border-[#193f3f]/20 md:text-xs md:px-3 md:py-1">
                {kw}
              </span>
            ))}
          </div>

          {/* Métodos de Pago */}
          {selectedBusiness.payment_methods && Object.values(selectedBusiness.payment_methods).some(v => v) && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-2 md:text-base">Métodos de Pago</h3>
              <div className="flex gap-2 flex-wrap">
                {selectedBusiness.payment_methods.cash && (
                  <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs rounded-lg font-medium border border-green-200 flex items-center gap-1">
                    💵 Efectivo
                  </span>
                )}
                {selectedBusiness.payment_methods.card && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium border border-blue-200 flex items-center gap-1">
                    💳 Datáfono
                  </span>
                )}
                {selectedBusiness.payment_methods.nequi && (
                  <span className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs rounded-lg font-medium border border-purple-200 flex items-center gap-1">
                    📱 Nequi
                  </span>
                )}
                {selectedBusiness.payment_methods.daviplata && (
                  <span className="px-3 py-1.5 bg-red-50 text-red-700 text-xs rounded-lg font-medium border border-red-200 flex items-center gap-1">
                    💰 Daviplata
                  </span>
                )}
              </div>
            </div>
          )}

          {/* CAMBIO: Galería de Fotos ÚNICA (antes duplicada) - Sin título */}
          <div className="mb-6">
             <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
               {selectedBusiness.gallery && selectedBusiness.gallery.length > 0 ? (
                 selectedBusiness.gallery.map((imgUrl, idx) => (
                   <div key={idx} className="group relative rounded-lg overflow-hidden shadow-sm border border-gray-100 aspect-square bg-gray-200 cursor-pointer">
                      <img 
                         src={getImageUrl(imgUrl, 'gallery')} 
                         alt={`Foto ${idx + 1}`} 
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                   </div>
                 ))
               ) : (
                 <div className="col-span-3 md:col-span-4 relative rounded-lg overflow-hidden shadow-sm border border-gray-100 aspect-video bg-gray-200">
                    <img 
                       src={DEFAULT_IMAGES.gallery} 
                       alt="Sin fotos disponibles" 
                       className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <p className="text-white font-medium text-sm">No hay fotos disponibles</p>
                    </div>
                 </div>
               )}
             </div>
          </div>

          {/* Botones de Acción (Solo WhatsApp ahora) */}
          <div className="space-y-3 mb-6 md:mt-auto">
            <a 
              href={selectedBusiness.whatsapp ? `https://wa.me/${selectedBusiness.whatsapp}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full bg-[#25D366] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:bg-[#20bd5a] transition-colors md:py-4 md:text-lg ${!selectedBusiness.whatsapp ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => !selectedBusiness.whatsapp && e.preventDefault()}
            >
              <MessageCircle size={20} className="md:w-6 md:h-6" />
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardView;
