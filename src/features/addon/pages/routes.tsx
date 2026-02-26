import type { RouteObject } from 'react-router-dom';
import Addon from './Addon';

export const addonRoutes: RouteObject[] = [
    {
        path: 'addons',
        element: <Addon />,
    },
];
