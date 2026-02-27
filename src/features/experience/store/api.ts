import axios from '@/utils/Http';

export const fetchExperienceData = async () => {
    return await axios.get('/admin/experiences');
};

export const fetchExperienceByIdApi = async (id: number) => {
    return await axios.get(`/admin/experiences/${id}`);
};

export const createExperienceApi = async (data: any) => {
    return await axios.post('/admin/experiences', data);
};

export const deleteExperienceApi = async (id: number) => {
    return await axios.delete(`/admin/experiences/${id}`);
};

export const updateExperienceApi = async (id: number, data: any) => {
    return await axios.put(`/admin/experiences/${id}`, data);
};

export const reorderExperienceApi = async (data: { id: number; newPosition: number }) => {
    return await axios.patch('/admin/experiences/reorder', data);
};

export const associateCancellationPolicyApi = async (experienceId: number, policyId: number) => {
    return await axios.post(`/admin/experiences/${experienceId}/cancellation-policies/${policyId}`, {});
};

export const disassociateCancellationPolicyApi = async (experienceId: number, policyId: number) => {
    return await axios.delete(`/admin/experiences/${experienceId}/cancellation-policies/${policyId}`);
};

export const associateInclusionApi = async (experienceId: number, inclusionId: number) => {
    return await axios.post(`/admin/experiences/${experienceId}/inclusions/${inclusionId}`, {});
};

export const disassociateInclusionApi = async (experienceId: number, inclusionId: number) => {
    return await axios.delete(`/admin/experiences/${experienceId}/inclusions/${inclusionId}`);
};

export const associateLocationApi = async (locationId: number, experienceId: number, data: any) => {
    return await axios.post(`/admin/locations/${locationId}/experiences/${experienceId}`, data);
};

export const updateExperienceLocationApi = async (locationId: number, experienceId: number, data: any) => {
    return await axios.put(`/admin/locations/${locationId}/experiences/${experienceId}`, data);
};

export const disassociateLocationApi = async (locationId: number, experienceId: number) => {
    return await axios.delete(`/admin/locations/${locationId}/experiences/${experienceId}`);
};

export const associateAddonApi = async (experienceId: number, addonId: number, data: any) => {
    return await axios.post(`/admin/experiences/${experienceId}/addons/${addonId}`, {}, { params: data });
};

export const disassociateAddonApi = async (experienceId: number, addonId: number) => {
    return await axios.delete(`/admin/experiences/${experienceId}/addons/${addonId}`);
};
