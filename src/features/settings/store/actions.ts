import * as types from './action-types';

export const getSettingsData = () => ({
    type: types.GET_SETTINGS_DATA,
});

export const getSettingsDataSuccess = (data: any) => ({
    type: types.GET_SETTINGS_DATA_SUCCESS,
    payload: data,
});

export const getSettingsDataFailure = (error: string) => ({
    type: types.GET_SETTINGS_DATA_FAILURE,
    payload: error,
});
