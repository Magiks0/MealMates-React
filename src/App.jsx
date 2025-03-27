import React from 'react';
import { Routes, Route } from 'react-router';
import SignupPage from './pages/Auth/SignupPage';
import LoginPage from './pages/Auth/LoginPage';
import SSOLoginPage from './pages/Auth/SSOLoginPage';
import LandingPage from './pages/LandingPage';
import Welcome from "./pages/Welcome.jsx"; 
import Account from "./pages/Account.jsx"; 
import Profile from "./pages/Profile.jsx"; 
import Preference from "./pages/Preference.jsx"; 
import Availability from "./pages/availability.jsx"; 
import "./index.css";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/google" element={<SSOLoginPage />} />
        <Route path="/home" element={<Welcome />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/profile" element={<Profile />} />
        <Route path="/account/preferences" element={<Preference />} />
        <Route path="/account/availability" element={<Availability />} />
      </Routes>
  );
}
