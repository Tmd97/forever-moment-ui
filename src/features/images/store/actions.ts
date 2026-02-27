import * as types from './action-types';
import { fetchImagesApi, uploadImageApi, deleteImageApi, fetchImageMetadataApi, downloadImageApi } from './api';
import toast from 'react-hot-toast';

export const getImages = () => async (dispatch: any) => {
    dispatch({ type: types.GET_IMAGE_DATA });
    try {
        const response = await fetchImagesApi();
        dispatch({
            type: types.GET_IMAGE_DATA_SUCCESS,
            payload: response.data.response || response.data,
        });
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to fetch images';
        dispatch({
            type: types.GET_IMAGE_DATA_FAILURE,
            payload: message,
        });
        toast.error(message);
    }
};

export const uploadImage = (file: File, metadata: any = {}) => async (dispatch: any) => {
    dispatch({ type: types.UPLOAD_IMAGE });
    try {
        const response = await uploadImageApi(file, metadata);
        dispatch({
            type: types.UPLOAD_IMAGE_SUCCESS,
            payload: response.data,
        });
        toast.success(response.data.msg || 'Image uploaded successfully');
        dispatch(getImages());
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to upload image';
        dispatch({
            type: types.UPLOAD_IMAGE_FAILURE,
            payload: message,
        });
        toast.error(message);
        throw error;
    }
};

export const deleteImage = (id: string) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_IMAGE });
    try {
        await deleteImageApi(id);
        dispatch({ type: types.DELETE_IMAGE_SUCCESS });
        dispatch(getImages());
        toast.success('Image deleted successfully');
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to delete image';
        dispatch({ type: types.DELETE_IMAGE_FAILURE, payload: message });
        toast.error(message);
    }
};

export const downloadImage = (id: string, fileName?: string) => async (dispatch: any) => {
    dispatch({ type: types.DOWNLOAD_IMAGE });
    try {
        const response = await downloadImageApi(id);
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const imageUrl = URL.createObjectURL(blob);

        if (fileName) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }

        dispatch({
            type: types.DOWNLOAD_IMAGE_SUCCESS,
            payload: imageUrl
        });
    } catch (error: any) {
        dispatch({ type: types.DOWNLOAD_IMAGE_FAILURE, payload: error.message });
        toast.error(fileName ? 'Failed to download image' : 'Failed to load image preview');
    }
};

export const getImageMetadata = (id: string) => async (dispatch: any) => {
    dispatch({ type: types.GET_IMAGE_METADATA });
    try {
        const response = await fetchImageMetadataApi(id);
        dispatch({ type: types.GET_IMAGE_METADATA_SUCCESS, payload: response.data?.response });
    } catch (error: any) {
        dispatch({ type: types.GET_IMAGE_METADATA_FAILURE, payload: error.message });
    }
};

export const resetStatus = () => ({ type: types.RESET_STATUS });
