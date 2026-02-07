import * as types from './action-types';

export const getRolesData = () => ({
    type: types.GET_ROLES_DATA,
});

export const getRolesDataSuccess = (data: any) => ({
    type: types.GET_ROLES_DATA_SUCCESS,
    payload: data,
});

export const getRolesDataFailure = (error: string) => ({
    type: types.GET_ROLES_DATA_FAILURE,
    payload: error,
});
