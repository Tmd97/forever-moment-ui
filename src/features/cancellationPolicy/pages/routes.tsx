import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const CancellationPolicy = lazy(() => import('./CancellationPolicy'));

export const cancellationPolicyRoutes: RouteObject[] = [
    {
        path: 'cancellation-policies',
        element: <CancellationPolicy />,
    }
];
