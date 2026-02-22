import * as types from './action-types';

const initialState = {
    data: [],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const slotReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_SLOT_DATA:
            return { ...state, loading: true };
        case types.GET_SLOT_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case 'FAILURE':
            if ([types.CREATE_SLOT, types.UPDATE_SLOT, types.DELETE_SLOT, types.GET_SLOT_DATA].includes(action.type)) {
                return { ...state, loading: false, error: action.payload, status: 'FAILURE' };
            }
            return { ...state, loading: false, error: action.payload };

        case types.CREATE_SLOT:
            return { ...state, loading: true, status: types.CREATE_SLOT, error: null };
        case types.CREATE_SLOT_SUCCESS:
            return { ...state, loading: false, status: types.CREATE_SLOT_SUCCESS };

        case types.DELETE_SLOT:
            return { ...state, loading: true, status: types.DELETE_SLOT, error: null };
        case types.DELETE_SLOT_SUCCESS:
            return { ...state, loading: false, status: types.DELETE_SLOT_SUCCESS };

        case types.UPDATE_SLOT:
            return { ...state, loading: true, status: types.UPDATE_SLOT, error: null };
        case types.UPDATE_SLOT_SUCCESS:
            return { ...state, loading: false, status: types.UPDATE_SLOT_SUCCESS };

        case types.RESET_SLOT_STATUS:
            return { ...state, status: 'IDLE', error: null };

        default:
            return state;
    }
};
