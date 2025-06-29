import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import authService from "../../services/AuthService";
import UserService from "../../services/UserService";
import { User as UserIcon, Heart, CreditCard, Package, Settings, FileText, LogOut } from 'lucide-react';

const Profile = () => {
  type User = {
    id: number;
    email: string;
    username: string;
    roles: string[];
  };

  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await UserService.getCurrentUser();
      setUser(data);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gray-100">
        <div className="p-6 bg-white shadow-md">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-4"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        <div className="p-6 text-center text-gray-600">
          Chargement du profil...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header du profil */}
      <div className="p-6 bg-white shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Grille d'actions rapides */}
      <div className="p-4 grid grid-cols-3 gap-4">
        <Link
          to="/favorite"
          className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Heart className="w-6 h-6 text-red-500 mb-2" />
          <p className="text-sm text-gray-700">Favoris</p>
        </Link>

        <Link
          to="/wallet"
          className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <CreditCard className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-sm text-gray-700">Wallet</p>
        </Link>

        <Link
          to="/my-order"
          className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Package className="w-6 h-6 text-orange-500 mb-2" />
          <p className="text-sm text-gray-700">Commandes</p>
        </Link>
      </div>

      {/* Menu de navigation */}
      <div className="bg-white mx-4 rounded-lg shadow-sm overflow-hidden">
        <Link
          to="/account/profile"
          className="w-full flex items-center space-x-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <UserIcon className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Profil</span>
        </Link>

        <Link
          to="/my-ads"
          className="w-full flex items-center space-x-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Mes annonces</span>
        </Link>

        <Link
          to="/settings"
          className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Paramètres</span>
        </Link>
      </div>

      {/* Bouton de déconnexion */}
      <div className="flex justify-center mt-auto mb-6 px-4">
        <button
          onClick={authService.logout}
          className="flex items-center space-x-2 px-6 py-3 text-red-600 border border-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
