import axios from '@/utils/Http';

export const fetchCancellationPolicyData = async () => {
    return await axios.get('/admin/cancellation-policies');
};

export const createCancellationPolicyApi = async (data: any) => {
    return await axios.post('/admin/cancellation-policies', data);
};

export const deleteCancellationPolicyApi = async (id: number) => {
    return await axios.delete(`/admin/cancellation-policies/${id}`);
};

export const updateCancellationPolicyApi = async (id: number, data: any) => {
    return await axios.put(`/admin/cancellation-policies/${id}`, data);
};

export const reorderCancellationPolicyApi = async (data: { id: number; newPosition: number }) => {
    return await axios.patch('/admin/cancellation-policies/reorder', data);
};
