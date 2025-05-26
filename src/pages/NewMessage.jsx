import { useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import chatService from '../services/ChatServices';

export default function NewMessage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Bonjour, votre produit m\'intéresse ! Est -il toujours disponible ?');
  const [loading, setLoading] = useState(false);

  const {
    product
  } = state || {};

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      const { chatId } = await chatService.createChatWithMessage({
        productId: product.id,
        userId: product.user.id,
        message,
      });
      console.log('Chat created with ID:', chatId);
      navigate(`/chats/${chatId}`);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la conversation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto flex flex-col h-screen bg-white">
      <h2 className="text-lg font-bold mb-2">Contacter {product.user.username}</h2>

      <div className="mb-4">
        <div className="flex items-center space-x-2">
          
          <div>
            <p className="font-semibold">{product.title}</p>
            <p className="text-sm text-gray-500">
              {product.price === 0 ? 'Don' : `${product.price} €`}
            </p>
          </div>
        </div>
      </div>

      <textarea
        className="flex-1 border rounded-lg p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Écris ton message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        disabled={loading}
        onClick={handleSend}
        className="bg-green-600 text-white p-3 rounded-lg flex items-center justify-center"
      >
        {loading ? 'Envoi...' : <ChevronRight size={20} />}
      </button>
    </div>
  );
}
