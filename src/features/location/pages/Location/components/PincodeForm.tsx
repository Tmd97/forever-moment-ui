import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Dropdown } from '@/components/common/Dropdown';
import { Input } from '@/components/common/Input';
import type { PincodeFormData } from './Pincode';

interface PincodeFormProps {
    initialData?: PincodeFormData;
    onSubmit: (data: PincodeFormData) => void;
    onCancel: () => void;
    submitLabel: string;
}

export const PincodeForm = ({ initialData, onSubmit, onCancel, submitLabel }: PincodeFormProps) => {
    const [formData, setFormData] = useState<PincodeFormData>(
        initialData || { pincodeCode: '', name: '', areaName: '', latitude: 0, longitude: 0, isActive: true }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
                <Input
                    label="Pincode Code"
                    type="text"
                    value={formData.pincodeCode}
                    onChange={(e) => setFormData({ ...formData, pincodeCode: e.target.value })}
                    required
                />
            </div>
            <div>
                <Input
                    label="Pincode Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>
            <div>
                <Input
                    label="Area Name"
                    type="text"
                    value={formData.areaName}
                    onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
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
                />
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="default">
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
};
