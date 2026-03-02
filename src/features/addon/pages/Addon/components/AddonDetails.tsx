import { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { TabFooter } from '@/components/common/TabFooter';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import type { AddonType } from '@/features/addon/store/action-types';

interface AddonDetailsProps {
    addon: AddonType;
    updateAddon: (id: number, data: any) => Promise<any>;
    onDirtyChange?: (isDirty: boolean, changes: any[]) => void;
}

export const AddonDetails = ({ addon, updateAddon, onDirtyChange }: AddonDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string | boolean | number>('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const fieldMapping = useMemo(() => ({
        name: 'Name',
        basePrice: 'Base Price',
        isActive: 'Status',
        icon: 'Icon'
    }), []);

    const {
        localData,
        updateField,
        isDirty,
        handleDiscard,
        changes
    } = useUnsavedChanges({
        originalData: addon,
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
        setEditValue(value);
    };

    const handleFieldUpdate = (field: keyof AddonType, value: any) => {
        setEditValue(value);
        updateField(field, value);
    };

    const handleFinalSave = async () => {
        setIsSaving(true);
        try {
            await updateAddon(addon.id, {
                ...addon,
                name: localData.name,
                basePrice: localData.basePrice,
                isActive: localData.isActive,
                icon: localData.icon,
                description: localData.description || ''
            });
        } catch (error) {
            console.error("Failed to save addon changes:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setEditingField(null);
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
                            onChange={(e) => handleFieldUpdate(fieldKey, e.target.value)}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={(e) => handleKeyDown(e)}
                            className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type={fieldKey === 'basePrice' ? 'number' : 'text'}
                            value={editValue as string | number}
                            onChange={(e) => handleFieldUpdate(fieldKey, fieldKey === 'basePrice' ? Number(e.target.value) : e.target.value)}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={(e) => handleKeyDown(e)}
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
                            status={localData.isActive ? 'true' : 'false'}
                            options={[
                                { label: 'Active', value: 'true' },
                                { label: 'Inactive', value: 'false' }
                            ]}
                            onChange={(val) => updateField('isActive', val === 'true')}
                        />
                    </div>
                </Cell>

                {/* Name */}
                <Cell>
                    {renderCellField('Name', 'name', localData.name)}
                </Cell>

                <Cell>
                    {/* Placeholder for status already rendered above */}
                </Cell>

                {/* Price */}
                <Cell>
                    {renderCellField('Base Price', 'basePrice', localData.basePrice, false, `₹${localData.basePrice || 0}`)}
                </Cell>

                {/* Icon */}
                <Cell>
                    {renderCellField('Icon Name/Emoji', 'icon', localData.icon)}
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
                        onChange={(e) => handleFieldUpdate('description', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                ) : (
                    <div
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={() => handleEditStart('description', localData.description || '')}
                    >
                        <p className={cn('text-[13px] leading-relaxed flex-1', localData.description ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 italic')}>
                            {localData.description || 'Empty'}
                        </p>
                        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                )}
            </div>
            <TabFooter
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={handleFinalSave}
                onDiscard={handleDiscard}
                changes={changes}
            />
        </div>
    );
};
