import * as types from './action-types';

export const getCategoryData = () => ({
    type: types.GET_CATEGORY_DATA,
});

export const getCategoryDataSuccess = (data: any) => ({
    type: types.GET_CATEGORY_DATA_SUCCESS,
    payload: data,
});

export const getCategoryDataFailure = (error: string) => ({
    type: types.GET_CATEGORY_DATA_FAILURE,
    payload: error,
});
