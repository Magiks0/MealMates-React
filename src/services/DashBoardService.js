import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const getDietaries = async () => {
  try {
    const response = await axios.get(`${API_URL}/dietaries`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erreur fetch dietaries");
  }
};

export const getTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/types`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erreur fetch types");
  }
};