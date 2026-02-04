import * as types from './action-types';

export const getExperienceData = () => ({
    type: types.GET_EXPERIENCE_DATA,
});

export const getExperienceDataSuccess = (data: any) => ({
    type: types.GET_EXPERIENCE_DATA_SUCCESS,
    payload: data,
});

export const getExperienceDataFailure = (error: string) => ({
    type: types.GET_EXPERIENCE_DATA_FAILURE,
    payload: error,
});
