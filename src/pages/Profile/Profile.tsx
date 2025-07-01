import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, User, Mail, Star } from "lucide-react";
import authService from "../../services/AuthService";
import UserService from "../../services/UserService";
import RatingService from "../../services/RatingService";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const Profile = () => {
  type User = {
    id: number;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    roles: string[];
  };

  const [user, setUser] = useState<User>();
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingsCount, setRatingsCount] = useState<number>(0);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await UserService.getCurrentUser();
      setUser(data);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoadingRatings(true);
        const ratings = await RatingService.getMyRatings();
        
        if (ratings.length > 0) {
          const sum = ratings.reduce((acc: number, rating: any) => acc + rating.score, 0);
          const avg = sum / ratings.length;
          setAverageRating(Number(avg.toFixed(1)));
          setRatingsCount(ratings.length);
        } else {
          setAverageRating(0);
          setRatingsCount(0);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des évaluations:', error);
        setAverageRating(0);
        setRatingsCount(0);
      } finally {
        setLoadingRatings(false);
      }
    };

    fetchRatings();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={16} 
            className={star <= Math.round(rating) ? "fill-current" : ""}
          />
        ))}
      </div>
    );
  };

  const form = useForm({
    defaultValues: {
      username: user?.username ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      address: user?.address ?? "",
    },
    validators: {
      onChange: z.object({
        username: z.string().min(1, "Username is required"),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Email invalide"),
        address: z.string().min(1, "Adresse requise"),
      }),
    },
  });

  if (!user) return <div className="p-4 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center shadow-sm">
        <button className="p-2 -ml-2 text-gray-600" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 flex-1 text-center mr-10">
          Profil
        </h1>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-green-700">
                {user?.username[0]}
              </span>
            </div>
            <button className="absolute -bottom-1 -right-1 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors">
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {user?.username}
            </h2>
            <button className="px-4 py-2 border border-green-500 text-green-600 rounded-full text-sm font-medium hover:bg-green-50 transition-colors">
              Ajoutez une photo
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4 leading-relaxed">
          Avec une photo de profil, vous avez de quoi personnaliser votre profil et rassurer les autres membres !
        </p>
      </div>

      {/* User Information */}
      <div className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <User size={16} className="mr-2 text-gray-500" />
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={user?.username}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              placeholder="Votre nom d'utilisateur"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Mail size={16} className="mr-2 text-gray-500" />
              Email
            </label>
            <input
              type="email"
              value={user?.email}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              placeholder="Votre adresse email"
            />
          </div>
        </div>

        <button className="w-full mt-6 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors">
          Sauvegarder
        </button>
      </div>

      {/* Reviews Section */}
      <div className="bg-white mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden">
        <button
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          onClick={() => navigate("/my-ratings")}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-base font-medium text-gray-800">Avis</span>
              {loadingRatings ? (
                <div className="flex text-gray-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} />
                  ))}
                </div>
              ) : (
                renderStars(averageRating)
              )}
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {loadingRatings ? "..." : (averageRating > 0 ? averageRating : "Aucun avis")}
              </span>
              {ratingsCount > 0 && (
                <span className="text-xs text-gray-400">
                  ({ratingsCount} avis)
                </span>
              )}
            </div>
          </div>
          <div className="text-gray-400">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 12l4-4-4-4v8z"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Profile;