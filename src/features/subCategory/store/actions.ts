import * as types from './action-types';
import { getSubCategories, createSubCategory as createSubCategoryApi, updateSubCategory as updateSubCategoryApi, deleteSubCategory as deleteSubCategoryApi } from './api';

export const getSubCategoryData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_SUB_CATEGORY_DATA });
    try {
        const response = await getSubCategories();
        dispatch({
            type: types.GET_SUB_CATEGORY_DATA_SUCCESS,
            payload: response.data.response || response.data, // Fallback if no nested response
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_SUB_CATEGORY_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch sub categories',
        });
    }
};

export const createSubCategory = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_SUB_CATEGORY });
    try {
        const response = await createSubCategoryApi(data);
        dispatch({
            type: types.CREATE_SUB_CATEGORY_SUCCESS,
            payload: response.data,
        });
        dispatch(getSubCategoryData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_SUB_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to create sub category',
        });
        throw error;
    }
};

export const updateSubCategory = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_SUB_CATEGORY });
    try {
        const response = await updateSubCategoryApi(id, data);
        dispatch({
            type: types.UPDATE_SUB_CATEGORY_SUCCESS,
            payload: response.data,
        });
        dispatch(getSubCategoryData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_SUB_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to update sub category',
        });
        throw error;
    }
};

export const deleteSubCategory = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_SUB_CATEGORY });
    try {
        const response = await deleteSubCategoryApi(id);
        dispatch({
            type: types.DELETE_SUB_CATEGORY_SUCCESS,
            payload: id,
        });
        dispatch(getSubCategoryData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_SUB_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete sub category',
        });
        throw error;
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS
});

