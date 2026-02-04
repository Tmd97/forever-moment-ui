import type { RouteObject } from 'react-router-dom';
import { dashboardRoutes } from '@/features/admin/dashboard/pages/routes';
import { categoryRoutes } from '@/features/admin/category/pages/routes';
import { experienceRoutes } from '@/features/admin/experience/pages/routes';
import { settingsRoutes } from '@/features/admin/settings/pages/routes';

export const adminRoutes: RouteObject[] = [
    ...dashboardRoutes,
    ...categoryRoutes,
    ...experienceRoutes,
    ...settingsRoutes,
];
