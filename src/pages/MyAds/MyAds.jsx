import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Plus, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import ProductService from '../../services/ProductService';

const MyAds = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    const loadMyProducts = async () => {
      try {
        setLoading(true);
        const products = await ProductService.getUserProducts();
        setMyProducts(products);
      } catch (err) {
        setError("Erreur lors du chargement de vos annonces");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMyProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await ProductService.deleteProduct(productId);
        setMyProducts(myProducts.filter(product => product.id !== productId));
        setShowMenu(null);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression de l'annonce");
      }
    }
  };

  const toggleMenu = (productId) => {
    setShowMenu(showMenu === productId ? null : productId);
  };

  const getStatusBadge = (product) => {
    const now = new Date();
    const peremptionDate = new Date(product.peremptionDate);
    const daysDiff = Math.ceil((peremptionDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 0) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Expiré</span>;
    } else if (daysDiff <= 2) {
      return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">Dernière chance</span>;
    } else {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Disponible</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Link to="/account" className="mr-3">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Mes annonces</h1>
          </div>
          {myProducts.length > 0 && (
            <Link 
              to="/new-product"
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle annonce
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {myProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <Eye className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune annonce publiée
            </h2>
            <p className="text-gray-600 mb-6">
              Commencez à partager vos surplus alimentaires avec la communauté !
            </p>
            <Link 
              to="/new-product"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Publier ma première annonce
            </Link>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {myProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex">
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src="/assets/bg-first-section.png"
                      alt={product.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-bold text-green-600">
                              {product.price > 0 ? `${product.price}€` : 'Don'}
                            </span>
                            {getStatusBadge(product)}
                          </div>
                          
                          <div className="relative">
                            <button 
                              onClick={() => toggleMenu(product.id)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-500" />
                            </button>
                            
                            {showMenu === product.id && (
                              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                                <button 
                                  onClick={() => {
                                    setShowMenu(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Modifier
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Quantité: {product.quantity}</span>
                        <span>
                          Expire le {new Date(product.peremptionDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(null)}
        />
      )}
    </div>
  );
};

export default MyAds;