import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Dropdown } from '@/components/common/Dropdown';

interface SubCategoryFormProps {
    initialData?: { name: string; description?: string; status: string; categoryId?: number };
    onSubmit: (data: { name: string; description: string; status: string; categoryId: number }) => void;
    onCancel: () => void;
    submitLabel: string;
    categories: any[];
}

export const SubCategoryForm = ({ initialData, onSubmit, onCancel, submitLabel, categories }: SubCategoryFormProps) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        status: initialData?.status || 'Active',
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
        <form onSubmit={handleSubmit} className='space-y-4 pt-4'>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Sub Category Name</label>
                <input
                    type='text'
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Description</label>
                <textarea
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none'
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Status</label>
                <Dropdown
                    options={[
                        { label: 'Active', value: 'Active' },
                        { label: 'Inactive', value: 'Inactive' }
                    ]}
                    value={formData.status}
                    onChange={(value) => setFormData({ ...formData, status: value })}
                    placeholder="Select Status"
                    searchable={false}
                />
            </div>
            <div className='flex justify-end gap-3 mt-6'>
                <Button type='button' variant='secondary' onClick={onCancel}>Cancel</Button>
                <Button type='submit' variant='default'>{submitLabel}</Button>
            </div>
        </form>
    );
};
