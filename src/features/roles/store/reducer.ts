import * as types from './action-types';

const initialState = {
    data: null,
    loading: false,
    error: null,
    status: 'IDLE',
};

export const roleReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_ROLES_DATA:
            return { ...state, loading: true };
        case types.GET_ROLES_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_ROLES_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.CREATE_ROLE:
            return { ...state, loading: true, status: types.CREATE_ROLE, error: null };
        case types.UPDATE_ROLE:
            return { ...state, loading: true, status: types.UPDATE_ROLE, error: null };
        case types.DELETE_ROLE:
            return { ...state, loading: true, status: types.DELETE_ROLE, error: null };

        case types.CREATE_ROLE_SUCCESS:
            return { ...state, loading: false, status: types.CREATE_ROLE_SUCCESS };
        case types.UPDATE_ROLE_SUCCESS:
            return { ...state, loading: false, status: types.UPDATE_ROLE_SUCCESS };
        case types.DELETE_ROLE_SUCCESS:
            return { ...state, loading: false, status: types.DELETE_ROLE_SUCCESS };

        case types.CREATE_ROLE_FAILURE:
        case types.UPDATE_ROLE_FAILURE:
        case types.DELETE_ROLE_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };

        default:
            return state;
    }
};
