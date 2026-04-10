import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Wait until localStorage auth state has been read — prevents false redirect on refresh
    if (isLoading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/app/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
