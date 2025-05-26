import authService from "./AuthService";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = authService.getToken();

export const chatService = {
  createChatWithMessage: async ({ productId, message, userId }) => {
    const res = await axios.post(`${API_URL}/chats/new/${userId}`, {
      userId,
      productId,
      message,
    }, 
    {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
      }
    });

    return { chatId: res.data.id };
  },
  

  getChats: async () => {
    try {
      const response = await fetch(`${API_URL}/chats`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des chats:', error);
      throw error;
    }
  },

  /**
   * Récupérer un chat spécifique par ID
   */
  getChat: async (chatId) => {
    try {
      const response = await fetch(`${API_URL}/chats/${chatId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la récupération du chat ${chatId}:`, error);
      throw error;
    }
  },

  /**
   * Récupérer les messages d'un chat après un certain ID
   */
  getMessages: async (chatId, afterId = null) => {
    try {
      let url = `${API_URL}/chats/${chatId}/messages`;
      if (afterId) {
        url += `?after_id=${afterId}`;
      }

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la récupération des messages:`, error);
      throw error;
    }
  },

  sendMessage : async (chatId, content) => {
    try {
      const response = await axios.post(
        `${API_URL}/chats/${chatId}/message/new`,
        { content },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'envoi du message:`, error);
      throw error;
    }
  },

  checkChatExistence: async (userId, productId) => {
    const res = await axios.get(`${API_URL}/chat/check-existence`, {
      params: { userId, productId },
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
      },
    });
    return res.data;
  },

  createChat: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/chats/new/${userId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la création de la conversation:`, error);
      throw error;
    }
  }
  
};

export default chatService;