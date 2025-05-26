import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${authService.getToken()}`,
    'Content-Type': 'application/json',
});

const getMyNotifications = async () => {
    try {
        const response = await axios.get(`${API_URL}/notifications`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return { notifications: [], unreadCount: 0 };
    }
};

const getUnreadCount = async () => {
    try {
        const response = await axios.get(`${API_URL}/notifications/count`, {
            headers: getAuthHeaders(),
        });
        return response.data.unreadCount;
    } catch (error) {
        console.error("Error fetching unread count:", error);
        return 0;
    }
};

const markAsRead = async (notificationId) => {
    try {
        const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

const markAllAsRead = async () => {
    try {
        const response = await axios.put(`${API_URL}/notifications/mark-all-read`, {}, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
    }
};

export default {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
};