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

const DashBoardService = {
 getDietaries() {
   return axios.get(`${API_URL}/dietaries`, {
     headers: {
       ...getAuthHeaders(),
     },
   }).then((res) => res.data)
     .catch((err) => {  
      throw new Error(err.response?.data?.message || "Erreur fetch dietaries");
    })
 },

 getTypes() {
   return axios.get(`${API_URL}/types`, {
     headers: {
       ...getAuthHeaders(),
     },
   }).then((res) => res.data)
     .catch((err) => {
      throw new Error(err.response?.data?.message || "Erreur fetch types");
    })
 }
};

export default DashBoardService;
