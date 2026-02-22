import axios from '@/utils/Http';

export const fetchInclusionData = async () => {
    return await axios.get('/admin/inclusions');
};

export const createInclusionApi = async (data: any) => {
    return await axios.post('/admin/inclusions', data);
};

export const deleteInclusionApi = async (id: number) => {
    return await axios.delete(`/admin/inclusions/${id}`);
};

export const updateInclusionApi = async (id: number, data: any) => {
    return await axios.put(`/admin/inclusions/${id}`, data);
};

export const reorderInclusionApi = async (data: { id: number; newPosition: number }) => {
    return await axios.patch('/admin/inclusions/reorder', data);
};
