import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

export const PrivateRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader full />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader full />;
  if (!user) return <Navigate to="/login" replace />;
  return user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};
