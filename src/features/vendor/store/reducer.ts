import * as types from './action-types';
import type { VendorState } from './action-types';

const initialState: VendorState = {
    data: null,
    loading: false,
    error: null,
};

export const vendorReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_VENDORS:
            return { ...state, loading: true };
        case types.GET_VENDORS_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_VENDORS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
