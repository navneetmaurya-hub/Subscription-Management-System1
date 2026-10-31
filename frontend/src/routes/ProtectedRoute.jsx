import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <Spinner size="lg" className="h-screen" />;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

