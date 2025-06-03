import { useParams, useNavigate } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import chatService from '../../services/ChatServices';

export default function Message() {
  const { chatId } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState({
    otherUser: { username: '', memberSince: '', transactionCount: 0 },
    product: '',
    messages: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const POLLING_INTERVAL = 1000;
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  useEffect(() => {
    const fetchChat = async () => {
      try {
        setLoading(true);
        const data = await chatService.getChat(chatId);
        setChat(data);
        
        // Set the last message ID for polling
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

  // Setup polling for new messages
  useEffect(() => {
    if (!chatId || !lastMessageId) return;
    
    const pollNewMessages = async () => {
      try {
        const newMessages = await chatService.getMessages(chatId, lastMessageId);
        
        if (newMessages && newMessages.length > 0) {
          setChat(prevChat => ({
            ...prevChat,
            messages: [...prevChat.messages, ...newMessages]
          }));
          
          // Update last message ID
          setLastMessageId(newMessages[newMessages.length - 1].id);
        }
      } catch (err) {
        console.error('Erreur lors du polling des messages:', err);
      }
    };

    // Set up polling interval
    const intervalId = setInterval(pollNewMessages, POLLING_INTERVAL);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [chatId, lastMessageId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleSendMessage = async () => {
    if (isSending) return;
    if (newMessage.trim() === '') return;

    setIsSending(true);
    try {
      const sentMessage = await chatService.sendMessage(chatId, newMessage);

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
    <div className="w-full max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-md flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft size={24} />
          </button>
          <div className="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2">
            {chat.otherUser.username.charAt(0)}
          </div>
          <span className="font-semibold">{chat.otherUser.username}</span>
        </div>
        <button>
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Product info */}
      <div className="flex items-center p-2 bg-gray-50 border-b" onClick={() => navigate(`/product/${chat.productId}`)}>
        <div className="w-8 h-8 bg-red-100 rounded mr-2">
          <img 
            src={`${IMG_URL}${chat.productFile}`}
            alt="Product" 
            className="w-full h-full object-cover rounded" />
        </div>
        <div>
          <div className="text-sm font-medium">{chat.productName}</div>
          <div className="text-xs text-gray-500">{chat.productPrice == 0 ? 'Don' : `${chat.productPrice}€`}</div>
        </div>
      </div>

      {/* User info */}
      <div className="bg-blue-50 p-3 border-b text-sm">
        <div className="flex items-center mb-1">
          <span>Membre depuis le {chat.otherUser.createdAt}</span>
        </div>
        <div className="flex items-center">
          <span>{chat.otherUser.transactionCount} transactions effectuées</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 bg-gray-50 flex flex-col">
        <div className="text-xs text-gray-500 mb-2">Historique</div>

        {/* Message list */}
        {chat.messages.map((message, index) => (
          <div 
            key={message.id || index} 
            className={`rounded-lg p-3 mb-3 shadow-sm ${
              message.isFromCurrentUser ? 'bg-green-50 ml-auto' : 'bg-white'
            }`}
            style={{ maxWidth: '80%' }}
          >
            <p>{message.content}</p>
            <div className="text-xs text-gray-400 text-right mt-1">
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {/* System messages can be added conditionally */}
        {chat.hasSystemMessage && (
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="flex items-start mb-2">
              <Check size={16} className="text-green-600 mr-1 mt-1" />
              <span className="font-semibold text-green-800">Bonne nouvelle !</span>
            </div>
            <p className="mb-2">
              {chat.otherUser.username} a effectué un achat de <span className="font-bold">{chat.productPrice}</span> pour votre produit "<span className="italic">{chat.productName}</span>".
            </p>
            <p className="mb-3">Faites scanner ce QR pour valider la transaction.</p>
            <div className="flex justify-center">
              <img src="/api/placeholder/100/100" alt="QR Code" className="w-24 h-24" />
            </div>
          </div>
        )}

        {/* Element for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 flex">
        <input 
          type="text" 
          placeholder="Écrire un message..." 
          className="flex-1 border rounded-lg p-2 mr-2 focus:outline-none focus:ring-1 focus:ring-green-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          className="bg-green-600 text-white p-2 rounded-lg"
          onClick={handleSendMessage}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}