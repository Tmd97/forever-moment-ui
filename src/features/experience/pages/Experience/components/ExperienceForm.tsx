import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Dropdown } from '@/components/common/Dropdown';
import { Input } from '@/components/common/Input';
import { Loader2 } from 'lucide-react';

export interface ExperiencePayload {
    name: string;
    slug: string;
    tagName: string;
    basePrice: number;
    displayOrder: number;
    isFeatured: boolean;
    isActive: boolean;
    subCategoryId: number; // Keeping 0 for now or hook up to real categories
    shortDescription: string;
    description: string;
    durationMinutes: number;
    maxCapacity: number;
    minAge: number;
    completionTime: number;
    minHours: number;
    termsConditions: string;
    whatToBring: string;
}

interface ExperienceFormProps {
    initialData?: ExperiencePayload;
    subCategories: any[];
    onSubmit: (data: ExperiencePayload) => void;
    onCancel: () => void;
    submitLabel: string;
    isLoading?: boolean;
}

export const ExperienceForm = ({ initialData, subCategories, onSubmit, onCancel, submitLabel, isLoading }: ExperienceFormProps) => {
    const [formData, setFormData] = useState<ExperiencePayload>(initialData || {
        name: '',
        slug: '',
        tagName: '',
        basePrice: 0,
        displayOrder: 0,
        isFeatured: false,
        isActive: true,
        subCategoryId: 0,
        shortDescription: '',
        description: '',
        durationMinutes: 0,
        maxCapacity: 0,
        minAge: 0,
        completionTime: 0,
        minHours: 0,
        termsConditions: '',
        whatToBring: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                slug: '',
                tagName: '',
                basePrice: 0,
                displayOrder: 0,
                isFeatured: false,
                isActive: true,
                subCategoryId: 0,
                shortDescription: '',
                description: '',
                durationMinutes: 0,
                maxCapacity: 0,
                minAge: 0,
                completionTime: 0,
                minHours: 0,
                termsConditions: '',
                whatToBring: '',
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const subCategoryOptions = (subCategories || []).map((cat: any) => ({
        label: cat.name,
        value: String(cat.id),
    }));

    return (
        <form onSubmit={handleSubmit} className='space-y-4 pt-4 relative'>
            {isLoading && (
                <div className="absolute inset-0 dark:bg-gray-900/50 flex items-center justify-center z-50">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isLoading}
                />
                <Input
                    label="Slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    disabled={isLoading}
                />
                <Input
                    label="Tag Name"
                    type="text"
                    value={formData.tagName}
                    onChange={(e) => setFormData({ ...formData, tagName: e.target.value })}
                    disabled={isLoading}
                />
                <Input
                    label="Base Price"
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    required
                    disabled={isLoading}
                />
                <Dropdown
                    label="Sub-Category"
                    options={subCategoryOptions}
                    value={String(formData.subCategoryId)}
                    onChange={(value) => setFormData({ ...formData, subCategoryId: Number(value) })}
                    placeholder="Select Sub-Category"
                    searchable={true}
                    disabled={isLoading}
                />
                <Input
                    label="Duration (Minutes)"
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    disabled={isLoading}
                />
                <Input
                    label="Max Capacity"
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    disabled={isLoading}
                />
                <Input
                    label="Min Age"
                    type="number"
                    value={formData.minAge}
                    onChange={(e) => setFormData({ ...formData, minAge: Number(e.target.value) })}
                    disabled={isLoading}
                />
                <Input
                    label="Completion Time"
                    type="number"
                    value={formData.completionTime}
                    onChange={(e) => setFormData({ ...formData, completionTime: Number(e.target.value) })}
                    disabled={isLoading}
                />
                <Input
                    label="Min Hours"
                    type="number"
                    value={formData.minHours}
                    onChange={(e) => setFormData({ ...formData, minHours: Number(e.target.value) })}
                    disabled={isLoading}
                />
                <Dropdown
                    label="Status"
                    options={[
                        { label: 'Active', value: 'Active' },
                        { label: 'Inactive', value: 'Inactive' }
                    ]}
                    value={formData.isActive ? 'Active' : 'Inactive'}
                    onChange={(value) => setFormData({ ...formData, isActive: value === 'Active' })}
                    searchable={false}
                    disabled={isLoading}
                />
            </div>

            <div className="flex gap-4 mt-2 mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        disabled={isLoading}
                    />
                    Is Featured
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Short Description"
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    disabled={isLoading}
                />
                <Input
                    label="Description"
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={isLoading}
                />
                <Input
                    label="Terms & Conditions"
                    type="text"
                    value={formData.termsConditions}
                    onChange={(e) => setFormData({ ...formData, termsConditions: e.target.value })}
                    disabled={isLoading}
                />
                <Input
                    label="What to Bring"
                    type="text"
                    value={formData.whatToBring}
                    onChange={(e) => setFormData({ ...formData, whatToBring: e.target.value })}
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
