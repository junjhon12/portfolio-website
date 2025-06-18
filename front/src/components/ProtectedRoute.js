// front/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // If the user is not authenticated, redirect them to the login page
        return <Navigate to="/login" replace />;
    }

    // If the user is authenticated, render the child components
    return children;
}

export default ProtectedRoute;