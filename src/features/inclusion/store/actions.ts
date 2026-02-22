import * as types from './action-types';
import { createInclusionApi, fetchInclusionData, deleteInclusionApi, updateInclusionApi } from './api';

export const getInclusionData = (isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_INCLUSION_DATA });
    }
    try {
        const response = await fetchInclusionData();
        dispatch({
            type: types.GET_INCLUSION_DATA_SUCCESS,
            payload: response.data,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_INCLUSION_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch inclusions',
        });
    }
};

export const getInclusionDataSuccess = (data: any) => ({
    type: types.GET_INCLUSION_DATA_SUCCESS,
    payload: data,
});

export const getInclusionDataFailure = (error: string) => ({
    type: types.GET_INCLUSION_DATA_FAILURE,
    payload: error,
});

export const createInclusion = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_INCLUSION });
    try {
        const response = await createInclusionApi(data);
        dispatch({
            type: types.CREATE_INCLUSION_SUCCESS,
            payload: response.data,
        });
        dispatch(getInclusionData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_INCLUSION_FAILURE,
            payload: error.response?.data?.message || 'Failed to create inclusion',
        });
        throw error;
    }
};

export const deleteInclusion = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_INCLUSION });
    try {
        const response = await deleteInclusionApi(id);
        dispatch({
            type: types.DELETE_INCLUSION_SUCCESS,
            payload: id,
        });
        dispatch(getInclusionData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_INCLUSION_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete inclusion',
        });
        throw error;
    }
};

export const updateInclusion = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_INCLUSION });
    try {
        const response = await updateInclusionApi(id, data);
        dispatch({
            type: types.UPDATE_INCLUSION_SUCCESS,
            payload: response.data,
        });
        dispatch(getInclusionData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_INCLUSION_FAILURE,
            payload: error.response?.data?.message || 'Failed to update inclusion',
        });
        throw error;
    }
};

export const reorderInclusion = (data: { id: number; newPosition: number }) => async (dispatch: any) => {
    dispatch({ type: types.REORDER_INCLUSION });
    try {
        const response = await import('./api').then(api => api.reorderInclusionApi(data));
        dispatch({
            type: types.REORDER_INCLUSION_SUCCESS,
            payload: response.data,
        });
        dispatch(getInclusionData(true));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.REORDER_INCLUSION_FAILURE,
            payload: error.response?.data?.message || 'Failed to reorder inclusion',
        });
        throw error;
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS
});
