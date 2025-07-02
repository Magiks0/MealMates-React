import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'token';

function getAuthHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const FavoriteService = {
  getFavorites() {
    return axios
      .get(`${API_URL}/favorites`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Erreur getFavorites :', err);
        throw err;
      });
  },

  toggleFavorite(productId) {
    return axios
      .get(`${API_URL}/favorites/${productId}`, {}, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Erreur toggleFavorite :', err);
        throw err;
      });
  },

  checkFavorite(productId) {
    return axios
      .get(`${API_URL}/favorites/check/${productId}`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Erreur checkFavorite :', err);
        throw err;
      });
  },
};

export default FavoriteService;