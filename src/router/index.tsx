import { createBrowserRouter } from 'react-router-dom';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import AdminLayout from '@/layouts/admin/AdminLayout';
import { adminRoutes } from '@/features/admin/routes';
import { customerRoutes } from '@/features/customer/routes';

export const router = createBrowserRouter([
  // Customer Routes
  {
    path: '/',
    element: <CustomerLayout />,
    children: customerRoutes,
  },
  // Admin Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: adminRoutes,
  },
]);
