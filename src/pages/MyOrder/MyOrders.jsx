import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, MapPin, MessageCircle, QrCode, Calendar, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router';
import PurchaseService from '../../services/PurchaseService';
import ProductService from '../../services/ProductService';
import chatService from '../../services/ChatServices';

const MyOrders = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'completed'

  const IMG_URL = import.meta.env.VITE_IMG_URL;

  useEffect(() => {

    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const data = await PurchaseService.getMyPurchases();
      console.log('Mes commandes:', data);
      setPurchases(data);
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = async (purchase) => {
    try {
      const { exists, chatId } = await chatService.checkChatExistence(purchase.seller.id, purchase.product.id);
    if (exists) {
    navigate(`/chats/${chatId}`);
    } else {
        const product = await ProductService.getProductById(purchase.product.id);
        navigate('/new-message', { state: { product, userId: purchase.seller.id } });
    }
    } catch (error) {
      console.error('Erreur lors de la vérification du chat :', error);
      alert('Impossible de contacter le vendeur. Veuillez réessayer.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      completed: { text: 'Complété', className: 'bg-green-100 text-green-800' },
      cancelled: { text: 'Annulé', className: 'bg-red-100 text-red-800' }
    };
    
    return badges[status] || badges.pending;
  };

  // Filtrer les commandes selon l'onglet actif
  const filteredPurchases = purchases.filter(purchase => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return purchase.status !== 'completed';
    if (activeTab === 'completed') return purchase.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 flex-1 text-center mr-10">
            Mes commandes
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'all' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Toutes ({purchases.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'pending' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'completed' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Terminées
          </button>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="px-4 py-6">
        {filteredPurchases.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Aucune commande trouvée</p>
            <p className="text-gray-400 text-sm mb-6">
              {activeTab === 'pending' && "Vous n'avez pas de commandes en cours"}
              {activeTab === 'completed' && "Vous n'avez pas encore de commandes terminées"}
              {activeTab === 'all' && "Commencez à faire vos achats sur MealMates !"}
            </p>
            <button 
              onClick={() => navigate('/home')}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Découvrir les produits
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPurchases.map((purchase) => (
              <div 
                key={purchase.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* En-tête de la commande */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Commande #{purchase.id}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(purchase.status || 'pending').className}`}>
                      {getStatusBadge(purchase.status || 'pending').text}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(purchase.createdAt || new Date())}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatTime(purchase.createdAt || new Date())}</span>
                    </div>
                  </div>
                </div>

                {/* Détails du produit */}
                <div 
                  className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/product/${purchase.product.id}`)}
                >
                  <img 
                    src={purchase.product.files?.[0]?.path 
                      ? `${IMG_URL}${purchase.product.files[0].path}` 
                      : '/assets/bg-first-section.png'}
                    alt={purchase.product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{purchase.product.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{purchase.product.address.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        {purchase.product.price === 0 ? 'Don' : `${purchase.product.price} €`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informations vendeur */}
                <div className="px-4 pb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-2">Vendeur</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {purchase.seller?.username?.[0]?.toUpperCase() || 'V'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{purchase.seller?.username || 'Vendeur'}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>{purchase.seller?.note?.toFixed(1) || '4.5'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex space-x-3">
                  <button
                    onClick={() => handleContactSeller(purchase)}
                    className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle size={18} />
                    <span>Contacter</span>
                  </button>
                  {/* TODO: Implementer le scanndr de code barre */}
                  <button
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <QrCode size={18} />
                    <span>QR Code</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-20"></div>
    </div>
  );
};

export default MyOrders;