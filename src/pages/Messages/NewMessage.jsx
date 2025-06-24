import { useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import ChatService from '../../services/ChatServices';

export default function NewMessage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    "Bonjour, votre produit m'intéresse ! Est-il toujours disponible ?"
  );
  const [loading, setLoading] = useState(false);

  const { product } = state || {};

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      const chatId = await ChatService.createChatWithMessage({
        productId: product.id,
        userId: product.user.id,
        message,
      });
      console.log('Conversation créée avec succès', chatId);
      navigate(`/chats/${chatId}`);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la conversation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg flex flex-col min-h-[calc(100vh-80px)]">
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Retour"
      >
        <ArrowLeft size={24} className="text-gray-600" />
      </button>

      {/* Titre */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Contacter <span className="text-green-600">{product?.user.username}</span>
      </h2>

      <div className="flex items-center space-x-4 mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
        <div className="flex">
          <img
            src={product.files?.[0]?.path 
              ? `${import.meta.env.VITE_IMG_URL}${product.files[0].path}` 
              : '/assets/bg-first-section.png'}
            alt={product?.title}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div className='flex flex-col justify-center ml-4'>
            <p className="font-bold text-lg text-gray-900">{product?.title}</p>
            <p className="text-sm text-gray-600">
              {product?.price === 0 ? 'Don' : `${product?.price} €`}
            </p>
          </div>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        className="flex-grow resize-none rounded-md border border-gray-300 p-4 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        placeholder="Écris ton message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        disabled={loading}
        onClick={handleSend}
        className="bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition"
      >
        {loading ? (
          'Envoi...'
        ) : (
          <>
            Envoyer <ChevronRight size={20} />
          </>
        )}
      </button>
    </div>
  );
}
