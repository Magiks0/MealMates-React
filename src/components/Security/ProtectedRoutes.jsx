import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { isAuthenticated, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
