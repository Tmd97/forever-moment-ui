import * as types from './action-types';

const initialState = {
    data: null,
    loading: false,
    error: null,
    status: 'IDLE',
};

export const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_USERS_DATA:
            return { ...state, loading: true };
        case types.GET_USERS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_USERS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.CREATE_USER:
            return { ...state, loading: true, status: types.CREATE_USER, error: null };
        case types.CREATE_USER_SUCCESS:
            return { ...state, loading: false, status: types.CREATE_USER_SUCCESS };
        case types.CREATE_USER_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.DELETE_USER:
            return { ...state, loading: true, status: types.DELETE_USER, error: null };
        case types.DELETE_USER_SUCCESS:
            return { ...state, loading: false, status: types.DELETE_USER_SUCCESS };
        case types.DELETE_USER_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.UPDATE_USER:
            return { ...state, loading: true, status: types.UPDATE_USER, error: null };
        case types.UPDATE_USER_SUCCESS:
            return { ...state, loading: false, status: types.UPDATE_USER_SUCCESS };
        case types.UPDATE_USER_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };

        default:
            return state;
    }
};
