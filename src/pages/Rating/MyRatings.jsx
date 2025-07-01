import { useState, useEffect } from 'react';
import { Star, User, Calendar, Package, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import RatingService from '../../services/RatingService';

const MyRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await RatingService.getMyRatings();
        setRatings(data);
        
        // Calculer la moyenne
        if (data.length > 0) {
          const sum = data.reduce((acc, rating) => acc + rating.score, 0);
          setAverageRating((sum / data.length).toFixed(1));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des évaluations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const renderStars = (score) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= score
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  console.log('Ratings:', ratings);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Mes évaluations</h1>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Note moyenne</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {averageRating || '—'}
                </span>
                {averageRating > 0 && (
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Nombre d'évaluations</p>
              <p className="text-3xl font-bold text-gray-900">{ratings.length}</p>
            </div>
           
          </div>
        </div>

        {/* Liste des évaluations */}
        {ratings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Vous n'avez pas encore reçu d'évaluation</p>
            <p className="text-gray-500 text-sm mt-2">
              Les évaluations apparaîtront ici après vos transactions
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{rating.reviewer.username}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(rating.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {rating.order.product.title}
                        </span>
                      </div>
                    </div>
                  </div>
                  {renderStars(rating.score)}
                </div>
                
                {rating.comment && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{rating.comment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRatings;