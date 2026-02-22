export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export interface User {
    id: string;
    email: string;
    name: string;
    fullName?: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
    dateOfBirth?: string;
    preferredCity?: string;
    roleId?: number;
    role: 'admin' | 'user';
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}
