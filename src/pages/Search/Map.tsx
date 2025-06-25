import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/common/navbar/Navbar";
import "./Maps.css";
import SearchBar from "../../components/common/searchbar/SearchBar";
import L from "leaflet";
import productService from "../../services/ProductService";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'user-marker' 
});

const searchLocationIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'search-marker'
});

function MapViewControl({ centerPosition, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (centerPosition) {
      map.setView(centerPosition, zoom || map.getZoom());
    }
  }, [centerPosition, zoom, map]);
  
  return null;
}

const Map = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userPosition, setUserPosition] = useState([49.21057328867782, 2.581954706737226]); // Position par défaut
  const [isLocating, setIsLocating] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10); // Rayon en km

  // Fonction optimisée pour la recherche géospatiale
  const fetchProducts = async (latitude, longitude, radius) => {
    try {
      setLoading(true);
      
      // Utilisation de la méthode spécifique pour la recherche géographique
      const data = await productService.getNearbyProducts(latitude, longitude, radius || searchRadius);
      
      setProducts(data);
      setLoading(false);
    } catch (err) {
      // Si la méthode géospatiale échoue, on revient à la méthode standard
      try {
        const queryParams = `?latitude=${latitude}&longitude=${longitude}&radius=${radius || searchRadius}`;
        const data = await productService.getFilteredProducts(queryParams);
        setProducts(data);
        setLoading(false);
      } catch (fallbackErr) {
        setError("Impossible de charger les produits");
        setLoading(false);
      }
    }
  };

  const getUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setIsLocating(false);
          
          fetchProducts(latitude, longitude, searchRadius);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setIsLocating(false);
        }
      );
    } else {
      console.error("La géolocalisation n'est pas prise en charge par ce navigateur.");
      setIsLocating(false);
    }
  };

  const handleMarkerClick = (product) => {
    setSelectedMarker(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  
  const handleSelectAddress = (address) => {
    
    setSearchedLocation(address);
    
    setMapCenter([address.latitude, address.longitude]);
    
    fetchProducts(address.latitude, address.longitude, searchRadius);
  };
  
  const handleRadiusChange = (radius) => {
    setSearchRadius(radius);
    
    if (searchedLocation) {
      fetchProducts(searchedLocation.latitude, searchedLocation.longitude, radius);
    } 
    else if (userPosition) {
      fetchProducts(userPosition[0], userPosition[1], radius);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getMarkerData = () => {
    if (!products || products.length === 0) return [];
    
    return products
      .filter(product => product.address && product.address.latitude && product.address.longitude)
      .map(product => {
        return {
          id: product.id,
          position: [parseFloat(product.address.latitude), parseFloat(product.address.longitude)],
          name: product.title,
          description: product.description,
          date: new Date(product.collection_date).toLocaleDateString('fr-FR'),
          price: product.donation ? "Don" : `${product.price}€`,
          type: product.type?.name || "Non spécifié",
          rating: product.user?.note || 0,
          image: "../assets/sandwich.webp"
        };
      });
  };

  const markersData = getMarkerData();
  
  const currentMapCenter = mapCenter || userPosition;
  
  const radiusCenter = searchedLocation ? [searchedLocation.latitude, searchedLocation.longitude] : userPosition;

  return (
    <div>
      <SearchBar 
        onSelectAddress={handleSelectAddress} 
        selectedLocation={searchedLocation}
        searchRadius={searchRadius}
        onRadiusChange={handleRadiusChange}
        onClearSearch={() => {
          setSearchedLocation(null);
          setMapCenter(userPosition);
          fetchProducts(userPosition[0], userPosition[1], searchRadius);
        }}
      />
      
      <MapContainer
        style={{ height: "100vh", width: "100%" }}
        center={currentMapCenter}
        zoom={15}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <Marker 
          position={userPosition}
          icon={userIcon}
        >
          <Popup>
            Votre position
          </Popup>
        </Marker>
        
        {searchedLocation && (
          <Marker 
            position={[searchedLocation.latitude, searchedLocation.longitude]}
            icon={searchLocationIcon}
          >
            <Popup>
              {searchedLocation.label}
            </Popup>
          </Marker>
        )}
        
        <Circle 
          center={radiusCenter}
          radius={searchRadius * 1000} 
          pathOptions={{ 
            color: '#009B6A', 
            fillColor: '#009B6A', 
            fillOpacity: 0.2
          }}
        />

        <MapViewControl centerPosition={currentMapCenter} zoom={15} />

        {loading ? (
          <div className="loading-overlay">Chargement des produits...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          markersData.map((marker, index) => (
            <Marker 
              key={marker.id || index} 
              position={marker.position}
              eventHandlers={{
                click: () => handleMarkerClick(marker),
              }}
            />
          ))
        )}

        <ZoomControl position="bottomright" />
        
        {showModal && selectedMarker && (
          <div id="modal" className="flex bg-white top-145 mx-5 z-1000 relative rounded-lg drop-shadow-lg">
            <div className="relative w-[40%] h-40 rounded-l-lg overflow-hidden">
              <button 
                className="absolute top-2 left-2 bg-red-500 text-white w-6 h-6 flex justify-center items-center rounded-full"
                onClick={closeModal}
              >
                X
              </button>
              <img
                src={selectedMarker.image}
                alt={selectedMarker.name}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>

            <div className="flex flex-col justify-between w-[60%] p-4">
              <div className="flex justify-between items-center">
                <h3>{selectedMarker.name}</h3>
                <img className="w-7 h-7" src="../assets/like.svg" alt="like-button" />
              </div>
              <p className="text-sm mt-1 text-gray-700 line-clamp-2">{selectedMarker.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#777777]">{selectedMarker.date}</p>
                  <h5 className="font-bold">{selectedMarker.price}</h5>
                  <p className="text-sm text-gray-600">{selectedMarker.type}</p>
                </div>
                <div className="flex items-center">
                  <img src="../assets/star.svg" alt="notation" />
                  <h5>{selectedMarker.rating}</h5>
                </div>
              </div>
            </div>
          </div>
        )}

      </MapContainer>
      
      <button 
        onClick={getUserLocation}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-[#009B6A] text-white p-3 rounded-full shadow-lg z-1000"
        disabled={isLocating}
        aria-label="Me localiser"
      >
        <i className={`fa-solid fa-location-crosshairs ${isLocating ? 'animate-pulse' : ''}`}></i>
      </button>
    </div>
  );
};

export default Map;