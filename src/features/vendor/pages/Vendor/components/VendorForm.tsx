import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import type { Vendor } from '../../../store/types';

interface VendorFormProps {
    initialData?: Partial<Vendor>;
    onSubmit: (data: Omit<Vendor, 'id' | 'rating'>) => void;
    onCancel: () => void;
    submitLabel: string;
}

export const VendorForm = ({ initialData, onSubmit, onCancel, submitLabel }: VendorFormProps) => {
    const [formData, setFormData] = useState<Omit<Vendor, 'id' | 'rating'>>({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        category: 'Photography',
        status: 'Active'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                contactPerson: initialData.contactPerson || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                category: initialData.category || 'Photography',
                status: initialData.status || 'Active'
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4 pt-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Business Name</label>
                    <input
                        type='text'
                        className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition'
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Contact Person</label>
                    <input
                        type='text'
                        className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition'
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Email</label>
                    <input
                        type='email'
                        className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition'
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Phone</label>
                    <input
                        type='tel'
                        className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition'
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Category</label>
                    <select
                        className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition'
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value='Photography'>Photography</option>
                        <option value='Catering'>Catering</option>
                        <option value='Decoration'>Decoration</option>
                        <option value='Venue'>Venue</option>
                        <option value='Music'>Music</option>
                    </select>
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Status</label>
                    <select
                        className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition'
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Vendor['status'] })}
                    >
                        <option value='Active'>Active</option>
                        <option value='Inactive'>Inactive</option>
                        <option value='Pending'>Pending</option>
                    </select>
                </div>
            </div>
            <div className='flex justify-end gap-3 mt-6'>
                <Button type='button' variant='secondary' onClick={onCancel}>Cancel</Button>
                <Button type='submit' variant='default'>{submitLabel}</Button>
            </div>
        </form>
    );
};
