import { useState, useRef, useEffect } from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { InclusionsTab } from './InclusionsTab';
import { CancellationPolicyTab } from './CancellationPolicyTab';
import { LocationTab } from './LocationTab';
import { Dropdown } from '@/components/common/Dropdown';
import { cn } from '@/utils/cn';
import type { ExperienceType } from './Experience';
import type { SidePanelTab } from '@/components/common/SidePanelTabs';

interface ExperienceDetailsProps {
    experience: ExperienceType;
    experienceDetail: any;
    inclusions: any[];
    cancellationPolicies: any[];
    subCategories: any[];
    locations: any[];
    onToggleCancellationPolicy: (id: number, checked: boolean) => void;
    onToggleInclusion: (id: number, checked: boolean) => void;
    onAssociateLocation: (id: number, data: any) => void;
    onUpdateLocation: (id: number, data: any) => void;
    onDisassociateLocation: (id: number) => void;
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

    const renderEditableField = (label: string, field: string, value: any, isTextArea: boolean = false, displayOverride?: string) => {
        const isEditing = editingField === field;
        const displayValue = displayOverride !== undefined ? displayOverride : value;

        return (
            <div className={cn("group relative", isTextArea && "col-span-2")}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tight mb-1">{label}</h3>
                {isEditing ? (
                    isTextArea ? (
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            className="w-full text-base font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all -ml-2 min-h-[100px]"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(field)}
                            onKeyDown={(e) => handleKeyDown(e, field)}
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type="text"
                            className="w-full text-base font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all -ml-2"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(field)}
                            onKeyDown={(e) => handleKeyDown(e, field)}
                        />
                    )
                ) : (
                    <div
                        className={cn(
                            "text-base font-semibold text-gray-900 dark:text-gray-100 px-2 py-1 -ml-2 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-gray-700 relative flex",
                            isTextArea ? "items-start min-h-[40px] whitespace-pre-line" : "items-center"
                        )}
                        onClick={() => handleEditClick(field, value)}
                    >
                        <span className={cn(!displayValue && "text-slate-400 italic font-normal")}>{displayValue || 'Empty'}</span>
                        <svg className="w-3.5 h-3.5 ml-2 mt-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {renderEditableField('Name', 'name', experienceDetail?.name || experience.name)}

                <div className="group relative">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tight mb-1">Sub Category</h3>
                    {editingField === 'subCategoryId' ? (
                        <div className="-ml-2">
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
                                    try {
                                        await updateExperience(experience.id, payload);
                                    } catch (e) {
                                        console.error("Failed to update sub category", e);
                                    }
                                }}
                                placeholder="Select Sub Category"
                                searchable={true}
                            />
                        </div>
                    ) : (
                        <div
                            className="mt-1 -ml-2 px-2 py-1 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-gray-700 w-max flex items-center"
                            onClick={() => setEditingField('subCategoryId')}
                        >
                            <p className="text-base text-gray-900 dark:text-gray-100">
                                {subCategories?.find((sc: any) => sc.id === experienceDetail?.subCategoryId)?.name || <span className="text-slate-400 italic font-normal">Not specified</span>}
                            </p>
                            <svg className="w-3.5 h-3.5 ml-2 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </div>
                    )}
                </div>

                {renderEditableField('Price', 'basePrice', experienceDetail?.basePrice || experience.basePrice, false, experience.price)}

                <div className="group relative">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tight mb-1">Status</h3>
                    {editingField === 'isActive' ? (
                        <div className="-ml-2">
                            <Dropdown
                                label=""
                                options={[
                                    { label: 'Active', value: 'true' },
                                    { label: 'Inactive', value: 'false' }
                                ]}
                                value={(experienceDetail?.isActive ?? experience.isActive) ? 'true' : 'false'}
                                onChange={async (val) => {
                                    const newStatus = val === 'true';
                                    setEditingField(null);
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
                                    try {
                                        await updateExperience(experience.id, payload);
                                    } catch (e) {
                                        console.error("Failed to update status", e);
                                    }
                                }}
                                placeholder="Select Status"
                                searchable={false}
                            />
                        </div>
                    ) : (
                        <div
                            className="mt-1 -ml-2 px-2 py-1 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-gray-700 w-max flex items-center"
                            onClick={() => setEditingField('isActive')}
                        >
                            <StatusBadge status={(experienceDetail?.isActive ?? experience.isActive) ? 'Active' : 'Inactive'} />
                            <svg className="w-3.5 h-3.5 ml-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </div>
                    )}
                </div>

                {renderEditableField('Slug', 'slug', experienceDetail?.slug || experience.slug)}
                {renderEditableField('Tag Name', 'tagName', experienceDetail?.tagName || experience.tagName)}

                <div className="group relative">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tight mb-1">Featured</h3>
                    {editingField === 'isFeatured' ? (
                        <div className="-ml-2">
                            <Dropdown
                                label=""
                                options={[
                                    { label: 'Yes', value: 'true' },
                                    { label: 'No', value: 'false' }
                                ]}
                                value={(experienceDetail?.isFeatured ?? experience.isFeatured) ? 'true' : 'false'}
                                onChange={async (val) => {
                                    const newFeatured = val === 'true';
                                    setEditingField(null);
                                    if (newFeatured === (experienceDetail?.isFeatured ?? experience.isFeatured)) return;

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
                                    try {
                                        await updateExperience(experience.id, payload);
                                    } catch (e) {
                                        console.error("Failed to update featured", e);
                                    }
                                }}
                                placeholder="Select Featured"
                                searchable={false}
                            />
                        </div>
                    ) : (
                        <div
                            className="mt-1 -ml-2 px-2 py-1 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-gray-700 w-max flex items-center"
                            onClick={() => setEditingField('isFeatured')}
                        >
                            <span className="text-base text-gray-900 dark:text-gray-100">{(experienceDetail?.isFeatured ?? experience.isFeatured) ? 'Yes' : 'No'}</span>
                            <svg className="w-3.5 h-3.5 ml-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </div>
                    )}
                </div>

                {renderEditableField('Duration (Minutes)', 'durationMinutes', experienceDetail?.detail?.durationMinutes || experience.durationMinutes)}
                {renderEditableField('Max Capacity', 'maxCapacity', experienceDetail?.detail?.maxCapacity || experience.maxCapacity)}
                {renderEditableField('Min Age', 'minAge', experienceDetail?.detail?.minAge || experience.minAge)}
                {renderEditableField('Completion Time', 'completionTime', experienceDetail?.detail?.completionTime || experience.completionTime)}
                {renderEditableField('Min Hours', 'minHours', experienceDetail?.detail?.minHours || experience.minHours)}

                {renderEditableField('Short Description', 'shortDescription', experienceDetail?.detail?.shortDescription || experience.shortDescription, true)}
                {renderEditableField('Description', 'description', experienceDetail?.detail?.description || experience.description, true)}
                {renderEditableField('What To Bring', 'whatToBring', experienceDetail?.detail?.whatToBring || experience.whatToBring, true)}
                {renderEditableField('Terms & Conditions', 'termsConditions', experienceDetail?.detail?.termsConditions || experience.termsConditions, true)}
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
        }
    ];
};
