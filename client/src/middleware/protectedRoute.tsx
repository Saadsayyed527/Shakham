import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const ProtectedRoute: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
