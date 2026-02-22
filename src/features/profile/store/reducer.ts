import * as types from './action-types';
import type { ProfileState } from './action-types';
import { storage } from '@/utils/storage';

const initialState: ProfileState = {
    data: null,
    loading: false,
    error: null,
    status: 'IDLE',
};

export const profileReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_USER_PROFILE:
            return { ...state, loading: true, error: null };

        case types.GET_USER_PROFILE_SUCCESS:
            // Sync with auth storage to keep the global user updated across reloads
            const currentUser = storage.getUser() || {};
            const updatedUser = { ...currentUser, ...action.payload };
            storage.setUser(updatedUser);

            return {
                ...state,
                loading: false,
                data: action.payload
            };

        case types.GET_USER_PROFILE_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.UPDATE_USER_PROFILE:
            return { ...state, loading: true, status: types.UPDATE_USER_PROFILE, error: null };

        case types.UPDATE_USER_PROFILE_SUCCESS:
            const currentUserAfterUpd = storage.getUser() || {};
            const newlyUpdatedUser = { ...currentUserAfterUpd, ...action.payload };
            storage.setUser(newlyUpdatedUser);

            return {
                ...state,
                loading: false,
                status: types.UPDATE_USER_PROFILE_SUCCESS,
                data: { ...state.data, ...action.payload }
            };

        case types.UPDATE_USER_PROFILE_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.RESET_PROFILE_STATUS:
            return { ...state, status: 'IDLE', error: null };

        default:
            return state;
    }
};
