import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import type { AddonType } from '@/features/addon/store/action-types';

export interface AddonPayload {
    name: string;
    description: string;
    icon: string;
    basePrice: number;
    isActive: boolean;
}

interface AddonFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AddonPayload) => void;
    initialData?: AddonType | null;
}

export const AddonForm: React.FC<AddonFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}) => {
    const [formData, setFormData] = useState<AddonPayload>({
        name: '',
        description: '',
        icon: '',
        basePrice: 0,
        isActive: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                icon: initialData.icon || '',
                basePrice: initialData.basePrice || 0,
                isActive: initialData.isActive ?? true,
            });
        } else {
            // Reset form when opening for new item
            setFormData({
                name: '',
                description: '',
                icon: '',
                basePrice: 0,
                isActive: true,
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Addon' : 'Create Addon'}
            className="max-w-md w-[95vw]"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                        placeholder="Addon Name"
                    />
                </div>

                <div>
                    <label htmlFor="icon" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Icon (Name or Emoji)
                    </label>
                    <input
                        type="text"
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                        placeholder="e.g. Star"
                    />
                </div>

                <div>
                    <label htmlFor="basePrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Base Price (₹) *
                    </label>
                    <input
                        type="number"
                        id="basePrice"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white resize-none"
                        placeholder="Description of the addon..."
                    />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700">
                    <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">Active Status</div>
                        <div className="text-xs text-slate-500">Enable or disable this addon</div>
                    </div>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleCheckboxChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 relative"></div>
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-gray-800 mt-6">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {initialData ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
