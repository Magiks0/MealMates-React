import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = localStorage.getItem('token');

async function getCurrentUser() {
    return axios.get(`${API_URL}/user/profile`,  {
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
        }
    })
    .then(res => {
        return res.data;
    })
    .catch(err => {
        console.error("Error fetching current user:", err);
        return [];
    });
}

export default {
    getCurrentUser,
}