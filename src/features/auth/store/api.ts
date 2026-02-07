import axios from '@/utils/Http';

export const loginApi = async (credentials: any) => {
    try {
        const response = await axios.post('auth/login', credentials);
        // Backend returns data in response.data.response
        if (response.data && response.data.code === 200) {
            return response.data.response;
        }
        throw new Error(response.data?.msg || 'Login failed');
    } catch (error) {
        throw error;
    }
};
