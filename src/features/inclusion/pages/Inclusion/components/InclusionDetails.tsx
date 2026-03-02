import { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { TabFooter } from '@/components/common/TabFooter';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import type { InclusionType } from './Inclusion';

interface InclusionDetailsProps {
    inclusion: InclusionType;
    updateInclusion: (id: number, data: any) => Promise<any>;
    onDirtyChange?: (isDirty: boolean, changes: any[]) => void;
}

export const InclusionDetails = ({ inclusion, updateInclusion, onDirtyChange }: InclusionDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const consolidatedData = useMemo(() => ({
        description: inclusion.description || '',
        isIncluded: inclusion.isIncluded ?? false,
        isActive: inclusion.isActive ?? true,
        displayOrder: inclusion.displayOrder || 0
    }), [inclusion]);

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
            await updateInclusion(inclusion.id, localData);
        } catch (e) {
            console.error("Failed to update inclusion", e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <SectionLabel>Inclusion Details</SectionLabel>
            <FieldGrid>
                <Cell full>
                    <div className="group relative">
                        <FieldLabel>Description</FieldLabel>
                        {editingField === 'description' ? (
                            <textarea
                                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                                className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px]"
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
                                className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex gap-2 items-start"
                                onClick={() => handleEditStart('description', localData.description)}
                            >
                                <span className={cn(!localData.description && 'text-slate-400 italic font-normal')}>
                                    {localData.description || 'Empty'}
                                </span>
                                <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </div>
                        )}
                    </div>
                </Cell>

                <Cell>
                    <FieldLabel>Is Included?</FieldLabel>
                    <div className="flex items-center gap-2 mt-1">
                        <button
                            onClick={() => updateField('isIncluded', !localData.isIncluded)}
                            className={cn(
                                'px-3 py-1 text-xs font-semibold rounded-full transition-colors',
                                localData.isIncluded ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            )}
                        >
                            {localData.isIncluded ? 'Yes' : 'No'}
                        </button>
                    </div>
                </Cell>

                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <div className="flex items-center -ml-2 mt-1">
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

                <Cell>
                    <FieldLabel>ID</FieldLabel>
                    <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">#{inclusion.id}</p>
                </Cell>
            </FieldGrid>

            <TabFooter
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={handleSave}
                onDiscard={handleDiscard}
                changes={changes}
            />
        </div>
    );
};
