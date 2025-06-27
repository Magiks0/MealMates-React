import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'token';

function getAuthHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const PurchaseService = {
  getPurchaseById(purchaseId) {
    return axios
      .get(`${API_URL}/orders/${purchaseId}`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Erreur getPurchaseById :', err);
        throw err;
      });
  },

  getMyPurchases() {
    return axios
      .get(`${API_URL}/my-orders`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Erreur getMyPurchases :', err);
        throw err;
      });
  },
}

export default PurchaseService;