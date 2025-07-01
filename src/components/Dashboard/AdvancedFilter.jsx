import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSearchParams } from 'react-router';
import DashboardService from '../../services/DashBoardService';

const AdvancedFilter = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const [dietaries, setDietaries] = useState([]);
  const [types, setTypes] = useState([]);
  const [params, setParams] = useSearchParams();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDietaries, setSelectedDietaries] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({ minPrice: '', maxPrice: '', address: '', category: '', peremptionDate: '' });
    setSelectedTypes([]);
    setSelectedDietaries([]);
    setParams({});
    onClose();
  };

  const handleCheckboxChangeType = (typeId) => {
    setSelectedTypes((prevSelected) => 
        prevSelected.includes(typeId)
            ? prevSelected.filter((id) => id !== typeId)
            : [...prevSelected, typeId]
    );
  };

  const handleCheckboxChangeDiet = (dietId) => {
    setSelectedDietaries((prevSelected) =>
      prevSelected.includes(dietId)
        ? prevSelected.filter((id) => id !== dietId)
        : [...prevSelected, dietId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newParams = new URLSearchParams();

    if (filters.minPrice) newParams.set("minPrice", filters.minPrice);
    if (filters.maxPrice) newParams.set("maxPrice", filters.maxPrice);
    if (filters.address) newParams.set("address", filters.address);
    if (filters.peremptionDate) newParams.set("peremptionDate", filters.peremptionDate);

    if (selectedTypes.length > 0) {
      newParams.set("types", selectedTypes.join(","));
    }

    if (selectedDietaries.length > 0) {
      newParams.set("dietaries", selectedDietaries.join(","));
    }

    setParams(newParams);
    onClose();
  };
  
  useEffect(() => {
    async function fetchDietaries() {
      try {
        const data = await DashboardService.getDietaries();
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
        const data = await DashboardService.getTypes();
        setTypes(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchTypes();
  }, []);

  return (
    <div className={`fixed h-full top-0 right-0 bottom-16 bg-white w-80 shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
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
                  value={filters.minPrice || ''}
                  onChange={handleChange}
                  className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                  placeholder="Min €"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice || ''}
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
              value={filters.address || ''}
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
              value={filters.peremptionDate || ''}
              onChange={handleChange}
              className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Régime alimentaire</label>
            <div className="space-y-2">
              {dietaries.map(dietary => (
                <div key={dietary.id} className="flex items-center space-x-3">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox"
                      id={`dietary-${dietary.id}`}
                      checked={selectedDietaries.includes(dietary.id)}
                      onChange={() => handleCheckboxChangeDiet(dietary.id)}
                      className="w-5 h-5 border border-gray-300 rounded focus:outline-none transition-colors cursor-pointer"
                    />
                    {selectedDietaries.includes(dietary.id) && (
                      <div className="absolute inset-0 bg-green-500 rounded flex items-center justify-center pointer-events-none">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor={`dietary-${dietary.id}`}
                    className="text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    {dietary.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Types de produits</h3>
            <div className="space-y-2">
              {types.map(type => (
                <div key={type.id} className="flex items-center space-x-3">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox"
                      id={`type-${type.id}`}
                      checked={selectedTypes.includes(type.id)}
                      onChange={() => handleCheckboxChangeType(type.id)}
                      className="w-5 h-5 border border-gray-300 rounded focus:outline-none transition-colors cursor-pointer"
                    />
                    {selectedTypes.includes(type.id) && (
                      <div className="absolute inset-0 bg-green-500 rounded flex items-center justify-center pointer-events-none">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor={`type-${type.id}`}
                    className="text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    {type.name}
                  </label>
                </div>
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
    </div>
  );
};

export default AdvancedFilter;