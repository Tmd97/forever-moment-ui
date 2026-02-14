import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Dropdown } from '@/components/common/Dropdown';
import { Input } from '@/components/common/Input';
import { Loader2 } from 'lucide-react';

interface RoleOption {
    id: number;
    roleName: string;
}

interface UserFormProps {
    initialData?: {
        fullName: string;
        email: string;
        phoneNumber: string;
        preferredCity: string;
        roleId: string;
        status: string;
    };
    roles: RoleOption[];
    onSubmit: (data: { fullName: string; email: string; phoneNumber: string; preferredCity: string; roleId: string; status: string }) => void;
    onCancel: () => void;
    submitLabel: string;
    isLoading?: boolean;
    isEditing?: boolean;
}

export const UserForm = ({ initialData, roles, onSubmit, onCancel, submitLabel, isLoading, isEditing }: UserFormProps) => {
    const [formData, setFormData] = useState({
        fullName: initialData?.fullName || '',
        email: initialData?.email || '',
        phoneNumber: initialData?.phoneNumber || '',
        preferredCity: initialData?.preferredCity || '',
        roleId: initialData?.roleId || '',
        status: initialData?.status || 'Active'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || '',
                email: initialData.email || '',
                phoneNumber: initialData.phoneNumber || '',
                preferredCity: initialData.preferredCity || '',
                roleId: initialData.roleId || '',
                status: initialData.status || 'Active'
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Build role dropdown options from roles data
    const roleOptions = roles.map(role => ({
        label: role.roleName,
        value: String(role.id),
    }));

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
                <Input
                    label="Phone Number"
                    type='text'
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    disabled={isLoading}
                />
            </div>
            <div>
                <Input
                    label="Preferred City"
                    type='text'
                    value={formData.preferredCity}
                    onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
                    disabled={isLoading}
                />
            </div>
            <div>
                <Dropdown
                    label="Role"
                    options={roleOptions}
                    value={formData.roleId}
                    onChange={(value) => setFormData({ ...formData, roleId: value })}
                    placeholder="Select Role"
                    searchable={false}
                    disabled={isLoading}
                />
            </div>
            {isEditing && (
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
            )}
            <div className='flex justify-end gap-3 mt-6'>
                <Button type='button' variant='secondary' onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button type='submit' variant='default' disabled={isLoading}>
                    {isLoading ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
};
