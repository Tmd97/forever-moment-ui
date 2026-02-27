import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { TabFooter } from '@/components/common/TabFooter';
import { Textarea } from '@/components/common/Textarea';
import type { CategoryType } from './Category';

interface CategoryDetailsProps {
    category: CategoryType;
    updateCategory: (id: number, data: any) => Promise<any>;
    onDirtyChange?: (isDirty: boolean) => void;
}


export const CategoryDetails = ({ category, updateCategory, onDirtyChange }: CategoryDetailsProps) => {
    const [localData, setLocalData] = useState<CategoryType>(category);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // Sync local state when category prop changes (from outside)
    useEffect(() => {
        setLocalData(category);
    }, [category]);

    const isDirty = JSON.stringify(localData) !== JSON.stringify(category);

    useEffect(() => {
        onDirtyChange?.(isDirty);
    }, [isDirty, onDirtyChange]);

    // Handle browser reload/close
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleEditStart = (field: string, value: string) => {
        setEditingField(field);
        setEditValue(value);
    };

    const handleFieldUpdate = (field: keyof CategoryType, value: string) => {
        setEditValue(value);
        if (localData[field] !== value) {
            setLocalData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleFinalSave = async () => {
        setIsSaving(true);
        try {
            await updateCategory(category.id, {
                name: localData.name,
                description: localData.description || '',
                isActive: localData.isActive
            });
        } catch (error) {
            console.error('Failed to save category changes', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDiscard = () => {
        setLocalData(category);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setEditingField(null);
        } else if (e.key === 'Escape') {
            // Revert local change for this specific field if escaping? 
            // Actually Discard button handles global revert.
            setEditingField(null);
        }
    };



    const renderCellField = (label: string, fieldKey: keyof CategoryType, value: any, isTextArea = false) => {
        const isEditing = editingField === fieldKey;

        return (
            <div className={cn('group relative', isTextArea && 'col-span-2')}>
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                    isTextArea ? (
                        <Textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            value={editValue}
                            onChange={(e) => handleFieldUpdate(fieldKey, e.target.value)}
                            onBlur={() => setEditingField(null)}
                            className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type="text"
                            value={editValue}
                            onChange={(e) => handleFieldUpdate(fieldKey, e.target.value)}
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
                        onClick={() => handleEditStart(String(fieldKey), value || '')}
                    >
                        <span className={cn(!value && 'text-slate-400 italic font-normal text-[12px]')}>
                            {value || 'Empty'}
                        </span>
                        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                )}
            </div>
        );
    };

    const handleStatusChange = (newStatus: string) => {
        const isActive = newStatus === 'true';
        setLocalData(prev => ({
            ...prev,
            isActive: isActive
        }));
    };

    return (
        <div className="space-y-8" style={{ paddingBottom: isDirty ? '60px' : '0' }}>
            {/* ── GENERAL ─────────────────────────────── */}
            <SectionLabel>General</SectionLabel>
            <FieldGrid>
                {/* Name */}
                <Cell>
                    {renderCellField('Name', 'name', localData.name)}
                </Cell>

                {/* Status */}
                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <div className="mt-1 flex items-center">
                        <EditableStatusBadge
                            status={localData.isActive ? 'Active' : 'Inactive'}
                            options={['Active', 'Inactive']}
                            onChange={(val) => handleStatusChange(val === 'Active' ? 'true' : 'false')}
                        />
                    </div>
                </Cell>

                {/* Slug (Display Only if available) */}
                {category.slug && (
                    <>
                        <Cell>
                            <FieldLabel>Slug</FieldLabel>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-[11.5px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-gray-700">
                                    {category.slug}
                                </span>
                            </div>
                        </Cell>
                        <Cell />
                    </>
                )}
            </FieldGrid>

            {/* ── DESCRIPTIONS ─────────────────────────── */}
            <SectionLabel>Description</SectionLabel>
            <div className="group bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3">
                <FieldLabel>Short Description</FieldLabel>
                {editingField === 'description' ? (
                    <Textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        className="w-full text-[13px] text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1.5 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                        value={editValue}
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
            />
        </div>
    );
};
