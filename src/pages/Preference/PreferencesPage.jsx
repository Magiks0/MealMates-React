import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import PreferencesService from '../../services/PreferencesService.js';


const PreferencesPage = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const [dietaries, userProfile] = await Promise.all([
        PreferencesService.getDietaries(),
        PreferencesService.getUserProfile()
      ]);
      
      setPreferences(dietaries);
      
      // Récupérer les préférences actuelles de l'utilisateur
      if (userProfile.dietaries) {
        const userDietaryIds = userProfile.dietaries.map(d => d.id);
        setSelectedPreferences(userDietaryIds);
      }
    } catch (err) {
      setError('Erreur lors du chargement des préférences');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (dietaryId) => {
    setSelectedPreferences(prev => {
      if (prev.includes(dietaryId)) {
        return prev.filter(id => id !== dietaryId);
      }
      return [...prev, dietaryId];
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await PreferencesService.updateDietaryPreferences(selectedPreferences);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getDietaryEmoji = (name) => {
    const emojiMap = {
      'Végétarien': '🥗',
      'Vegan': '🌱',
      'Sans gluten': '🌾',
      'Sans lactose': '🥛',
      'Halal': '🕌',
      'Casher': '✡️',
      'Bio': '🌿',
      'Paleo': '🥩',
      'Riche en protéines': '💪',
      'Faible en sucres': '🍬',
      'Sans sel ajouté': '🧂',
      'Sans allergènes': '🚫',
      'Diabétique': '💉',
      'Méditerranéen': '🫒',
      'Flexitarien': '🥗',
      'Crudivore': '🥒',
      'Hypocalorique': '🥤',
      'Alimentation sportive': '🏃'
    };
    return emojiMap[name] || '🍽️';
  };

  const getDietaryDescription = (name) => {
    const descriptions = {
      'Végétarien': 'Aucune viande ni poisson',
      'Vegan': 'Aucun produit d\'origine animale',
      'Sans gluten': 'Adapté aux personnes cœliaques',
      'Sans lactose': 'Sans produits laitiers',
      'Halal': 'Conforme aux principes islamiques',
      'Casher': 'Conforme aux lois alimentaires juives',
      'Bio': 'Produits issus de l\'agriculture biologique',
      'Paleo': 'Régime ancestral sans produits transformés',
      'Riche en protéines': 'Pour la construction musculaire',
      'Faible en sucres': 'Contrôle de la glycémie',
      'Sans sel ajouté': 'Pour une alimentation pauvre en sodium',
      'Sans allergènes': 'Sans les 14 allergènes majeurs',
      'Diabétique': 'Adapté aux personnes diabétiques',
      'Méditerranéen': 'Riche en fruits, légumes et huile d\'olive',
      'Flexitarien': 'Végétarien flexible',
      'Crudivore': 'Aliments crus uniquement',
      'Hypocalorique': 'Faible en calories',
      'Alimentation sportive': 'Optimisé pour les performances'
    };
    return descriptions[name] || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate('/account/profile')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Préférences alimentaires</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto">
        {/* Description */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Personnalisez votre expérience
          </h2>
          <p className="text-gray-600">
            Renseignez vos préférences et contraintes alimentaires pour recevoir des offres qui correspondent vraiment à vos besoins et envies.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4 flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>Préférences enregistrées avec succès</span>
          </div>
        )}

        {/* Preferences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {preferences.map((dietary) => {
            const isSelected = selectedPreferences.includes(dietary.id);
            return (
              <button
                key={dietary.id}
                onClick={() => handleToggle(dietary.id)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-green-500 bg-green-50 shadow-md transform scale-[1.02]' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getDietaryEmoji(dietary.name)}</span>
                  <div className="flex-1 text-left">
                    <h3 className={`font-medium ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>
                      {dietary.name}
                    </h3>
                    <p className={`text-sm mt-0.5 ${isSelected ? 'text-green-600' : 'text-gray-500'}`}>
                      {getDietaryDescription(dietary.name)}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Préférences sélectionnées</span>
            <span className="font-semibold text-green-600">
              {selectedPreferences.length} / {preferences.length}
            </span>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`
            w-full py-4 rounded-xl font-medium transition-all duration-200
            ${saving 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }
          `}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Enregistrement...
            </span>
          ) : (
            'Enregistrer mes préférences'
          )}
        </button>

        {/* Info */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Vous pourrez modifier vos préférences à tout moment
        </p>
      </div>
    </div>
  );
};

export default PreferencesPage;