import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  Authorization: `Bearer ${authService.getToken() ?? ''}`,
});

function getFilteredProducts(filters) {
  return axios
    .get(`${API_URL}/products?${filters}`, { headers: authHeaders() })
    .then(res => res.data)
    .catch(err => {
      console.error('Error fetching products:', err);
      return [];
    });
}

function getLastChanceProducts() {
  return axios
    .get(`${API_URL}/product/last-chance`, { headers: authHeaders() })
    .then(res => res.data)
    .catch(err => {
      console.error('Error fetching last chance products:', err);
      return [];
    });
}

function getRecomendations() {
  return axios
    .get(`${API_URL}/product/recommendations`, { headers: authHeaders() })
    .then(res => res.data)
    .catch(err => {
      console.error('Error fetching recommendations:', err);
      return [];
    });
}

function getRecentProducts() {
  return axios
    .get(`${API_URL}/product/recent`, { headers: authHeaders() })
    .then(res => res.data)
    .catch(err => {
      console.error('Error fetching recent products:', err);
      return [];
    });
}

export async function createProduct(formData) {
  try {
    const res = await axios.post(`${API_URL}/product/new`, formData, {
      headers: {
        ...authHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

function getSavedSearches() {
  return axios
    .get(`${API_URL}/saved-searches`, { headers: authHeaders() })
    .then(res => res.data)
    .catch(err => {
      console.error('Error fetching saved searches:', err);
      return [];
    });
}

function createSavedSearch(payload) {
  return axios
    .post(`${API_URL}/saved-searches`, payload, {
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    })
    .then(res => res.data)
    .catch(err => {
      console.error('Error creating saved search:', err);
      throw err;
    });
}

function deleteSavedSearch(id) {
  return axios
    .delete(`${API_URL}/saved-searches/${id}`, { headers: authHeaders() })
    .then(() => true)
    .catch(err => {
      console.error('Error deleting saved search:', err);
      return false;
    });
}

export default {
  getFilteredProducts,
  getLastChanceProducts,
  getRecentProducts,
  getRecomendations,
  createProduct,
  getSavedSearches,
  createSavedSearch,
  deleteSavedSearch,
};
