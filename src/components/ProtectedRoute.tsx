import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import React, { ReactNode } from 'react';

export const ProtectedRoute = ({ children} : {children: ReactNode}) => {
    const {isAuthenticated, hasActiveSubscription} = useAuthContext();

    if (!isAuthenticated) {
        // If not logged in, go to /login
        return <Navigate to="/login" replace />;
    }

    if (!hasActiveSubscription) {
        // If logged in but no active subscription, go to /subscribe
        return <Navigate to="/subscribe" replace />;
    }

    return children;
}