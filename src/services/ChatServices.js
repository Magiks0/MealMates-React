import AuthService from "./AuthService";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function getBearerToken() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const ChatService = {
  createChatWithMessage({ productId, message, userId }) {
    return axios
    .post(`${API_URL}/chats/new/${userId}`, {
      userId,
      productId,
      message,
    }, 
    {
      headers: {
        ...getBearerToken(),
      }
    }).then((res) => {return  res.data.id}
    ).catch((err) => {
      console.error('Erreur lors de la création du chat avec message:', err);
      throw err;
    });
  },
  
  getChats() {
    return axios.get(`${API_URL}/chats`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...getBearerToken(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Erreur lors de la récupération des chats:', err);
        throw err;
      });
    },
  

  getChatByID(chatId) {
    return axios.get(`${API_URL}/chats/${chatId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...getBearerToken(),
      },
    })
      .then((res) => {return res.data;})
      .catch((err) => {
        console.error(`Erreur lors de la récupération du chat ${chatId}:`, err);
        throw err;
      });
  },

  getMessages(chatId, afterId = null) {
    return axios.get(`${API_URL}/chats/${chatId}/messages`, {
      params: { after_id: afterId },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...getBearerToken(),
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        console.error(`Erreur lors de la récupération des messages du chat ${chatId}:`, err);
        throw err;
      });
  },

  sendMessage : async (chatId, content) => {
    try {
      const response = await axios.post(
        `${API_URL}/chats/${chatId}/message/new`,
        { content },
        {
          headers: {
            'Content-Type': 'application/json',
            ...getBearerToken(),
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
        ...getBearerToken(),
      },
    });
    return res.data;
  },

  getChatByProductIdAndUsers: async (buyerId, sellerId, productId) => {
   return axios
    .get(`${API_URL}/chats/${buyerId}/${sellerId}/${productId}`, {
        headers: {
          ...getBearerToken(),
        },
      })
    .then((res) => res.data)
    .catch((err) => {
      console.error(`Erreur lors de la récupération du chat:`, err);
      throw err;
    });
  },
};

export default ChatService;