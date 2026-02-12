import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Loader2 } from 'lucide-react';
import { Dropdown } from '@/components/common/Dropdown';

interface RoleFormProps {
    initialData?: { roleName: string; description?: string; isActive: boolean };
    onSubmit: (data: { roleName: string; description: string; isActive: boolean }) => void;
    onCancel: () => void;
    submitLabel: string;
    isLoading?: boolean;
}

export const RoleForm = ({ initialData, onSubmit, onCancel, submitLabel, isLoading }: RoleFormProps) => {
    const [formData, setFormData] = useState(initialData || { roleName: '', description: '', isActive: true });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, description: formData.description || '' });
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4 pt-4 relative'>
            {isLoading && (
                <div className="absolute inset-0 dark:bg-gray-900/50 flex items-center justify-center z-50">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
            )}
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Role Name</label>
                <input
                    type='text'
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed'
                    value={formData.roleName}
                    onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Description</label>
                <textarea
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed resize-none'
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={isLoading}
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Status</label>
                <Dropdown
                    options={[
                        { label: 'Active', value: 'true' },
                        { label: 'Inactive', value: 'false' }
                    ]}
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(value) => setFormData({ ...formData, isActive: value === 'true' })}
                    placeholder="Select Status"
                    searchable={false}
                    disabled={isLoading}
                />
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
