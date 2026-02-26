import axios from '@/utils/Http';

const basePath = '/admin/addons';

export const getAddonDataApi = async () => {
    return await axios.get(basePath);
};

export const createAddonApi = async (data: any) => {
    return await axios.post(basePath, data);
};

export const updateAddonApi = async (id: number, data: any) => {
    return await axios.put(`${basePath}/${id}`, data);
};

export const deleteAddonApi = async (id: number) => {
    return await axios.delete(`${basePath}/${id}`);
};
