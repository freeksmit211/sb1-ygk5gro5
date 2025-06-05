import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRoles }) => {
  const { user, loading, refreshAuth } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    // Try to refresh auth when accessing protected routes
    if (!loading && !user) {
      refreshAuth();
    }
  }, [loading, user, refreshAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    // Save the attempted URL for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires specific roles
  if (requiredRoles) {
    const hasRequiredRole = requiredRoles.includes(user.role) || user.role === 'superAdmin';
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  // Special handling for management routes
  if (location.pathname.startsWith('/management')) {
    const hasManagementAccess = 
      user.role === 'superAdmin' || 
      user.role === 'management' || 
      user.allowed_pages?.includes('/management');

    if (!hasManagementAccess) {
      return <Navigate to="/" replace />;
    }
  }

  // For other routes, check allowed_pages
  if (user.allowed_pages && !user.allowed_pages.some(page => location.pathname.startsWith(page))) {
    // Allow superAdmin to access everything
    if (user.role !== 'superAdmin') {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;