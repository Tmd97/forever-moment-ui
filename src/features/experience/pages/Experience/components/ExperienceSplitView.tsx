import { useMemo, useCallback } from 'react';
import { Sparkles, CheckCircle2, Star, BarChart2 } from 'lucide-react';
import { getExperienceTabs } from './ExperienceDetails';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { EditableFeatureBadge } from '@/components/common/EditableFeatureBadge';
import { RowActions } from '@/components/common/RowActions';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatsRow } from '@/components/common/StatsRow';
import { TABS, ITEM_ID_PREFIX } from '@/config/constants';



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
    disassociateMedia,
    showStats = true
}: any) => {

    const columns = [
        {
            header: '',
            className: 'w-[28px] py-1.5 px-2',
            render: () => null
        },
        {
            header: 'Title',
            accessorKey: 'name',
            className: 'py-1.5 px-4 text-left font-semibold text-slate-900 dark:text-white',
            render: (exp: any) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-7 px-2 min-w-[32px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0",
                        "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                    )}>
                        <span className="text-[12px] leading-none">📝</span>
                        {`${ITEM_ID_PREFIX}-${exp.id}`}
                    </div>
                    <div>
                        <div className="font-semibold text-[13.5px] text-slate-800 dark:text-slate-100 leading-tight">{exp.name}</div>
                        {exp.subCategoryName && (
                            <div className="text-[11.5px] text-slate-400 dark:text-slate-500 mt-0.5">{exp.subCategoryName}</div>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: 'Price',
            accessorKey: 'basePrice',
            className: 'py-1.5 px-4 text-right',
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
            className: 'py-1.5 px-4 text-center',
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
            className: 'py-1.5 px-4 text-center',
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
            className: 'py-1.5 px-4 text-right',
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

    const renderListItem = useCallback((exp: any, isSelected: boolean) => (
        <div
            className={cn(
                "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group relative",
                isSelected
                    ? "bg-violet-50/80 dark:bg-violet-900/20"
                    : "hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent"
            )}
        >
            <div className={cn(
                "absolute left-2 w-1 h-8 rounded-r-md transition-all duration-300",
                isSelected ? "bg-violet-600 opacity-100" : "opacity-0"
            )} />
            <div className={cn(
                "h-7 px-2 min-w-[40px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0 ml-1",
                "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
            )}>
                <span className="text-[12px] leading-none">📝</span>
                {`${ITEM_ID_PREFIX}-${exp.id}`}
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
    ), []);

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

    const renderStatsRow = useMemo(() => () => {
        const exps = experiences || [];
        const total = exps.length;
        const active = exps.filter((e: any) => e.isActive).length;
        const featured = exps.filter((e: any) => e.isFeatured).length;
        const totalValue = exps.reduce((sum: number, e: any) => sum + (Number(e.basePrice) || 0), 0);

        const cards = [
            {
                icon: <Sparkles size={18} color="#6c63ff" />,
                iconBg: '#ede9ff',
                value: total,
                label: 'Total Experiences',
            },
            {
                icon: <CheckCircle2 size={18} color="#12b76a" />,
                iconBg: '#ecfdf3',
                value: active,
                label: 'Active',
            },
            {
                icon: <Star size={18} color="#f5a623" />,
                iconBg: '#fff8ec',
                value: featured,
                label: 'Featured',
            },
            {
                icon: <BarChart2 size={18} color="#f04438" />,
                iconBg: '#fef3f2',
                value: `₹${totalValue.toLocaleString('en-IN')}`,
                label: 'Total Value',
            },
        ];

        return <StatsRow stats={cards} />;
    }, [experiences]);

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
            renderStatsRow={showStats ? renderStatsRow : undefined}
        />
    );
};
