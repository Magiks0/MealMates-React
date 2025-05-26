import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'token';

const isTokenExpired = (token) => {
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
  return res.data;
}

async function login({ username, password }) {
  try {
    const res = await axios.post(`${API_URL}/login`, { username, password }, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (res.data.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
    }

    return res.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
}

async function googleLogin(token) {
  const res = await axios.post(`${API_URL}/google-login`, { token });
  
  if (res.data.token) {
    localStorage.setItem(TOKEN_KEY, res.data.token);
  }
  
  return res.data;
}

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = '/login';
};

export default {
  register,
  login,
  googleLogin,
  logout,
  isAuthenticated,
  getToken,
};
