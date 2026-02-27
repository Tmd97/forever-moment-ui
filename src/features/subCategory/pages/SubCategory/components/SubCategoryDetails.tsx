import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Dropdown } from '@/components/common/Dropdown';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import type { SubCategoryType } from './SubCategory';

interface SubCategoryDetailsProps {
    subCategory: SubCategoryType;
    categories: any[];
    updateSubCategory: (id: number, data: any) => Promise<any>;
}

export const SubCategoryDetails = ({ subCategory, categories, updateSubCategory }: SubCategoryDetailsProps) => {
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
        setEditValue(value || '');
    };

    const handleSave = async (fieldKey: keyof SubCategoryType) => {
        if (editValue !== (subCategory[fieldKey] as string)) {
            try {
                await updateSubCategory(subCategory.id, {
                    name: subCategory.name,
                    description: subCategory.description || '',
                    isActive: subCategory.isActive,
                    categoryId: subCategory.categoryId,
                    [fieldKey]: editValue
                });
            } catch (error) {
                console.error(`Failed to update ${fieldKey}`, error);
            }
        }
        setEditingField(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, fieldKey: keyof SubCategoryType) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave(fieldKey);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        const isActive = newStatus === 'true';
        if (subCategory.isActive !== isActive) {
            try {
                await updateSubCategory(subCategory.id, {
                    name: subCategory.name,
                    description: subCategory.description || '',
                    isActive: isActive,
                    categoryId: subCategory.categoryId
                });
            } catch (error) {
                console.error('Failed to update status', error);
            }
        }
    };

    const handleCategoryChange = async (val: string) => {
        if (!val) {
            setEditingField(null);
            return;
        }
        const newCategoryId = Number(val);
        setEditingField(null);
        if (newCategoryId === subCategory.categoryId || isNaN(newCategoryId)) return;

        try {
            await updateSubCategory(subCategory.id, {
                name: subCategory.name,
                description: subCategory.description || '',
                isActive: subCategory.isActive,
                categoryId: newCategoryId
            });
        } catch (error) {
            console.error('Failed to update category', error);
        }
    };

    const renderCellField = (label: string, fieldKey: keyof SubCategoryType, value: any, isTextArea = false) => {
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
                            onKeyDown={(e) => handleKeyDown(e, fieldKey)}
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

    return (
        <div>
            {/* ── GENERAL ─────────────────────────────── */}
            <SectionLabel>General</SectionLabel>
            <FieldGrid>
                {/* Name */}
                <Cell>
                    {renderCellField('Name', 'name', subCategory.name)}
                </Cell>

                {/* Status */}
                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <div className="mt-1 flex items-center">
                        <EditableStatusBadge
                            status={subCategory.isActive ? 'Active' : 'Inactive'}
                            options={['Active', 'Inactive']}
                            onChange={(val) => handleStatusChange(val === 'Active' ? 'true' : 'false')}
                        />
                    </div>
                </Cell>

                {/* Category */}
                <Cell full>
                    <div className="group relative">
                        <FieldLabel>Category</FieldLabel>
                        {editingField === 'categoryId' ? (
                            <Dropdown
                                label=""
                                options={categories?.map((c: any) => ({ label: c.name, value: String(c.id) })) || []}
                                value={String(subCategory.categoryId || '')}
                                onChange={handleCategoryChange}
                                placeholder="Select Category"
                                searchable={true}
                            />
                        ) : (
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setEditingField('categoryId')}
                            >
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                                    {categories?.find((c: any) => c.id === subCategory.categoryId)?.name || <span className="text-slate-400 italic font-normal text-[12px]">Not specified</span>}
                                </span>
                                <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </div>
                        )}
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
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave('description')}
                        onKeyDown={(e) => handleKeyDown(e, 'description')}
                    />
                ) : (
                    <div
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={() => handleEditStart('description', subCategory.description || '')}
                    >
                        <p className={cn('text-[13px] leading-relaxed flex-1', subCategory.description ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 italic')}>
                            {subCategory.description || 'Empty'}
                        </p>
                        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                )}
            </div>
        </div>
    );
};
