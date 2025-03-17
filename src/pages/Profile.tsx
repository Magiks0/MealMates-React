import React from "react";
import { Link } from "react-router";
import { AiOutlineArrowLeft, AiFillStar } from "react-icons/ai";
import Navbar from "../components/common/navbar/Navbar";

const ProfilePage = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex items-center p-4 bg-white shadow">
        <Link to="/account" className="text-xl">
          <AiOutlineArrowLeft />
        </Link>
        <h1 className="text-lg font-semibold flex-1 text-center">Profil</h1>
      </div>

      <div className="flex flex-col items-center p-4">
        <div className="flex justify-around items-center w-90 mb-4">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-300 text-xl font-bold">
            T
            </div>
            <button className="mt-2 px-4 border border-green-500 text-green-500 rounded-full text-sm h-10">
            Ajoutez une photo
            </button>  
        </div>
        <p className="text-xs text-center text-gray-600 mt-2">
          Avec une photo de profil, vous avez de quoi personnaliser votre profil et rassurer les autres membres !
        </p>
      </div>

      <div className="px-4 space-y-3">
        <div>
          <label className="text-sm text-gray-600">Nom d'utilisateur</label>
          <input type="text" value="Tom" className="w-full p-2 border rounded-md mt-1" readOnly />
        </div>
        <div>
          <label className="text-sm text-gray-600">Adresse</label>
          <input type="text" value="19 rue Gaston Fontaine Oissery" className="w-full p-2 border rounded-md mt-1" readOnly />
        </div>
      </div>

      <div className="px-4 mt-4">
        <Link to="/reviews" className="flex justify-between items-center py-3 border-b">
          <div className="flex items-center space-x-2">
            <p className="text-sm">Avis</p>
            <div className="flex text-green-500">
              {[...Array(5)].map((_, i) => (
                <AiFillStar key={i} />
              ))}
            </div>
            <span className="text-xs text-gray-500">(12)</span>
          </div>
          <span className="text-gray-400">{">"}</span>
        </Link>
      </div>

      <div className="px-4 space-y-3 mt-2">
        <Link to="/account/availability" className="flex justify-between items-center py-3 border-b">
          <p className="text-sm">Mes disponibilités</p>
          <span className="text-gray-400">{">"}</span>
        </Link>
        <Link to="/account/preferences" className="flex justify-between items-center py-3">
          <p className="text-sm">Mes préférences alimentaires</p>
          <span className="text-gray-400">{">"}</span>
        </Link>
      </div>

      <Navbar />

    </div>
  );
};

export default ProfilePage;
