import type { RouteObject } from 'react-router-dom';
import CustomerHomePage from './CustomerHomePage';

export const homeRoutes: RouteObject[] = [
    {
        index: true,
        element: <CustomerHomePage />,
    }
];
