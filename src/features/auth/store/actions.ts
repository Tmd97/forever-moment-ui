import * as types from './action-types';
import type { User } from './action-types';
import { loginApi } from './api';
import { getUserProfile } from '@/features/profile/store/actions';

export const loginStart = () => ({
    type: types.LOGIN_START,
});

export const loginSuccess = (payload: { user: User; token: string }) => ({
    type: types.LOGIN_SUCCESS,
    payload,
});

export const loginFailure = (error: string) => ({
    type: types.LOGIN_FAILURE,
    payload: error,
});

export const logout = () => ({
    type: types.LOGOUT,
});

export const login = (credentials: any) => async (dispatch: any) => {
    dispatch(loginStart());
    try {
        const response = await loginApi(credentials);
        dispatch(loginSuccess(response));
        await dispatch(getUserProfile());
        return response;
    } catch (error: any) {
        dispatch(loginFailure(error.message || 'Login failed'));
        throw error;
    }
};
