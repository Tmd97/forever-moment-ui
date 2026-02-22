import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Loader2 } from 'lucide-react';
import { Dropdown } from '@/components/common/Dropdown';
import { Input } from '@/components/common/Input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface SlotFormData {
    name: string;
    date: Date | null;
    city: string;
    country: string;
    isActive: boolean;
}

interface SlotFormProps {
    initialData?: SlotFormData;
    onSubmit: (data: SlotFormData) => void;
    onCancel: () => void;
    submitLabel: string;
    isLoading?: boolean;
}

export const SlotForm = ({ initialData, onSubmit, onCancel, submitLabel, isLoading }: SlotFormProps) => {
    const [formData, setFormData] = useState<SlotFormData>(
        initialData || { name: '', date: null, city: '', country: '', isActive: true }
    );

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
                <Input
                    label="Slot Name"
                    type='text'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <Input
                    label="City"
                    type='text'
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={isLoading}
                />
            </div>
            <div>
                <Input
                    label="Country"
                    type='text'
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
