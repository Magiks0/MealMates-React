import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Star, Bookmark, Share2, ShoppingCart, ArrowLeft } from 'lucide-react';
import ProductService from '../../services/ProductService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Image par défaut pour les produits sans image
  const defaultImage = '/assets/bg-first-section.png';

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getProductById(id);
        setProduct(response);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement du produit');
        setLoading(false);
        console.error('Error fetching product details:', err);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <p className="text-red-500 mb-4">{error || "Ce produit n'existe pas"}</p>
        <button 
          onClick={() => navigate('/home')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // Déterminer l'image à afficher
  const productImage = product.image || product.files?.length > 0 ? 
    (product.files[0].path || defaultImage) : defaultImage;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header with back button */}
      <div className="p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Product Image */}
      <div className="w-full">
        <img 
          src={productImage}
          alt={product.title} 
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.onerror = null; // Évite une boucle infinie si l'image par défaut ne charge pas
            e.target.src = defaultImage; // Utilise l'image par défaut en cas d'erreur
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 p-4 space-y-4">
        <h1 className="text-xl font-bold text-gray-800">{product.title}</h1>
        <p className="text-xl font-semibold text-green-600">{product.price} €</p>
        
        <div>
          <h2 className="font-bold mb-1">Description</h2>
          <p className="text-gray-700">{product.description}</p>
        </div>

        <div>
          <h2 className="font-bold mb-1">Vendeur</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                {product.user?.image_url ? (
                  <img 
                    src={product.user.image_url} 
                    alt={product.user.username} 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <span>{product.user?.username || "Vendeur inconnu"}</span>
            </div>
            <div className="flex items-center text-green-600">
              <span className="mr-1">{product.user?.note || "N/A"}</span>
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Button */}
      <div className="p-4">
        <button 
          className="w-full bg-green-500 text-white py-3 rounded-lg font-medium"
          onClick={() => navigate(`/message?userId=${product.user?.id}&productId=${product.id}`)}
        >
          Contacter
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-around p-4 border-t">
        <button className="flex flex-col items-center">
          <Bookmark className="w-6 h-6 text-gray-500" />
        </button>
        <button className="flex flex-col items-center">
          <Share2 className="w-6 h-6 text-gray-500" />
        </button>
        <button className="flex flex-col items-center">
          <ShoppingCart className="w-6 h-6 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;