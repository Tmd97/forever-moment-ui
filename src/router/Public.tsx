import { Navigate, Outlet } from 'react-router-dom';

interface PublicRouteProps {
    redirectTo?: string;
}

/**
 * PublicRoute component for routes accessible to all users
 * Can optionally redirect authenticated users to a different route
 */
export const PublicRoute = ({ redirectTo }: PublicRouteProps) => {
    // TODO: Replace with actual authentication check
    const isAuthenticated = false;

    if (isAuthenticated && redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
};
