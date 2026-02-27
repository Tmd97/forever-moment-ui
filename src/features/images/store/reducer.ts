import * as types from './action-types';

const initialState = {
    data: null,
    currentMetadata: null,
    currentPreviewUrl: null,
    loading: false,
    error: null,
    status: 'IDLE',
};

export const imageReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_IMAGE_DATA:
            return { ...state, loading: true };
        case types.GET_IMAGE_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_IMAGE_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.UPLOAD_IMAGE:
            return { ...state, loading: true, status: types.UPLOAD_IMAGE, error: null };
        case types.UPLOAD_IMAGE_SUCCESS:
            return { ...state, loading: false, status: types.UPLOAD_IMAGE_SUCCESS };
        case types.UPLOAD_IMAGE_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.DELETE_IMAGE:
            return { ...state, loading: true, status: types.DELETE_IMAGE, error: null };
        case types.DELETE_IMAGE_SUCCESS:
            return { ...state, loading: false, status: types.DELETE_IMAGE_SUCCESS };
        case types.DELETE_IMAGE_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.DOWNLOAD_IMAGE:
            return { ...state, status: types.DOWNLOAD_IMAGE, currentPreviewUrl: null };
        case types.DOWNLOAD_IMAGE_SUCCESS:
            return { ...state, status: types.DOWNLOAD_IMAGE_SUCCESS, currentPreviewUrl: action.payload };
        case types.DOWNLOAD_IMAGE_FAILURE:
            return { ...state, status: 'FAILURE', error: action.payload, currentPreviewUrl: null };

        case types.GET_IMAGE_METADATA:
            return { ...state, loading: true };
        case types.GET_IMAGE_METADATA_SUCCESS:
            return { ...state, loading: false, currentMetadata: action.payload };
        case types.GET_IMAGE_METADATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };

        default:
            return state;
    }
};
