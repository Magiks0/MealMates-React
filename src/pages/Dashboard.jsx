import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import AdvancedFilter from '../components/AdvancedFilter';
import { useSearchParams } from 'react-router';
import Navbar from '../components/common/navbar/Navbar';
import ProductSlider from '../components/Dashboard/ProductSlider';
import ProductCard from '../components/common/ProductCard'; 
import ProductService from '../services/ProductService';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [lastChanceProducts, setLastChanceProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recomendedProducts, setRecomendedProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useSearchParams();

  useEffect(() => {
    const load = async () => {
      try {
        const [filtered, lastChance, recent] = await Promise.all([
          ProductService.getFilteredProducts(filters),
          ProductService.getLastChanceProducts(),
          ProductService.getRecentProducts(),
        ]);

        setRecomendedProducts(filtered);
        setLastChanceProducts(lastChance);
        setRecentProducts(recent);
      } catch (error) {
        console.error('Erreur :', error);
      }
    };

    load();
  }, [filters]);

  const hasActiveFilters = filters.toString() !== '';

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm z-10 px-4">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
            <div className="font-medium">10 Rue de la Paix, Paris</div>
          </div>
          <div className="flex items-center space-x-1">
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
              className="w-10/12 p-2 pl-9 border rounded-md bg-gray-100"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-2 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="px-4 py-2 bg-green-50 flex items-center justify-between">
            <div className="text-sm text-green-800">
              Produits filtrés ({recomendedProducts.length})
            </div>
          </div>
        )}
      </div>

      {/* Contenu conditionnel */}
      {hasActiveFilters ? (
       <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recomendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      ) : (
        <>
          <ProductSlider sectionTitle="Nos recommendations" products={recomendedProducts} />
          <ProductSlider sectionTitle="Dernières chances !" products={lastChanceProducts} />
          <ProductSlider sectionTitle="Récemment ajoutés" products={recentProducts} />
        </>
      )}

      {/* Filtres avancés */}
      <AdvancedFilter isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black opacity-20 z-40"
          onClick={() => setFilterOpen(false)}
        ></div>
      )}

      <Navbar />
    </div>
  );
}
