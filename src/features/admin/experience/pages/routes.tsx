import type { RouteObject } from 'react-router-dom';
import ExperiencePage from './ExperiencePage';

export const experienceRoutes: RouteObject[] = [
    {
        path: 'experience',
        element: <ExperiencePage />,
    }
];
