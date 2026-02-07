export const GET_VENDORS = 'GET_VENDORS';
export const GET_VENDORS_SUCCESS = 'GET_VENDORS_SUCCESS';
export const GET_VENDORS_FAILURE = 'GET_VENDORS_FAILURE';

export interface Vendor {
    id: string | number;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    category: string;
    status: 'Active' | 'Inactive' | 'Pending';
    rating?: number;
}

export interface VendorState {
    data: Vendor[] | null;
    loading: boolean;
    error: string | null;
}
