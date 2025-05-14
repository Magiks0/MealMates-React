import React from 'react';
import { Navigate, Outlet } from 'react-router';
import AuthService from '../../services/AuthService';

export default function ProtectedRoute() {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
