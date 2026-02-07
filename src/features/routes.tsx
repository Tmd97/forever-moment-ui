import { dashboardRoutes } from '@/features/dashboard/pages/routes';
import { categoryRoutes } from '@/features/category/pages/routes';
import { experienceRoutes } from '@/features/experience/pages/routes';
import { settingsRoutes } from '@/features/settings/pages/routes';
import { subCategoryRoutes } from '@/features/subCategory/pages/routes';
import { vendorRoutes } from '@/features/vendor/pages/routes';
import { userRoutes } from '@/features/users/pages/routes';
import { roleRoutes } from '@/features/roles/pages/routes';

export const adminRoutes = [
    ...dashboardRoutes,
    ...categoryRoutes,
    ...experienceRoutes,
    ...settingsRoutes,
    ...subCategoryRoutes,
    ...vendorRoutes,
    ...userRoutes,
    ...roleRoutes,
];
