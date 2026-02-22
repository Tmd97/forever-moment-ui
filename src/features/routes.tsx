import { dashboardRoutes } from '@/features/dashboard/pages/routes';
import { categoryRoutes } from '@/features/category/pages/routes';
import { experienceRoutes } from '@/features/experience/pages/routes';
import { settingsRoutes } from '@/features/settings/pages/routes';
import { subCategoryRoutes } from '@/features/subCategory/pages/routes';
import { vendorRoutes } from '@/features/vendor/pages/routes';
import { userRoutes } from '@/features/users/pages/routes';
import { roleRoutes } from '@/features/roles/pages/routes';
import { locationRoutes } from '@/features/location/pages/routes';
import { slotRoutes } from '@/features/slot/pages/routes';
import { profileRoutes } from '@/features/profile/pages/routes';
import { inclusionRoutes } from '@/features/inclusion/pages/routes';
import { cancellationPolicyRoutes } from '@/features/cancellationPolicy/pages/routes';

export const adminRoutes = [
    ...dashboardRoutes,
    ...categoryRoutes,
    ...experienceRoutes,
    ...settingsRoutes,
    ...subCategoryRoutes,
    ...vendorRoutes,
    ...userRoutes,
    ...roleRoutes,
    ...locationRoutes,
    ...slotRoutes,
    ...profileRoutes,
    ...inclusionRoutes,
    ...cancellationPolicyRoutes,
];
