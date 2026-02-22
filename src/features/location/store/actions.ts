import * as types from './action-types';
import {
    fetchLocationData, createLocationApi, deleteLocationApi, updateLocationApi,
    fetchPincodeData, createPincodeApi, deletePincodeApi, updatePincodeApi
} from './api';

export const getLocationData = (isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_LOCATION_DATA });
    }
    try {
        const response = await fetchLocationData();
        dispatch({
            type: types.GET_LOCATION_DATA_SUCCESS,
            payload: response.data.response,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_LOCATION_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch locations',
        });
    }
};

export const createLocation = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_LOCATION });
    try {
        const response = await createLocationApi(data);
        dispatch({
            type: types.CREATE_LOCATION_SUCCESS,
            payload: response.data,
        });
        dispatch(getLocationData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to create location',
        });
        throw error;
    }
};

export const deleteLocation = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_LOCATION });
    try {
        const response = await deleteLocationApi(id);
        dispatch({
            type: types.DELETE_LOCATION_SUCCESS,
            payload: id,
        });
        dispatch(getLocationData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete location',
        });
        throw error;
    }
};

export const updateLocation = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_LOCATION });
    try {
        const response = await updateLocationApi(id, data);
        dispatch({
            type: types.UPDATE_LOCATION_SUCCESS,
            payload: response.data,
        });
        dispatch(getLocationData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to update location',
        });
        throw error;
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS,
});

export const getPincodeData = (locationId: number, isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_PINCODE_DATA });
    }
    try {
        const response = await fetchPincodeData(locationId);
        dispatch({
            type: types.GET_PINCODE_DATA_SUCCESS,
            payload: response.data.response || response.data,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_PINCODE_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch pincodes',
        });
    }
};

export const createPincode = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_PINCODE });
    try {
        const response = await createPincodeApi(data);
        dispatch({
            type: types.CREATE_PINCODE_SUCCESS,
            payload: response.data,
        });
        dispatch(getPincodeData(data.locationId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_PINCODE_FAILURE,
            payload: error.response?.data?.message || 'Failed to create pincode',
        });
        throw error;
    }
};

export const deletePincode = (id: number, locationId: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_PINCODE });
    try {
        const response = await deletePincodeApi(id);
        dispatch({
            type: types.DELETE_PINCODE_SUCCESS,
            payload: id,
        });
        dispatch(getPincodeData(locationId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_PINCODE_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete pincode',
        });
        throw error;
    }
};

export const updatePincode = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_PINCODE });
    try {
        const response = await updatePincodeApi(id, data);
        dispatch({
            type: types.UPDATE_PINCODE_SUCCESS,
            payload: response.data,
        });
        dispatch(getPincodeData(data.locationId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_PINCODE_FAILURE,
            payload: error.response?.data?.message || 'Failed to update pincode',
        });
        throw error;
    }
};
