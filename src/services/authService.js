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
  if(isTokenExpired(localStorage.getItem(TOKEN_KEY))) {
    localStorage.removeItem(TOKEN_KEY);
    return false;
  }

  return localStorage.getItem(TOKEN_KEY) !== null;
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
  const res = await axios.post(`${API_URL}/login`, { username, password }, {
    headers: {
      "Content-Type": "application/json",
    }
  });
  
  if (res.data.token) {
    localStorage.setItem(TOKEN_KEY, res.data.token);
  }
  
  return res.data;
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
  getToken
};