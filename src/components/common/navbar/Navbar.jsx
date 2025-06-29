import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation(); 
  const navigate = useNavigate();
  const [value, setValue] = React.useState(location.pathname);

  const navItems = [
    { label: "Accueil", value: "/home", icon: Home },
    { label: "Parcourir", value: "/search", icon: Search },
    { label: "Publier", value: "/new-product", icon: Plus },
    { label: "Messages", value: "/chats", icon: MessageCircle },
    { label: "Profil", value: "/account", icon: User }
  ];

  const handleNavigation = (newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-1">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.value;
          const Icon = item.icon;
          
          return (
            <button
              key={item.value}
              onClick={() => handleNavigation(item.value)}
              className="flex flex-col items-center p-2 transition-colors duration-200"
            >
              <Icon 
                size={20} 
                className={`mb-1 transition-colors duration-200 ${
                  isActive ? 'text-green-500' : 'text-gray-400'
                }`}
              />
              <span className={`text-xs transition-colors duration-200 ${
                isActive ? 'text-green-500 font-medium' : 'text-gray-400'
              }`}>
                {item.label}
              </span>

              {isActive && (
                <div className="w-1 h-1 bg-green-500 rounded-full mt-1"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;