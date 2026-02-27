import { useState, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import { Tabs } from '@/components/common/Tabs';
import { getExperienceTabs } from './ExperienceDetails';
import { DataTable } from '@/components/common/DataTable';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { SearchBar } from '@/components/common/SearchBar';
import { Plus, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Filter } from '@/components/common/Filter';

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
    const [tab, setTab] = useState("general");
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const filtered = useMemo(() => (experiences || []).filter((e: any) => {
        const matchSearch = e.name && e.name.toLowerCase().includes(search.toLowerCase());

        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = e.isActive ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }

        return matchSearch && matchStatus;
    }), [experiences, search, activeFilters]);

    // Data for tabs
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
    }, [selectedExperience, experienceDetail, inclusions, cancellationPolicies, subCategories, locations, addons, slots, handleOpenModal, toggleCancellationPolicy, toggleInclusion, updateExperience, associateLocation, updateExperienceLocation, disassociateLocation, toggleAddon]);

    const renderFullTable = () => {
        return (
            <div className="flex flex-col flex-1 h-full">
                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-800">
                    <Filter
                        categories={[
                            {
                                id: 'status',
                                name: 'Status',
                                options: [
                                    { id: '1', label: 'Active', value: 'true' },
                                    { id: '2', label: 'Inactive', value: 'false' },
                                ]
                            }
                        ]}
                        onFilterChange={setActiveFilters}
                    />

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <SearchBar
                            className="w-full sm:w-72"
                            inputClassName="py-2.5 pl-10 pr-4"
                            placeholder="Search experiences..."
                            value={search}
                            onChange={setSearch}
                        />
                        <Button onClick={() => handleOpenModal()} className="h-10 px-4 text-sm gap-2 shadow-sm shrink-0">
                            <Plus size={16} /> Add Experience
                        </Button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <DataTable
                        data={filtered}
                        columns={[
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
                        ]}
                        keyExtractor={(item: any) => item.id}
                        onRowClick={(exp: any) => { setSelectedExperience(exp); setTab("general"); }}
                        loading={loading}
                        onReorder={search === "" && Object.keys(activeFilters).length === 0 ? handleDragReorder : undefined}
                        draggable={true}
                    />
                </div>
            </div>
        );
    };

    const renderSplitView = () => {
        const activeTabContent = tabsData.find(t => t.id === tab)?.content;

        return (
            <div className="flex flex-1 h-full overflow-hidden">
                {/* Left Panel */}
                <div className="w-[340px] min-w-[340px] bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between p-5 pb-3">
                        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Experiences</span>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 mx-4 mb-3">
                        <SearchBar
                            className="flex-1"
                            inputClassName="bg-slate-50"
                            placeholder="Search experiences..."
                            value={search}
                            onChange={setSearch}
                        />
                        <Button onClick={() => handleOpenModal()} className="h-[38px] px-3 text-xs gap-1.5 shadow-sm shrink-0">
                            <Plus size={14} /> Add
                        </Button>
                    </div>

                    {/* Filter Pills */}
                    <div className="px-4 mb-3">
                        <Filter
                            categories={[
                                {
                                    id: 'status',
                                    name: 'Status',
                                    options: [
                                        { id: '1', label: 'Active', value: 'true' },
                                        { id: '2', label: 'Inactive', value: 'false' },
                                    ]
                                }
                            ]}
                            onFilterChange={setActiveFilters}
                        />
                    </div>

                    {/* Count Row */}
                    <div className="px-5 pb-2 border-b border-slate-100 dark:border-gray-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                            {filtered.length} experience{filtered.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-10 px-5 text-slate-400">
                                <div className="text-4xl mb-2 opacity-50">✨</div>
                                <div className="text-sm font-medium">No experiences found</div>
                            </div>
                        )}
                        {filtered.map((exp: any) => {
                            const isSelected = selectedExperience?.id === exp.id;
                            const itemColor = getColorForExp(exp.id);
                            return (
                                <div
                                    key={exp.id}
                                    onClick={() => { setSelectedExperience(exp); setTab("general"); }}
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
                        })}
                    </div>
                </div>

                {/* Detail Panel Container */}
                <div className="flex-1 flex bg-slate-50 dark:bg-gray-900/40 p-3 h-full overflow-hidden">
                    <div className="flex-1 flex bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm relative">
                        {/* Vertical Tab Nav (Left) */}
                        <Tabs
                            tabs={tabsData.map(t => ({ id: t.id, label: t.label }))}
                            activeTab={tab}
                            onTabChange={setTab}
                        />

                        {/* Detail Content (Right) */}
                        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                            {/* Detail Header (Inside Content) */}
                            {/* Close Button Only */}
                            <button
                                onClick={() => setSelectedExperience(null)}
                                className="absolute top-1 right-1 z-[60] p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-all"
                                title="Close Detail View"
                            >
                                <X size={14} />
                            </button>

                            {/* Tab Content Area */}
                            <div className="flex-1 overflow-y-auto p-8 pt-4">
                                {activeTabContent && (
                                    <div className="max-w-4xl">

                                        {activeTabContent}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return selectedExperience ? renderSplitView() : renderFullTable();
};
