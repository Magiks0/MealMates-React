import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import AdvancedFilter from '../components/AdvancedFilter';
import { useSearchParams } from 'react-router';
import Navbar from '../components/common/navbar/Navbar';
import ProductSlider from '../components/Dashboard/ProductSlider';
import ProductService from '../services/ProductService';
import NotificationBell from '../components/Dashboard/NotificationBell';
import NotificationPanel from '../components/Dashboard/NotificationPanel';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [lastChanceProducts, setLastChanceProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recomendedProducts, setRecomendedProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useSearchParams();

  console.log(lastChanceProducts);
  
  useEffect(() => {
    const load = async () => {
      try {
        const [recomendedProducts, lastChanceProducts, recentProducts] = await Promise.all([
          ProductService.getFilteredProducts(filters),
          ProductService.getLastChanceProducts(),
          ProductService.getRecentProducts(),
        ]);

        setRecomendedProducts(recomendedProducts);
        setLastChanceProducts(lastChanceProducts);
        setRecentProducts(recentProducts);
      } catch (error) {
        console.error('Erreur :', error);
        setError('Erreur lors du chargement des produits');
      }
    };

    load();
  }, [filters]);

  const handleResetFilters = () => {
    setActiveFilters(null);
    setFilters({});
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white shadow-sm z-10 px-4">
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
          
          <div className="flex items-center space-x-3">
            {/* Icône de notification avec compteur */}
            <NotificationBell onClick={() => setNotificationPanelOpen(true)} />
            
            <button 
              onClick={() => setFilterOpen(true)} 
              className="p-2 text-white"
              aria-label="Filtres avancés"
            >
              <img src="/assets/filter-icon.png" alt="filter-icon" />
            </button>
          </div>
        </div>
        
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-10/12 p-2 pl-9 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-2 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {activeFilters && (
          <div className="px-4 py-2 bg-green-50 flex items-center justify-between">
            <div className="text-sm text-green-800">
              Filtres actifs ({Object.values(activeFilters.dietary || {}).filter(Boolean).length + 
                               Object.values(activeFilters.pickupTimes || {}).filter(Boolean).length + 
                               (activeFilters.categories || []).length} sélections)
            </div>
            <button 
              onClick={handleResetFilters}
              className="text-xs text-green-700 font-medium hover:text-green-900 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>

      <main className="pb-20">
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <ProductSlider 
          sectionTitle="Nos recommandations" 
          products={recomendedProducts} 
        />

        <ProductSlider 
          sectionTitle="Dernières chances !" 
          products={lastChanceProducts} 
        />

        <ProductSlider 
          sectionTitle="Récemment ajoutés" 
          products={recentProducts} 
        />

        {recomendedProducts.length === 0 && lastChanceProducts.length === 0 && recentProducts.length === 0 && !error && (
          <div className="mx-4 mt-8 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit disponible</h3>
            <p className="text-gray-500">Revenez plus tard pour découvrir de nouvelles offres !</p>
          </div>
        )}
      </main>

      <AdvancedFilter
        isOpen={filterOpen} 
        onClose={() => setFilterOpen(false)}
        onApplyFilters={setActiveFilters}
      />

      <NotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
      />

      {(filterOpen || notificationPanelOpen) && (
        <div 
          className="fixed inset-0 bg-black opacity-20 z-40"
          onClick={() => {
            setFilterOpen(false);
            setNotificationPanelOpen(false);
          }}
        ></div>
      )}

      <Navbar />
    </div>
  );
}