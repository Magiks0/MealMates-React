import React, { useEffect, useState } from 'react';
import { Sliders, MapPin } from 'lucide-react';
import AdvancedFilter from '../components/AdvancedFilter';
import ProductCard from '../components/common/ProductCard';
import { useSearchParams, useLocation } from 'react-router';

export default function Dashboard ({}) {
  const [products, setProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useSearchParams();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const queryParams = new URLSearchParams(location.search);
        const response = await fetch(`${API_URL}/products?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    fetchProducts();
  }, [API_URL, filters]);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* En-tête avec localisation et filtres */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
            <div className="font-medium">10 Rue de la Paix, Paris</div>
            <button className="ml-1">
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setFilterOpen(true)} 
              className="p-2 text-white"
              aria-label="Filtres avancés"
            >
              <img src="/public/assets/filter-icon.png" alt="filter-icon" />
            </button>
          </div>
        </div>
        
        {/* Barre de recherche */}
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-10/12 p-2 pl-9 border rounded-md bg-gray-100"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-2 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        
        {activeFilters && (
          <div className="px-4 py-2 bg-green-50 flex items-center justify-between">
            <div className="text-sm text-green-800">
              Filtres actifs ({Object.values(activeFilters.dietary).filter(Boolean).length + 
                               Object.values(activeFilters.pickupTimes).filter(Boolean).length + 
                               activeFilters.categories.length} sélections)
            </div>
            <button 
              onClick={() => {
                setActiveFilters(null);
              }}
              className="text-xs text-green-700 font-medium"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>

      {/* Liste des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Slider de filtres avancés */}
      <AdvancedFilter
        isOpen={filterOpen} 
        onClose={() => setFilterOpen(false)}
      />
      
      {/* Overlay sombre quand le filtre est ouvert */}
      {filterOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-20 z-40"
          onClick={() => setFilterOpen(false)}
        ></div>
      )}
    </div>
  );
};