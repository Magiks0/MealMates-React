import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSearchParams } from 'react-router';

const AdvancedFilter = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const [dietaries , setDietaries] = useState([]);
  const [types, setTypes] = useState([]);
  const [params, setParams] = useSearchParams();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({ minPrice: '', maxPrice: '', address: '', category: '', peremptionDate: '', dietetic: '' });
    setSelectedTypes([]);
    setParams({});
  };

  const handleCheckboxChange = (typeId) => {
    setSelectedTypes((prevSelected) => 
        prevSelected.includes(typeId)
            ? prevSelected.filter((id) => id !== typeId)
            : [...prevSelected, typeId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newParams = new URLSearchParams();
  
    if (filters.minPrice) newParams.set("minPrice", filters.minPrice);
    if (filters.maxPrice) newParams.set("maxPrice", filters.maxPrice);
    if (filters.address) newParams.set("address", filters.address);
    if (filters.peremptionDate) newParams.set("peremptionDate", filters.peremptionDate);
    if (filters.dietaries) newParams.set("dietary", filters.dietaries);
  
    if (selectedTypes.length > 0) {
      newParams.set("types", selectedTypes.join(","));
    }
 
    setParams(newParams); 
  };
  
  useEffect(() => {
    async function fetchDietaries() {
      try {
        const data = await getDietaries();
        setDietaries(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchDietaries();
  }, []);
  
  useEffect(() => {
    async function fetchTypes() {
      try {
        const data = await getTypes();
        setTypes(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchTypes();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className={`fixed top-0 right-0 h-full bg-white w-80 shadow-xl transform transition-transform duration-300 ease-in-out z-402 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex items-center justify-between p-5 border-b">
        <h2 className="text-lg font-medium text-gray-800">Filtres</h2>
        <button 
          type="button" 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto flex-grow space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Prix</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                placeholder="Min €"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                placeholder="Max €"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Localisation</label>
          <input
            type="text"
            name="address"
            value={filters.address}
            onChange={handleChange}
            className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
            placeholder="Ville, région..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Périme après</label>
          <input
            type="date"
            name="peremptionDate"
            value={filters.peremptionDate}
            onChange={handleChange}
            className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Régime alimentaire</label>
          <div className="relative">
            <select
              name="dietaries"
              value={filters.dietaries}
              onChange={handleChange}
              className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none transition-all pr-10"
            >
              <option value="">Tous les régimes</option>
              {dietaries.map((dietary) => (
                <option key={dietary.id} value={dietary.name}>
                  {dietary.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Types de produits</h3>
          <div className="space-y-2">
            {types.map(type => (
              <label key={type.id} className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox"
                    id={`type-${type.id}`}
                    checked={selectedTypes.includes(type.id)}
                    onChange={() => handleCheckboxChange(type.id)}
                    className="appearance-none w-5 h-5 border border-gray-300 rounded checked:bg-green-500 checked:border-transparent focus:outline-none transition-colors cursor-pointer"
                  />
                  <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{type.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border-t flex gap-3 mt-auto">
        <button 
          type="button" 
          onClick={handleReset} 
          className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          Réinitialiser
        </button>
        <button 
          type="submit" 
          className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Appliquer
        </button>
      </div>
    </form>
  );
};

export default AdvancedFilter;
