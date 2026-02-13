import * as types from './action-types';
import { createUserApi, fetchUsersData, deleteUserApi, updateUserApi } from './api';

export const getUsersData = (isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_USERS_DATA });
    }
    try {
        const response = await fetchUsersData();
        dispatch({
            type: types.GET_USERS_DATA_SUCCESS,
            payload: response.data.response,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_USERS_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch users',
        });
    }
};

export const createUser = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_USER });
    try {
        const response = await createUserApi(data);
        dispatch({
            type: types.CREATE_USER_SUCCESS,
            payload: response.data,
        });
        dispatch(getUsersData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_USER_FAILURE,
            payload: error.response?.data?.message || 'Failed to create user',
        });
        throw error;
    }
};

export const deleteUser = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_USER });
    try {
        const response = await deleteUserApi(id);
        dispatch({
            type: types.DELETE_USER_SUCCESS,
            payload: id,
        });
        dispatch(getUsersData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_USER_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete user',
        });
        throw error;
    }
};

export const updateUser = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_USER });
    try {
        const response = await updateUserApi(id, data);
        dispatch({
            type: types.UPDATE_USER_SUCCESS,
            payload: response.data,
        });
        dispatch(getUsersData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_USER_FAILURE,
            payload: error.response?.data?.message || 'Failed to update user',
        });
        throw error;
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS
});
