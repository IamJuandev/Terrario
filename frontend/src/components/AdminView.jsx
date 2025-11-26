import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Upload } from 'lucide-react';
import { createBusiness, updateBusiness, deleteBusiness } from '../services/api';
import { DEFAULT_IMAGES } from '../constants/defaultImages';

export default function AdminView({ businesses, onUpdate, goBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({ image: null, logo: null, gallery: [] });

  const handleEdit = (business) => {
    setCurrentBusiness(business);
    setFormData({ 
      ...business,
      is_popular: Boolean(business.is_popular),
      is_nearby: Boolean(business.is_nearby)
    });
    setFiles({ image: null, logo: null, gallery: [] });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentBusiness(null);
    setFormData({
      name: '',
      category: 'Restaurantes',
      specialty: '',
      deliveryTime: '',
      hours: '',
      opening_time: '',
      closing_time: '',
      distances: { walk: '', car: '', bike: '' },
      keywords: [],
      description: '',
      latitude: '',
      longitude: '',
      whatsapp: '',
      is_popular: false,
      is_nearby: false,
      payment_methods: {
        cash: false,
        card: false,
        nequi: false,
        daviplata: false
      }
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
      Object.keys(formData).forEach(key => {
        if (key === 'distances' || key === 'keywords' || key === 'gallery' || key === 'payment_methods') {
          data.append(key, JSON.stringify(formData[key]));
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

  if (isEditing) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{currentBusiness ? 'Editar Negocio' : 'Nuevo Negocio'}</h2>
          <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
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
            <label className="block text-sm font-medium text-gray-700">Especialidad</label>
            <input type="text" name="specialty" value={formData.specialty || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) }))} 
              placeholder="Ej: Pizza, Italiana, Delivery" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
            />
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
            <div className="grid grid-cols-2 gap-2">
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
                    <label className="block text-sm font-medium text-gray-700">Galería (Seleccionar múltiples)</label>
                    <input type="file" name="gallery" accept="image/*" multiple onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    {formData.gallery && formData.gallery.length > 0 && <p className="text-xs text-gray-500 mt-1">{formData.gallery.length} imágenes actuales</p>}
                </div>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Latitud</label>
                <input type="text" name="latitude" value={formData.latitude || ''} onChange={handleChange} placeholder="Ej: 4.60971" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Longitud</label>
                <input type="text" name="longitude" value={formData.longitude || ''} onChange={handleChange} placeholder="Ej: -74.08175" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
             </div>
          </div>
          
          {/* Distances */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Distancias</h3>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs text-gray-500">Caminando</label>
                    <input type="text" value={formData.distances?.walk || ''} onChange={(e) => handleNestedChange('distances', 'walk', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Carro</label>
                    <input type="text" value={formData.distances?.car || ''} onChange={(e) => handleNestedChange('distances', 'car', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Bici</label>
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
            <button onClick={goBack} className="mr-4 text-gray-500 hover:text-gray-700">
                &larr; Volver
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Administración</h1>
        </div>
        <button onClick={handleCreate} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
          <Plus size={20} className="mr-2" /> Nuevo Negocio
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negocio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {businesses.map((biz) => (
              <tr key={biz.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {biz.logo ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={biz.logo.startsWith('http') ? biz.logo : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${biz.logo}`} alt="" />
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(biz)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(biz.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
