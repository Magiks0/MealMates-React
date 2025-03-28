// src/services/authService.js
import axios from 'axios';

const API_URL = 'https://groupe-3.lycee-stvincent.net:82/';

async function register({ email, password }) {
  const res = await axios.post(`${API_URL}/register`, { email, password });
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
