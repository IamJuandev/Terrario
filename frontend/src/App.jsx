import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import HomeView from './components/HomeView';
import BusinessCardView from './components/BusinessCardView';
import RestaurantView from './components/RestaurantView';
import ListingView from './components/ListingView';
import AdminView from './components/AdminView';
import { getBusinesses } from './services/api';

function PublicApp({ businesses, fetchData }) {
  const { zone } = useParams();
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [listingConfig, setListingConfig] = useState({ title: '', items: [] });

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);
    setCurrentView('card');
  };

  const handleSeeGallery = () => {
    setCurrentView('restaurant');
  };

  // Helper to resolve zone from URL (duplicated from HomeView for now)
  const getZoneInfo = (slug) => {
    if (!slug) return { name: "Las Acacias", filter: "Las Acacias" }; 
    
    const normalized = slug.toLowerCase().replace(/-/g, '').replace(/ /g, '');
    
    if (normalized.includes("acacias")) return { name: "Las Acacias", filter: "Las Acacias" };
    if (normalized.includes("cecilia")) return { name: "Nueva Cecilia", filter: "Nueva Cecilia" };
    if (normalized.includes("bota")) return { name: "La Bota", filter: "La Bota" };

    const formatted = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return { name: formatted, filter: formatted };
  };

  const handleSeeMore = (type) => {
    const currentZone = getZoneInfo(zone);
    // Filter by Zone first
    let filtered = businesses.filter(biz => (biz.zone || 'Las Acacias') === currentZone.filter);

    if (type === 'nearby') {
      // Also filter by type to be consistent
      filtered = filtered.filter(biz => biz.is_nearby);
      setListingConfig({ title: 'Cerca de ti', items: filtered });
    } else if (type === 'popular') {
      filtered = filtered.filter(biz => biz.is_popular);
      setListingConfig({ title: 'Los más populares', items: filtered });
    }
    setCurrentView('listing');
  };

  const handleCategoryClick = (categoryName) => {
    const currentZone = getZoneInfo(zone);
    const filteredItems = businesses.filter(biz => 
      biz.category === categoryName && 
      (biz.zone || 'Las Acacias') === currentZone.filter
    );
    setListingConfig({ title: categoryName, items: filteredItems });
    setCurrentView('listing');
  };

  const goBack = () => {
    if (currentView === 'restaurant') {
      setCurrentView('card');
    } else if (currentView === 'listing') {
      setCurrentView('home');
    } else {
      setCurrentView('home');
      setSelectedBusiness(null);
    }
  };

  const openGoogleMaps = (business) => {
    if (business && business.map_url) {
       window.open(business.map_url, '_blank');
    } else if (business && business.latitude && business.longitude) {
       window.open(`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`, '_blank');
    } else {
       const query = encodeURIComponent(business.name || business);
       window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  return (
    <>
      {currentView === 'home' && (
        <HomeView 
          businesses={businesses} 
          handleBusinessClick={handleBusinessClick} 
          onSeeMore={handleSeeMore} 
          onCategoryClick={handleCategoryClick} 
          zone={zone}
        />
      )}
      {currentView === 'card' && <BusinessCardView selectedBusiness={selectedBusiness} goBack={goBack} openGoogleMaps={openGoogleMaps} />}
      {currentView === 'restaurant' && <RestaurantView selectedBusiness={selectedBusiness} goBack={goBack} />}
      {currentView === 'listing' && <ListingView title={listingConfig.title} businesses={listingConfig.items} goBack={goBack} handleBusinessClick={handleBusinessClick} />}
    </>
  );
}

export default function App() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchData = async () => {
    try {
      const result = await getBusinesses();
      setBusinesses(result.data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Cargando...</div>;
  }

  return (
    <div className="font-poppins bg-gray-50 min-h-screen max-w-7xl mx-auto shadow-2xl border-x border-gray-200 overflow-hidden relative text-gray-800">
      <Routes>
        <Route path="/" element={<PublicApp businesses={businesses} fetchData={fetchData} />} />
        <Route path="/:zone" element={<PublicApp businesses={businesses} fetchData={fetchData} />} />
        <Route path="/manager" element={<AdminView businesses={businesses} onUpdate={fetchData} goBack={() => window.history.back()} />} />
      </Routes>
    </div>
  );
}
