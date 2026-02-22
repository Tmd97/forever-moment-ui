import * as types from './action-types';
import { fetchUserProfileApi, updateUserProfileApi } from './api';

export const getUserProfile = (isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_USER_PROFILE });
    }
    try {
        const response = await fetchUserProfileApi();
        dispatch({
            type: types.GET_USER_PROFILE_SUCCESS,
            payload: response.data?.response || response.data,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_USER_PROFILE_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch user profile',
        });
    }
};

export const updateUserProfile = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_USER_PROFILE });
    try {
        const response = await updateUserProfileApi(data);
        dispatch({
            type: types.UPDATE_USER_PROFILE_SUCCESS,
            payload: response.data?.response || response.data,
        });
        dispatch(getUserProfile(true));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_USER_PROFILE_FAILURE,
            payload: error.response?.data?.message || 'Failed to update user profile',
        });
        throw error;
    }
};

export const resetProfileStatus = () => ({
    type: types.RESET_PROFILE_STATUS,
});
