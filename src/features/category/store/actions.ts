import * as types from './action-types';
import { createCategoryApi, fetchCategoryData, deleteCategoryApi, updateCategoryApi } from './api';

export const getCategoryData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_CATEGORY_DATA });
    try {
        const response = await fetchCategoryData();
        dispatch({
            type: types.GET_CATEGORY_DATA_SUCCESS,
            payload: response.data.response,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_CATEGORY_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch categories',
        });
    }
};

export const getCategoryDataSuccess = (data: any) => ({
    type: types.GET_CATEGORY_DATA_SUCCESS,
    payload: data,
});

export const getCategoryDataFailure = (error: string) => ({
    type: types.GET_CATEGORY_DATA_FAILURE,
    payload: error,
});

export const createCategory = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_CATEGORY });
    try {
        const response = await createCategoryApi(data);
        dispatch({
            type: types.CREATE_CATEGORY_SUCCESS,
            payload: response.data,
        });
        // Optionally refresh list
        dispatch(getCategoryData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to create category',
        });
        throw error;
    }
};

export const deleteCategory = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_CATEGORY });
    try {
        const response = await deleteCategoryApi(id);
        dispatch({
            type: types.DELETE_CATEGORY_SUCCESS,
            payload: id,
        });
        dispatch(getCategoryData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete category',
        });
        throw error;
    }
};

export const updateCategory = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_CATEGORY });
    try {
        const response = await updateCategoryApi(id, data);
        dispatch({
            type: types.UPDATE_CATEGORY_SUCCESS,
            payload: response.data,
        });
        dispatch(getCategoryData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to update category',
        });
        throw error;
    }
};
