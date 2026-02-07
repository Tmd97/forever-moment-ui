import * as types from './action-types';

const initialState = {
    data: null,
    loading: false,
    error: null,
};

export const roleReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_ROLES_DATA:
            return { ...state, loading: true };
        case types.GET_ROLES_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_ROLES_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
