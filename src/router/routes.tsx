import { createBrowserRouter } from 'react-router-dom';
import { PublicRoute } from './Public';
import { ProtectedRoute } from './Protected';

// Admin routes
import { adminRoutes } from '@/features/routes';

// Customer routes
import { homeRoutes } from '@/features/customer/home/pages/routes';

/**
 * Main application router configuration
 * Combines public, private, and protected routes
 */
export const router = createBrowserRouter([
    // Public routes (accessible to all)
    {
        element: <PublicRoute />,
        children: [
            ...homeRoutes,
        ],
    },

    // Protected routes (require authentication and specific roles)
    {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
            ...adminRoutes,
        ],
    },

    // Add more route groups as needed
]);
