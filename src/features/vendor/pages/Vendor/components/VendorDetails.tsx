import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import { Mail, Phone, Star, Calendar } from 'lucide-react';
import type { Vendor } from '../../../store/types';

interface VendorDetailsProps {
    vendor: Vendor;
    onEdit: () => void;
    onClose: () => void;
}

export const VendorDetails = ({ vendor, onEdit }: VendorDetailsProps) => {
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{vendor.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.category}</p>
                </div>
                <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    vendor.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        vendor.status === 'Inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                )}>
                    {vendor.status}
                </span>
            </div>

            {/* Quick Stats or Actions could act here */}

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Contact Information</h3>
                <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="w-5 h-5 flex items-center justify-center mr-2 text-gray-400">
                            <span className="font-bold text-xs">CP</span>
                        </span>
                        <span>{vendor.contactPerson}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4 mr-3 text-gray-400" />
                        <a href={`mailto:${vendor.email}`} className="hover:text-blue-600 hover:underline">{vendor.email}</a>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4 mr-3 text-gray-400" />
                        <a href={`tel:${vendor.phone}`} className="hover:text-blue-600 hover:underline">{vendor.phone}</a>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Performance</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{vendor.rating || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                            <p className="font-semibold text-gray-900 dark:text-white">Feb 2025</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button variant="default" className="w-full" onClick={onEdit}>
                    Edit Vendor
                </Button>
            </div>
        </div>
    );
};
