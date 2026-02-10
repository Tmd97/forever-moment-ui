import axios from '@/utils/Http';

export const fetchCategoryData = async () => {
    return await axios.get('/admin/categories');
};

export const createCategoryApi = async (data: any) => {
    return await axios.post('/admin/categories', data);
};

export const deleteCategoryApi = async (id: number) => {
    return await axios.delete(`/admin/categories/${id}`);
};

export const updateCategoryApi = async (id: number, data: any) => {
    return await axios.put(`/admin/categories/${id}`, data);
};
