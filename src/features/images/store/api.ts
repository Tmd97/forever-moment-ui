import axios from '@/utils/Http';
import { getLoginSession } from '@/utils/storage';

export const fetchImagesApi = async () => {
    return await axios.get('/admin/images');
};

export const getImageUrl = (id: string) => {
    const rawBase = axios.defaults.baseURL || '';
    const cleanBase = rawBase.replace(/\/+$/, '');
    const url = `${cleanBase}/admin/images/${id}`;
    const token = getLoginSession("access_token");
    return token ? `${url}?accessToken=${token}` : url;
};

export const getMediaAssetUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    const rawBase = axios.defaults.baseURL || '';

    // Ensure rawBase is an absolute URL for URL constructor
    const normalizedBaseStr = rawBase.startsWith('http://') || rawBase.startsWith('https://')
        ? rawBase
        : `${window.location.origin}${rawBase.startsWith('/') ? '' : '/'}${rawBase}`;

    // Normalize path: if it starts with a slash, we need to be careful as 'new URL(path, base)' 
    // will strip the path part of the base if path starts with '/'.
    // We want to append path to normalizedBaseStr.
    const cleanBase = normalizedBaseStr.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');
    const url = `${cleanBase}/${cleanPath}`;
    const token = getLoginSession("access_token");

    return token ? `${url}?accessToken=${token}` : url;
};

export const uploadImageApi = async (files: File[], metadata: any = {}) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const metadataStr = JSON.stringify(metadata);

    return await axios.post('/admin/images/batch', formData, {
        params: { metadata: metadataStr },
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteImageApi = async (id: string) => {
    return await axios.delete(`/admin/images/${id}`);
};

export const downloadImageApi = async (id: string) => {
    return await axios.get(`/admin/images/${id}`, { responseType: 'blob' });
};

export const fetchImageMetadataApi = async (id: string) => {
    return await axios.get(`/admin/images/${id}/metadata`);
};
