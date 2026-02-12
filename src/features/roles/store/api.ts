import axios from '@/utils/Http';

export const fetchRolesData = async () => {
    return await axios.get('/admin/roles');
};

export const createRoleApi = async (data: any) => {
    return await axios.post('/admin/roles', data);
};

export const updateRoleApi = async (id: number, data: any) => {
    return await axios.put(`/admin/roles/${id}`, data);
};

export const deleteRoleApi = async (id: number) => {
    return await axios.delete(`/admin/roles/${id}`);
};
