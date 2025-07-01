import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Package } from 'lucide-react';
import { useNavigate } from 'react-router';
import ProductCard from '../../components/common/ProductCard';

// Service des favoris intégré temporairement
const FavoriteService = {
  getFavorites: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await FavoriteService.getFavorites();
        setFavorites(data);
      } catch (err) {
        setError("Erreur lors du chargement des favoris");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-4">Mes Favoris</h1>
          <div className="ml-auto flex items-center">
            <Heart className="w-5 h-5 text-red-500 fill-current mr-2" />
            <span className="text-sm text-gray-600">{favorites.length} produits</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucun favori pour le moment</h2>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Explorez les produits disponibles et ajoutez vos préférés à vos favoris pour les retrouver facilement !
            </p>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center"
            >
              <Package className="w-5 h-5 mr-2" />
              Explorer les produits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favorites.map((product) => (
              <div key={product.id} className="transform hover:scale-[1.02] transition-transform duration-200">
                <ProductCard 
                  product={{...product, isFavorite: true}} 
                  onFavoriteChange={(productId, isFavorite) => {
                    if (!isFavorite) {
                      // Retirer le produit de la liste des favoris
                      setFavorites(favorites.filter(p => p.id !== productId));
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating info */}
      {favorites.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 bg-green-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between z-10">
          <div>
            <p className="font-semibold">Astuce</p>
            <p className="text-sm opacity-90">Cliquez sur le cœur d'un produit pour le retirer des favoris</p>
          </div>
          <Heart className="w-8 h-8 fill-current flex-shrink-0 ml-4" />
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;