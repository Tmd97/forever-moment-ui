import * as types from './action-types';

const initialState = {
    data: null,
    loading: false,
    error: null,
};

export const categoryReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_CATEGORY_DATA:
            return { ...state, loading: true };
        case types.GET_CATEGORY_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_CATEGORY_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.CREATE_CATEGORY:
            return { ...state, loading: true, error: null };
        case types.CREATE_CATEGORY_SUCCESS:
            return { ...state, loading: false }; // Data might be refreshed by getCategoryData
        case types.CREATE_CATEGORY_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.DELETE_CATEGORY:
            return { ...state, loading: true, error: null };
        case types.DELETE_CATEGORY_SUCCESS:
            return { ...state, loading: false };
        case types.DELETE_CATEGORY_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.UPDATE_CATEGORY:
            return { ...state, loading: true, error: null };
        case types.UPDATE_CATEGORY_SUCCESS:
            return { ...state, loading: false };
        case types.UPDATE_CATEGORY_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
