import * as types from './action-types';

const initialState = {
    data: null,
    loading: false,
    error: null,
    status: 'IDLE',
};

export const cancellationPolicyReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_CANCELLATION_POLICY_DATA:
            return { ...state, loading: true };
        case types.GET_CANCELLATION_POLICY_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_CANCELLATION_POLICY_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.CREATE_CANCELLATION_POLICY:
            return { ...state, loading: true, status: types.CREATE_CANCELLATION_POLICY, error: null };
        case types.CREATE_CANCELLATION_POLICY_SUCCESS:
            return { ...state, loading: false, status: types.CREATE_CANCELLATION_POLICY_SUCCESS };
        case types.CREATE_CANCELLATION_POLICY_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.DELETE_CANCELLATION_POLICY:
            return { ...state, loading: true, status: types.DELETE_CANCELLATION_POLICY, error: null };
        case types.DELETE_CANCELLATION_POLICY_SUCCESS:
            return { ...state, loading: false, status: types.DELETE_CANCELLATION_POLICY_SUCCESS };
        case types.DELETE_CANCELLATION_POLICY_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.UPDATE_CANCELLATION_POLICY:
            return { ...state, loading: true, status: types.UPDATE_CANCELLATION_POLICY, error: null };
        case types.UPDATE_CANCELLATION_POLICY_SUCCESS:
            return { ...state, loading: false, status: types.UPDATE_CANCELLATION_POLICY_SUCCESS };
        case types.UPDATE_CANCELLATION_POLICY_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.REORDER_CANCELLATION_POLICY:
            return { ...state, error: null };
        case types.REORDER_CANCELLATION_POLICY_SUCCESS:
            return { ...state, loading: false };
        case types.REORDER_CANCELLATION_POLICY_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };

        default:
            return state;
    }
};
