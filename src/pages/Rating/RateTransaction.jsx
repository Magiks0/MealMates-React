import { useState, useEffect } from 'react';
import { Star, Send, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import OrderService from '../../services/OrderService';
import RatingService from '../../services/RatingService';

const RateTransaction = () => {
  // 3 ratings, one for each section
  const [qualityRating, setQualityRating] = useState(0);
  const [qualityHover, setQualityHover] = useState(0);

  const [timelinessRating, setTimelinessRating] = useState(0);
  const [timelinessHover, setTimelinessHover] = useState(0);

  const [friendlinessRating, setFriendlinessRating] = useState(0);
  const [friendlinessHover, setFriendlinessHover] = useState(0);

  const [comment, setComment] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { orderId } = useParams();
  const { reviewedId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await OrderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Erreur lors du chargement de la commande:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Calcul de la moyenne arrondie au centième
  const averageRating = Number(
    (
      (qualityRating + timelinessRating + friendlinessRating) / 3
    ).toFixed(2)
  );

  const handleSubmit = async () => {
    if (
      qualityRating === 0 ||
      timelinessRating === 0 ||
      friendlinessRating === 0
    ) {
      alert('Veuillez noter chaque critère');
      return;
    }

    setSubmitting(true);
    try {
      await RatingService.createRating(
        reviewedId,
        orderId,
        averageRating,
        comment
      );
      navigate('/home', {
        state: { message: 'Merci pour votre évaluation !' },
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'évaluation:", error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-600 mb-4">Commande introuvable</p>
        <button
          onClick={() => navigate('/home')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // Déterminer qui évaluer
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;
  const userToRate =
    order.buyer.id === currentUserId ? order.seller : order.buyer;

  // Helper pour afficher le texte d'appréciation
  const getRatingText = (rating) => {
    if (rating === 1) return 'Très mauvaise expérience';
    if (rating === 2) return 'Expérience décevante';
    if (rating === 3) return 'Expérience correcte';
    if (rating === 4) return 'Bonne expérience';
    if (rating === 5) return 'Excellente expérience';
    return '';
  };

  // Composant étoile réutilisable
  const StarSection = ({
    label,
    rating,
    setRating,
    hovered,
    setHovered,
    id,
  }) => (
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-700 mb-3">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none transition-transform hover:scale-110"
            aria-label={`Donner ${star} étoile(s) pour ${label}`}
          >
            <Star
              className={`w-10 h-10 ${
                star <= (hovered || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {rating > 0 && getRatingText(rating)}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Évaluer la transaction</h1>
        </div>

        {/* Card principale */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Info sur la transaction */}
          <div className="mb-6 pb-6 border-b">
            <h2 className="text-lg font-semibold mb-2">
              Transaction avec {userToRate.username}
            </h2>
            <p className="text-gray-600">Produit : {order.product.title}</p>
            <p className="text-gray-600">Prix : {order.product.price} €</p>
          </div>

          {/* Systèmes d'étoiles */}
          <StarSection
            label="Qualité de la marchandise"
            rating={qualityRating}
            setRating={setQualityRating}
            hovered={qualityHover}
            setHovered={setQualityHover}
            id="quality"
          />
          <StarSection
            label="Respect des délais"
            rating={timelinessRating}
            setRating={setTimelinessRating}
            hovered={timelinessHover}
            setHovered={setTimelinessHover}
            id="timeliness"
          />
          <StarSection
            label="Convivialité"
            rating={friendlinessRating}
            setRating={setFriendlinessRating}
            hovered={friendlinessHover}
            setHovered={setFriendlinessHover}
            id="friendliness"
          />

          {/* Affichage de la moyenne */}
          <div className="mb-6">
            <p className="text-sm text-gray-700">
              Note globale :{' '}
              <span className="font-semibold">{averageRating} / 5</span>
            </p>
          </div>

          {/* Commentaire */}
          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Ajouter un commentaire (optionnel)
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={
                qualityRating === 0 ||
                timelinessRating === 0 ||
                friendlinessRating === 0 ||
                submitting
              }
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                qualityRating === 0 ||
                timelinessRating === 0 ||
                friendlinessRating === 0 ||
                submitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Send className="w-5 h-5" />
              {submitting ? 'Envoi en cours...' : "Envoyer l'évaluation"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>

        {/* Information supplémentaire */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Votre évaluation aide les autres utilisateurs à faire confiance à la
            communauté.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RateTransaction;