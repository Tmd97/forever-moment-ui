import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Loader2 } from 'lucide-react';

interface CategoryFormProps {
    initialData?: { name: string; isActive: boolean };
    onSubmit: (data: { name: string; isActive: boolean }) => void;
    onCancel: () => void;
    submitLabel: string;
    isLoading?: boolean;
}

export const CategoryForm = ({ initialData, onSubmit, onCancel, submitLabel, isLoading }: CategoryFormProps) => {
    const [formData, setFormData] = useState(initialData || { name: '', isActive: true });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4 pt-4 relative'>
            {isLoading && (
                <div className="absolute inset-0 dark:bg-gray-900/50 flex items-center justify-center z-50">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
            )}
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Category Name</label>
                <input
                    type='text'
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Status</label>
                <select
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed'
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    disabled={isLoading}
                >
                    <option value='true'>Active</option>
                    <option value='false'>Inactive</option>
                </select>
            </div>
            <div className='flex justify-end gap-3 mt-6'>
                <Button type='button' variant='secondary' onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button type='submit' variant='default' disabled={isLoading}>
                    {isLoading ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
};
