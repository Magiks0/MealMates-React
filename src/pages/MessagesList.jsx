import { Home, Search, PlusSquare, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function MessagesList() {
  const navigate = useNavigate();

  const chats = [
    {
      id: 1,
      user2: { id: 4, username: "Camille", avatarUrl: "/api/placeholder/40/40" },
      updatedAt: new Date(),
      lastMessageContent: "Je vous remercie pour cet..."
    },
    {
      id: 2,
      user2: { id: 5, username: "GrégoireC", avatarUrl: "/api/placeholder/40/40" },
      updatedAt: new Date(),
      lastMessageContent: "J'ai bien mangé !"
    }
  ];

  const navigateToChat = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="relative bg-white p-4 border-b">
        <h1 className="text-xl font-bold mt-4">Mes messages</h1>
        <button className="absolute right-4 top-8 text-green-600">
          <MessageSquare className="rotate-90" size={20} />
        </button>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-auto">
        {chats.map(chat => (
          <MessageItem 
            key={chat.id}
            name={chat.user2.username}
            message={chat.lastMessageContent}
            time="12 min"
            avatarSrc={chat.user2.avatarUrl}
            onClick={() => navigateToChat(chat.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MessageItem({ name, message, time, avatarSrc, onClick }) {
  return (
    <div 
      className="flex items-center p-3 border-b hover:bg-gray-50 cursor-pointer"
      onClick={onClick}
    >
      <img src={avatarSrc} alt={name} className="w-10 h-10 rounded-full mr-3" />
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-gray-600 truncate">{message}</div>
      </div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  );
}
