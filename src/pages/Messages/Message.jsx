import { useParams, useNavigate } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Check, ChevronRight, ArrowLeft, CheckCircle, ShoppingCart } from 'lucide-react';
import {QRCodeSVG} from 'qrcode.react';
import ChatService from '../../services/ChatServices';
import BuyingButton from '../../components/common/Product/BuyingButton';

export default function Message() {
  const { chatId } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const POLLING_INTERVAL = 1000;
  const IMG_URL = import.meta.env.VITE_IMG_URL;
  const PICKUP_PAGE = import.meta.env.VITE_VALIDATE_PICKUP_DOMAIN;

  useEffect(() => {
    const fetchChat = async () => {
      try {
        setLoading(true);
        const data = await ChatService.getChatByID(chatId);
        setChat(data);
        
        if (data.messages && data.messages.length > 0) {
          setLastMessageId(data.messages[data.messages.length - 1].id);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement de la conversation');
        setLoading(false);
        console.error(err);
      }
    };

    fetchChat();
  }, [chatId]);

  useEffect(() => {
    if (!chatId || !lastMessageId) return;
    
    const pollNewMessages = async () => {
      try {
        const newMessages = await ChatService.getMessages(chatId, lastMessageId);
        
        if (newMessages && newMessages.length > 0) {
          setChat(prevChat => ({
            ...prevChat,
            messages: [...prevChat.messages, ...newMessages]
          }));
          
          setLastMessageId(newMessages[newMessages.length - 1].id);
        }
      } catch (err) {
        console.error('Erreur lors du polling des messages:', err);
      }
    };

    const intervalId = setInterval(pollNewMessages, POLLING_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [chatId, lastMessageId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleSendMessage = async () => {
    if (isSending) return;
    if (newMessage.trim() === '') return;

    setIsSending(true);
    try {
      const sentMessage = await ChatService.sendMessage(chatId, newMessage);

      setChat(prevChat => ({
        ...prevChat,
        messages: [...prevChat.messages, sentMessage]
      }));

      setLastMessageId(sentMessage.id);
      setNewMessage('');
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      alert('Impossible d\'envoyer le message. Veuillez réessayer.');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Chargement...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full h-full mx-auto bg-white rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-secondary text-white p-4 border-b border-green-700 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-1 text-white hover:bg-primary rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="bg-secondary w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mx-3 shadow-inner border-2"> {/* Taille plus grande, ombre interne */}
            {chat.otherUser.username.charAt(0)}
          </div>
          <span className="font-semibold text-lg">{chat.otherUser.username}</span>
        </div>
        <button className="text-white hover:bg-secondary rounded-full p-1 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex items-center p-3 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"> 
        <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded-md mr-3 shadow-sm overflow-hidden">
          <img 
            src={`${IMG_URL}${chat.productFile}`}
            alt="Product" 
            className="w-full h-full object-cover rounded-md" />
        </div>
        <div className="flex-1" onClick={() => navigate(`/product/${chat.productId}`)}>
          <div className="text-md font-semibold text-gray-800">{chat.productName}</div>
          <div className="text-sm text-gray-600 font-medium">{chat.productPrice == 0 ? 'Don' : `${chat.productPrice}€`}</div>
        </div>
        {chat.productStatus && (
          <BuyingButton productId={chat.productId} />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 flex flex-col space-y-3"> {/* Utilise space-y pour l'espacement */}
        <div className="text-xs text-gray-500 text-center mb-2">Historique</div>
          {chat.messages.map((message, index) => (
            <div 
              key={message.id || index} 
              className={`rounded-xl p-3 shadow-md relative group ${
                message.isFromCurrentUser ? 'bg-secondary text-white ml-auto rounded-br-none' : 'bg-white text-gray-800 mr-auto rounded-bl-none' // Coins spécifiques
              }`}
              style={{ maxWidth: '85%' }}
            >
              <p className="text-sm break-words">{message.content}</p> 
              <div className={`text-xs mt-1 ${message.isFromCurrentUser ? 'text-green-200 text-right' : 'text-gray-500 text-right'}`}>
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className={`absolute w-3 h-3 transform rotate-45 ${
                  message.isFromCurrentUser ? 'bg-secondary -right-1 bottom-1' : 'bg-white -left-1 bottom-1'
              }`}></div>
            </div>
          ))}

          {chat.linkedOrder && chat.linkedOrder.status === 'awaiting_pickup' ?
           (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 my-2 shadow-sm text-center">
                  <div className="flex items-center mb-2 justify-center">
                      <span className="font-semibold text-lg">✅ Bonne nouvelle !</span>
                  </div>
                  <p className="mb-3 text-sm text-left">
                      {chat.linkedOrder.buyer} a effectué un achat de {chat.productPrice}€ pour votre produit "{chat.productName}".
                  </p>
                  <p className="mb-3 text-sm text-left">
                      Faites scanner ce QR pour valider la transaction.
                  </p>
                  <div className="flex justify-center p-2 rounded-md">
                      <QRCodeSVG value={PICKUP_PAGE + chat.linkedOrder.qrCodeToken} />
                  </div>
              </div>
          ) : (chat.linkedOrder && chat.linkedOrder.status === 'completed') && (
              <div className="bg-green-100 border border-green-400 text-green-800 rounded-lg p-6 my-4 shadow-md text-center">
                <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Commande Récupérée avec Succès !</h2>
                <p className="text-gray-700">Merci d'avoir validé le retrait pour "{chat.productName}".</p>
            </div>
          )}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200 flex items-center shadow-lg">
        <input 
          type="text" 
          placeholder="Écrire un message..." 
          className="flex-1 border border-gray-300 rounded-full py-2 px-4 mr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isSending}
        />
        <button 
          className={`bg-secondary text-white p-3 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isSending ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary'
          }`}
          onClick={handleSendMessage}
          disabled={isSending}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}