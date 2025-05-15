import { useParams } from 'react-router';
import { useState } from 'react';
import { MoreVertical, Check, ChevronRight } from 'lucide-react';

export default function Message() {
  const { chatId } = useParams();
  const [newMessage, setNewMessage] = useState('');

  const chat = {
    id: chatId,
    otherUser: {
      id: 3,
      username: "Jezmem",
      avatarUrl: "/api/placeholder/40/40",
      memberSince: "5 Mar. 2025",
      transactionCount: 12
    },
    productName: "Tarte à la fraise",
    productPrice: "1500 €",
    messages: [
      {
        id: 1,
        content: "Bonjour ! Merci pour votre achat !",
        authorId: 3,
        createdAt: new Date()
      },
      {
        id: 2,
        isSystemMessage: true,
        content: `Bonne nouvelle ! Jezmem a effectué un achat de 1500€ pour votre produit "Tarte à la fraise". Faites scanner ce QR pour valider la transaction.`,
        createdAt: new Date()
      }
    ]
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      console.log(`Envoi du message: ${newMessage}`);
      setNewMessage('');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-md flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
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
      <div className="flex items-center p-2 bg-gray-50 border-b">
        <div className="w-8 h-8 bg-red-100 rounded mr-2"></div>
        <div>
          <div className="text-sm font-medium">{chat.productName}</div>
          <div className="text-xs text-gray-500">{chat.productPrice}</div>
        </div>
      </div>

      {/* User info */}
      <div className="bg-blue-50 p-3 border-b text-sm">
        <div className="flex items-center mb-1">
          <img src="/api/placeholder/16/16" alt="Member" className="mr-2" />
          <span>Membre depuis le {chat.otherUser.memberSince}</span>
        </div>
        <div className="flex items-center">
          <img src="/api/placeholder/16/16" alt="Transactions" className="mr-2" />
          <span>{chat.otherUser.transactionCount} transactions effectuées</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 bg-gray-50 flex flex-col">
        <div className="text-xs text-gray-500 mb-2">Historique</div>

        {/* Message */}
        <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
          <p>{chat.messages[0].content}</p>
        </div>

        {/* System message */}
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
