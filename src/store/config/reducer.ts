import type { ConfigState } from '@/types/config';
import * as types from './action-types';
import type { ConfigActionTypes } from './action-types';

const initialState: ConfigState = {
    navigation: null,
    forms: null,
    tables: null,
    routes: null,
    permissions: null,
    content: null,
    theme: null,
    loading: false,
    error: null,
    lastUpdated: null,
};

export const configReducer = (
    state = initialState,
    action: ConfigActionTypes
): ConfigState => {
    switch (action.type) {
        case types.LOAD_CONFIG_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case types.LOAD_CONFIG_SUCCESS:
            return {
                ...state,
                ...action.payload,
                loading: false,
                error: null,
            };

        case types.LOAD_CONFIG_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case types.LOAD_NAVIGATION_SUCCESS:
            return {
                ...state,
                navigation: action.payload,
                lastUpdated: Date.now(),
            };

        case types.LOAD_FORMS_SUCCESS:
            return {
                ...state,
                forms: action.payload,
                lastUpdated: Date.now(),
            };

        case types.LOAD_TABLES_SUCCESS:
            return {
                ...state,
                tables: action.payload,
                lastUpdated: Date.now(),
            };

        case types.LOAD_ROUTES_SUCCESS:
            return {
                ...state,
                routes: action.payload,
                lastUpdated: Date.now(),
            };

        case types.LOAD_PERMISSIONS_SUCCESS:
            return {
                ...state,
                permissions: action.payload,
                lastUpdated: Date.now(),
            };

        case types.LOAD_CONTENT_SUCCESS:
            return {
                ...state,
                content: action.payload,
                lastUpdated: Date.now(),
            };

        case types.LOAD_THEME_SUCCESS:
            return {
                ...state,
                theme: action.payload,
                lastUpdated: Date.now(),
            };

        case types.CLEAR_CONFIG_CACHE:
            return initialState;

        default:
            return state;
    }
};
