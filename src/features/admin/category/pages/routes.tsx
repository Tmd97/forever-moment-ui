import type { RouteObject } from 'react-router-dom';
import CategoryPage from './CategoryPage';

export const categoryRoutes: RouteObject[] = [
    {
        path: 'category',
        element: <CategoryPage />,
    }
];
