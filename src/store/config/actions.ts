import { configService } from '@/services/configService';
import type { AppDispatch } from '@/store/config';
import * as types from './action-types';

/**
 * Load all configurations
 */
export const loadAllConfigs = (forceRefresh = false) => {
    return async (dispatch: AppDispatch) => {
        dispatch({ type: types.LOAD_CONFIG_REQUEST });

        try {
            const configs = await configService.getAllConfigs(forceRefresh);

            dispatch({
                type: types.LOAD_CONFIG_SUCCESS,
                payload: {
                    navigation: configs.navigation,
                    forms: configs.forms,
                    tables: configs.tables,
                    routes: configs.routes,
                    permissions: configs.permissions,
                    content: configs.content,
                    theme: configs.theme,
                    lastUpdated: Date.now(),
                },
            });
        } catch (error) {
            dispatch({
                type: types.LOAD_CONFIG_FAILURE,
                payload: error instanceof Error ? error.message : 'Failed to load configurations',
            });
        }
    };
};

/**
 * Load navigation config
 */
export const loadNavigationConfig = (forceRefresh = false) => {
    return async (dispatch: AppDispatch) => {
        try {
            const navigation = await configService.getNavigationConfig(forceRefresh);
            dispatch({
                type: types.LOAD_NAVIGATION_SUCCESS,
                payload: navigation,
            });
        } catch (error) {
            console.error('Failed to load navigation config', error);
        }
    };
};

/**
 * Load forms config
 */
export const loadFormsConfig = (forceRefresh = false) => {
    return async (dispatch: AppDispatch) => {
        try {
            const forms = await configService.getFormsConfig(forceRefresh);
            dispatch({
                type: types.LOAD_FORMS_SUCCESS,
                payload: forms,
            });
        } catch (error) {
            console.error('Failed to load forms config', error);
        }
    };
};

/**
 * Load tables config
 */
export const loadTablesConfig = (forceRefresh = false) => {
    return async (dispatch: AppDispatch) => {
        try {
            const tables = await configService.getTablesConfig(forceRefresh);
            dispatch({
                type: types.LOAD_TABLES_SUCCESS,
                payload: tables,
            });
        } catch (error) {
            console.error('Failed to load tables config', error);
        }
    };
};

/**
 * Load routes config
 */
export const loadRoutesConfig = (forceRefresh = false) => {
    return async (dispatch: AppDispatch) => {
        try {
            const routes = await configService.getRoutesConfig(forceRefresh);
            dispatch({
                type: types.LOAD_ROUTES_SUCCESS,
                payload: routes,
            });
        } catch (error) {
            console.error('Failed to load routes config', error);
        }
    };
};

/**
 * Load permissions config
 */
export const loadPermissionsConfig = (forceRefresh = false) => {
    return async (dispatch: AppDispatch) => {
        try {
            const permissions = await configService.getPermissionsConfig(forceRefresh);
            dispatch({
                type: types.LOAD_PERMISSIONS_SUCCESS,
                payload: permissions,
            });
        } catch (error) {
            console.error('Failed to load permissions config', error);
        }
    };
};

/**
 * Load content config
 */
export const loadContentConfig = (forceRefresh = false) => {
    return async (dispatch: AppDispatch) => {
        try {
            const content = await configService.getContentConfig(forceRefresh);
            dispatch({
                type: types.LOAD_CONTENT_SUCCESS,
                payload: content,
            });
        } catch (error) {
            console.error('Failed to load content config', error);
        }
    };
};

/**
 * Load theme config
 */
export const loadThemeConfig = (forceRefresh = false) => {
    return async (dispatch: AppDispatch) => {
        try {
            const theme = await configService.getThemeConfig(forceRefresh);
            dispatch({
                type: types.LOAD_THEME_SUCCESS,
                payload: theme,
            });
        } catch (error) {
            console.error('Failed to load theme config', error);
        }
    };
};

/**
 * Clear config cache
 */
export const clearConfigCache = () => {
    configService.clearCache();
    return {
        type: types.CLEAR_CONFIG_CACHE,
    };
};
