import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";

const root = document.getElementById("root");

import "./index.css";
import App from "./App.jsx";

const clientId =
  "250667347883-jfvc59oo852pnfmd2kvop01ecruem9s1.apps.googleusercontent.com";

createRoot(root).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
