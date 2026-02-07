import * as types from './action-types';
import type { Vendor } from './action-types';

export const getVendors = () => ({
    type: types.GET_VENDORS,
});

export const getVendorsSuccess = (data: Vendor[]) => ({
    type: types.GET_VENDORS_SUCCESS,
    payload: data,
});

export const getVendorsFailure = (error: string) => ({
    type: types.GET_VENDORS_FAILURE,
    payload: error,
});
