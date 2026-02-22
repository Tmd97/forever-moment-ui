import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Loader2 } from 'lucide-react';
import type { User } from '@/features/auth/store/action-types';

interface ProfileFormProps {
    initialData: User | null;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
}

export const ProfileForm = ({ initialData, onSubmit, isLoading }: ProfileFormProps) => {
    const [formData, setFormData] = useState({
        fullName: initialData?.fullName || initialData?.name || '',
        email: initialData?.email || '',
        phoneNumber: initialData?.phoneNumber || '',
        dateOfBirth: initialData?.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
        preferredCity: initialData?.preferredCity || '',
        profilePictureUrl: initialData?.profilePictureUrl || '',
        // The API payload specifically required roleId to be present in the PUT payload
        roleId: initialData?.roleId || 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || initialData.name || '',
                email: initialData.email || '',
                phoneNumber: initialData.phoneNumber || '',
                dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
                preferredCity: initialData.preferredCity || '',
                profilePictureUrl: initialData.profilePictureUrl || '',
                roleId: initialData.roleId || 0,
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure date is properly formatted into ISO if provided, else omit or send as is based on backend expectation.
        // The example payload used "2026-02-22T06:58:15.358Z"
        let formattedDate = formData.dateOfBirth;
        if (formattedDate && !formattedDate.includes('T')) {
            formattedDate = new Date(formattedDate).toISOString();
        }

        await onSubmit({
            ...formData,
            dateOfBirth: formattedDate
        });
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-5 relative'>
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        label="Email Address"
                        type='email'
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={true} // Usually emails are read-only for profiles, but locking it just in case
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                </div>
                <div>
                    <Input
                        label="Phone Number"
                        type='tel'
                        placeholder="+1234567890"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Input
                        label="Date of Birth"
                        type='date'
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        disabled={isLoading}
                    />
                </div>
                <div className="md:col-span-2">
                    <Input
                        label="Preferred City"
                        type='text'
                        value={formData.preferredCity}
                        onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className='flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700'>
                <Button type='submit' variant='default' disabled={isLoading}>
                    {isLoading ? 'Saving Changes...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};
