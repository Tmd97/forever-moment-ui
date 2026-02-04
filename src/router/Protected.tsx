import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    allowedRoles?: string[];
    redirectTo?: string;
}

/**
 * ProtectedRoute component for role-based access control
 * Requires authentication and specific user roles
 */
export const ProtectedRoute = ({
    allowedRoles = [],
    redirectTo = '/unauthorized'
}: ProtectedRouteProps) => {
    // TODO: Replace with actual authentication and role check from store/context
    const isAuthenticated = false;
    const userRole = ''; // e.g., 'admin', 'customer', 'manager'

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
};
