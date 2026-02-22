import * as types from './action-types';

const initialState = {
    data: null,
    selectedExperienceDetail: null,
    loading: false,
    error: null,
    status: 'IDLE',
};

export const experienceReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_EXPERIENCE_DATA:
            return { ...state, loading: true };
        case types.GET_EXPERIENCE_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_EXPERIENCE_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.GET_EXPERIENCE_BY_ID:
            return { ...state, loading: true, error: null };
        case types.GET_EXPERIENCE_BY_ID_SUCCESS:
            return { ...state, loading: false, selectedExperienceDetail: action.payload };
        case types.GET_EXPERIENCE_BY_ID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.CREATE_EXPERIENCE:
            return { ...state, loading: true, status: types.CREATE_EXPERIENCE, error: null };
        case types.CREATE_EXPERIENCE_SUCCESS:
            return { ...state, loading: false, status: types.CREATE_EXPERIENCE_SUCCESS };
        case types.CREATE_EXPERIENCE_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.DELETE_EXPERIENCE:
            return { ...state, loading: true, status: types.DELETE_EXPERIENCE, error: null };
        case types.DELETE_EXPERIENCE_SUCCESS:
            return { ...state, loading: false, status: types.DELETE_EXPERIENCE_SUCCESS };
        case types.DELETE_EXPERIENCE_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.UPDATE_EXPERIENCE:
            return { ...state, loading: true, status: types.UPDATE_EXPERIENCE, error: null };
        case types.UPDATE_EXPERIENCE_SUCCESS:
            return { ...state, loading: false, status: types.UPDATE_EXPERIENCE_SUCCESS };
        case types.UPDATE_EXPERIENCE_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.REORDER_EXPERIENCE:
            return { ...state, error: null };
        case types.REORDER_EXPERIENCE_SUCCESS:
            return { ...state, loading: false };
        case types.REORDER_EXPERIENCE_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.TOGGLE_CANCELLATION_POLICY:
            return { ...state, loading: true, error: null };
        case types.TOGGLE_CANCELLATION_POLICY_SUCCESS:
            return { ...state, loading: false };
        case types.TOGGLE_CANCELLATION_POLICY_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.TOGGLE_INCLUSION:
            return { ...state, loading: true, error: null };
        case types.TOGGLE_INCLUSION_SUCCESS:
            return { ...state, loading: false };
        case types.TOGGLE_INCLUSION_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null, selectedExperienceDetail: null };

        default:
            return state;
    }
};
