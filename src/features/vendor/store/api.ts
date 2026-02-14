import { VENDORS_DATA } from '../../data/mockData';

export const fetchVendors = async (): Promise<any> => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(VENDORS_DATA);
        }, 1000);
    });
};
