import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Dropdown } from '@/components/common/Dropdown';
import { Input } from '@/components/common/Input';
import { Loader2 } from 'lucide-react';

interface UserFormProps {
    initialData?: {
        fullName: string;
        email: string;
        role: string;
        status: string;
    };
    onSubmit: (data: { fullName: string; email: string; role: string; status: string }) => void;
    onCancel: () => void;
    submitLabel: string;
    isLoading?: boolean;
}

export const UserForm = ({ initialData, onSubmit, onCancel, submitLabel, isLoading }: UserFormProps) => {
    const [formData, setFormData] = useState({
        fullName: initialData?.fullName || '',
        email: initialData?.email || '',
        role: initialData?.role || 'User',
        status: initialData?.status || 'Active'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || '',
                email: initialData.email || '',
                role: initialData.role || 'User',
                status: initialData.status || 'Active'
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4 pt-4 relative'>
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center dark:bg-gray-900/50">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
            )}
            <div>
                <Input
                    label="Full Name"
                    type='text'
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <Input
                    label="Email"
                    type='email'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <Dropdown
                    label="Role"
                    options={[
                        { label: 'Admin', value: 'Admin' },
                        { label: 'Manager', value: 'Manager' },
                        { label: 'User', value: 'User' }
                    ]}
                    value={formData.role}
                    onChange={(value) => setFormData({ ...formData, role: value })}
                    placeholder="Select Role"
                    searchable={false}
                    disabled={isLoading}
                />
            </div>
            <div>
                <Dropdown
                    label="Status"
                    options={[
                        { label: 'Active', value: 'Active' },
                        { label: 'Inactive', value: 'Inactive' }
                    ]}
                    value={formData.status}
                    onChange={(value) => setFormData({ ...formData, status: value })}
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
