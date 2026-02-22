import axios from '@/utils/Http';

export const fetchSlotData = async () => {
    return await axios.get('/admin/slots');
};

export const createSlot = async (data: any) => {
    return await axios.post('/admin/slots', data);
};

export const updateSlot = async (id: number, data: any) => {
    return await axios.put(`/admin/slots/${id}`, data);
};

export const deleteSlot = async (id: number) => {
    return await axios.delete(`/admin/slots/${id}`);
};
