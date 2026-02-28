import { Button } from '@/components/common/Button';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { Mail, Phone, Star, Calendar } from 'lucide-react';
import type { Vendor } from './Vendor';

interface VendorDetailsProps {
    vendor: Vendor;
    onEdit: () => void;
    onClose: () => void;
    updateVendor: (id: number, payload: any) => Promise<any>;
}

export const VendorDetails = ({ vendor, onEdit, updateVendor }: VendorDetailsProps) => {
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{vendor.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.category}</p>
                </div>
                <EditableStatusBadge
                    status={vendor.status}
                    options={[
                        { label: 'Active', value: 'Active' },
                        { label: 'Inactive', value: 'Inactive' },
                        { label: 'Pending', value: 'Pending' }
                    ]}
                    onChange={async (val) => {
                        if (val === vendor.status) return;
                        try {
                            await updateVendor(vendor.id, { status: val });
                        } catch (e) { console.error(e); }
                    }}
                />
            </div>

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
