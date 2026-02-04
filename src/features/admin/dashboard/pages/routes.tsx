import type { RouteObject } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

export const dashboardRoutes: RouteObject[] = [
    {
        index: true,
        element: <AdminDashboard />,
    }
];
