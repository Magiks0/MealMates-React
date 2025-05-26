import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import authService from "../../services/AuthService";
import "../../style/auth.css";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(credentials);
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
      // Appelle le service directement, car on doit stocker aussi le token
      const res = await authService.googleLogin(credentialResponse.credential);
      if (res.token) {
        localStorage.setItem("token", res.token);
        // Tu peux aussi envisager d'ajouter une fonction googleLogin dans ton AuthContext
        navigate("/home");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion Google", error);
      setError("Connexion Google échouée");
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Error:", error);
    setError("Connexion Google échouée");
  };

  return (
    <div className="login-wrapper">
      <img
        src="/assets/logo_mealmates.png"
        alt="MealMates Logo"
        className="login-logo"
      />

      <div className="login-container">
        <h2>Connexion</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={credentials.username}
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

        <div className="login-links">
          <a href="/forgot-password">Mot de passe oublié ?</a>
          <p>
            Vous n’avez pas de compte ? <a href="/signup">Créez-en un</a>
          </p>
        </div>

        <div className="separator">
          <hr />
          <span>Ou</span>
          <hr />
        </div>

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
