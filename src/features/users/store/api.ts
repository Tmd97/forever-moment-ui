import axios from '@/utils/Http';

export const fetchUsersData = async () => {
    return await axios.get('/admin/user/profiles');
};

export const createUserApi = async (data: any) => {
    return await axios.post('/auth/register', data);
};

export const deleteUserApi = async (id: number) => {
    return await axios.delete(`/admin/user/profile/${id}`);
};

export const updateUserApi = async (id: number, data: any) => {
    return await axios.put(`/admin/user/profile/${id}`, data);
};
