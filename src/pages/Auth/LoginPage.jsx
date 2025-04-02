// src/pages/Auth/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router";
import authService from "../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import "../../style/auth.css";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login(credentials);
      localStorage.setItem("token", res.token);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Une erreur est survenue lors de la connexion"
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await authService.googleLogin(credentialResponse.credential);
      localStorage.setItem("token", res.token);
      navigate("/home");
    } catch (error) {
      console.error("Erreur lors de la connexion Google", error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Error:", error);
  };

  return (
    <div className="login-wrapper">
      {/* Logo optionnel (même style que pour signup) */}
      <img
        src="/assets/logo_mealmates.png"
        alt="MealMates Logo"
        className="login-logo"
      />

      <div className="login-container">
        <h2>Connexion</h2>
        {error && <p className="error">{error}</p>}

        {/* Formulaire de connexion */}
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

        {/* Liens sous le formulaire */}
        <div className="login-links">
          <a href="/forgot-password">Mot de passe oublié ?</a>
          <p>
            Vous n’avez pas de compte ? <a href="/signup">Créez-en un</a>
          </p>
        </div>

        {/* Séparateur "Ou" */}
        <div className="separator">
          <hr />
          <span>Ou</span>
          <hr />
        </div>

        {/* Section SSO / Google */}
        <div className="sso-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
