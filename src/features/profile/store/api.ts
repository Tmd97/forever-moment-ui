import axios from '@/utils/Http';

export const fetchUserProfileApi = async () => {
    return await axios.get('/user/profile');
};

export const updateUserProfileApi = async (data: any) => {
    return await axios.put('/user/profile', data);
};
