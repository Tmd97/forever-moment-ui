// Addon Action Types
export const GET_ADDON_DATA_REQUEST = 'GET_ADDON_DATA_REQUEST';
export const GET_ADDON_DATA_SUCCESS = 'GET_ADDON_DATA_SUCCESS';
export const GET_ADDON_DATA_FAILURE = 'GET_ADDON_DATA_FAILURE';

export const GET_ADDON_BY_ID_REQUEST = 'GET_ADDON_BY_ID_REQUEST';
export const GET_ADDON_BY_ID_SUCCESS = 'GET_ADDON_BY_ID_SUCCESS';
export const GET_ADDON_BY_ID_FAILURE = 'GET_ADDON_BY_ID_FAILURE';

export const ADD_ADDON_REQUEST = 'ADD_ADDON_REQUEST';
export const ADD_ADDON_SUCCESS = 'ADD_ADDON_SUCCESS';
export const ADD_ADDON_FAILURE = 'ADD_ADDON_FAILURE';

export const UPDATE_ADDON_REQUEST = 'UPDATE_ADDON_REQUEST';
export const UPDATE_ADDON_SUCCESS = 'UPDATE_ADDON_SUCCESS';
export const UPDATE_ADDON_FAILURE = 'UPDATE_ADDON_FAILURE';

export const DELETE_ADDON_REQUEST = 'DELETE_ADDON_REQUEST';
export const DELETE_ADDON_SUCCESS = 'DELETE_ADDON_SUCCESS';
export const DELETE_ADDON_FAILURE = 'DELETE_ADDON_FAILURE';

export const RESET_ADDON_STATUS = 'RESET_ADDON_STATUS';

export interface AddonType {
    id: number;
    name: string;
    description: string;
    icon: string;
    basePrice: number;
    isActive: boolean;
}
