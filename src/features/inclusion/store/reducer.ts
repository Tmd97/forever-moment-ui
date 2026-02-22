import * as types from './action-types';

const initialState = {
    data: null,
    loading: false,
    error: null,
    status: 'IDLE',
};

export const inclusionReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_INCLUSION_DATA:
            return { ...state, loading: true };
        case types.GET_INCLUSION_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_INCLUSION_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.CREATE_INCLUSION:
            return { ...state, loading: true, status: types.CREATE_INCLUSION, error: null };
        case types.CREATE_INCLUSION_SUCCESS:
            return { ...state, loading: false, status: types.CREATE_INCLUSION_SUCCESS };
        case types.CREATE_INCLUSION_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.DELETE_INCLUSION:
            return { ...state, loading: true, status: types.DELETE_INCLUSION, error: null };
        case types.DELETE_INCLUSION_SUCCESS:
            return { ...state, loading: false, status: types.DELETE_INCLUSION_SUCCESS };
        case types.DELETE_INCLUSION_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.UPDATE_INCLUSION:
            return { ...state, loading: true, status: types.UPDATE_INCLUSION, error: null };
        case types.UPDATE_INCLUSION_SUCCESS:
            return { ...state, loading: false, status: types.UPDATE_INCLUSION_SUCCESS };
        case types.UPDATE_INCLUSION_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.REORDER_INCLUSION:
            return { ...state, error: null };
        case types.REORDER_INCLUSION_SUCCESS:
            return { ...state, loading: false };
        case types.REORDER_INCLUSION_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };

        default:
            return state;
    }
};
