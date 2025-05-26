import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import NotificationService from '../../services/notificationService';

const NotificationBell = ({ onClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    
    // Actualiser le compteur toutes les 2 minutes
    const interval = setInterval(fetchUnreadCount, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleClick = () => {
    onClick();
    // Actualiser le compteur après ouverture
    setTimeout(fetchUnreadCount, 500);
  };

  return (
    <button 
      onClick={handleClick}
      className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      aria-label="Notifications"
    >
      <Bell className="w-6 h-6" />
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;