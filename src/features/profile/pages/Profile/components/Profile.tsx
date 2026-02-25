import { useEffect } from 'react';
import { ProfileForm } from './ProfileForm';
import toast from 'react-hot-toast';
import * as types from '@/features/profile/store/action-types';
import '../../css/styles.scss';

interface ProfileProps {
    user: any;
    profileData: any;
    profileLoading: boolean;
    profileError: string | null;
    profileStatus: string;
    getUserProfile: () => void;
    updateUserProfile: (data: any) => void;
}

const Profile = ({
    user,
    profileData,
    profileLoading,
    profileError,
    profileStatus,
    getUserProfile,
    updateUserProfile
}: ProfileProps) => {
    useEffect(() => {
        getUserProfile();
    }, [getUserProfile]);

    useEffect(() => {
        if (profileError) {
            toast.error(profileError);
        }
        if (profileStatus === types.UPDATE_USER_PROFILE_SUCCESS) {
            toast.success('Profile updated successfully');
        }
    }, [profileError, profileStatus]);

    const handleUpdateProfile = async (data: any) => {
        await updateUserProfile(data);
    };

    return (
        <div className="profile-page-container w-full h-full flex flex-col">
            <div className="flex-1 overflow-y-auto w-full mx-auto p-6 md:px-10 max-w-4xl">
                {user || profileData ? (
                    <ProfileForm
                        initialData={profileData || user}
                        onSubmit={handleUpdateProfile}
                        isLoading={profileLoading}
                    />
                ) : (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9622f]"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
