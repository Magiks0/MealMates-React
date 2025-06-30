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
}

export default UserService;