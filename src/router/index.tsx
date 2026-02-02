import { createBrowserRouter } from 'react-router-dom'
import CustomerLayout from '../layouts/customer/CustomerLayout'
import AdminLayout from '../layouts/admin/AdminLayout'
import Home from '../pages/customer/Home'
import Dashboard from '../pages/admin/Dashboard'

export const router = createBrowserRouter([
    // Customer Routes
    {
        path: '/',
        element: <CustomerLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },
    // Admin Routes
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            // Add more admin routes here
        ],
    },
])
