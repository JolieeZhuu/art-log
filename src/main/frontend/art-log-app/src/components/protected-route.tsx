// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();
    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
    
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};