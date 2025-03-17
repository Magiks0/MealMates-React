import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./index.css";
import App from "./App.jsx";
import Welcome from "./pages/Welcome.jsx"; 
import Account from "./pages/Account.jsx"; 
import Profile from "./pages/Profile.jsx"; 
import Preference from "./pages/Preference.jsx"; 
import Availability from "./pages/availability.jsx"; 

const root = document.getElementById("root");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Welcome />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/profile" element={<Profile />} />
        <Route path="/account/preferences" element={<Preference />} />
        <Route path="/account/availability" element={<Availability />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
