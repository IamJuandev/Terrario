import React from 'react';
import { ChefHat, ShoppingBag, Coffee, Pill, LayoutGrid } from 'lucide-react';

export const CATEGORIES = [
  { id: 1, name: 'Restaurantes', icon: <ChefHat size={20} /> },
  { id: 2, name: 'Supermercados', icon: <ShoppingBag size={20} /> },
  { id: 3, name: 'Cafés', icon: <Coffee size={20} /> },
  { id: 4, name: 'Droguerías', icon: <Pill size={20} /> },
  { id: 5, name: 'Otros', icon: <LayoutGrid size={20} /> },
];

export const BUSINESSES = [
  {
    id: 101,
    name: "La Trattoria del Barrio",
    category: "Restaurantes",
    specialty: "Comida Italiana & Pastas Artesanales",
    deliveryTime: "30-45 min",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=100&q=80",
    hours: "11:00 AM - 10:00 PM",
    status: "open",
    distances: { walk: "5 min", car: "2 min", bike: "3 min" },
    keywords: ["Italiana", "Pasta", "Vino"],
    description: "La mejor pasta artesanal hecha en casa con ingredientes frescos.",
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
      "https://images.unsplash.com/photo-1574071318500-d0d586aa477d?w=600&q=80",
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80",
      "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=600&q=80",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80",
      "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=600&q=80",
    ]
  },
  {
    id: 102,
    name: "Café El Despertar",
    category: "Cafés",
    specialty: "Café de Origen & Repostería",
    deliveryTime: "15-25 min",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&q=80",
    hours: "07:00 AM - 08:00 PM",
    status: "closing",
    distances: { walk: "12 min", car: "5 min", bike: "6 min" },
    keywords: ["Café", "Postres", "Wifi"],
    description: "Un espacio tranquilo para trabajar y disfrutar del mejor café de la región.",
    gallery: [
       "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80",
       "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
       "https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=600&q=80",
       "https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=600&q=80",
    ]
  },
  {
    id: 103,
    name: "Supermercado La Esquina",
    category: "Supermercados",
    specialty: "Abarrotes, Licores & Aseo",
    deliveryTime: "40-60 min",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80",
    hours: "08:00 AM - 09:00 PM",
    status: "closed",
    distances: { walk: "20 min", car: "8 min", bike: "10 min" },
    keywords: ["Víveres", "Licores", "Aseo"],
    description: "Todo lo que necesitas para tu hogar a los mejores precios.",
    gallery: [
       "https://images.unsplash.com/photo-1604719312566-b76d4686ed52?w=600&q=80",
       "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=600&q=80",
       "https://images.unsplash.com/photo-1625702463365-44a36c525d44?w=600&q=80",
    ]
  },
  {
    id: 104,
    name: "Burger Kingo",
    category: "Restaurantes",
    specialty: "Hamburguesas al Carbón",
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&q=80",
    hours: "12:00 PM - 11:00 PM",
    status: "open",
    distances: { walk: "8 min", car: "3 min", bike: "4 min" },
    keywords: ["Hamburguesa", "Rápida", "Queso"],
    description: "Las hamburguesas más grandes del barrio.",
    gallery: [
       "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80",
       "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=80",
       "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80",
       "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&q=80",
    ]
  }
];
