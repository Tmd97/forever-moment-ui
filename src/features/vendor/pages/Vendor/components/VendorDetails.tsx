import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { Mail, Phone, Star, Calendar, User } from 'lucide-react';
import { TabFooter } from '@/components/common/TabFooter';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { cn } from '@/utils/cn';
import type { Vendor } from './Vendor';

interface VendorDetailsProps {
    vendor: Vendor;
    onEdit: () => void;
    onClose: () => void;
    updateVendor: (id: number, payload: any) => Promise<any>;
    onDirtyChange?: (isDirty: boolean, changes: any[]) => void;
}

export const VendorDetails = ({ vendor, onEdit, updateVendor, onDirtyChange }: VendorDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const consolidatedData = useMemo(() => ({
        name: vendor.name || '',
        category: vendor.category || '',
        status: vendor.status || 'Active',
        contactPerson: vendor.contactPerson || '',
        email: vendor.email || '',
        phone: vendor.phone || ''
    }), [vendor]);

    const fieldMapping = useMemo(() => ({
        name: 'Business Name',
        category: 'Category',
        status: 'Status',
        contactPerson: 'Contact Person',
        email: 'Email',
        phone: 'Phone'
    }), []);

    const {
        localData,
        updateField,
        isDirty,
        handleDiscard,
        changes
    } = useUnsavedChanges({
        originalData: consolidatedData,
        fieldMapping,
        onDirtyChange
    });

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleEditStart = (field: string, value: any) => {
        setEditingField(field);
        setEditValue(String(value));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setEditingField(null);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateVendor(vendor.id, localData);
        } catch (e) {
            console.error("Failed to update vendor", e);
        } finally {
            setIsSaving(false);
        }
    };

    const renderEditableText = (field: any, value: string, icon: React.ReactNode, label: string) => {
        const isEditing = editingField === field;
        return (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 group">
                <div className="w-5 h-5 flex items-center justify-center mr-2 text-gray-400">
                    {icon}
                </div>
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 text-sm bg-white dark:bg-gray-800 border border-blue-500 rounded px-2 py-0.5 outline-none"
                        value={editValue}
                        onChange={(e) => {
                            setEditValue(e.target.value);
                            updateField(field, e.target.value);
                        }}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={handleKeyDown}
                        placeholder={label}
                    />
                ) : (
                    <div
                        className="flex-1 cursor-pointer flex items-center gap-2"
                        onClick={() => handleEditStart(field, value)}
                    >
                        <span className={cn(!value && 'text-gray-400 italic font-normal')}>
                            {value || `No ${label.toLowerCase()}`}
                        </span>
                        <svg className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header Section */}
            <div className="flex items-start justify-between">
                <div>
                    {editingField === 'name' ? (
                        <input
                            ref={inputRef}
                            className="text-xl font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-blue-500 rounded px-2 py-0.5 outline-none"
                            value={editValue}
                            onChange={(e) => {
                                setEditValue(e.target.value);
                                updateField('name', e.target.value);
                            }}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        <h2
                            className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors group flex items-center gap-2"
                            onClick={() => handleEditStart('name', localData.name)}
                        >
                            {localData.name}
                            <svg className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        </h2>
                    )}

                    {editingField === 'category' ? (
                        <input
                            ref={editingField === 'category' ? inputRef : null}
                            className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-blue-500 rounded px-2 py-0.5 mt-1 outline-none"
                            value={editValue}
                            onChange={(e) => {
                                setEditValue(e.target.value);
                                updateField('category', e.target.value);
                            }}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        <p
                            className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600 transition-colors group flex items-center gap-2"
                            onClick={() => handleEditStart('category', localData.category)}
                        >
                            {localData.category}
                            <svg className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        </p>
                    )}
                </div>
                <EditableStatusBadge
                    status={localData.status}
                    options={[
                        { label: 'Active', value: 'Active' },
                        { label: 'Inactive', value: 'Inactive' },
                        { label: 'Pending', value: 'Pending' }
                    ]}
                    onChange={(val) => updateField('status', val)}
                />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Contact Information</h3>
                <div className="space-y-3">
                    {renderEditableText('contactPerson', localData.contactPerson, <User className="w-4 h-4" />, 'Contact Person')}
                    {renderEditableText('email', localData.email, <Mail className="w-4 h-4" />, 'Email')}
                    {renderEditableText('phone', localData.phone, <Phone className="w-4 h-4" />, 'Phone')}
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Performance</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{vendor.rating || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                            <p className="font-semibold text-gray-900 dark:text-white">Feb 2025</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={onEdit}>
                    Edit in Modal
                </Button>
            </div>

            <TabFooter
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={handleSave}
                onDiscard={handleDiscard}
                changeCount={changes.length}
            />
        </div>
    );
};
