import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = () => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
      const { isLoggedIn } = JSON.parse(adminAuth);
      return isLoggedIn;
    }
    return false;
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;