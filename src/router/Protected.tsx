import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store/store';

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
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login page, but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
};
