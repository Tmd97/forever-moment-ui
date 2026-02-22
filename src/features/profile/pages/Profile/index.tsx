import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, updateUserProfile } from '@/features/profile/store/actions';
import type { RootState } from '@/store/store';
import { ProfileForm } from './components/ProfileForm.tsx';
import toast from 'react-hot-toast';
import * as types from '@/features/profile/store/action-types';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { data: profileData, loading: profileLoading, error: profileError, status: profileStatus } = useSelector((state: RootState) => state.profile);

    useEffect(() => {
        dispatch(getUserProfile() as any);
    }, [dispatch]);

    useEffect(() => {
        if (profileError) {
            toast.error(profileError);
        }
        if (profileStatus === types.UPDATE_USER_PROFILE_SUCCESS) {
            toast.success('Profile updated successfully');
        }
    }, [profileError, profileStatus]);

    const handleUpdateProfile = async (data: any) => {
        await dispatch(updateUserProfile(data) as any);
    };

    return (
        <div className="w-full h-full p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Profile</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and preferences.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    {user || profileData ? (
                        <ProfileForm
                            initialData={profileData || user}
                            onSubmit={handleUpdateProfile}
                            isLoading={profileLoading}
                        />
                    ) : (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
