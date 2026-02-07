import * as types from './action-types';

export const getSubCategoryData = () => ({
    type: types.GET_SUB_CATEGORY_DATA,
});

export const getSubCategoryDataSuccess = (data: any) => ({
    type: types.GET_SUB_CATEGORY_DATA_SUCCESS,
    payload: data,
});

export const getSubCategoryDataFailure = (error: string) => ({
    type: types.GET_SUB_CATEGORY_DATA_FAILURE,
    payload: error,
});
