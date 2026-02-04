import { combineReducers } from '@reduxjs/toolkit';

// Config reducer
import { configReducer } from '@/store/config/reducer';

// Admin reducers
import { categoryReducer } from '@/features/admin/category/store/reducer';
import { experienceReducer } from '@/features/admin/experience/store/reducer';
import { dashboardReducer } from '@/features/admin/dashboard/store/reducer';
import { settingsReducer } from '@/features/admin/settings/store/reducer';

// Customer reducers
import { homeReducer } from '@/features/customer/home/store/reducer';

export const rootReducer = combineReducers({
    // Global config
    config: configReducer,

    // Admin
    category: categoryReducer,
    experience: experienceReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,

    // Customer
    home: homeReducer,
});
