import { useMemo, useCallback } from 'react';
import { getExperienceTabs } from './ExperienceDetails';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';

const expInitials = (name: string) => name ? name.slice(0, 2).toUpperCase() : 'EX';

const expColors = [
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
];

const getColorForExp = (id: number) => expColors[(id || 0) % expColors.length];

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
}: any) => {

    const columns = [
        {
            header: 'Title',
            accessorKey: 'name',
            className: 'w-[40%] min-w-[200px] py-4 px-6 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
            render: (exp: any) => {
                const colorInfo = getColorForExp(exp.id);
                return (
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm",
                            colorInfo.bg,
                            colorInfo.text
                        )}>
                            {expInitials(exp.name)}
                        </div>
                        <span>{exp.name}</span>
                    </div>
                );
            }
        },
        {
            header: 'Price',
            accessorKey: 'basePrice',
            className: 'w-[20%] min-w-[120px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
            render: (exp: any) => <span className="font-medium">₹{exp.basePrice || 0}</span>
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'w-[20%] min-w-[100px] py-4 px-6 text-left',
            render: (exp: any) => (
                <EditableStatusBadge
                    status={exp.isActive ? 'Active' : 'Inactive'}
                    options={['Active', 'Inactive']}
                    onChange={async (val) => {
                        const newStatus = val === 'Active';
                        if (newStatus === exp.isActive) return;
                        try {
                            await updateExperience(exp.id, {
                                name: exp.name || "",
                                slug: exp.slug || "",
                                tagName: exp.tagName || "",
                                basePrice: exp.basePrice || 0,
                                displayOrder: exp.displayOrder || 0,
                                isFeatured: exp.isFeatured || false,
                                subCategoryId: exp.subCategoryId || 0,
                                isActive: newStatus
                            });
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                />
            )
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'w-[20%] min-w-[80px] py-4 px-6 text-right',
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
        const itemColor = getColorForExp(exp.id);
        return (
            <div
                className={cn(
                    "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group",
                    isSelected
                        ? "bg-blue-50/80 dark:bg-blue-900/20"
                        : "hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent"
                )}
            >
                <div className={cn(
                    "absolute left-2 w-1 h-8 rounded-r-md transition-all duration-300",
                    isSelected ? "bg-blue-600 opacity-100" : "opacity-0"
                )} />
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ml-1 shadow-sm", itemColor.bg, itemColor.text)}>
                    {expInitials(exp.name)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                        isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )}>{exp.name}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 truncate font-medium">₹{exp.basePrice || 0}</div>
                </div>
                <div className={cn(
                    "w-2 h-2 rounded-full shrink-0 shadow-sm",
                    exp.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                )} />
            </div>
        );
    }, []);

    const tabsData = useMemo(() => {
        if (!selectedExperience) return [];
        return getExperienceTabs({
            experience: {
                ...selectedExperience,
                title: selectedExperience.name,
                price: `₹${selectedExperience.basePrice || 0}`,
                status: selectedExperience.isActive ? 'Active' : 'Inactive'
            },
            experienceDetail,
            inclusions,
            cancellationPolicies,
            subCategories,
            onToggleCancellationPolicy: (policyId: number, isAssociate: boolean) => {
                toggleCancellationPolicy(selectedExperience.id, policyId, isAssociate);
            },
            onToggleInclusion: (inclusionId: number, isAssociate: boolean) => {
                toggleInclusion(selectedExperience.id, inclusionId, isAssociate);
            },
            onAssociateLocation: (locationId: number, timeSlotId: number, data: any) => {
                associateLocation(selectedExperience.id, locationId, timeSlotId, data);
            },
            onUpdateLocation: (locationId: number, timeSlotId: number, data: any) => {
                updateExperienceLocation(selectedExperience.id, locationId, timeSlotId, data);
            },
            onDisassociateLocation: (locationId: number, timeSlotId: number) => {
                disassociateLocation(selectedExperience.id, locationId, timeSlotId);
            },
            onToggleAddon: (addonId: number, isAssociate: boolean, data?: any) => {
                toggleAddon(selectedExperience.id, addonId, isAssociate, data);
            },
            updateExperience,
            locations,
            addons,
            slots,
        });
    }, [selectedExperience, experienceDetail, inclusions, cancellationPolicies, subCategories, locations, addons, slots, toggleCancellationPolicy, toggleInclusion, updateExperience, associateLocation, updateExperienceLocation, disassociateLocation, toggleAddon]);

    const renderDetailsPanel = useCallback((_exp: any, activeTab: string, _dirtyState: any) => {
        return tabsData.find(t => t.id === activeTab)?.content || null;
    }, [tabsData]);

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
