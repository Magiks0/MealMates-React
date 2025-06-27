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
      let lat = latitude;
      let lng = longitude;
      if (userPosition && userPosition.length === 2) {
        lat = userPosition[0];
        lng = userPosition[1];
      }

      const data = await productService.getNearbyProducts(lat, lng, radius || searchRadius);
      
      setProducts(data);
      setLoading(false);
    }catch (err) {
      setError("Impossible de charger les produits");
      setLoading(false);
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

    setUserPosition([address.latitude, address.longitude, searchRadius]);
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
    <div className="h-full w-full flex flex-col">
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
        style={{ height: "100%", width: "100%" }}
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
          <div
            className="fixed bottom-0 z-[2000] flex items-end justify-center bg-opacity-40 mb-30 px-4 h-auto w-full"
            onClick={() => {
              window.location.href = `/product/${selectedMarker.id}`;
            }}
            style={{ cursor: "pointer" }}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-xl relative animate-fade-in mx-auto"
              style={{
                minWidth: 0,
                width: "100%",
                maxWidth: "600px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              onClick={e => e.stopPropagation()}
            >
            <button className="hidden md:flex absolute top-3 left-3 bg-white w-9 h-9 items-center justify-center rounded-full shadow hover:bg-gray-100 transition z-10" aria-label="Like">
          <img className="w-7 h-7" src="../assets/like.svg" alt="like-button" />
              </button>
              <button
                className="absolute top-3 right-3 bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-600 transition"
                onClick={closeModal}
                aria-label="Fermer"
              >
          <span className="text-lg font-bold">×</span>
              </button>
              <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 w-full h-40 md:h-auto rounded-t-lg md:rounded-l-lg md:rounded-tr-none overflow-hidden flex-shrink-0">
            <img
              src={selectedMarker.image}
              alt={selectedMarker.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{selectedMarker.name}</h3>
                <img className="w-7 h-7 md:hidden" src="../assets/like.svg" alt="like-button" />
              </div>
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">{selectedMarker.description}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-xs text-gray-500">{selectedMarker.date}</p>
                <h5 className="font-bold text-[#009B6A]">{selectedMarker.price}</h5>
                <p className="text-xs text-gray-600">{selectedMarker.type}</p>
              </div>
              <div className="flex items-center gap-1">
                <img src="../assets/star.svg" alt="notation" className="w-5 h-5" />
                <span className="font-medium">{selectedMarker.rating}</span>
              </div>
            </div>
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