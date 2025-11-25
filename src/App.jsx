import React, { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import BusinessCardView from './components/BusinessCardView';
import RestaurantView from './components/RestaurantView';
import ListingView from './components/ListingView';
import { BUSINESSES } from './data/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [listingConfig, setListingConfig] = useState({ title: '', items: [] });
  
  useEffect(() => {
    // Aunque Tailwind maneja fuentes, mantenemos esto por si acaso o se puede mover a index.html/css
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);
    setCurrentView('card');
  };

  const handleSeeGallery = () => {
    setCurrentView('restaurant');
  };

  const handleSeeMore = (type) => {
    if (type === 'nearby') {
      setListingConfig({ title: 'Cerca de ti', items: BUSINESSES });
    } else if (type === 'popular') {
      setListingConfig({ title: 'Los más populares', items: BUSINESSES }); // Podríamos filtrar/ordenar aquí
    }
    setCurrentView('listing');
  };

  const handleCategoryClick = (categoryName) => {
    const filteredItems = BUSINESSES.filter(biz => biz.category === categoryName);
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

  const openGoogleMaps = (businessName) => {
    const query = encodeURIComponent(businessName);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="font-poppins bg-gray-50 min-h-screen max-w-7xl mx-auto shadow-2xl border-x border-gray-200 overflow-hidden relative text-gray-800">
      {currentView === 'home' && <HomeView handleBusinessClick={handleBusinessClick} onSeeMore={handleSeeMore} onCategoryClick={handleCategoryClick} />}
      {currentView === 'card' && <BusinessCardView selectedBusiness={selectedBusiness} goBack={goBack} openGoogleMaps={openGoogleMaps} />}
      {currentView === 'restaurant' && <RestaurantView selectedBusiness={selectedBusiness} goBack={goBack} />}
      {currentView === 'listing' && <ListingView title={listingConfig.title} businesses={listingConfig.items} goBack={goBack} handleBusinessClick={handleBusinessClick} />}
    </div>
  );
}
