import { useMemo, useCallback } from 'react';
import { getExperienceTabs } from './ExperienceDetails';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { EditableFeatureBadge } from '@/components/common/EditableFeatureBadge';
import { RowActions } from '@/components/common/RowActions';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { TABS } from '@/config/constants';

const expInitials = (name: string) => name ? name.slice(0, 2).toUpperCase() : 'EX';

const EXP_GRADIENTS = [
    'linear-gradient(135deg, #6c63ff, #a78bfa)',    // purple
    'linear-gradient(135deg, #1a1a2e, #c8a96e)',    // dark-gold
    'linear-gradient(135deg, #b76e79, #f2c4ce)',    // rose
    'linear-gradient(135deg, #0ea5e9, #38bdf8)',    // cyan
    'linear-gradient(135deg, #059669, #34d399)',    // emerald
];

const getGradientForExp = (id: number) => EXP_GRADIENTS[(id || 0) % EXP_GRADIENTS.length];

export const ExperienceSplitView = ({
    experiences,
    handleOpenModal,
    handleDeleteClick,
    selectedExperience,
    setSelectedExperience,
    loading,
    experienceDetail,
    inclusions,
    cancellationPolicies,
    subCategories,
    toggleCancellationPolicy,
    toggleInclusion,
    updateExperience,
    handleDragReorder,
    locations,
    associateLocation,
    updateExperienceLocation,
    disassociateLocation,
    addons,
    toggleAddon,
    slots,
    toggleExperienceActive,
    toggleExperienceFeatured,
    images,
    getImages,
    experienceMedia,
    getExperienceMedia,
    bulkAttachMedia,
    disassociateMedia
}: any) => {

    const columns = [
        {
            header: '',
            className: 'w-[28px] py-4 px-2',
            render: () => (
                <svg className="text-slate-300 dark:text-gray-600 cursor-grab" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9" cy="6" r="1.5" /><circle cx="9" cy="12" r="1.5" /><circle cx="9" cy="18" r="1.5" />
                    <circle cx="15" cy="6" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="15" cy="18" r="1.5" />
                </svg>
            )
        },
        {
            header: 'Title',
            accessorKey: 'name',
            className: 'py-4 px-4 text-left font-semibold text-slate-900 dark:text-white',
            render: (exp: any) => {
                const gradient = getGradientForExp(exp.id);
                return (
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 text-white shadow-md"
                            style={{ background: gradient }}
                        >
                            {expInitials(exp.name)}
                        </div>
                        <div>
                            <div className="font-semibold text-[13.5px] text-slate-800 dark:text-slate-100 leading-tight">{exp.name}</div>
                            {exp.subCategoryName && (
                                <div className="text-[11.5px] text-slate-400 dark:text-slate-500 mt-0.5">{exp.subCategoryName}</div>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Price',
            accessorKey: 'basePrice',
            className: 'py-4 px-4 text-right',
            render: (exp: any) => (
                <div className="text-right">
                    <span className="font-semibold text-[14px] text-slate-800 dark:text-slate-100">₹{(exp.basePrice || 0).toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-slate-400 ml-1">/ event</span>
                </div>
            )
        },
        {
            header: 'Featured',
            accessorKey: 'isFeatured',
            preventRowClick: true,
            className: 'py-4 px-4 text-center',
            render: (exp: any) => (
                <EditableFeatureBadge
                    isFeatured={exp.isFeatured}
                    onChange={async (val) => {
                        if (val === exp.isFeatured) return;
                        try { await toggleExperienceFeatured(exp.id); }
                        catch (e) { console.error('Failed to update featured status', e); }
                    }}
                />
            )
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'py-4 px-4 text-center',
            render: (exp: any) => (
                <EditableStatusBadge
                    status={exp.isActive ? 'Active' : 'Inactive'}
                    options={['Active', 'Inactive']}
                    onChange={async (val) => {
                        const newStatus = val === 'Active';
                        if (newStatus === exp.isActive) return;
                        try { await toggleExperienceActive(exp.id); }
                        catch (e) { console.error(e); }
                    }}
                />
            )
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'py-4 px-4 text-right',
            render: (exp: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(exp)}
                        onDelete={() => handleDeleteClick(exp.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((exp: any, isSelected: boolean) => {
        const gradient = getGradientForExp(exp.id);
        return (
            <div
                className={cn(
                    "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-xl group relative",
                    isSelected
                        ? "bg-violet-50 dark:bg-violet-900/20 shadow-sm"
                        : "hover:bg-slate-50 dark:hover:bg-gray-800/50"
                )}
            >
                {isSelected && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-violet-600 rounded-r-full" />
                )}
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ml-1 text-white shadow-md"
                    style={{ background: gradient }}
                >
                    {expInitials(exp.name)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                        isSelected ? "text-violet-900 dark:text-violet-300" : "text-slate-800 dark:text-slate-100 group-hover:text-violet-600"
                    )}>{exp.name}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        ₹{(exp.basePrice || 0).toLocaleString('en-IN')}
                    </div>
                </div>
                <div className={cn(
                    "w-2 h-2 rounded-full shrink-0 shadow-sm",
                    exp.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                )} />
            </div>
        );
    }, []);

    const tabsData = useMemo(() => [
        { id: TABS.GENERAL.id, label: TABS.GENERAL.label },
        { id: TABS.INCLUSIONS.id, label: TABS.INCLUSIONS.label },
        { id: TABS.LOCATIONS.id, label: TABS.LOCATIONS.label },
        { id: TABS.POLICIES.id, label: TABS.POLICIES.label },
        { id: TABS.ADDONS.id, label: TABS.ADDONS.label },
        { id: TABS.IMAGES.id, label: TABS.IMAGES.label }
    ], []);

    const renderDetailsPanel = useCallback((_exp: any, activeTab: string, dirtyState: any) => {
        if (!selectedExperience) return null;

        // Transformation logic moved inside to ensure it depends on the correct selectedExperience
        // and we use a memoized version if possible, but actually we can just use _exp which is selectedItem
        const tabs = getExperienceTabs({
            experience: {
                ..._exp,
                title: _exp.name,
                price: `₹${_exp.basePrice || 0}`,
                status: _exp.isActive ? 'Active' : 'Inactive'
            },
            experienceDetail,
            inclusions,
            cancellationPolicies,
            subCategories,
            onToggleCancellationPolicy: (policyId: number, isAssociate: boolean) => {
                toggleCancellationPolicy(_exp.id, policyId, isAssociate);
            },
            onToggleInclusion: (inclusionId: number, isAssociate: boolean) => {
                toggleInclusion(_exp.id, inclusionId, isAssociate);
            },
            onAssociateLocation: (locationId: number, timeSlotId: number, data: any) => {
                associateLocation(_exp.id, locationId, timeSlotId, data);
            },
            onUpdateLocation: (locationId: number, timeSlotId: number, data: any) => {
                updateExperienceLocation(_exp.id, locationId, timeSlotId, data);
            },
            onDisassociateLocation: (locationId: number, timeSlotId: number) => {
                disassociateLocation(_exp.id, locationId, timeSlotId);
            },
            onToggleAddon: (addonId: number, isAssociate: boolean, data?: any) => {
                toggleAddon(_exp.id, addonId, isAssociate, data);
            },
            updateExperience,
            locations,
            addons,
            slots,
            images,
            getImages,
            experienceMedia,
            getExperienceMedia,
            bulkAttachMedia,
            disassociateMedia,
            onDirtyChange: dirtyState.handleDirtyChange
        });
        return tabs.find(t => t.id === activeTab)?.content || null;
    }, [experienceDetail, inclusions, cancellationPolicies, subCategories, locations, addons, slots, images, experienceMedia, toggleCancellationPolicy, toggleInclusion, updateExperience, associateLocation, updateExperienceLocation, disassociateLocation, toggleAddon, bulkAttachMedia, disassociateMedia, getImages, getExperienceMedia]);

    const customFilter = useCallback((exp: any, activeFilters: Record<string, string[]>) => {
        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = exp.isActive ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }

        return matchStatus;
    }, []);

    const customSearch = useCallback((exp: any, search: string) => {
        return exp.name && exp.name.toLowerCase().includes(search.toLowerCase());
    }, []);

    return (
        <CrudSplitViewLayout
            data={experiences || []}
            loading={loading}
            resourceName="Experience"
            resourceNamePlural="Experiences"
            selectedItem={selectedExperience}
            onSelectItem={setSelectedExperience}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            onDragReorder={handleDragReorder}
            renderListItem={renderListItem}
            tabs={tabsData.map(t => ({ id: t.id, label: t.label }))}
            renderDetailsPanel={renderDetailsPanel}
            filterConfig={[
                {
                    id: 'status',
                    name: 'Status',
                    options: [
                        { id: '1', label: 'Active', value: 'true' },
                        { id: '2', label: 'Inactive', value: 'false' },
                    ]
                }
            ]}
            customFilter={customFilter}
            customSearch={customSearch}
            onAdd={() => handleOpenModal()}
        />
    );
};
