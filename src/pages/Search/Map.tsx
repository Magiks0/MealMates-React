import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/common/navbar/Navbar";
import SearchBar from "../../components/common/searchbar/SearchBar";
import "./Maps.css";
import L from "leaflet";

// Données de marqueurs avec leurs informations
const markersData = [
  {
    position: [49.21, 2.58],
    name: "Sandwich jambon beurre",
    date: "5 Avril 2025",
    price: "12.5$",
    rating: "4.75",
    image: "../assets/sandwich.webp"
  },
  {
    position: [49.29, 2.59],
    name: "Croissant au chocolat",
    date: "6 Avril 2025",
    price: "3.5$",
    rating: "4.9",
    image: "../assets/sandwich.webp" // Changez cette image selon le besoin
  },
  {
    position: [49.27, 2.54],
    name: "Salade César",
    date: "4 Avril 2025",
    price: "10.0$",
    rating: "4.2",
    image: "../assets/sandwich.webp" // Changez cette image selon le besoin
  },
  {
    position: [49.20, 2.60],
    name: "Quiche Lorraine",
    date: "3 Avril 2025",
    price: "8.5$",
    rating: "4.6",
    image: "../assets/sandwich.webp" // Changez cette image selon le besoin
  },
  {
    position: [49.91, 2.52],
    name: "Pizza Margherita",
    date: "7 Avril 2025",
    price: "15.0$",
    rating: "4.8",
    image: "../assets/sandwich.webp" // Changez cette image selon le besoin
  },
];

// Correction de l'icône pour Leaflet (problème courant)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = () => {
  // État pour contrôler l'affichage de la modale
  const [showModal, setShowModal] = useState(false);
  // État pour stocker les données du marqueur sélectionné
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Fonction pour ouvrir la modale avec les données du marqueur
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setShowModal(true);
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <SearchBar />
      <MapContainer
        style={{ height: "100vh", width: "100%" }}
        center={[49.21057328867782, 2.581954706737226]} 
        zoom={15} // Zoom ajusté pour une meilleure vue des marqueurs
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {markersData.map((marker, index) => (
          <Marker 
            key={index} 
            position={marker.position}
            eventHandlers={{
              click: () => handleMarkerClick(marker),
            }}
          />
        ))}

        <ZoomControl position="bottomright" />
        
        {/* Modale conditionnelle qui s'affiche uniquement si showModal est true */}
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
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#777777]">{selectedMarker.date}</p>
                  <h5 className="font-bold">{selectedMarker.price}</h5>
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
      <Navbar />
    </div>
  );
};

export default Map;