import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Récupère le token d'authentification
 * @returns {string} Le token JWT stocké
 */
const getToken = () => {
  return localStorage.getItem('token') || authService.getToken();
};

/**
 * Récupère les produits filtrés selon différents critères
 * @param {string|object} filters - Filtres à appliquer (chaîne de requête ou objet)
 * @returns {Promise<Array>} Liste des produits
 */
function getFilteredProducts(filters = '') {
  // Si filters est un objet, le convertir en chaîne de requête
  let queryParams = filters;
  if (typeof filters === 'object') {
    queryParams = new URLSearchParams(filters).toString();
  }
  
  const url = queryParams ? `${API_URL}/products?${queryParams}` : `${API_URL}/products`;
  
  return axios.get(url, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  })
  .then(res => {
    return res.data;
  })
  .catch(err => {
    console.error("Error fetching products:", err);
    return [];
  });
}

/**
 * Récupère les produits à proximité d'un point géographique dans un rayon donné
 * @param {number} latitude - Latitude du point central
 * @param {number} longitude - Longitude du point central
 * @param {number} radius - Rayon de recherche en km (par défaut: 10)
 * @returns {Promise<Array>} Liste des produits à proximité
 */
function getNearbyProducts(latitude, longitude, radius = 10) {
  // On utilise directement l'endpoint products avec les paramètres de géolocalisation
  // Cette approche est plus simple et utilise notre méthode rectangulaire pour le filtrage
  return getFilteredProducts(`latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
}

/**
 * Récupère les produits qui expirent bientôt (dernière chance)
 */
function getLastChanceProducts() {
  return axios.get(`${API_URL}/product/last-chance`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  })
  .then(res => {
    return res.data;
  })
  .catch(err => {
    console.error("Error fetching last chance products:", err);
    return [];
  });
}

/**
 * Récupère les recommandations de produits pour l'utilisateur
 */
function getRecomendations() {
  return axios.get(`${API_URL}/product/recommendations`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  })
  .then(res => {
    return res.data;
  })
  .catch(err => {
    console.error("Error fetching recommendations:", err);
    return [];
  });
}

/**
 * Récupère les produits récemment ajoutés
 */
function getRecentProducts() {
  return axios.get(`${API_URL}/product/recent`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  })
  .then(res => {
    return res.data;
  })
  .catch(err => {
    console.error("Error fetching recent products:", err);
    return [];
  });
}

/**
 * Récupère un produit par son ID
 * @param {number} id - ID du produit
 */
function getProductById(id) {
  return axios.get(`${API_URL}/product/${id}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  })
  .then(res => {
    return res.data;
  })
  .catch(err => {
    console.error(`Error fetching product with ID ${id}:`, err);
    throw err;
  });
}

/**
 * Crée un nouveau produit
 * @param {FormData} formData - Données du produit à créer
 */
async function createProduct(formData) {
  try {
    const res = await axios.post(`${API_URL}/product/new`, formData, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    return res;
  } catch (error) {
    console.error("Error in creating product:", error);
    throw error;
  }
}

export default {
  getFilteredProducts,
  getNearbyProducts,
  getLastChanceProducts,
  getRecentProducts,
  getRecomendations,
  getProductById,
  createProduct,
};