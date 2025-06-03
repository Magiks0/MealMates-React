// src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

<<<<<<< Updated upstream
async function register({ email, password }) {
  const res = await axios.post(`${API_URL}/register`, { email, password });
=======
const isTokenExpired = (token) => {
  if (!token) return true;
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return false;

  try {
    if (isTokenExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Token is invalid:", e);
    localStorage.removeItem(TOKEN_KEY);
    return false;
  }
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

async function register({ username, email, password }) {
  const res = await axios.post(`${API_URL}/register`, { username, email, password }, {
    headers: {
      "Content-Type": "application/json",
    }
  });
>>>>>>> Stashed changes
  return res.data;
}

async function login({ email, password }) {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
}

async function googleLogin(token) {
  const res = await axios.post(`${API_URL}/google-login`, { token });
  return res.data;
}

export default {
  register,
  login,
  googleLogin
};
