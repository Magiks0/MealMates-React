// src/pages/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import authService from '../../services/authService';
import { GoogleLogin } from '@react-oauth/google';
import '../../style/auth.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login(credentials);
      localStorage.setItem('token', res.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la connexion');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await authService.googleLogin(credentialResponse.credential);
      localStorage.setItem('token', res.token);
      navigate('/profile');
    } catch (error) {
      console.error("Erreur lors de la connexion Google", error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Error:", error);
  };

  return (
    <div className="form-container">
      <h2>Connexion</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      <div className="sso-login">
        <p>Ou connectez-vous avec :</p>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />
      </div>
    </div>
  );
};

export default LoginPage;
