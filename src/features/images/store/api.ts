import axios from '@/utils/Http';

export const fetchImagesApi = async () => {
    return await axios.get('/admin/images');
};

export const getImageUrl = (id: string) => {
    return `${axios.defaults.baseURL}/admin/images/${id}`;
};

export const uploadImageApi = async (file: File, metadata: any = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    const metadataStr = JSON.stringify(metadata);

    return await axios.post('/admin/images', formData, {
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
