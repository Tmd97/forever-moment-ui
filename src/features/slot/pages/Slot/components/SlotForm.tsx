import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Loader2 } from 'lucide-react';
import { Dropdown } from '@/components/common/Dropdown';
import { Input } from '@/components/common/Input';
import { DatePicker } from '@/components/common/DatePicker';

interface SlotFormData {
    label: string;
    startTime: Date | null;
    endTime: Date | null;
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
        initialData || { label: '', startTime: null, endTime: null, isActive: true }
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
                    label="Label"
                    type='text'
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <DatePicker
                        label="Start Time"
                        selected={formData.startTime}
                        onChange={(date: Date | null) => setFormData({ ...formData, startTime: date })}
                        showTimeSelect
                        showTimeSelectOnly
                        disabled={isLoading}
                        required
                    />
                </div>
                <div className="flex-1">
                    <DatePicker
                        label="End Time"
                        selected={formData.endTime}
                        onChange={(date: Date | null) => setFormData({ ...formData, endTime: date })}
                        showTimeSelect
                        showTimeSelectOnly
                        disabled={isLoading}
                        required
                    />
                </div>
            </div>
            <div>
                <Dropdown
                    label="Active"
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
        </form >
    );
};
