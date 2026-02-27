import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import type { CategoryType } from './Category';

interface CategoryDetailsProps {
    category: CategoryType;
    updateCategory: (id: number, data: any) => Promise<any>;
}

// ─── Stable layout primitives (must be at module level to avoid remounting) ───
const Cell = ({ children, full = false, className: cls = '' }: { children?: React.ReactNode; full?: boolean; className?: string }) => (
    <div className={cn('bg-white dark:bg-gray-900 px-4 py-3 transition-colors hover:bg-slate-50/60 dark:hover:bg-gray-800/40', full && 'col-span-2', cls)}>
        {children}
    </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-semibold tracking-[0.09em] uppercase text-slate-400 dark:text-slate-500 mb-2 mt-5 first:mt-0">
        {children}
    </p>
);

const FieldGrid = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-xl overflow-hidden mb-1">
        {children}
    </div>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-slate-400 dark:text-slate-500 mb-1">{children}</p>
);

export const CategoryDetails = ({ category, updateCategory }: CategoryDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleEditStart = (field: string, value: string) => {
        setEditingField(field);
        setEditValue(value);
    };

    const handleSave = async (field: keyof CategoryType) => {
        setEditingField(null);
        if (category[field] !== editValue) {
            try {
                await updateCategory(category.id, {
                    name: category.name,
                    description: category.description || '',
                    isActive: category.isActive,
                    [field]: editValue
                });
            } catch (error) {
                console.error(`Failed to update ${field}`, error);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, field: keyof CategoryType) => {
        if (e.key === 'Enter') {
            handleSave(field);
        } else if (e.key === 'Escape') {
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
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(fieldKey)}
                            className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
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

    const handleStatusChange = async (newStatus: string) => {
        const isActive = newStatus === 'true';
        if (category.isActive !== isActive) {
            try {
                await updateCategory(category.id, {
                    name: category.name,
                    description: category.description || '',
                    isActive: isActive
                });
            } catch (error) {
                console.error('Failed to update status', error);
            }
        }
    };

    return (
        <div>
            {/* ── GENERAL ─────────────────────────────── */}
            <SectionLabel>General</SectionLabel>
            <FieldGrid>
                {/* Name */}
                <Cell>
                    {renderCellField('Name', 'name', category.name)}
                </Cell>

                {/* Status */}
                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <div className="mt-1 flex items-center">
                        <EditableStatusBadge
                            status={category.isActive ? 'Active' : 'Inactive'}
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
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        className="w-full text-[13px] text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1.5 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave('description')}
                        onKeyDown={(e) => handleKeyDown(e, 'description')}
                    />
                ) : (
                    <div
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={() => handleEditStart('description', category.description || '')}
                    >
                        <p className={cn('text-[13px] leading-relaxed flex-1', category.description ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 italic')}>
                            {category.description || 'Empty'}
                        </p>
                        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                )}
            </div>
        </div>
    );
};
