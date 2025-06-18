import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import chatService from '../../services/ChatServices';
import Navbar from '../../components/common/navbar/Navbar';

export default function MessagesList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const POLLING_INTERVAL = 1000;
  
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await chatService.getChats();
        setChats(data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des conversations');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchChats();
    
    const intervalId = setInterval(fetchChats, POLLING_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, []);

  const navigateToChat = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

  if (loading && chats.length === 0) {
    return <div className="flex justify-center items-center h-screen">Chargement des conversations...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm p-4 z-10">
        <h1 className="text-xl font-bold text-center">Mes messages</h1>
      </div>
      
      {/* Messages list */}
      <div className="flex-grow overflow-y-auto p-4">
        {chats.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">
            Aucune conversation pour le moment
          </div>
        ) : (
          chats.map(chat => (
            <MessageItem
              key={chat.id}
              name={chat.otherUser?.username || 'Utilisateur inconnu'}
              message={chat.lastMessage?.content || 'Démarrer une conversation'}

              time={formatTime(chat.updatedAt)}
              avatarSrc={chat.avatarUrl}
              onClick={() => navigateToChat(chat.id)}
            />
          ))
        )}
      </div>
      
      <Navbar />
    </div>
  );
}

function MessageItem({ name, message, time, avatarSrc, onClick }) {
  return (
    <div onClick={onClick} className="flex items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
      <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-3 flex-shrink-0">
        {avatarSrc ? 
          <img src={avatarSrc} alt={name} className="w-full h-full object-cover" /> :
          <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
        }
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
        <p className="text-sm text-gray-600 truncate">{message}</p>
      </div>
      <div className="text-xs text-gray-500 ml-2">{time}</div>
    </div>
  );
}

function formatTime(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Hier';
  }
  
  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7);
  if (date > lastWeek) {
    const options = { weekday: 'long' };
    return date.toLocaleDateString('fr-FR', options);
  }

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}