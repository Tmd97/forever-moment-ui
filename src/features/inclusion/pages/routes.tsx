import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const Inclusion = lazy(() => import('./Inclusion'));

export const inclusionRoutes: RouteObject[] = [
    {
        path: 'inclusions',
        element: <Inclusion />,
    }
];
