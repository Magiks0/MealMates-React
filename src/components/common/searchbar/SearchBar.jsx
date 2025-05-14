import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import axios from 'axios';

const SearchBar = ({ 
  onSearch, 
  onSelectAddress, 
  onClearSearch, 
  onRadiusChange,
  selectedLocation,
  searchRadius = 10
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Gestion des clics à l'extérieur du dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Recherche d'adresse avec l'API Adresse du gouvernement
  const searchAddress = async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      
      if (data && data.features) {
        const formattedResults = data.features.map(feature => ({
          label: feature.properties.label,
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
        }));
        
        setSearchResults(formattedResults);
        setShowDropdown(formattedResults.length > 0);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'adresse :", error);
    } finally {
      setSearching(false);
    }
  };

  // Gestion de la saisie dans la barre de recherche
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Annuler la recherche précédente si elle existe
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Définir un délai avant de lancer la recherche (pour éviter trop de requêtes)
    if (value.trim().length > 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchAddress(value);
        if (onSearch) onSearch(value);
      }, 300);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Sélection d'une adresse dans les résultats
  const handleSelectAddress = (result) => {
    setSearchValue(result.label);
    setShowDropdown(false);
    if (onSelectAddress) onSelectAddress(result);
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchValue('');
    setSearchResults([]);
    setShowDropdown(false);
    if (onClearSearch) onClearSearch();
  };

  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value);
    if (onRadiusChange) onRadiusChange(newRadius);
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <div className="input-with-icon">
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder="Rechercher une adresse..."
            className="search-input"
          />
          {searchValue ? (
            <button 
              onClick={clearSearch}
              className="clear-button"
              aria-label="Effacer la recherche"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          ) : (
            <div className="search-icon">
              <i className="fa-solid fa-search"></i>
            </div>
          )}
        </div>
        
        {/* Résultats de recherche */}
        {showDropdown && (
          <div ref={dropdownRef} className="search-results">
            {searching && (
              <div className="search-loading">
                <span>Recherche en cours...</span>
              </div>
            )}
            
            {!searching && searchResults.length === 0 && (
              <div className="no-results">
                <span>Aucun résultat trouvé</span>
              </div>
            )}
            
            {!searching && searchResults.map((result, index) => (
              <div
                key={index}
                className="search-result-item"
                onClick={() => handleSelectAddress(result)}
              >
                <i className="fa-solid fa-location-dot result-icon"></i>
                <span>{result.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Information sur le rayon de recherche */}
      {selectedLocation && (
        <div className="radius-container">
          <p className="radius-label">
            Produits dans un rayon de {searchRadius} km autour de 
            <span className="location-label"> {selectedLocation.label}</span>
          </p>
          <div className="radius-slider">
            <span className="radius-min">1 km</span>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={searchRadius}
              onChange={handleRadiusChange}
              className="slider"
            />
            <span className="radius-max">50 km</span>
            <span className="radius-value">{searchRadius} km</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;