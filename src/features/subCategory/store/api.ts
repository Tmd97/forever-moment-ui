import Http from '@/utils/Http';

export const getSubCategories = async () => {
    return await Http.get('/admin/subcategories');
};

export const createSubCategory = async (payload: any) => {
    return await Http.post('/admin/subcategories/category', payload);
};

export const updateSubCategory = async (id: number, payload: any) => {
    return await Http.put(`/admin/subcategories/${id}`, payload);
};

export const deleteSubCategory = async (id: number) => {
    return await Http.delete(`/admin/subcategories/${id}`);
};
