import React from "react";
import { Link } from "react-router";
import authService from "../services/AuthService";
import UserService from "../services/UserService";
import Navbar from "../components/common/navbar/Navbar";

const user = await UserService.getCurrentUser();

const Profile = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <img
            src="../assets/user.svg"
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
        </div>
      </div>

      <div className="p-4 grid grid-cols-3 gap-4">
        <Link to="/favorite" className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:bg-gray-200 transition">
          <span className="text-xl">❤️</span>
          <p className="text-sm">Favoris</p>
        </Link>

        <Link to="/wallet" className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:bg-gray-200 transition">
          <span className="text-xl">💳</span>
          <p className="text-sm">Wallet</p>
        </Link>

        <Link to="/my-order" className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:bg-gray-200 transition">
          <span className="text-xl">📦</span>
          <p className="text-sm">Commande</p>
        </Link>
      </div>

      <div className="bg-white p-4 shadow-md mt-4">
        <div className="space-y-4">
          <Link to="/account/profile" className="flex items-center space-x-2 border-b pb-2 hover:text-blue-500 transition">
            <span className="text-xl">👤</span>
            <p>Profil</p>
          </Link>

          <Link to="/my-ads" className="flex items-center space-x-2 border-b pb-2 hover:text-blue-500 transition">
            <span className="text-xl">📜</span>
            <p>Mes annonces</p>
          </Link>

          <Link to="/settings" className="flex items-center space-x-2 hover:text-blue-500 transition">
            <span className="text-xl">⚙️</span>
            <p>Paramètres</p>
          </Link>
        </div>
      </div>

      <div className="flex justify-center mt-auto mb-24">
        <button className="px-6 py-2 text-red-600 border border-red-600 rounded-full hover:bg-red-600 hover:text-white transition" onClick={authService.logout}>
          Déconnexion
        </button>
      </div>

      <Navbar />
    </div>
  );
};

export default Profile;
