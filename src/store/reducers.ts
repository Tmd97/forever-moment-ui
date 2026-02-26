import { combineReducers } from '@reduxjs/toolkit';

// Config reducer
import { configReducer } from '@/store/config/reducer';

// Admin reducers
import { authReducer } from '@/features/auth/store/reducer';
import { categoryReducer } from '@/features/category/store/reducer';
import { experienceReducer } from '@/features/experience/store/reducer';
import { dashboardReducer } from '@/features/dashboard/store/reducer';
import { settingsReducer } from '@/features/settings/store/reducer';
import { subCategoryReducer } from '@/features/subCategory/store/reducer';
import { vendorReducer } from '@/features/vendor/store/reducer';
import { userReducer } from '@/features/users/store/reducer';
import { roleReducer } from '@/features/roles/store/reducer';
import { locationReducer } from '@/features/location/store/reducer';
import { inclusionReducer } from '@/features/inclusion/store/reducer';
import { cancellationPolicyReducer } from '@/features/cancellationPolicy/store/reducer';
import { addonReducer } from '@/features/addon/store/reducer';

export const rootReducer = combineReducers({
    // Global config
    config: configReducer,

    // Admin
    auth: authReducer,
    category: categoryReducer,
    experience: experienceReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,
    subCategory: subCategoryReducer,
    vendor: vendorReducer,
    user: userReducer,
    roles: roleReducer,
    location: locationReducer,
    inclusion: inclusionReducer,
    cancellationPolicy: cancellationPolicyReducer,
    addon: addonReducer,
});
