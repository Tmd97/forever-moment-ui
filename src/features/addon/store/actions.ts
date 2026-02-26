import * as types from './action-types';
import {
    getAddonDataApi,
    createAddonApi,
    updateAddonApi,
    deleteAddonApi
} from './api';

export const getAddonData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_ADDON_DATA_REQUEST });
    try {
        const response = await getAddonDataApi();
        dispatch({
            type: types.GET_ADDON_DATA_SUCCESS,
            payload: response.data,
        });
    } catch (error: any) {
        dispatch({
            type: types.GET_ADDON_DATA_FAILURE,
            payload: error.response?.data?.message || 'Something went wrong',
        });
    }
};

export const createAddon = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.ADD_ADDON_REQUEST });
    try {
        const response = await createAddonApi(data);
        dispatch({
            type: types.ADD_ADDON_SUCCESS,
            payload: response.data,
        });
        dispatch(getAddonData());
        return response;
    } catch (error: any) {
        dispatch({
            type: types.ADD_ADDON_FAILURE,
            payload: error.response?.data?.message || 'Failed to create addon',
        });
        throw error;
    }
};

export const updateAddon = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_ADDON_REQUEST });
    try {
        const response = await updateAddonApi(id, data);
        dispatch({
            type: types.UPDATE_ADDON_SUCCESS,
            payload: response.data,
        });
        dispatch(getAddonData());
        return response;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_ADDON_FAILURE,
            payload: error.response?.data?.message || 'Failed to update addon',
        });
        throw error;
    }
};

export const deleteAddon = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_ADDON_REQUEST });
    try {
        await deleteAddonApi(id);
        dispatch({
            type: types.DELETE_ADDON_SUCCESS,
            payload: id,
        });
        dispatch(getAddonData());
    } catch (error: any) {
        dispatch({
            type: types.DELETE_ADDON_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete addon',
        });
        throw error;
    }
};

export const resetStatus = () => (dispatch: any) => {
    dispatch({ type: types.RESET_ADDON_STATUS });
};
