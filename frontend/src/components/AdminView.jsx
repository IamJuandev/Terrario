import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Upload, Copy } from 'lucide-react';
import { createBusiness, updateBusiness, deleteBusiness } from '../services/api';
import { DEFAULT_IMAGES } from '../constants/defaultImages';

const ZONES = ['Las Acacias', 'Nueva Cecilia', 'La Bota'];

export default function AdminView({ businesses, onUpdate, goBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({ image: null, logo: null, gallery: [] });
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterZone, setFilterZone] = useState('Todas');
  
  // Copy modal state
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [businessToCopy, setBusinessToCopy] = useState(null);
  const [selectedCopyZone, setSelectedCopyZone] = useState('');
  
  // Filtered businesses
  const filteredBusinesses = businesses.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          biz.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = filterZone === 'Todas' || (biz.zone || 'Las Acacias') === filterZone;
    return matchesSearch && matchesZone;
  });

  const handleEdit = (business) => {
    setCurrentBusiness(business);
    setFormData({ 
      ...business,
      is_popular: Boolean(business.is_popular),
      is_nearby: Boolean(business.is_nearby),
      zone: business.zone || 'Las Acacias'
    });
    setFiles({ image: null, logo: null, gallery: [] });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentBusiness(null);
    setFormData({
      name: '',
      category: 'Restaurantes',
      zone: 'Las Acacias',
      specialty: '',
      deliveryTime: '',
      hours: '',
      opening_time: '',
      closing_time: '',
      distances: { walk: '', car: '', bike: '' },
      keywords: [],
      description: '',
      map_url: '',
      whatsapp: '',
      is_popular: false,
      is_nearby: false,
      payment_methods: {
        cash: false,
        card: false,
        nequi: false,
        daviplata: false
      },
      payment_methods: {
        cash: false,
        card: false,
        nequi: false,
        daviplata: false
      },
      priority: 0,
      gallery: []
    });
    setFiles({ image: null, logo: null, gallery: [] });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este negocio?')) {
      try {
        await deleteBusiness(id);
        onUpdate();
      } catch (error) {
        console.error("Error deleting business:", error);
        alert("Error al eliminar");
      }
    }
  };

  // Open copy modal
  const openCopyModal = (business) => {
    setBusinessToCopy(business);
    // Pre-select a different zone than the current one
    const currentZone = business.zone || 'Las Acacias';
    const otherZones = ZONES.filter(z => z !== currentZone);
    setSelectedCopyZone(otherZones[0] || ZONES[0]);
    setCopyModalOpen(true);
  };

  // Handle copy business to another zone
  const handleCopyBusiness = async () => {
    if (!businessToCopy || !selectedCopyZone) return;
    
    try {
      const data = new FormData();
      
      // Copy all fields except id
      const fieldsToCopy = ['name', 'category', 'specialty', 'deliveryTime', 'hours', 'opening_time', 'closing_time', 'description', 'whatsapp', 'is_popular', 'is_nearby', 'priority', 'map_url', 'image', 'logo'];
      
      fieldsToCopy.forEach(key => {
        if (businessToCopy[key] !== null && businessToCopy[key] !== undefined) {
          data.append(key, businessToCopy[key]);
        }
      });
      
      // Set the new zone
      data.append('zone', selectedCopyZone);
      
      // Handle JSON fields
      if (businessToCopy.distances) {
        data.append('distances', JSON.stringify(businessToCopy.distances));
      }
      if (businessToCopy.keywords) {
        data.append('keywords', JSON.stringify(businessToCopy.keywords));
      }
      if (businessToCopy.payment_methods) {
        data.append('payment_methods', JSON.stringify(businessToCopy.payment_methods));
      }
      if (businessToCopy.gallery) {
        data.append('gallery_json', JSON.stringify(businessToCopy.gallery));
      }
      
      await createBusiness(data);
      setCopyModalOpen(false);
      setBusinessToCopy(null);
      onUpdate();
      alert(`Negocio copiado exitosamente a ${selectedCopyZone}`);
    } catch (error) {
      console.error("Error copying business:", error);
      alert("Error al copiar el negocio");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (name === 'gallery') {
      setFiles(prev => ({ ...prev, gallery: Array.from(selectedFiles) }));
    } else {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleNestedChange = (parent, key, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value }
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      payment_methods: {
        ...prev.payment_methods,
        [method]: !prev.payment_methods[method]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      
      // Append text fields
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key === 'gallery') {
           data.append('gallery_json', JSON.stringify(formData[key]));
        } else if (key === 'keywords') {
          // Convert string to array if needed
          const keywordsValue = typeof formData[key] === 'string' 
            ? formData[key].split(',').map(k => k.trim()).filter(k => k)
            : formData[key];
          data.append(key, JSON.stringify(keywordsValue));
        } else if (key === 'distances' || key === 'payment_methods') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'priority') {
          data.append(key, formData[key] || 0);
        } else if (key === 'map_url') { // Add map_url
          data.append(key, formData[key] || '');
        } else if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      // Append files
      if (files.image) data.append('image', files.image);
      if (files.logo) data.append('logo', files.logo);
      if (files.gallery.length > 0) {
        files.gallery.forEach(file => {
          data.append('gallery', file);
        });
      }

      if (currentBusiness) {
        await updateBusiness(currentBusiness.id, data);
      } else {
        await createBusiness(data);
      }
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error saving business:", error);
      alert("Error al guardar");
    }
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== indexToRemove)
    }));
  };

  if (isEditing) {
    return (
      <div className="p-4 md:p-6 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">{currentBusiness ? 'Editar Negocio' : 'Nuevo Negocio'}</h2>
          <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto">
          {/* ... existing fields ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select name="category" value={formData.category || 'Restaurantes'} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
              <option>Restaurantes</option>
              <option>Supermercados</option>
              <option>Cafés</option>
              <option>Droguerías</option>
              <option>Otros</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sede</label>
            <select name="zone" value={formData.zone || 'Las Acacias'} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
              <option value="Las Acacias">Las Acacias</option>
              <option value="Nueva Cecilia">Nueva Cecilia</option>
              <option value="La Bota">La Bota</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Especialidad</label>
            <input type="text" name="specialty" value={formData.specialty || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Hora de Apertura</label>
                <input 
                  type="time" 
                  name="opening_time" 
                  value={formData.opening_time || ''} 
                  onChange={handleChange} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Hora de Cierre</label>
                <input 
                  type="time" 
                  name="closing_time" 
                  value={formData.closing_time || ''} 
                  onChange={handleChange} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                />
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tiempo Entrega</label>
            <input type="text" name="deliveryTime" value={formData.deliveryTime || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp (Número)</label>
            <input type="text" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} placeholder="Ej: 573001234567" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Palabras Clave (separadas por comas)</label>
            <input 
              type="text" 
              name="keywords" 
              value={Array.isArray(formData.keywords) ? formData.keywords.join(', ') : formData.keywords || ''} 
              onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))} 
              placeholder="Ej: Pizza, Italiana, Delivery" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Prioridad (Orden)</label>
             <input type="number" name="priority" value={formData.priority || 0} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
             <p className="text-xs text-gray-500 mt-1">Mayor número = Aparece primero. (Ej: 10 aparece antes que 0)</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Destacar en Secciones</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="is_popular" 
                  name="is_popular" 
                  checked={formData.is_popular === true} 
                  onChange={handleChange} 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                />
                <label htmlFor="is_popular" className="ml-2 block text-sm text-gray-700">
                  Mostrar en "Los más populares"
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="is_nearby" 
                  name="is_nearby" 
                  checked={formData.is_nearby === true} 
                  onChange={handleChange} 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                />
                <label htmlFor="is_nearby" className="ml-2 block text-sm text-gray-700">
                  Mostrar en "Cerca de ti"
                </label>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Métodos de Pago</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="payment_cash" 
                  checked={formData.payment_methods?.cash || false} 
                  onChange={() => handlePaymentMethodChange('cash')} 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                />
                <label htmlFor="payment_cash" className="ml-2 block text-sm text-gray-700">
                  💵 Efectivo
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="payment_card" 
                  checked={formData.payment_methods?.card || false} 
                  onChange={() => handlePaymentMethodChange('card')} 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                />
                <label htmlFor="payment_card" className="ml-2 block text-sm text-gray-700">
                  💳 Datáfono
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="payment_nequi" 
                  checked={formData.payment_methods?.nequi || false} 
                  onChange={() => handlePaymentMethodChange('nequi')} 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                />
                <label htmlFor="payment_nequi" className="ml-2 block text-sm text-gray-700">
                  📱 Nequi
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="payment_daviplata" 
                  checked={formData.payment_methods?.daviplata || false} 
                  onChange={() => handlePaymentMethodChange('daviplata')} 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                />
                <label htmlFor="payment_daviplata" className="ml-2 block text-sm text-gray-700">
                  💰 Daviplata
                </label>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 border-b pb-4">
             <h3 className="text-sm font-medium text-gray-900 mb-2">Imágenes</h3>
             <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Imagen Principal</label>
                    <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    {formData.image && <p className="text-xs text-gray-500 mt-1">Actual: {formData.image}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Logo</label>
                    <input type="file" name="logo" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    {formData.logo && <p className="text-xs text-gray-500 mt-1">Actual: {formData.logo}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Galería</label>
                    
                    {/* Existing Gallery Images */}
                    {formData.gallery && formData.gallery.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {formData.gallery.map((img, index) => (
                           <div key={index} className="relative group">
                             <img 
                               src={img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL || ''}${img}`} 
                               alt={`Gallery ${index}`} 
                               className="w-full h-24 object-cover rounded-lg border border-gray-200"
                             />
                             <button 
                               type="button"
                               onClick={() => handleRemoveGalleryImage(index)}
                               className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                               <X size={12} />
                             </button>
                           </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload size={24} className="text-gray-400 mb-2" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click para agregar</span> o arrastra imágenes</p>
                                <p className="text-xs text-gray-500">Puedes seleccionar múltiples</p>
                            </div>
                            <input type="file" name="gallery" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                        </label>
                    </div>
                </div>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Link Google Maps (Cómo llegar)</label>
                <input type="text" name="map_url" value={formData.map_url || ''} onChange={handleChange} placeholder="https://maps.google.com/..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
             </div>
          </div>
          
          {/* Distances */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Distancias</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs text-gray-500">Caminando</label>
                    <input type="text" value={formData.distances?.walk || ''} onChange={(e) => handleNestedChange('distances', 'walk', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Carro</label>
                    <input type="text" value={formData.distances?.car || ''} onChange={(e) => handleNestedChange('distances', 'car', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Moto</label>
                    <input type="text" value={formData.distances?.bike || ''} onChange={(e) => handleNestedChange('distances', 'bike', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border" />
                </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Save size={16} className="mr-2" /> Guardar
            </button>
          </div>
        </form>
      </div>
    );
  }



  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div className="flex items-center">
            <button onClick={goBack} className="mr-4 text-gray-500 hover:text-gray-700">
                &larr; Volver
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Administración</h1>
        </div>
        <button onClick={handleCreate} className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
          <Plus size={20} className="mr-2" /> Nuevo Negocio
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
           <label className="block text-xs font-medium text-gray-500 mb-1">Filtrar por Sede</label>
           <select 
             className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
             value={filterZone}
             onChange={(e) => setFilterZone(e.target.value)}
           >
             <option value="Todas">Todas las sedes</option>
             <option value="Las Acacias">Las Acacias</option>
             <option value="Nueva Cecilia">Nueva Cecilia</option>
             <option value="La Bota">La Bota</option>
           </select>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredBusinesses.map((biz) => (
          <div key={biz.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
            <div className="flex-shrink-0 h-16 w-16">
               {biz.logo ? (
                 <img className="h-16 w-16 rounded-lg object-cover" src={biz.logo.startsWith('http') ? biz.logo : `${import.meta.env.VITE_API_URL || ''}${biz.logo}`} alt="" />
               ) : (
                 <img className="h-16 w-16 rounded-lg object-cover" src={DEFAULT_IMAGES.logo} alt="default logo" />
               )}
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-base font-bold text-gray-900 truncate">{biz.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{biz.specialty}</p>
                 </div>
                 <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${biz.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {biz.status === 'open' ? 'Abierto' : 'Cerrado'}
                 </span>
               </div>
               <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{biz.category}</span>
                  <div className="flex gap-3">
                    <button onClick={() => openCopyModal(biz)} className="text-emerald-600 hover:text-emerald-900" title="Copiar a otra sede"><Copy size={18} /></button>
                    <button onClick={() => handleEdit(biz)} className="text-indigo-600 hover:text-indigo-900" title="Editar"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(biz.id)} className="text-red-600 hover:text-red-900" title="Eliminar"><Trash2 size={18} /></button>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negocio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBusinesses.map((biz) => (
              <tr key={biz.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {biz.logo ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={biz.logo.startsWith('http') ? biz.logo : `${import.meta.env.VITE_API_URL || ''}${biz.logo}`} alt="" />
                      ) : (
                        <img className="h-10 w-10 rounded-full object-cover" src={DEFAULT_IMAGES.logo} alt="default logo" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{biz.name}</div>
                      <div className="text-sm text-gray-500">{biz.specialty}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {biz.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {biz.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {biz.zone || 'Las Acacias'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openCopyModal(biz)} className="text-emerald-600 hover:text-emerald-900 mr-4" title="Copiar a otra sede"><Copy size={18} /></button>
                  <button onClick={() => handleEdit(biz)} className="text-indigo-600 hover:text-indigo-900 mr-4" title="Editar"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(biz.id)} className="text-red-600 hover:text-red-900" title="Eliminar"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Copy Modal */}
      {copyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Copiar Negocio</h3>
              <button onClick={() => setCopyModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Copiar <strong>{businessToCopy?.name}</strong> a otra sede:
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Sede actual: <span className="font-medium text-gray-600">{businessToCopy?.zone || 'Las Acacias'}</span>
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar nueva sede</label>
              <select
                value={selectedCopyZone}
                onChange={(e) => setSelectedCopyZone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
              >
                {ZONES.filter(z => z !== (businessToCopy?.zone || 'Las Acacias')).map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setCopyModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCopyBusiness}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Copy size={18} />
                Copiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
