import { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { Dropdown } from '@/components/common/Dropdown';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { TabFooter } from '@/components/common/TabFooter';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import type { CancellationPolicyType } from './CancellationPolicy';

interface CancellationPolicyDetailsProps {
    cancellationPolicy: CancellationPolicyType;
    updateCancellationPolicy: (id: number, data: any) => Promise<any>;
    onDirtyChange?: (isDirty: boolean, changes: any[]) => void;
}

export const CancellationPolicyDetails = ({ cancellationPolicy, updateCancellationPolicy, onDirtyChange }: CancellationPolicyDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const consolidatedData = useMemo(() => ({
        description: cancellationPolicy.description || '',
        isActive: cancellationPolicy.isActive ?? true,
        isIncluded: cancellationPolicy.isIncluded ?? false,
        displayOrder: cancellationPolicy.displayOrder || 0
    }), [cancellationPolicy]);

    const fieldMapping = useMemo(() => ({
        description: 'Description',
        isIncluded: 'Is Included',
        isActive: 'Status'
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
            await updateCancellationPolicy(cancellationPolicy.id, localData);
        } catch (e) {
            console.error("Failed to update cancellation policy", e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="pb-20">
            {/* ── GENERAL ─────────────────────────────── */}
            <SectionLabel>General</SectionLabel>
            <FieldGrid>
                {/* Is Included */}
                <Cell>
                    <div className="group relative">
                        <FieldLabel>Is Included?</FieldLabel>
                        {editingField === 'isIncluded' ? (
                            <Dropdown
                                label=""
                                options={[
                                    { label: 'Yes', value: 'true' },
                                    { label: 'No', value: 'false' }
                                ]}
                                value={localData.isIncluded ? 'true' : 'false'}
                                onChange={(val) => {
                                    setEditingField(null);
                                    updateField('isIncluded', val === 'true');
                                }}
                                placeholder="Select Included Status"
                                searchable={false}
                            />
                        ) : (
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setEditingField('isIncluded')}
                            >
                                <span className={cn(
                                    'inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full transition-colors',
                                    localData.isIncluded ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                )}>
                                    {localData.isIncluded ? 'Yes' : 'No'}
                                </span>
                                <svg className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </div>
                        )}
                    </div>
                </Cell>

                {/* Status */}
                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <div className="mt-1 flex items-center -ml-2">
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
            </FieldGrid>

            {/* ── DESCRIPTIONS ─────────────────────────── */}
            <SectionLabel>Description</SectionLabel>
            <div className="group bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3">
                <FieldLabel>Description</FieldLabel>
                {editingField === 'description' ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        className="w-full text-[13px] text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1.5 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                        value={editValue}
                        onChange={(e) => {
                            setEditValue(e.target.value);
                            updateField('description', e.target.value);
                        }}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <div
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={() => handleEditStart('description', localData.description)}
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
                onSave={handleSave}
                onDiscard={handleDiscard}
                changeCount={changes.length}
            />
        </div>
    );
};
