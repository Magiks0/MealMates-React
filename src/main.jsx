import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "leaflet/dist/leaflet.css";

const root = document.getElementById("root");

import './index.css';
import App from './App.jsx';

const clientId = "250667347883-jfvc59oo852pnfmd2kvop01ecruem9s1.apps.googleusercontent.com";

createRoot(root).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
