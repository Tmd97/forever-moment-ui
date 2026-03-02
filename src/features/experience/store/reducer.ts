import * as types from './action-types';

const initialState = {
    data: null,
    selectedExperienceDetail: null,
    loading: false,
    error: null,
    status: 'IDLE',
    experienceMedia: [],
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

        case types.TOGGLE_EXPERIENCE_ACTIVE:
            return { ...state, status: types.TOGGLE_EXPERIENCE_ACTIVE, error: null };
        case types.TOGGLE_EXPERIENCE_ACTIVE_SUCCESS:
            return { ...state, status: types.TOGGLE_EXPERIENCE_ACTIVE_SUCCESS };
        case types.TOGGLE_EXPERIENCE_ACTIVE_FAILURE:
            return { ...state, status: 'FAILURE', error: action.payload };

        case types.TOGGLE_EXPERIENCE_FEATURED:
            return { ...state, status: types.TOGGLE_EXPERIENCE_FEATURED, error: null };
        case types.TOGGLE_EXPERIENCE_FEATURED_SUCCESS:
            return { ...state, status: types.TOGGLE_EXPERIENCE_FEATURED_SUCCESS };
        case types.TOGGLE_EXPERIENCE_FEATURED_FAILURE:
            return { ...state, status: 'FAILURE', error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null, selectedExperienceDetail: null };

        case types.BULK_ATTACH_MEDIA:
        case types.DISASSOCIATE_MEDIA:
        case types.GET_EXPERIENCE_MEDIA:
            return { ...state, loading: true, error: null };
        case types.BULK_ATTACH_MEDIA_SUCCESS:
        case types.DISASSOCIATE_MEDIA_SUCCESS:
            return { ...state, loading: false };
        case types.GET_EXPERIENCE_MEDIA_SUCCESS:
            return { ...state, loading: false, experienceMedia: action.payload };
        case types.BULK_ATTACH_MEDIA_FAILURE:
        case types.DISASSOCIATE_MEDIA_FAILURE:
        case types.GET_EXPERIENCE_MEDIA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
