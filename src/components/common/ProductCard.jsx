import React, { useState } from 'react';
import { Clock, MapPin, User, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';

const IMG_URL = import.meta.env.VITE_IMG_URL;

// Service des favoris intégré temporairement
const FavoriteService = {
  toggleFavorite: async (productId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/favorites/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};

const ProductCard = ({ product, onFavoriteChange }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      const result = await FavoriteService.toggleFavorite(product.id);
      setIsFavorite(result.isFavorite);
      
      // Appeler le callback si fourni (utile pour la page favoris)
      if (onFavoriteChange) {
        onFavoriteChange(product.id, result.isFavorite);
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris :', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="relative max-w-2xs w-64 h-full rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative">
        <img 
          src={product.files?.[0]?.path ? `${IMG_URL}${product.files[0].path}` : '/assets/bg-first-section.png'}
          alt={product.title} 
          className="w-full h-40 object-cover"
        />
        <button 
          className={`absolute top-0 right-0 m-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-all duration-200 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleToggleFavorite}
          disabled={isProcessing}
        >
          <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col px-4 pt-3 pb-2">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold text-base text-gray-900 truncate max-w-[120px]">{product.title}</h3>
          <span className="text-lg font-bold text-green-600 whitespace-nowrap">
            {product.price > 0 ? `${product.price}€` : 'Don'}
          </span>
        </div>
        
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <Clock className="w-4 h-4 mr-1" /> 
          <span>
            {product.peremptionDate
              ? new Date(product.peremptionDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })
              : 'Date inconnue'}
          </span>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <MapPin className="w-4 h-4 mr-1" /> 
          <span>{product.address?.name || 'Adresse non spécifiée'}</span>
        </div>
      </div>
      
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center">
          <User className="w-4 h-4 text-gray-500 mr-1" />
          <span className="text-sm text-gray-700 font-medium truncate">{product.user?.username}</span>
        </div>
        <div className="flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
          <span className="mr-1">★</span>
          {product.user?.note ? product.user.note.toFixed(1) : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;