import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'token';

function getAuthHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const OrderService = {
  getOrderById(orderId) {
    return axios
      .get(`${API_URL}/orders/${orderId}`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  }, 

  getOrderByUserAndToken(userId, qrCodeToken) {
    return axios
      .get(`${API_URL}/orders/${userId}/${qrCodeToken}`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },

  confirmPickup(qrCodeToken) {
    return axios
      .get(
        `${API_URL}/order/validate-pickup/${qrCodeToken}`,
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      )
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
}

export default OrderService;