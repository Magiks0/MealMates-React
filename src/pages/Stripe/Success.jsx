import { useState, useEffect } from "react";
import { Check, Home, MessageCircle, Package } from 'lucide-react';
import { useParams, useNavigate } from "react-router";
import OrderService from "../../services/OrderService";
import ChatService from "../../services/ChatServices";

const PaymentSuccessPage = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [purchase, setPurchase] = useState(null);
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const timer1 = setTimeout(() => setShowAnimation(true), 300);
    const timer2 = setTimeout(() => setShowContent(true), 1500);

    const fetchPurchase = async () => {
      try {
        const purchaseData = await OrderService.getOrderById(params.id);
        setPurchase(purchaseData);
      } catch (error) {
        console.error('Erreur lors du chargement de la transaction :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [params]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const chatData = await ChatService.getChatByProductIdAndUsers(purchase.buyer.id, purchase.seller.id, purchase.product.id);
        setChat(chatData);
      } catch(err) {
        console.error('Erreur lors de la récupéeration du chat: ', err)
      }
    }

    fetchChat();
  }, [purchase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
        <p className="mt-4 text-gray-600">Chargement de la transaction...</p>
      </div>
    );
  }

  if (!purchase || !purchase.product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-red-600">Erreur : impossible de charger les données de la transaction.</p>
        <button
          onClick={() => navigate('/home')}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Animation Check */}
        <div className="relative mb-8">
          <div className={`w-24 h-24 rounded-full bg-green-500 flex items-center justify-center transition-all duration-1000 ${
            showAnimation ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}>
            <Check className="w-12 h-12 text-white" />
          </div>
          <div className={`absolute inset-0 w-24 h-24 rounded-full border-4 border-green-200 transition-all duration-1000 ${
            showAnimation ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
          }`} />
          <div className={`absolute inset-0 w-24 h-24 rounded-full border-2 border-green-300 transition-all duration-1000 delay-200 ${
            showAnimation ? 'scale-200 opacity-0' : 'scale-100 opacity-100'
          }`} />
        </div>

        {/* Contenu succès */}
        <div className={`text-center transition-all duration-800 delay-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Paiement réussi !</h1>
          <p className="text-gray-600 text-lg mb-2">Votre transaction a été effectuée avec succès</p>

          <div className="bg-white rounded-lg p-6 shadow-sm mb-8 text-left max-w-sm">
             <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-900 m-auto">{purchase.product.title}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Montant</span>
              <span className="font-semibold text-gray-900">{purchase.product.price} €</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date</span>
              <span className="text-gray-900">{new Date().toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className={`w-full max-w-sm space-y-3 transition-all duration-800 delay-1000 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button 
            onClick={() => navigate('/home')}
            className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600"
          >
            <Home className="w-5 h-5" />
            <span>Retour à l'accueil</span>
          </button>

          <button 
            onClick={() => navigate('/my-orders')}
            className="w-full flex items-center justify-center space-x-2 bg-white text-gray-700 py-4 px-6 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <Package className="w-5 h-5" />
            <span>Voir mes commandes</span>
          </button>

          <button 
            onClick={() => navigate('/chats/' + chat.id)}
            className="w-full flex items-center justify-center space-x-2 bg-white text-gray-700 py-4 px-6 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Contacter le vendeur</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
