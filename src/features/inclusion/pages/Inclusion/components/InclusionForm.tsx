import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Loader2 } from 'lucide-react';
import { Dropdown } from '@/components/common/Dropdown';
import { Input } from '@/components/common/Input';

interface InclusionFormProps {
    initialData?: { description: string; isIncluded: boolean; isActive: boolean };
    onSubmit: (data: { description: string; isIncluded: boolean; isActive: boolean }) => void;
    onCancel: () => void;
    submitLabel: string;
    isLoading?: boolean;
}

export const InclusionForm = ({ initialData, onSubmit, onCancel, submitLabel, isLoading }: InclusionFormProps) => {
    const [formData, setFormData] = useState(initialData || { description: '', isIncluded: true, isActive: true });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData });
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4 pt-4 relative'>
            {isLoading && (
                <div className="absolute inset-0 dark:bg-gray-900/50 flex items-center justify-center z-50">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
            )}
            <div>
                <Input
                    label="Description"
                    type='text'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <Dropdown
                    label="Is Included?"
                    options={[
                        { label: 'Yes', value: 'true' },
                        { label: 'No', value: 'false' }
                    ]}
                    value={formData.isIncluded ? 'true' : 'false'}
                    onChange={(value) => setFormData({ ...formData, isIncluded: value === 'true' })}
                    placeholder="Select Type"
                    searchable={false}
                    disabled={isLoading}
                />
            </div>
            <div>
                <Dropdown
                    label="Status"
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
