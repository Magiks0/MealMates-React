import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSearchParams } from 'react-router';

const AdvancedFilter = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const [dietetics , setDietetics] = useState([]);
  const [params, setParams] = useSearchParams();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({ minPrice: '', maxPrice: '', location: '', category: '' });
    setParams({});
  };

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
      async function fetchDietetics() {
        try {
          const response = await fetch(`${API_URL}/dietetics`);
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          const data = await response.json();
          setDietetics(data);
        } catch (err) {
          setError(err.message);
        }
      }
  
      fetchDietetics();
    }, [API_URL]);

  return (
    <form
      className={`fixed top-0 right-0 h-full bg-white w-80 shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* En-tête du menu */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <img src="/public/assets/filter-icon.png" className="w-5 h-5 mr-2 text-green-500" alt="filter-icon" />
          Filtres avancés
        </h2>
        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* Contenu du formulaire */}
      <div className="p-4 overflow-y-auto flex-grow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Prix minimum</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="€"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Prix maximum</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="€"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Localisation</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Ville, région..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Catégorie</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md bg-white appearance-none"
          >

            <option value="">Sélectionner un régime</option>
            {dietetics.map((dietetic) => (
              <option key={dietetic.id} value={dietetic.name}>
                {dietetic.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Boutons fixes en bas */}
      <div className="p-4 bg-white border-t flex gap-2 mt-auto">
        <button type="button" onClick={handleReset} className="flex-1 py-2 px-4 border border-gray-300 rounded text-sm font-medium">
          Réinitialiser
        </button>
        <button type="submit" className="flex-1 py-2 px-4 bg-green-500 text-white rounded text-sm font-medium">
          Appliquer
        </button>
      </div>
    </form>
  );
};

export default AdvancedFilter;
