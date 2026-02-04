export type RequestStatus = 'idle' | 'pending' | 'success' | 'error';

export const RequestStatus = {
    IDLE: 'idle' as const,
    PENDING: 'pending' as const,
    SUCCESS: 'success' as const,
    ERROR: 'error' as const,
};

export interface AsyncState<T = any> {
    data: T | null;
    status: RequestStatus;
    error: string | null;
}

export const createInitialAsyncState = <T = any>(): AsyncState<T> => ({
    data: null,
    status: RequestStatus.IDLE,
    error: null,
});

export const isLoading = (status: RequestStatus): boolean =>
    status === RequestStatus.PENDING;

export const isSuccess = (status: RequestStatus): boolean =>
    status === RequestStatus.SUCCESS;

export const isError = (status: RequestStatus): boolean =>
    status === RequestStatus.ERROR;

export const isIdle = (status: RequestStatus): boolean =>
    status === RequestStatus.IDLE;
