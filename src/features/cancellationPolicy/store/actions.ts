import * as types from './action-types';
import { createCancellationPolicyApi, fetchCancellationPolicyData, deleteCancellationPolicyApi, updateCancellationPolicyApi } from './api';

export const getCancellationPolicyData = (isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_CANCELLATION_POLICY_DATA });
    }
    try {
        const response = await fetchCancellationPolicyData();
        dispatch({
            type: types.GET_CANCELLATION_POLICY_DATA_SUCCESS,
            payload: response.data,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_CANCELLATION_POLICY_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch cancellation policies',
        });
    }
};

export const getCancellationPolicyDataSuccess = (data: any) => ({
    type: types.GET_CANCELLATION_POLICY_DATA_SUCCESS,
    payload: data,
});

export const getCancellationPolicyDataFailure = (error: string) => ({
    type: types.GET_CANCELLATION_POLICY_DATA_FAILURE,
    payload: error,
});

export const createCancellationPolicy = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_CANCELLATION_POLICY });
    try {
        const response = await createCancellationPolicyApi(data);
        dispatch({
            type: types.CREATE_CANCELLATION_POLICY_SUCCESS,
            payload: response.data,
        });
        dispatch(getCancellationPolicyData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_CANCELLATION_POLICY_FAILURE,
            payload: error.response?.data?.message || 'Failed to create cancellation policy',
        });
        throw error;
    }
};

export const deleteCancellationPolicy = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_CANCELLATION_POLICY });
    try {
        const response = await deleteCancellationPolicyApi(id);
        dispatch({
            type: types.DELETE_CANCELLATION_POLICY_SUCCESS,
            payload: id,
        });
        dispatch(getCancellationPolicyData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_CANCELLATION_POLICY_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete cancellation policy',
        });
        throw error;
    }
};

export const updateCancellationPolicy = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_CANCELLATION_POLICY });
    try {
        const response = await updateCancellationPolicyApi(id, data);
        dispatch({
            type: types.UPDATE_CANCELLATION_POLICY_SUCCESS,
            payload: response.data,
        });
        dispatch(getCancellationPolicyData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_CANCELLATION_POLICY_FAILURE,
            payload: error.response?.data?.message || 'Failed to update cancellation policy',
        });
        throw error;
    }
};

export const reorderCancellationPolicy = (data: { id: number; newPosition: number }) => async (dispatch: any) => {
    dispatch({ type: types.REORDER_CANCELLATION_POLICY });
    try {
        const response = await import('./api').then(api => api.reorderCancellationPolicyApi(data));
        dispatch({
            type: types.REORDER_CANCELLATION_POLICY_SUCCESS,
            payload: response.data,
        });
        dispatch(getCancellationPolicyData(true));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.REORDER_CANCELLATION_POLICY_FAILURE,
            payload: error.response?.data?.message || 'Failed to reorder cancellation policy',
        });
        throw error;
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS
});
