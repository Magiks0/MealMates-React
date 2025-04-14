import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function getFilteredProducts(filters) {
    return axios.get(`${API_URL}/products?${filters}`)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        console.error("Error fetching products:", err);
        return [];
    });
}

function getLastChanceProducts() {
    return axios.get(`${API_URL}/product/last-chance`)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        console.error("Error fetching last chance products:", err);
        return [];
    });
}

function getRecomendations() {
    return axios.get(`${API_URL}/product/recommendations`)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        console.error("Error fetching recommendations:", err);
        return [];
    });
}

function getRecentProducts() {
    return axios.get(`${API_URL}/product/recent`)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        console.error("Error fetching recent products:", err);
        return [];
    });
}


export default {
    getFilteredProducts,
    getLastChanceProducts,
    getRecentProducts,
    getRecomendations
  };
