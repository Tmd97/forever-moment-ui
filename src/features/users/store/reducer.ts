import * as types from './action-types';

const initialState = {
    data: null,
    loading: false,
    error: null,
};

export const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_USERS_DATA:
            return { ...state, loading: true };
        case types.GET_USERS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_USERS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
