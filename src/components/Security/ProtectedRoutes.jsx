import React from 'react';
import { Navigate, Outlet } from 'react-router';
import authService from '../../services/AuthService';

export default function ProtectedRoute() {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
