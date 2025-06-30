import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const listSavedSearches = async () => {
    const res = await axios.get(`${API_URL}/saved-searches`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

export const saveSearch = async (name, criteria) => {
    const res = await axios.post(
        `${API_URL}/saved-searches`,
        { name, criteria },
        {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
        },
    );
    return res.data;
};

export const deleteSavedSearch = async (id) => {
    await axios.delete(`${API_URL}/saved-searches/${id}`, {
        headers: getAuthHeaders(),
    });
};