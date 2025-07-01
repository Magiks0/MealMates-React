import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useSearchParams } from "react-router";
import DashboardService from "../../services/DashBoardService";

const AdvancedFilter = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const [dietaries, setDietaries] = useState([]);
  const [types, setTypes] = useState([]);
  const [params, setParams] = useSearchParams();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10);
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const handleCheckboxChange = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };
  const searchAddress = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await res.json();
      if (data && data.features) {
        const formatted = data.features.map((f) => ({
          label: f.properties.label,
          longitude: f.geometry.coordinates[0],
          latitude: f.geometry.coordinates[1],
          city: f.properties.city,
          postcode: f.properties.postcode,
        }));
        setSearchResults(formatted);
        setShowDropdown(formatted.length > 0);
      }
    } catch (err) {
      console.error("Erreur adresse :", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSelectedLocation(null);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (value.trim().length > 2) {
      searchTimeoutRef.current = setTimeout(() => searchAddress(value), 300);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectAddress = (result) => {
    setSelectedLocation(result);
    setSearchValue(result.label);
    setShowDropdown(false);
  };

  const clearLocation = () => {
    setSearchValue("");
    setSearchResults([]);
    setSelectedLocation(null);
    setSearchRadius(10);
  };

  const handleRadiusChange = (e) => setSearchRadius(parseInt(e.target.value));
  const handleReset = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      address: "",
      category: "",
      peremptionDate: "",
      dietetic: "",
    });
    setSelectedTypes([]);
    clearLocation();
    setParams({});
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();

    if (filters.minPrice) newParams.set("minPrice", filters.minPrice);
    if (filters.maxPrice) newParams.set("maxPrice", filters.maxPrice);
    if (filters.peremptionDate)
      newParams.set("peremptionDate", filters.peremptionDate);
    if (filters.dietetic) newParams.set("dietary", filters.dietetic);
    if (selectedLocation) {
      newParams.set("address", selectedLocation.label);
      newParams.set("lat", selectedLocation.latitude);
      newParams.set("lng", selectedLocation.longitude);
      newParams.set("radius", searchRadius);
    } else if (searchValue.trim()) {
      newParams.set("address", searchValue.trim());
    }
    if (selectedTypes.length) newParams.set("types", selectedTypes.join(","));

    setParams(newParams);
    onClose();
  };

  useEffect(() => {
    async function fetchDietaries() {
      try {
        setDietaries(await DashboardService.getDietaries());
      } catch (err) {
        setError(err.message);
      }
    }
    fetchDietaries();
  }, []);

  useEffect(() => {
    async function fetchTypes() {
      try {
        setTypes(await DashboardService.getTypes());
      } catch (err) {
        setError(err.message);
      }
    }
    fetchTypes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`fixed h-full top-0 right-0 bottom-16 bg-white w-80 shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
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
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Prix
            </h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice || ""}
                  onChange={handleChange}
                  className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                  placeholder="Min €"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice || ""}
                  onChange={handleChange}
                  className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                  placeholder="Max €"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Localisation
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchInputChange}
                placeholder="Ville, région..."
                className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all pr-10"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={clearLocation}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Effacer"
                >
                  ×
                </button>
              )}
            </div>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute z-40 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {searching && (
                  <div className="p-3 text-sm text-gray-500">
                    Recherche en cours...
                  </div>
                )}
                {!searching && searchResults.length === 0 && (
                  <div className="p-3 text-sm text-gray-500">
                    Aucun résultat trouvé
                  </div>
                )}
                {!searching &&
                  searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      onClick={() => handleSelectAddress(result)}
                    >
                      {result.label}
                    </button>
                  ))}
              </div>
            )}

            {selectedLocation && (
              <div className="pt-4 space-y-1">
                <p className="text-xs text-gray-600">
                  Rayon de recherche :{" "}
                  <span className="font-medium">{searchRadius} km</span>
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">1</span>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={searchRadius}
                    onChange={handleRadiusChange}
                    className="flex-1 accent-green-500"
                  />
                  <span className="text-[10px] text-gray-400">50</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Périme après
            </label>
            <input
              type="date"
              name="peremptionDate"
              value={filters.peremptionDate || ""}
              onChange={handleChange}
              className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Régime alimentaire
            </label>
            <div className="relative">
              <select
                name="dietetic"
                value={filters.dietetic || ""}
                onChange={handleChange}
                className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none transition-all pr-10"
              >
                <option value="">Tous les régimes</option>
                {dietaries.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Types de produits
            </h3>
            <div className="space-y-2">
              {types.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.id)}
                      onChange={() => handleCheckboxChange(type.id)}
                      className="w-5 h-5 border border-gray-300 rounded focus:outline-none transition-colors cursor-pointer"
                    />
                    {selectedTypes.includes(type.id) && (
                      <div className="absolute inset-0 bg-green-500 rounded flex items-center justify-center pointer-events-none">
                        <svg
                          className="w-3 h-3 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    {type.name}
                  </span>
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
    </div>
  );
};

export default AdvancedFilter;
