import * as types from './action-types';
import {
    createExperienceApi, fetchExperienceData, fetchExperienceByIdApi, deleteExperienceApi, updateExperienceApi, reorderExperienceApi,
    associateCancellationPolicyApi, disassociateCancellationPolicyApi,
    associateInclusionApi, disassociateInclusionApi,
    associateLocationApi, updateExperienceLocationApi, disassociateLocationApi,
    associateAddonApi, disassociateAddonApi
} from './api';

export const getExperienceData = (isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_EXPERIENCE_DATA });
    }
    try {
        const response = await fetchExperienceData();
        dispatch({
            type: types.GET_EXPERIENCE_DATA_SUCCESS,
            payload: response.data.response,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_EXPERIENCE_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch experiences',
        });
    }
};

export const getExperienceDataSuccess = (data: any) => ({
    type: types.GET_EXPERIENCE_DATA_SUCCESS,
    payload: data,
});

export const getExperienceDataFailure = (error: string) => ({
    type: types.GET_EXPERIENCE_DATA_FAILURE,
    payload: error,
});

export const getExperienceById = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.GET_EXPERIENCE_BY_ID });
    try {
        const response = await fetchExperienceByIdApi(id);
        dispatch({
            type: types.GET_EXPERIENCE_BY_ID_SUCCESS,
            payload: response.data.response || response.data,
        });
        return response.data.response || response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_EXPERIENCE_BY_ID_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch experience details',
        });
        throw error;
    }
};

export const createExperience = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_EXPERIENCE });
    try {
        const response = await createExperienceApi(data);
        dispatch({
            type: types.CREATE_EXPERIENCE_SUCCESS,
            payload: response.data,
        });
        dispatch(getExperienceData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_EXPERIENCE_FAILURE,
            payload: error.response?.data?.message || 'Failed to create experience',
        });
        throw error;
    }
};

export const deleteExperience = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_EXPERIENCE });
    try {
        const response = await deleteExperienceApi(id);
        dispatch({
            type: types.DELETE_EXPERIENCE_SUCCESS,
            payload: id,
        });
        dispatch(getExperienceData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_EXPERIENCE_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete experience',
        });
        throw error;
    }
};

export const updateExperience = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_EXPERIENCE });
    try {
        const response = await updateExperienceApi(id, data);
        dispatch({
            type: types.UPDATE_EXPERIENCE_SUCCESS,
            payload: response.data,
        });
        dispatch(getExperienceData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_EXPERIENCE_FAILURE,
            payload: error.response?.data?.message || 'Failed to update experience',
        });
        throw error;
    }
};

export const reorderExperience = (data: { id: number; newPosition: number }) => async (dispatch: any) => {
    dispatch({ type: types.REORDER_EXPERIENCE });
    try {
        const response = await reorderExperienceApi(data);
        dispatch({
            type: types.REORDER_EXPERIENCE_SUCCESS,
            payload: response.data,
        });
        dispatch(getExperienceData(true));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.REORDER_EXPERIENCE_FAILURE,
            payload: error.response?.data?.message || 'Failed to reorder experience',
        });
        throw error;
    }
};

export const toggleCancellationPolicy = (experienceId: number, policyId: number, isAssociate: boolean) => async (dispatch: any) => {
    dispatch({ type: types.TOGGLE_CANCELLATION_POLICY });
    try {
        let response;
        if (isAssociate) {
            response = await associateCancellationPolicyApi(experienceId, policyId);
        } else {
            response = await disassociateCancellationPolicyApi(experienceId, policyId);
        }
        dispatch({
            type: types.TOGGLE_CANCELLATION_POLICY_SUCCESS,
            payload: response.data,
        });
        // Refresh experience details to strictly reflect server state
        dispatch(getExperienceById(experienceId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.TOGGLE_CANCELLATION_POLICY_FAILURE,
            payload: error.response?.data?.message || 'Failed to toggle cancellation policy',
        });
        throw error;
    }
};

export const toggleInclusion = (experienceId: number, inclusionId: number, isAssociate: boolean) => async (dispatch: any) => {
    dispatch({ type: types.TOGGLE_INCLUSION });
    try {
        let response;
        if (isAssociate) {
            response = await associateInclusionApi(experienceId, inclusionId);
        } else {
            response = await disassociateInclusionApi(experienceId, inclusionId);
        }
        dispatch({
            type: types.TOGGLE_INCLUSION_SUCCESS,
            payload: response.data,
        });
        dispatch(getExperienceById(experienceId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.TOGGLE_INCLUSION_FAILURE,
            payload: error.response?.data?.message || 'Failed to toggle inclusion',
        });
        throw error;
    }
};

export const associateLocation = (experienceId: number, locationId: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.ASSOCIATE_LOCATION });
    try {
        const response = await associateLocationApi(locationId, experienceId, data);
        dispatch({
            type: types.ASSOCIATE_LOCATION_SUCCESS,
            payload: response.data,
        });
        dispatch(getExperienceById(experienceId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.ASSOCIATE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to associate location',
        });
        throw error;
    }
};

export const updateExperienceLocation = (experienceId: number, locationId: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_EXPERIENCE_LOCATION });
    try {
        const response = await updateExperienceLocationApi(locationId, experienceId, data);
        dispatch({
            type: types.UPDATE_EXPERIENCE_LOCATION_SUCCESS,
            payload: response.data,
        });
        dispatch(getExperienceById(experienceId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_EXPERIENCE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to update associated location',
        });
        throw error;
    }
};

export const disassociateLocation = (experienceId: number, locationId: number) => async (dispatch: any) => {
    dispatch({ type: types.DISASSOCIATE_LOCATION });
    try {
        const response = await disassociateLocationApi(locationId, experienceId);
        dispatch({
            type: types.DISASSOCIATE_LOCATION_SUCCESS,
            payload: response.data,
        });
        dispatch(getExperienceById(experienceId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DISASSOCIATE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to disassociate location',
        });
        throw error;
    }
};

export const toggleAddon = (experienceId: number, addonId: number, isAssociate: boolean, data?: any) => async (dispatch: any) => {
    dispatch({ type: types.TOGGLE_ADDON });
    try {
        let response;
        if (isAssociate) {
            response = await associateAddonApi(experienceId, addonId, data);
        } else {
            response = await disassociateAddonApi(experienceId, addonId);
        }
        dispatch({
            type: types.TOGGLE_ADDON_SUCCESS,
            payload: response.data,
        });
        dispatch(getExperienceById(experienceId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.TOGGLE_ADDON_FAILURE,
            payload: error.response?.data?.message || 'Failed to toggle addon',
        });
        throw error;
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS
});
