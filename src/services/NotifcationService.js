class NotificationService {
  constructor(apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api') {
    this.apiUrl = apiUrl;
  }

  // Obtenir le token d'authentification
  getAuthToken() {
    // Adaptez selon votre système d'authentification
    return localStorage.getItem('token') || '';
  }

  // Headers par défaut pour toutes les requêtes
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.getAuthToken()}`,
      'Content-Type': 'application/json'
    };
  }

  // Récupérer toutes les notifications
  async getNotifications() {
    try {
      const response = await fetch(`${this.apiUrl}/notifications`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Récupérer uniquement les notifications non lues
  async getUnreadNotifications() {
    try {
      const response = await fetch(`${this.apiUrl}/notifications/unread`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  }

  // Compter les notifications non lues
  async getUnreadCount() {
    try {
      const response = await fetch(`${this.apiUrl}/notifications/count`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId) {
    try {
      const response = await fetch(`${this.apiUrl}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead() {
    try {
      const response = await fetch(`${this.apiUrl}/notifications/read-all`, {
        method: 'PUT',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }

  // Supprimer une notification
  async deleteNotification(notificationId) {
    try {
      const response = await fetch(`${this.apiUrl}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Supprimer toutes les notifications lues
  async clearReadNotifications() {
    try {
      const response = await fetch(`${this.apiUrl}/notifications/clear-read`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error clearing read notifications:', error);
      throw error;
    }
  }
}

// Export en singleton
const notificationService = new NotificationService();
export default notificationService;