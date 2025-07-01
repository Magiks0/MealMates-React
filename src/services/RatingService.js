import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'token';

function getAuthHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const RatingService = {
  createRating(reviewedId, orderId, score, comment) {
    return axios
      .post(
        `${API_URL}/ratings`,
        {
          reviewedId,
          orderId,
          score,
          comment
        },
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      )
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error creating rating:', err);
        throw err;
      });
  },

  checkIfRated(orderId) {
    return axios
      .get(`${API_URL}/ratings/check/${orderId}`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data.rated)
      .catch((err) => {
        console.error('Error checking rating:', err);
        throw err;
      });
  },

  getUserRatings(userId) {
    return axios
      .get(`${API_URL}/users/${userId}/ratings`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error fetching user ratings:', err);
        throw err;
      });
  },

  getMyRatings() {
    return axios
      .get(`${API_URL}/my-ratings`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error fetching my ratings:', err);
        throw err;
      });
  }
};

export default RatingService;