import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
    redirectTo?: string;
}

/**
 * PrivateRoute component for routes requiring authentication
 * Redirects unauthenticated users to login page
 */
export const PrivateRoute = ({ redirectTo = '/login' }: PrivateRouteProps) => {
    // TODO: Replace with actual authentication check from store/context
    const isAuthenticated = false;

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
};
