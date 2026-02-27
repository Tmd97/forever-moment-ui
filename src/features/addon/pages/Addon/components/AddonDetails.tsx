import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
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

    const handleEditStart = (field: string, value: any) => {
        setEditingField(field);
        setEditValue(value);
    };

    const handleSave = async (field: keyof AddonType) => {
        if (editValue !== addon[field]) {
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

    const handleKeyDown = (e: React.KeyboardEvent, field: keyof AddonType) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave(field);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const renderCellField = (label: string, fieldKey: keyof AddonType, value: any, isTextArea = false, displayOverride?: string) => {
        const isEditing = editingField === fieldKey;
        const displayValue = displayOverride !== undefined ? displayOverride : value;

        return (
            <div className={cn('group relative', isTextArea && 'col-span-2')}>
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                    isTextArea ? (
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            value={editValue as string}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(fieldKey)}
                            onKeyDown={(e) => handleKeyDown(e, fieldKey)}
                            className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type={fieldKey === 'basePrice' ? 'number' : 'text'}
                            value={editValue as string | number}
                            onChange={(e) => setEditValue(fieldKey === 'basePrice' ? Number(e.target.value) : e.target.value)}
                            onBlur={() => handleSave(fieldKey)}
                            onKeyDown={(e) => handleKeyDown(e, fieldKey)}
                            className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    )
                ) : (
                    <div
                        className={cn(
                            'text-[13px] font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex gap-2',
                            isTextArea ? 'items-start whitespace-pre-line leading-relaxed' : 'items-center'
                        )}
                        onClick={() => handleEditStart(String(fieldKey), value)}
                    >
                        <span className={cn(!displayValue && 'text-slate-400 italic font-normal text-[12px]')}>
                            {displayValue || 'Empty'}
                        </span>
                        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            {/* ── GENERAL ─────────────────────────────── */}
            <SectionLabel>General</SectionLabel>
            <FieldGrid>
                {/* Name */}
                <Cell>
                    {renderCellField('Name', 'name', addon.name)}
                </Cell>

                {/* Status */}
                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <div className="mt-1 flex items-center">
                        <EditableStatusBadge
                            status={addon.isActive ? 'Active' : 'Inactive'}
                            options={['Active', 'Inactive']}
                            onChange={async (val) => {
                                const newStatus = val === 'Active';
                                if (newStatus === addon.isActive) return;
                                try {
                                    await updateAddon(addon.id, { ...addon, isActive: newStatus });
                                } catch (e) {
                                    console.error("Failed to update status", e);
                                }
                            }}
                        />
                    </div>
                </Cell>

                {/* Price */}
                <Cell>
                    {renderCellField('Base Price', 'basePrice', addon.basePrice, false, `₹${addon.basePrice || 0}`)}
                </Cell>

                {/* Icon */}
                <Cell>
                    {renderCellField('Icon Name/Emoji', 'icon', addon.icon)}
                </Cell>
            </FieldGrid>

            {/* ── DESCRIPTIONS ─────────────────────────── */}
            <SectionLabel>Description</SectionLabel>
            <div className="group bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3">
                <FieldLabel>Description</FieldLabel>
                {editingField === 'description' ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        className="w-full text-[13px] text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1.5 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                        value={editValue as string}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave('description')}
                        onKeyDown={(e) => handleKeyDown(e, 'description')}
                    />
                ) : (
                    <div
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={() => handleEditStart('description', addon.description || '')}
                    >
                        <p className={cn('text-[13px] leading-relaxed flex-1', addon.description ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 italic')}>
                            {addon.description || 'Empty'}
                        </p>
                        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                )}
            </div>
        </div>
    );
};
