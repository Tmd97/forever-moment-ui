import * as types from './action-types';

export const getHomeData = () => ({
    type: types.GET_HOME_DATA,
});

export const getHomeDataSuccess = (data: any) => ({
    type: types.GET_HOME_DATA_SUCCESS,
    payload: data,
});

export const getHomeDataFailure = (error: string) => ({
    type: types.GET_HOME_DATA_FAILURE,
    payload: error,
});
