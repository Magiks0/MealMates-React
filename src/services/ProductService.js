import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'token';

function getAuthHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const ProductService = {
  getFilteredProducts(filters) {
    return axios
      .get(`${API_URL}/products?${filters}`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Erreur getFilteredProducts :', err);
        throw err;
      });
  },

  getLastChanceProducts() {
    return axios
      .get(`${API_URL}/product/last-chance`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Erreur getLastChanceProducts :', err);
        throw err;
      });
  },

  getRecentProducts() {
    return axios
      .get(`${API_URL}/product/recent`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Erreur getRecentProducts :', err);
        throw err;
      });
  },

    getProductById(productId) {
      return axios
      .get(`${API_URL}/products/${productId}`, {
          headers: {
            ...getAuthHeaders(),
          },
      })
      .then((res) => res.data)
      .catch((err) => {
          console.error('Erreur getProductById :', err);
          throw err;
      });
    },

    goToCheckout(productId) {
    return axios
        .post(
            `${API_URL}/stripe/checkout/${productId}`, {},
            {
              headers: {
                  ...getAuthHeaders(),
              },
            }
        )
        .then((res) => res.data)
        .catch((err) => {
            console.error('Checkout error', err);
            throw err;
        });
    },

    createProduct(formData) {
    return axios
      .post(`${API_URL}/product/new`, formData, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error('Erreur createProduct :', error.message);
        throw error;
      });
  },
};

export default ProductService;
