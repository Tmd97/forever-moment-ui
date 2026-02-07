import * as types from './action-types';
import type { AuthState } from './action-types';
import { getLoginSession, setLoginSession, storage } from '@/utils/storage';

// Check local storage for initial state using storage utility
const token = getLoginSession('access_token');
const user = storage.getUser();

const initialState: AuthState = {
    isAuthenticated: !!token,
    user: user,
    token: token,
    loading: false,
    error: null,
};

export const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.LOGIN_START:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case types.LOGIN_SUCCESS:
            // Persist to local storage using utility
            // Payload is now the 'response' object from backend: { token, email, ... }
            // Payload is now the 'response' object from backend: { token, email, ... }
            const newToken = action.payload.token;
            // Construct user object from payload
            // Ensure role is present for ProtectedRoute (default to 'admin' if not provided)
            const newUser = {
                id: action.payload.id || '1',
                email: action.payload.email,
                name: action.payload.name || 'Admin User',
                role: action.payload.role || 'admin'
            };

            setLoginSession('access_token', newToken);
            storage.setUser(newUser);

            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: newUser,
                token: newToken,
                error: null,
            };
        case types.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                token: null,
                error: action.payload,
            };
        case types.LOGOUT:
            // Clear local storage using utility
            storage.clearToken();
            storage.clearUser();
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};
