import { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { Dropdown } from '@/components/common/Dropdown';
import type { AddonType } from '@/features/addon/store/action-types';

interface AddonDetailsProps {
    addon: AddonType | null;
    updateAddon: (id: number, data: any) => Promise<any>;
}

export const AddonDetails = ({ addon, updateAddon }: AddonDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string | boolean | number>('');
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
            if (inputRef.current instanceof HTMLInputElement && inputRef.current.type !== 'checkbox') {
                // Move cursor to end
                const len = inputRef.current.value.length;
                inputRef.current.setSelectionRange(len, len);
            }
        }
    }, [editingField]);

    if (!addon) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-gray-500 p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                    <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">No Addon Selected</p>
                    <p className="text-sm">Select an addon from the list to view its details</p>
                </div>
            </div>
        );
    }

    const handleEditStart = (field: string, value: string | boolean | number) => {
        setEditingField(field);
        setEditValue(value);
    };

    const handleSave = async (field: keyof AddonType) => {
        if (editingField === field && editValue !== addon[field]) {
            try {
                await updateAddon(addon.id, {
                    ...addon,
                    [field]: editValue,
                });
            } catch (error) {
                console.error("Failed to update addon:", error);
            }
        }
        setEditingField(null);
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent, field: keyof AddonType) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave(field);
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const renderEditableField = (
        field: keyof AddonType,
        label: string,
        type: 'text' | 'textarea' | 'number' = 'text',
        formatter?: (val: any) => string
    ) => {
        const isEditing = editingField === field;
        const displayValue = formatter ? formatter(addon[field]) : String(addon[field] || '-');

        return (
            <div className="group border-b border-slate-100 dark:border-gray-800 last:border-0 pb-4 last:pb-0">
                <label className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 block">
                    {label}
                </label>
                {isEditing ? (
                    <div className="flex items-start gap-2">
                        {type === 'textarea' ? (
                            <textarea
                                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                                value={editValue as string}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') handleCancel();
                                    // Enter creates new line in textarea, use Ctrl+Enter or Cmd+Enter to save
                                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                        handleSave(field);
                                    }
                                }}
                                onBlur={() => handleSave(field)}
                                className="w-full bg-white dark:bg-gray-800 border border-blue-500 rounded px-2 py-1 text-sm outline-none shadow-sm dark:text-white"
                                rows={3}
                            />
                        ) : (
                            <input
                                ref={inputRef as React.RefObject<HTMLInputElement>}
                                type={type}
                                value={editValue as string | number}
                                onChange={(e) => setEditValue(type === 'number' ? Number(e.target.value) : e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, field)}
                                onBlur={() => handleSave(field)}
                                className="w-full bg-white dark:bg-gray-800 border border-blue-500 rounded px-2 py-1 text-sm outline-none shadow-sm dark:text-white"
                            />
                        )}
                        <div className="flex flex-col gap-1 shrink-0">
                            <button onMouseDown={(e) => { e.preventDefault(); handleSave(field); }} className="text-green-600 hover:bg-green-50 p-1 rounded">
                                <Check size={14} />
                            </button>
                            <button onMouseDown={(e) => { e.preventDefault(); handleCancel(); }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex items-start justify-between p-1.5 -ml-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                        onClick={() => handleEditStart(field, addon[field] !== undefined ? String(addon[field]) : '')}
                    >
                        <span className={`text-sm text-slate-800 dark:text-slate-200 ${type === 'textarea' ? 'whitespace-pre-wrap' : ''}`}>
                            {displayValue}
                        </span>
                        <Pencil size={14} className="text-slate-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                    </div>
                )}
            </div>
        );
    };

    const renderStatusField = () => {
        const isEditing = editingField === 'isActive';

        return (
            <div className="group border-b border-slate-100 dark:border-gray-800 last:border-0 pb-4 last:pb-0">
                <label className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Status
                </label>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <Dropdown
                            options={[
                                { label: 'Active', value: 'true' },
                                { label: 'Inactive', value: 'false' }
                            ]}
                            value={String(editValue)}
                            onChange={(val) => {
                                setEditValue(val === 'true');
                                // Add a small delay to allow state update before save
                                setTimeout(() => handleSave('isActive'), 50);
                            }}
                            className="w-40"
                        />
                        <div className="flex flex-col gap-1 shrink-0">
                            <button onMouseDown={(e) => { e.preventDefault(); handleCancel(); }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex items-center justify-between p-1.5 -ml-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                        onClick={() => handleEditStart('isActive', addon.isActive)}
                    >
                        <span className={
                            addon.isActive
                                ? 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }>
                            {addon.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Pencil size={14} className="text-slate-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6 max-h-full overflow-y-auto">
            <div className="space-y-4">
                {renderEditableField('name', 'Name')}
                {renderEditableField('description', 'Description', 'textarea')}
                {renderEditableField('basePrice', 'Base Price', 'number', (val) => `₹${val || 0}`)}
                {renderEditableField('icon', 'Icon Name/Emoji')}
                {renderStatusField()}
            </div>
        </div>
    );
};
