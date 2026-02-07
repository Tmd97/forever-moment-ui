import * as types from './action-types';

export const getUsersData = () => ({
    type: types.GET_USERS_DATA,
});

export const getUsersDataSuccess = (data: any) => ({
    type: types.GET_USERS_DATA_SUCCESS,
    payload: data,
});

export const getUsersDataFailure = (error: string) => ({
    type: types.GET_USERS_DATA_FAILURE,
    payload: error,
});
