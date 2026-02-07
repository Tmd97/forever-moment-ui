import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { adminRoutes } from '@/features/routes';
import { NotFound } from '@/components/common/NotFound';
import { authRoutes } from '@/features/auth/pages/routes';
import { ProtectedRoute } from './Protected';

export const router = createBrowserRouter([
  // Public Login Route
  ...authRoutes,
  // Redirect root to admin (which checks auth)
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
  },
  // Admin Routes (Protected)
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        element: <AdminLayout />,
        children: adminRoutes,
      }
    ]
  },
  // 404 Catch-all route
  {
    path: '*',
    element: <NotFound />,
  },
]);
