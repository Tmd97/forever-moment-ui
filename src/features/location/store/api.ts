import axios from '@/utils/Http';

export const fetchLocationData = async () => {
    return await axios.get('/admin/locations');
};

export const createLocationApi = async (data: any) => {
    return await axios.post('/admin/locations', data);
};

export const deleteLocationApi = async (id: number) => {
    return await axios.delete(`/admin/locations/${id}`);
};

export const updateLocationApi = async (id: number, data: any) => {
    return await axios.put(`/admin/locations/${id}`, data);
};

export const fetchPincodeData = async (locationId: number) => {
    return await axios.get(`/admin/locations/${locationId}/pincodes`);
};

export const createPincodeApi = async (data: any) => {
    return await axios.post('/admin/locations/pincodes', data);
};

export const deletePincodeApi = async (id: number) => {
    return await axios.delete(`/admin/locations/pincodes/${id}`);
};

export const updatePincodeApi = async (id: number, data: any) => {
    return await axios.put(`/admin/locations/pincodes/${id}`, data);
};
