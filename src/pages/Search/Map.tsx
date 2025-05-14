import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/common/navbar/Navbar";
import "./Maps.css";
import SearchBar from "../../components/common/searchbar/SearchBar";
import L from "leaflet";
import productService from "../../services/productService";

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

function SetViewOnUserLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 15);
    }
  }, [coords, map]);
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des produits:", err);
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
          setIsLocating(false);
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

  useEffect(() => {
    getUserLocation();
    fetchProducts();
  }, []);

  // Préparation des données pour les marqueurs
  const getMarkerData = () => {
    if (!products || products.length === 0) return [];
    
    return products
      .filter(product => product.address && product.address.latitude && product.address.longitude)
      .map(product => {
        return {
          id: product.id,
          position: [product.address.latitude, product.address.longitude],
          name: product.title,
          description: product.description,
          date: new Date(product.collection_date).toLocaleDateString('fr-FR'),
          price: product.donation ? "Don" : `${product.price}€`,
          type: product.type?.name || "Non spécifié",
          rating: product.user?.note || 0,
          // Comme il n'y a pas de champ files dans votre format de données, on utilise une image par défaut
          image: "../assets/sandwich.webp"
        };
      });
  };

  const markersData = getMarkerData();

  return (
    <div>
      <SearchBar />
      <MapContainer
        style={{ height: "100vh", width: "100%" }}
        center={userPosition}
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
        
        <Circle 
          center={userPosition}
          radius={1000} 
          pathOptions={{ 
            color: '#009B6A', 
            fillColor: '#009B6A', 
            fillOpacity: 0.2
          }}
        />

        <SetViewOnUserLocation coords={userPosition} />

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
      
      <Navbar />
    </div>
  );
};

export default Map;