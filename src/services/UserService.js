import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const UserService = {
  getCurrentUser() {
    return axios
      .get(`${API_URL}/user/profile`, {
        headers: {
          ...getAuthHeaders(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error fetching current user:", err);
        throw err;
      });
  },

  updateUser(data) {
    return axios
    .put(`${API_URL}/users/update`, data, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
      throw err;
    });
  },

  getAvailabilities() {
    return axios
      .get(`${API_URL}/availabilities`, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Erreur lors du chargement des disponibilités :", err);
        throw err;
      });
  },

  updateAvailabilities(data) {
    return axios
      .put(`${API_URL}/availabilities/update`, data, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Erreur lors de la mise à jour des disponibilités :", err);
        throw err;
      });
  },

}

export default UserService;