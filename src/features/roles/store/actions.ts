import * as types from './action-types';
import { fetchRolesData, createRoleApi, updateRoleApi, deleteRoleApi } from './api';

export const getRolesData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_ROLES_DATA });
    try {
        const response = await fetchRolesData();
        dispatch({
            type: types.GET_ROLES_DATA_SUCCESS,
            payload: response.data.response,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_ROLES_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch roles',
        });
    }
};

export const createRole = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_ROLE });
    try {
        const response = await createRoleApi(data);
        dispatch({
            type: types.CREATE_ROLE_SUCCESS,
            payload: response.data,
        });
        dispatch(getRolesData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_ROLE_FAILURE,
            payload: error.response?.data?.message || 'Failed to create role',
        });
        throw error;
    }
};

export const updateRole = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_ROLE });
    try {
        const response = await updateRoleApi(id, data);
        dispatch({
            type: types.UPDATE_ROLE_SUCCESS,
            payload: response.data,
        });
        dispatch(getRolesData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_ROLE_FAILURE,
            payload: error.response?.data?.message || 'Failed to update role',
        });
        throw error;
    }
};

export const deleteRole = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_ROLE });
    try {
        const response = await deleteRoleApi(id);
        dispatch({
            type: types.DELETE_ROLE_SUCCESS,
            payload: id,
        });
        dispatch(getRolesData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_ROLE_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete role',
        });
        throw error;
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS
});
