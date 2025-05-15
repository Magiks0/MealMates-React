import axios from 'axios';
import authService from './AuthService';

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = authService.getToken();

function getFilteredProducts(filters) {
    return axios.get(`${API_URL}/products?${filters}`, {
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
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

function getProducts() {
    return axios.get(`${API_URL}/products`,  {
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
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

function getProductsByDistance(latitude, longitude, radius = 10) {
    return axios.get(`${API_URL}/products/search`, {
        params: {
            latitude,
            longitude,
            radius
        },
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
        }
    })
    .then(res => {
        return res.data;
    })
    .catch(err => {
        console.error("Error fetching products by distance:", err);
        return [];
    });
}

function getLastChanceProducts() {
    return axios.get(`${API_URL}/product/last-chance`,  {
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
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

function getRecomendations() {
    return axios.get(`${API_URL}/product/recommendations`,  {
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
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

function getRecentProducts() {
    return axios.get(`${API_URL}/product/recent`,  {
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
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

export async function createProduct(formData) {
    const token = localStorage.getItem('token');
    
    try {
        const res = await axios.post(`${API_URL}/product/new`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return res;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export default {
    getProducts,
    getLastChanceProducts,
    getFilteredProducts,
    getRecentProducts,
    getRecomendations,
    createProduct,
    getProductsByDistance
};