import { useState, useRef, useEffect } from 'react';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { InclusionsTab } from './InclusionsTab';
import { CancellationPolicyTab } from './CancellationPolicyTab';
import { LocationTab } from './LocationTab';
import { AddonsTab } from './AddonsTab';
import { Dropdown } from '@/components/common/Dropdown';
import { cn } from '@/utils/cn';
import type { ExperienceType } from './Experience';
import type { SidePanelTab } from '@/components/common/SidePanelTabs';

// ─── Stable layout primitives (must be at module level to avoid remounting) ───
const Cell = ({ children, full = false, className: cls = '' }: { children: React.ReactNode; full?: boolean; className?: string }) => (
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

interface ExperienceDetailsProps {
    experience: ExperienceType;
    experienceDetail: any;
    inclusions: any[];
    cancellationPolicies: any[];
    subCategories: any[];
    locations: any[];
    addons: any[];
    onToggleCancellationPolicy: (id: number, checked: boolean) => void;
    onToggleInclusion: (id: number, checked: boolean) => void;
    onAssociateLocation: (id: number, data: any) => void;
    onUpdateLocation: (id: number, data: any) => void;
    onDisassociateLocation: (id: number) => void;
    onToggleAddon: (addonId: number, isAssociate: boolean, data?: any) => void;
    updateExperience: (id: number, data: any) => Promise<any>;
}

const GeneralInfoTab = ({ experience, experienceDetail, updateExperience, subCategories }: any) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleEditClick = (field: string, value: any) => {
        setEditingField(field);
        setEditValue(value ? String(value) : '');
    };

    const handleSave = async (field: string) => {
        const valueToSave = field === 'basePrice' || field === 'durationMinutes' || field === 'maxCapacity' || field === 'minAge' || field === 'completionTime' || field === 'minHours'
            ? Number(editValue)
            : editValue;

        // Check if value actually changed (loose equality to handle string/number conversion initially)
        if (valueToSave != (experienceDetail?.[field] ?? experienceDetail?.detail?.[field] ?? experience[field])) {
            const payload = {
                name: experienceDetail?.name || experience.name || '',
                slug: experienceDetail?.slug || experience.slug || '',
                tagName: experienceDetail?.tagName || experience.tagName || '',
                basePrice: experienceDetail?.basePrice || experience.basePrice || 0,
                displayOrder: experienceDetail?.displayOrder || 0,
                isFeatured: experienceDetail?.isFeatured || false,
                isActive: experienceDetail?.isActive ?? experience.isActive ?? true,
                subCategoryId: experienceDetail?.subCategoryId || 0,
                shortDescription: experienceDetail?.detail?.shortDescription || '',
                description: experienceDetail?.detail?.description || '',
                durationMinutes: experienceDetail?.detail?.durationMinutes || 0,
                maxCapacity: experienceDetail?.detail?.maxCapacity || 0,
                minAge: experienceDetail?.detail?.minAge || 0,
                completionTime: experienceDetail?.detail?.completionTime || 0,
                minHours: experienceDetail?.detail?.minHours || 0,
                termsConditions: experienceDetail?.detail?.termsConditions || '',
                whatToBring: experienceDetail?.detail?.whatToBring || '',
                [field]: valueToSave
            };

            try {
                await updateExperience(experience.id, payload);
            } catch (e) {
                console.error("Failed to update field", e);
            }
        }
        setEditingField(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Allow multiline Enter for textareas
            e.preventDefault();
            handleSave(field);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };


    const isFeatured = experienceDetail?.isFeatured ?? experience.isFeatured;


    const renderCellField = (label: string, field: string, value: any, isTextArea = false, displayOverride?: string) => {
        const isEditing = editingField === field;
        const displayValue = displayOverride !== undefined ? displayOverride : value;
        return (
            <div className={cn('group relative', isTextArea && 'col-span-2')}>
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                    isTextArea ? (
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(field)}
                            onKeyDown={(e) => handleKeyDown(e, field)}
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type="text"
                            className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(field)}
                            onKeyDown={(e) => handleKeyDown(e, field)}
                        />
                    )
                ) : (
                    <div
                        className={cn(
                            'text-[13px] font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex gap-2',
                            isTextArea ? 'items-start whitespace-pre-line leading-relaxed' : 'items-center'
                        )}
                        onClick={() => handleEditClick(field, value)}
                    >
                        <span className={cn(!displayValue && 'text-slate-400 italic font-normal text-[12px]')}>{displayValue || 'Empty'}</span>
                        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                )}
            </div>
        );
    };

    const renderCodeCellField = (label: string, field: string, value: any) => {
        const isEditing = editingField === field;
        return (
            <div className="group relative">
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        className="w-full text-[12px] font-mono text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(field)}
                        onKeyDown={(e) => handleKeyDown(e, field)}
                    />
                ) : (
                    <div
                        className="cursor-pointer flex items-center gap-2 group/val"
                        onClick={() => handleEditClick(field, value)}
                    >
                        {value ? (
                            <span className="font-mono text-[11.5px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-gray-700">
                                {value}
                            </span>
                        ) : (
                            <span className="text-slate-400 italic text-[12px]">Empty</span>
                        )}
                        <svg className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
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
                {/* Name — full width */}
                <Cell full>
                    {renderCellField('Name', 'name', experienceDetail?.name || experience.name)}
                </Cell>

                {/* Sub Category */}
                <Cell>
                    <div className="group relative">
                        <FieldLabel>Sub Category</FieldLabel>
                        {editingField === 'subCategoryId' ? (
                            <Dropdown
                                label=""
                                options={subCategories?.map((sc: any) => ({ label: sc.name, value: String(sc.id) })) || []}
                                value={String(experienceDetail?.subCategoryId || '')}
                                onChange={async (val) => {
                                    const newSubCategoryId = parseInt(val, 10);
                                    setEditingField(null);
                                    if (newSubCategoryId === experienceDetail?.subCategoryId) return;
                                    const payload = {
                                        name: experienceDetail?.name || experience.name || '',
                                        slug: experienceDetail?.slug || experience.slug || '',
                                        tagName: experienceDetail?.tagName || experience.tagName || '',
                                        basePrice: experienceDetail?.basePrice || experience.basePrice || 0,
                                        displayOrder: experienceDetail?.displayOrder || 0,
                                        isFeatured: experienceDetail?.isFeatured || false,
                                        isActive: experienceDetail?.isActive ?? experience.isActive ?? true,
                                        subCategoryId: newSubCategoryId,
                                        shortDescription: experienceDetail?.detail?.shortDescription || '',
                                        description: experienceDetail?.detail?.description || '',
                                        durationMinutes: experienceDetail?.detail?.durationMinutes || 0,
                                        maxCapacity: experienceDetail?.detail?.maxCapacity || 0,
                                        minAge: experienceDetail?.detail?.minAge || 0,
                                        completionTime: experienceDetail?.detail?.completionTime || 0,
                                        minHours: experienceDetail?.detail?.minHours || 0,
                                        termsConditions: experienceDetail?.detail?.termsConditions || '',
                                        whatToBring: experienceDetail?.detail?.whatToBring || '',
                                    };
                                    try { await updateExperience(experience.id, payload); }
                                    catch (e) { console.error("Failed to update sub category", e); }
                                }}
                                placeholder="Select Sub Category"
                                searchable={true}
                            />
                        ) : (
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setEditingField('subCategoryId')}>
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                                    {subCategories?.find((sc: any) => sc.id === experienceDetail?.subCategoryId)?.name
                                        || <span className="text-slate-400 italic font-normal text-[12px]">Not specified</span>}
                                </span>
                                <svg className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </div>
                        )}
                    </div>
                </Cell>

                {/* Status */}
                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <EditableStatusBadge
                        status={(experienceDetail?.isActive ?? experience.isActive) ? 'Active' : 'Inactive'}
                        options={['Active', 'Inactive']}
                        onChange={async (val) => {
                            const newStatus = val === 'Active';
                            if (newStatus === (experienceDetail?.isActive ?? experience.isActive)) return;
                            const payload = {
                                name: experienceDetail?.name || experience.name || '',
                                slug: experienceDetail?.slug || experience.slug || '',
                                tagName: experienceDetail?.tagName || experience.tagName || '',
                                basePrice: experienceDetail?.basePrice || experience.basePrice || 0,
                                displayOrder: experienceDetail?.displayOrder || 0,
                                isFeatured: experienceDetail?.isFeatured || false,
                                isActive: newStatus,
                                subCategoryId: experienceDetail?.subCategoryId || 0,
                                shortDescription: experienceDetail?.detail?.shortDescription || '',
                                description: experienceDetail?.detail?.description || '',
                                durationMinutes: experienceDetail?.detail?.durationMinutes || 0,
                                maxCapacity: experienceDetail?.detail?.maxCapacity || 0,
                                minAge: experienceDetail?.detail?.minAge || 0,
                                completionTime: experienceDetail?.detail?.completionTime || 0,
                                minHours: experienceDetail?.detail?.minHours || 0,
                                termsConditions: experienceDetail?.detail?.termsConditions || '',
                                whatToBring: experienceDetail?.detail?.whatToBring || '',
                            };
                            try { await updateExperience(experience.id, payload); }
                            catch (e) { console.error("Failed to update status", e); }
                        }}
                    />
                </Cell>

                {/* Price */}
                <Cell>
                    {renderCellField('Price', 'basePrice', experienceDetail?.basePrice || experience.basePrice, false,
                        experienceDetail?.basePrice != null ? `₹${experienceDetail.basePrice}` : (experience.price || `₹${experience.basePrice || 0}`)
                    )}
                </Cell>

                {/* Featured */}
                <Cell>
                    <div className="group relative">
                        <FieldLabel>Featured</FieldLabel>
                        {editingField === 'isFeatured' ? (
                            <Dropdown
                                label=""
                                options={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
                                value={isFeatured ? 'true' : 'false'}
                                onChange={async (val) => {
                                    const newFeatured = val === 'true';
                                    setEditingField(null);
                                    if (newFeatured === isFeatured) return;
                                    const payload = {
                                        name: experienceDetail?.name || experience.name || '',
                                        slug: experienceDetail?.slug || experience.slug || '',
                                        tagName: experienceDetail?.tagName || experience.tagName || '',
                                        basePrice: experienceDetail?.basePrice || experience.basePrice || 0,
                                        displayOrder: experienceDetail?.displayOrder || 0,
                                        isFeatured: newFeatured,
                                        isActive: experienceDetail?.isActive ?? experience.isActive ?? true,
                                        subCategoryId: experienceDetail?.subCategoryId || 0,
                                        shortDescription: experienceDetail?.detail?.shortDescription || '',
                                        description: experienceDetail?.detail?.description || '',
                                        durationMinutes: experienceDetail?.detail?.durationMinutes || 0,
                                        maxCapacity: experienceDetail?.detail?.maxCapacity || 0,
                                        minAge: experienceDetail?.detail?.minAge || 0,
                                        completionTime: experienceDetail?.detail?.completionTime || 0,
                                        minHours: experienceDetail?.detail?.minHours || 0,
                                        termsConditions: experienceDetail?.detail?.termsConditions || '',
                                        whatToBring: experienceDetail?.detail?.whatToBring || '',
                                    };
                                    try { await updateExperience(experience.id, payload); }
                                    catch (e) { console.error("Failed to update featured", e); }
                                }}
                                placeholder="Select Featured"
                                searchable={false}
                            />
                        ) : (
                            <div
                                className="flex items-center gap-1.5 cursor-pointer"
                                onClick={() => setEditingField('isFeatured')}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill={isFeatured ? '#e6a817' : 'none'} stroke={isFeatured ? '#e6a817' : '#cbd5e1'} strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>
                                <span className={cn('text-[13px] font-semibold', isFeatured ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400')}>
                                    {isFeatured ? 'Yes' : 'No'}
                                </span>
                                <svg className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </div>
                        )}
                    </div>
                </Cell>
            </FieldGrid>

            {/* ── IDENTIFIERS ──────────────────────────── */}
            <SectionLabel>Identifiers</SectionLabel>
            <FieldGrid>
                <Cell>{renderCodeCellField('Slug', 'slug', experienceDetail?.slug || experience.slug)}</Cell>
                <Cell>{renderCodeCellField('Tag Name', 'tagName', experienceDetail?.tagName || experience.tagName)}</Cell>
            </FieldGrid>

            {/* ── TIMING & CAPACITY ────────────────────── */}
            <SectionLabel>Timing & Capacity</SectionLabel>
            <FieldGrid>
                <Cell>
                    <FieldLabel>Duration</FieldLabel>
                    <div className="flex items-baseline gap-1 cursor-pointer group" onClick={() => handleEditClick('durationMinutes', experienceDetail?.detail?.durationMinutes || experience.durationMinutes)}>
                        {editingField === 'durationMinutes' ? (
                            <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" className="w-full text-[13px] font-medium border border-blue-500 rounded-md px-2 py-0.5 outline-none" value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleSave('durationMinutes')} onKeyDown={e => handleKeyDown(e, 'durationMinutes')} />
                        ) : (
                            <>
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{experienceDetail?.detail?.durationMinutes || experience.durationMinutes || '—'}</span>
                                <span className="text-[11px] text-slate-400">min</span>
                                <svg className="w-3 h-3 ml-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </>
                        )}
                    </div>
                </Cell>
                <Cell>
                    <FieldLabel>Completion Time</FieldLabel>
                    <div className="flex items-baseline gap-1 cursor-pointer group" onClick={() => handleEditClick('completionTime', experienceDetail?.detail?.completionTime || experience.completionTime)}>
                        {editingField === 'completionTime' ? (
                            <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" className="w-full text-[13px] font-medium border border-blue-500 rounded-md px-2 py-0.5 outline-none" value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleSave('completionTime')} onKeyDown={e => handleKeyDown(e, 'completionTime')} />
                        ) : (
                            <>
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{experienceDetail?.detail?.completionTime || experience.completionTime || '—'}</span>
                                <span className="text-[11px] text-slate-400">min</span>
                                <svg className="w-3 h-3 ml-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </>
                        )}
                    </div>
                </Cell>
                <Cell>
                    <FieldLabel>Min Hours</FieldLabel>
                    <div className="flex items-baseline gap-1 cursor-pointer group" onClick={() => handleEditClick('minHours', experienceDetail?.detail?.minHours || experience.minHours)}>
                        {editingField === 'minHours' ? (
                            <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" className="w-full text-[13px] font-medium border border-blue-500 rounded-md px-2 py-0.5 outline-none" value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleSave('minHours')} onKeyDown={e => handleKeyDown(e, 'minHours')} />
                        ) : (
                            <>
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{experienceDetail?.detail?.minHours || experience.minHours || '—'}</span>
                                <span className="text-[11px] text-slate-400">hrs</span>
                                <svg className="w-3 h-3 ml-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </>
                        )}
                    </div>
                </Cell>
                <Cell>
                    <FieldLabel>Max Capacity</FieldLabel>
                    <div className="flex items-baseline gap-1 cursor-pointer group" onClick={() => handleEditClick('maxCapacity', experienceDetail?.detail?.maxCapacity || experience.maxCapacity)}>
                        {editingField === 'maxCapacity' ? (
                            <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" className="w-full text-[13px] font-medium border border-blue-500 rounded-md px-2 py-0.5 outline-none" value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleSave('maxCapacity')} onKeyDown={e => handleKeyDown(e, 'maxCapacity')} />
                        ) : (
                            <>
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{experienceDetail?.detail?.maxCapacity || experience.maxCapacity || '—'}</span>
                                <span className="text-[11px] text-slate-400">people</span>
                                <svg className="w-3 h-3 ml-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </>
                        )}
                    </div>
                </Cell>
                <Cell full>
                    <FieldLabel>Min Age</FieldLabel>
                    <div className="flex items-baseline gap-1 cursor-pointer group" onClick={() => handleEditClick('minAge', experienceDetail?.detail?.minAge || experience.minAge)}>
                        {editingField === 'minAge' ? (
                            <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" className="w-full text-[13px] font-medium border border-blue-500 rounded-md px-2 py-0.5 outline-none" value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleSave('minAge')} onKeyDown={e => handleKeyDown(e, 'minAge')} />
                        ) : (
                            <>
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{experienceDetail?.detail?.minAge || experience.minAge || '—'}</span>
                                <span className="text-[11px] text-slate-400">yrs</span>
                                <svg className="w-3 h-3 ml-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </>
                        )}
                    </div>
                </Cell>
            </FieldGrid>

            {/* ── DESCRIPTIONS ─────────────────────────── */}
            <SectionLabel>Description</SectionLabel>
            <div className="flex flex-col gap-2">
                {(['shortDescription', 'description', 'whatToBring', 'termsConditions'] as const).map((field) => {
                    const labelMap: Record<string, string> = {
                        shortDescription: 'Short Description',
                        description: 'Description',
                        whatToBring: 'What To Bring',
                        termsConditions: 'Terms & Conditions',
                    };
                    const val = (experienceDetail?.detail as any)?.[field] || (experience as any)[field];
                    const isEditing = editingField === field;
                    return (
                        <div key={field} className="group bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3">
                            <FieldLabel>{labelMap[field]}</FieldLabel>
                            {isEditing ? (
                                <textarea
                                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                                    className="w-full text-[13px] text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1.5 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={() => handleSave(field)}
                                    onKeyDown={(e) => handleKeyDown(e, field)}
                                />
                            ) : (
                                <div
                                    className="flex items-start gap-2 cursor-pointer"
                                    onClick={() => handleEditClick(field, val)}
                                >
                                    <p className={cn('text-[13px] leading-relaxed flex-1', val ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 italic')}>
                                        {val || 'Empty'}
                                    </p>
                                    <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const getExperienceTabs = (params: ExperienceDetailsProps): SidePanelTab[] => {
    return [
        {
            id: 'general',
            label: 'General Information',
            content: (
                <GeneralInfoTab
                    experience={params.experience}
                    experienceDetail={params.experienceDetail}
                    updateExperience={params.updateExperience}
                    subCategories={params.subCategories}
                />
            )
        },
        {
            id: 'inclusions',
            label: 'Inclusions',
            content: (
                <InclusionsTab
                    inclusions={params.inclusions}
                    experienceDetail={params.experienceDetail}
                    onToggleInclusion={params.onToggleInclusion}
                />
            )
        },
        {
            id: 'locations',
            label: 'Locations',
            content: (
                <LocationTab
                    availableLocations={params.locations}
                    experienceLocations={params.experienceDetail?.locations || []}
                    onAssociateLocation={params.onAssociateLocation}
                    onUpdateLocation={params.onUpdateLocation}
                    onDisassociateLocation={params.onDisassociateLocation}
                />
            )
        },
        {
            id: 'policies',
            label: 'Cancellation Policy',
            content: (
                <CancellationPolicyTab
                    cancellationPolicies={params.cancellationPolicies}
                    experienceDetail={params.experienceDetail}
                    onToggleCancellationPolicy={params.onToggleCancellationPolicy}
                />
            )
        },
        {
            id: 'addons',
            label: 'Add-ons',
            content: (
                <AddonsTab
                    availableAddons={params.addons}
                    experienceAddons={params.experienceDetail?.addons || []}
                    onToggleAddon={params.onToggleAddon}
                />
            )
        }
    ];
};
