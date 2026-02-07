import type { Vendor } from './action-types';
import { VENDORS_DATA } from '../../data/mockData';

export const fetchVendors = async (): Promise<Vendor[]> => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // Casting VENDORS_DATA to any to match strict Vendor type if there are minor mismatches 
            // (e.g. status string literal vs string), though they should match.
            resolve(VENDORS_DATA as unknown as Vendor[]);
        }, 1000);
    });
};
