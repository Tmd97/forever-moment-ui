import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth/store/reducer';
import { dashboardReducer } from '@/features/dashboard/store/reducer';
import { categoryReducer } from '@/features/category/store/reducer';
import { experienceReducer } from '@/features/experience/store/reducer';
import { settingsReducer } from '@/features/settings/store/reducer';
import { subCategoryReducer } from '@/features/subCategory/store/reducer';
import { vendorReducer } from '@/features/vendor/store/reducer';
import { userReducer } from '@/features/users/store/reducer';
import { roleReducer } from '@/features/roles/store/reducer';
import { locationReducer } from '@/features/location/store/reducer';
import { slotReducer } from '@/features/slot/store/reducer';
import { profileReducer } from '@/features/profile/store/reducer';
import { inclusionReducer } from '@/features/inclusion/store/reducer';
import { cancellationPolicyReducer } from '@/features/cancellationPolicy/store/reducer';
import { addonReducer } from '@/features/addon/store/reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    category: categoryReducer,
    experience: experienceReducer,
    settings: settingsReducer,
    subCategory: subCategoryReducer,
    vendor: vendorReducer,
    user: userReducer,
    roles: roleReducer,
    location: locationReducer,
    slot: slotReducer,
    profile: profileReducer,
    inclusion: inclusionReducer,
    cancellationPolicy: cancellationPolicyReducer,
    addon: addonReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
