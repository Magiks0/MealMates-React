import React, { useState, useEffect } from "react";
import authService from "../../services/AuthService";
import { useNavigate } from "react-router";
import UserService from "../../services/UserService";
import {
  ArrowLeft, Star, ChevronRight, Camera, User,
  Mail, Calendar, Utensils, MapPin, Check, X
} from 'lucide-react';
import RatingService from "../../services/RatingService";

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
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await UserService.getCurrentUser();
        setUser(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          address: data.address || ""
        });
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      }
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim() || !formData.address.trim()) {
      setSaveStatus('error');
      setErrorMessage("Tous les champs doivent être remplis");
      return;
    }

    setSaveStatus('saving');
    setErrorMessage("");

    try {
      await UserService.updateUser(formData);
      const updatedUser = await UserService.getCurrentUser();
      setUser(updatedUser);
      setSaveStatus('success');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
      navigate("/login");
    } catch (error: any) {
      setSaveStatus('error');
      setErrorMessage(error?.response?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        address: user.address || ""
      });
    }
    setIsEditing(false);
    setSaveStatus('idle');
    setErrorMessage("");
  };

  if (!user) return <div className="p-4 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center shadow-sm">
        <button className="p-2 -ml-2 text-gray-600" onClick={() => navigate("/account")}>
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
                {user?.username[0]?.toUpperCase()}
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

      <form onSubmit={handleSubmit} className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Informations</h3>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-green-600 text-sm font-medium hover:text-green-700"
            >
              Modifier
            </button>
          )}
        </div>

        {saveStatus === 'success' && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
            <Check size={20} className="mr-2" />
            Profil mis à jour avec succès !
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
            <X size={20} className="mr-2" />
            {errorMessage || "Erreur lors de la mise à jour"}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <User size={16} className="mr-2 text-gray-500" />
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-0 rounded-xl text-gray-800 transition-all ${
                isEditing 
                  ? 'bg-white ring-2 ring-green-500 focus:ring-green-600' 
                  : 'bg-gray-50 cursor-not-allowed'
              }`}
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
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-0 rounded-xl text-gray-800 transition-all ${
                isEditing 
                  ? 'bg-white ring-2 ring-green-500 focus:ring-green-600' 
                  : 'bg-gray-50 cursor-not-allowed'
              }`}
              placeholder="Votre adresse email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin size={16} className="mr-2 text-gray-500" />
              Adresse
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-0 rounded-xl text-gray-800 transition-all ${
                isEditing 
                  ? 'bg-white ring-2 ring-green-500 focus:ring-green-600' 
                  : 'bg-gray-50 cursor-not-allowed'
              }`}
              placeholder="Votre adresse"
            />
          </div>
        </div>

        {isEditing ? (
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={saveStatus === 'saving'}
              className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveStatus === 'saving' ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
          </div>
        ) : (
          <button 
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full mt-6 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            Modifier mes informations
          </button>
        )}
      </form>

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
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="bg-white mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden">
        <button
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
          onClick={() => navigate("/account/availability")}
        >
          <div className="flex items-center space-x-3">
            <Calendar size={20} className="text-green-500" />
            <span className="text-base font-medium text-gray-800">Mes disponibilités</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
        <button
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          onClick={() => navigate("/account/preferences")}
        >
          <div className="flex items-center space-x-3">
            <Utensils size={20} className="text-green-500" />
            <span className="text-base font-medium text-gray-800">Mes préférences alimentaires</span>
          </div>
        </button>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
};

export default Profile;