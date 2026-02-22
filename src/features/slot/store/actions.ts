import type { Dispatch } from 'redux';
import * as types from './action-types';
import * as api from './api';
import toast from 'react-hot-toast';

export const getSlotData = () => async (dispatch: Dispatch) => {
    dispatch({ type: types.GET_SLOT_DATA });
    try {
        const response = await api.fetchSlotData();
        dispatch({
            type: types.GET_SLOT_DATA_SUCCESS,
            payload: response?.data?.response || [],
        });
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to fetch slots';
        dispatch({
            type: 'FAILURE',
            payload: message,
        });
        toast.error(message);
    }
};

export const createSlot = (data: any) => async (dispatch: Dispatch) => {
    dispatch({ type: types.CREATE_SLOT });
    try {
        await api.createSlot(data);
        dispatch({ type: types.CREATE_SLOT_SUCCESS });
        // Refresh data after successful creation
        await (getSlotData() as any)(dispatch);
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to create slot';
        dispatch({
            type: 'FAILURE',
            payload: message,
        });
        toast.error(message);
    }
};

export const updateSlot = (id: number, data: any) => async (dispatch: Dispatch) => {
    dispatch({ type: types.UPDATE_SLOT });
    try {
        await api.updateSlot(id, data);
        dispatch({ type: types.UPDATE_SLOT_SUCCESS });
        // Refresh data after successful update
        await (getSlotData() as any)(dispatch);
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to update slot';
        dispatch({
            type: 'FAILURE',
            payload: message,
        });
        toast.error(message);
    }
};

export const deleteSlot = (id: number) => async (dispatch: Dispatch) => {
    dispatch({ type: types.DELETE_SLOT });
    try {
        await api.deleteSlot(id);
        dispatch({ type: types.DELETE_SLOT_SUCCESS });
        // Refresh data after successful deletion
        await (getSlotData() as any)(dispatch);
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to delete slot';
        dispatch({
            type: 'FAILURE',
            payload: message,
        });
        toast.error(message);
    }
};

export const resetStatus = () => (dispatch: Dispatch) => {
    dispatch({ type: types.RESET_SLOT_STATUS });
};
