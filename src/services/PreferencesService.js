import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const PreferencesService = {
  // Récupérer toutes les préférences alimentaires disponibles
  getDietaries() {
    return axios
      .get(`${API_URL}/dietaries`, {
        headers: { ...getAuthHeaders() }
      })
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.response?.data?.message || 'Erreur lors de la récupération des préférences');
      });
  },

  // Récupérer le profil utilisateur avec ses préférences actuelles
  getUserProfile() {
    return axios
      .get(`${API_URL}/user/profile`, {
        headers: { ...getAuthHeaders() }
      })
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.response?.data?.message || 'Erreur lors de la récupération du profil');
      });
  },

  // Mettre à jour les préférences alimentaires de l'utilisateur
  updateDietaryPreferences(dietaryIds) {
    return axios
      .put(`${API_URL}/users/dietary-preferences`, 
        { dietaryIds },
        { headers: { ...getAuthHeaders() } }
      )
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.response?.data?.message || 'Erreur lors de la mise à jour des préférences');
      });
  }
};

export default PreferencesService;