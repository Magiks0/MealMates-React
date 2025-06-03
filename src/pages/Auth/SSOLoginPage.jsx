// src/pages/Auth/SSOLoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router';
import authService from '../../services/AuthService';
import { GoogleLogin } from '@react-oauth/google';

const SSOLoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await authService.googleLogin(credentialResponse.credential);
      localStorage.setItem('token', res.token);
      navigate('/home');
    } catch (error) {
      console.error("Erreur lors de la connexion Google", error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Error:", error);
  };

  return (
    <div className="sso-container">
      <h2>Connexion avec Google</h2>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
      />
    </div>
  );
};

export default SSOLoginPage;
