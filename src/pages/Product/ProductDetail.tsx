import React, { useState, useEffect } from 'react';
import { Star, Bookmark, Share2, ShoppingCart, ArrowLeft, Heart, MessageCircle, User, MapPin, Eye, Clock, Shield, Camera } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import ProductService from '../../services/ProductService';
import chatService from '../../services/ChatServices';
import UserService from '../../services/UserService';


const ProductDetail = () => {
  // Votre logique existante
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  // Nouveaux états pour l'interface améliorée
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // Image par défaut pour les produits sans image
  const defaultImage = '/assets/bg-first-section.png';

  useEffect(() => {
    async function fetchUser() {
      const user = await UserService.getCurrentUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getProductById(Number(id));
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

  const handleContactClick = async () => {
    try {
      const { exists, chatId } = await chatService.checkChatExistence(user.id, product.id);
      if (exists) {
        navigate(`/chats/${chatId}`);
      } else {
        navigate('/new-message', { state: { product, userId: product.user.id } });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du chat :', error);
      alert('Impossible de vérifier la conversation. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oups !</h2>
          <p className="text-red-600 mb-6">{error || "Ce produit n'existe pas"}</p>
          <button 
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  //TODO: Améliorer l'affichage de l'image du produit
  const productImage = import.meta.env.VITE_IMG_URL + product.files[0]?.path || defaultImage;

  return (
    <div className="flex flex-col bg-gray-50">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
            >
              <Heart 
                size={20} 
                className={isFavorite ? "text-red-500 fill-current" : "text-gray-700"} 
              />
            </button>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200">
              <Share2 size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        <div className="relative">
          <img 
            src={productImage}
            alt={product.title} 
            className="w-full h-80 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            <Camera size={14} className="inline mr-1" />
            1/1
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 flex-1 mr-4">{product.title}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Eye size={16} />
                <span>127</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-green-600">{product.price === 0 ? 'Don' : `${product.price} €`}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>Il y a 2 jours</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center">
              <User size={18} className="mr-2" />
              Vendeur
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    {product.user?.image_url ? (
                      <img 
                        src={product.user.image_url} 
                        alt={product.user.username} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">{product.user?.username || "Vendeur inconnu"}</span>
                    <div className="ml-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" />
                    <span>Paris, France</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600 font-semibold">
                  <span className="mr-1">{product.user?.note || "4.8"}</span>
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-xs text-gray-500">125 avis</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-bold text-gray-900 text-lg">Description</h2>
            <div className="text-gray-700 leading-relaxed">
              <p className={`${!showFullDescription && product.description?.length > 150 ? 'line-clamp-3' : ''}`}>
                {product.description}
              </p>
              {product.description?.length > 150 && (
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-green-600 font-medium mt-2 hover:text-green-700 transition-colors"
                >
                  {showFullDescription ? 'Voir moins' : 'Voir plus'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4 space-y-3">
        <button 
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-md font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
          onClick={handleContactClick}
        >
          <MessageCircle size={20} className="mr-2" />
          Contacter le vendeur
        </button>
        <button 
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-md font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
          onClick={handleContactClick}
        >
          <ShoppingCart size={20} className="mr-2" />
          Acheter
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;