import * as types from './action-types';

export const getDashboardData = () => ({
    type: types.GET_DASHBOARD_DATA,
});

export const getDashboardDataSuccess = (data: any) => ({
    type: types.GET_DASHBOARD_DATA_SUCCESS,
    payload: data,
});

export const getDashboardDataFailure = (error: string) => ({
    type: types.GET_DASHBOARD_DATA_FAILURE,
    payload: error,
});
