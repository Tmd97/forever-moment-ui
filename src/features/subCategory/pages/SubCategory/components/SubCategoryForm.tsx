import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Dropdown } from '@/components/common/Dropdown';
import { Loader2 } from 'lucide-react';

interface SubCategoryFormProps {
    initialData?: { name: string; description?: string; isActive: boolean; categoryId?: number };
    onSubmit: (data: { name: string; description: string; isActive: boolean; categoryId: number }) => void;
    onCancel: () => void;
    submitLabel: string;
    categories: any[];
    loading?: boolean;
}

export const SubCategoryForm = ({ initialData, onSubmit, onCancel, submitLabel, categories, loading }: SubCategoryFormProps) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        isActive: initialData?.isActive ?? true,
        categoryId: initialData?.categoryId || (categories?.length > 0 ? categories[0].id : '')
    });

    const categoryOptions = categories?.map(cat => ({
        label: cat.name,
        value: String(cat.id)
    })) || [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, categoryId: Number(formData.categoryId) });
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4 pt-4 relative'>
            {loading && (
                <div className="absolute inset-0 dark:bg-gray-900/50 flex items-center justify-center z-50">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
            )}
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Sub Category Name</label>
                <input
                    type='text'
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={loading}
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Description</label>
                <textarea
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none disabled:opacity-50 disabled:cursor-not-allowed'
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={loading}
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Category</label>
                <Dropdown
                    options={categoryOptions}
                    value={String(formData.categoryId)}
                    onChange={(value) => setFormData({ ...formData, categoryId: Number(value) })}
                    placeholder="Select Category"
                    searchable={true}
                    disabled={loading}
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Status</label>
                <Dropdown
                    options={[
                        { label: 'Active', value: 'true' },
                        { label: 'Inactive', value: 'false' }
                    ]}
                    value={String(formData.isActive)}
                    onChange={(value) => setFormData({ ...formData, isActive: value === 'true' })}
                    placeholder="Select Status"
                    searchable={false}
                    disabled={loading}
                />
            </div>
            <div className='flex justify-end gap-3 mt-6'>
                <Button type='button' variant='secondary' onClick={onCancel} disabled={loading}>Cancel</Button>
                <Button type='submit' variant='default' disabled={loading}>
                    {loading ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
};
