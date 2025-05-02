// src/components/ProtectedRouteSuper.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteSuperProps {
  children: React.ReactNode;
}

const ProtectedRouteSuper: React.FC<ProtectedRouteSuperProps> = ({ children }) => {
  const { user, loading } = useAuth(); // Get loading from context

  if (loading) {
    return <div>Loading...</div>; // You can show a loading message, or null
  }

  if (!user || user.role !== 'superadmin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};


export default ProtectedRouteSuper;
