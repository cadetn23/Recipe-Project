import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from './authToken';

const AuthRoute = () => {
  // Check if the user is authenticated by verifying token
  const isAuthenticated = !!getToken();

 // If the user is authenticated, remder protected route
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthRoute;