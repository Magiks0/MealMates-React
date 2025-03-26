// src/pages/Auth/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import authService from '../../services/authService';
import '../../style/auth.css'; // Fichier de style modifié

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const { email, password } = formData;
      await authService.register({ email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de l\'inscription');
    }
  };

  return (
    <div className="signup-wrapper">
      {/* Optionnel : logo ou nom du produit */}
      <img
        src="/public/assets/logo_mealmates.png"
        alt="MealMates Logo"
        className="signup-logo"
      />
      
      <div className="signup-container">
        <h2>Inscription</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Saisir une adresse mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Saisir un mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">S’inscrire</button>
        </form>
        <p className="login-link">
          Vous avez déjà un compte ? <a href="/login">Connectez-vous</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
