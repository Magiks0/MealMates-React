import React from 'react';
import { Routes, Route } from 'react-router';
import SignupPage from './pages/Auth/SignupPage';
import LoginPage from './pages/Auth/LoginPage';
import SSOLoginPage from './pages/Auth/SSOLoginPage';

export default function App() {
  return (
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/google" element={<SSOLoginPage />} />
      </Routes>
  );
}