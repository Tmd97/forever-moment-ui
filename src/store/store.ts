import { configureStore } from '@reduxjs/toolkit';
import { dashboardReducer } from '@/features/admin/dashboard/store/reducer';
import { categoryReducer } from '@/features/admin/category/store/reducer';
import { experienceReducer } from '@/features/admin/experience/store/reducer';
import { settingsReducer } from '@/features/admin/settings/store/reducer';
import { homeReducer } from '@/features/customer/home/store/reducer';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    category: categoryReducer,
    experience: experienceReducer,
    settings: settingsReducer,
    home: homeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
