export const GET_USER_PROFILE = 'GET_USER_PROFILE';
export const GET_USER_PROFILE_SUCCESS = 'GET_USER_PROFILE_SUCCESS';
export const GET_USER_PROFILE_FAILURE = 'GET_USER_PROFILE_FAILURE';

export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
export const UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS';
export const UPDATE_USER_PROFILE_FAILURE = 'UPDATE_USER_PROFILE_FAILURE';

export const RESET_PROFILE_STATUS = 'RESET_PROFILE_STATUS';

export interface UserProfileData {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
    dateOfBirth?: string;
    preferredCity?: string;
    roleId?: number;
    [key: string]: any;
}

export interface ProfileState {
    data: UserProfileData | null;
    loading: boolean;
    error: string | null;
    status: string;
}
