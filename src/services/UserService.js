import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = localStorage.getItem('token');

async function getCurrentUser() {
  try {
    const res = await axios.get(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching current user:", err);
    return null;
  }
}

export default {
    getCurrentUser,
}