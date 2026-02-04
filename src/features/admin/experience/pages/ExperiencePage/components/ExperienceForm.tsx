import { useState } from 'react';
import { Button } from '@/components/admin/common/Button';

interface ExperienceFormProps {
    initialData?: { title: string; category: string; price: string; status: string };
    onSubmit: (data: { title: string; category: string; price: string; status: string }) => void;
    onCancel: () => void;
    submitLabel: string;
}

export const ExperienceForm = ({ initialData, onSubmit, onCancel, submitLabel }: ExperienceFormProps) => {
    const [formData, setFormData] = useState(initialData || { title: '', category: '', price: '', status: 'Active' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4 pt-4'>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Title</label>
                <input
                    type='text'
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition'
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Category</label>
                <input
                    type='text'
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition'
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Price</label>
                <input
                    type='text'
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition'
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Status</label>
                <select
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition'
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                    <option value='Active'>Active</option>
                    <option value='Inactive'>Inactive</option>
                </select>
            </div>
            <div className='flex justify-end gap-3 mt-6'>
                <Button type='button' variant='secondary' onClick={onCancel}>Cancel</Button>
                <Button type='submit' variant='default'>{submitLabel}</Button>
            </div>
        </form>
    );
};
