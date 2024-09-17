import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from './utils/authToken';

const AuthRoute = () => {
  // Check if the user is authenticated by verifying if a token exists
  const isAuthenticated = !!getToken();

 // If the user is authenticated, render the protected route
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthRoute;