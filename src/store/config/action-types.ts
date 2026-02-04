import type { ConfigState } from '@/types/config';

// Action Types
export const LOAD_CONFIG_REQUEST = 'config/LOAD_CONFIG_REQUEST';
export const LOAD_CONFIG_SUCCESS = 'config/LOAD_CONFIG_SUCCESS';
export const LOAD_CONFIG_FAILURE = 'config/LOAD_CONFIG_FAILURE';

export const LOAD_NAVIGATION_SUCCESS = 'config/LOAD_NAVIGATION_SUCCESS';
export const LOAD_FORMS_SUCCESS = 'config/LOAD_FORMS_SUCCESS';
export const LOAD_TABLES_SUCCESS = 'config/LOAD_TABLES_SUCCESS';
export const LOAD_ROUTES_SUCCESS = 'config/LOAD_ROUTES_SUCCESS';
export const LOAD_PERMISSIONS_SUCCESS = 'config/LOAD_PERMISSIONS_SUCCESS';
export const LOAD_CONTENT_SUCCESS = 'config/LOAD_CONTENT_SUCCESS';
export const LOAD_THEME_SUCCESS = 'config/LOAD_THEME_SUCCESS';

export const CLEAR_CONFIG_CACHE = 'config/CLEAR_CONFIG_CACHE';

// Action Interfaces
interface LoadConfigRequestAction {
    type: typeof LOAD_CONFIG_REQUEST;
}

interface LoadConfigSuccessAction {
    type: typeof LOAD_CONFIG_SUCCESS;
    payload: Partial<ConfigState>;
}

interface LoadConfigFailureAction {
    type: typeof LOAD_CONFIG_FAILURE;
    payload: string;
}

interface LoadNavigationSuccessAction {
    type: typeof LOAD_NAVIGATION_SUCCESS;
    payload: ConfigState['navigation'];
}

interface LoadFormsSuccessAction {
    type: typeof LOAD_FORMS_SUCCESS;
    payload: ConfigState['forms'];
}

interface LoadTablesSuccessAction {
    type: typeof LOAD_TABLES_SUCCESS;
    payload: ConfigState['tables'];
}

interface LoadRoutesSuccessAction {
    type: typeof LOAD_ROUTES_SUCCESS;
    payload: ConfigState['routes'];
}

interface LoadPermissionsSuccessAction {
    type: typeof LOAD_PERMISSIONS_SUCCESS;
    payload: ConfigState['permissions'];
}

interface LoadContentSuccessAction {
    type: typeof LOAD_CONTENT_SUCCESS;
    payload: ConfigState['content'];
}

interface LoadThemeSuccessAction {
    type: typeof LOAD_THEME_SUCCESS;
    payload: ConfigState['theme'];
}

interface ClearConfigCacheAction {
    type: typeof CLEAR_CONFIG_CACHE;
}

export type ConfigActionTypes =
    | LoadConfigRequestAction
    | LoadConfigSuccessAction
    | LoadConfigFailureAction
    | LoadNavigationSuccessAction
    | LoadFormsSuccessAction
    | LoadTablesSuccessAction
    | LoadRoutesSuccessAction
    | LoadPermissionsSuccessAction
    | LoadContentSuccessAction
    | LoadThemeSuccessAction
    | ClearConfigCacheAction;
