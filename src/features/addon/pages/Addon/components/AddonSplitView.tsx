import { useState, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import { AddonDetails } from './AddonDetails';
import { Tabs } from '@/components/common/Tabs';
import { DataTable } from '@/components/common/DataTable';
import { EditableTitle } from '@/components/common/EditableTitle';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { SearchBar } from '@/components/common/SearchBar';
import { Plus, X, PackageOpen } from 'lucide-react';
import { Filter } from '@/components/common/Filter';
import type { AddonType } from '@/features/addon/store/action-types';
import { cn } from '@/utils/cn';

const tabOptions = [
    { id: 'general', label: 'General Info' },
];

export const AddonSplitView = ({
    addons,
    handleOpenModal,
    handleDeleteClick,
    selectedAddon,
    setSelectedAddon,
    loading,
    updateAddon
}: any) => {
    const [tab, setTab] = useState("general");
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const filtered = useMemo(() => (addons || []).filter((a: AddonType) => {
        const matchSearch = a.name && a.name.toLowerCase().includes(search.toLowerCase());

        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = a.isActive ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }

        return matchSearch && matchStatus;
    }), [addons, search, activeFilters]);

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
                            placeholder="Search addon..."
                            value={search}
                            onChange={setSearch}
                        />
                        <Button onClick={() => handleOpenModal()} className="h-10 px-4 text-sm gap-2 shadow-sm shrink-0">
                            <Plus size={16} /> Add Addon
                        </Button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <DataTable
                        data={filtered}
                        columns={[
                            {
                                header: 'Name',
                                className: 'w-[45%] min-w-[200px] py-4 px-6 text-left font-semibold text-slate-900 dark:text-white',
                                render: (a: any) => (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                            {a.icon || <PackageOpen className="w-4 h-4" />}
                                        </div>
                                        <EditableTitle
                                            value={a.name || '-'}
                                            onChange={(val) => updateAddon(a.id, { name: val, description: a.description, basePrice: a.basePrice, isActive: a.isActive, icon: a.icon })}
                                        />
                                        {a.description && <p className="text-xs text-slate-500 font-normal truncate mt-0.5 max-w-[250px]">{a.description}</p>}
                                    </div>
                                )
                            },
                            {
                                header: 'Base Price',
                                className: 'w-[20%] min-w-[120px] py-4 px-6 text-left',
                                render: (a: any) => (
                                    <span className="font-medium text-slate-700 dark:text-slate-300">₹{a.basePrice || 0}</span>
                                )
                            },
                            {
                                header: 'Status',
                                preventRowClick: true,
                                className: 'w-[15%] min-w-[120px] py-4 px-6 text-left',
                                render: (a: any) => (
                                    <EditableStatusBadge
                                        status={a.isActive ? 'Active' : 'Inactive'}
                                        options={['Active', 'Inactive']}
                                        onChange={(val) => updateAddon(a.id, { isActive: val === 'Active', name: a.name, description: a.description, basePrice: a.basePrice, icon: a.icon })}
                                    />
                                )
                            },
                            {
                                header: '',
                                className: 'w-[10%] min-w-[80px] py-4 px-6 text-right',
                                render: (a: any) => (
                                    <RowActions
                                        onEdit={() => handleOpenModal(a)}
                                        onDelete={() => handleDeleteClick(a)}
                                    />
                                )
                            }
                        ]}
                        loading={loading}
                        onRowClick={(row: any) => setSelectedAddon(row)}
                        keyExtractor={(row: any) => row.id}
                    />
                </div>
            </div>
        );
    };

    const renderSplitView = () => {
        return (
            <div className="flex flex-1 h-full overflow-hidden">
                {/* Left Panel - Compact List */}
                <div className="w-1/3 min-w-[320px] border-r border-slate-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900 relative">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 dark:border-gray-800 flex-shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Addons</h2>
                            <Button onClick={() => handleOpenModal()} className="h-8 px-3 text-xs gap-1.5 shadow-sm">
                                <Plus size={14} /> Add
                            </Button>
                        </div>
                        <SearchBar
                            className="w-full"
                            inputClassName="py-2 pl-9 pr-3 text-sm bg-slate-50 border-slate-200 focus:bg-white dark:bg-gray-800/50 dark:border-gray-700"
                            placeholder="Search..."
                            value={search}
                            onChange={setSearch}
                        />
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        {loading && filtered.length === 0 ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-10 px-5 text-slate-400">
                                <div className="text-4xl mb-2 opacity-50">📦</div>
                                <div className="text-sm font-medium">No addons found</div>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {filtered.map((a: AddonType) => {
                                    const isSelected = selectedAddon?.id === a.id;
                                    return (
                                        <div
                                            key={a.id}
                                            onClick={() => setSelectedAddon(a)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group relative",
                                                isSelected
                                                    ? "bg-blue-50/80 dark:bg-blue-900/20"
                                                    : "hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute left-0 w-1 h-8 rounded-r-md transition-all duration-300",
                                                isSelected ? "bg-blue-600 opacity-100" : "opacity-0"
                                            )} />
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ml-1 shadow-sm transition-colors",
                                                isSelected
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                                            )}>
                                                {a.icon || <PackageOpen className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={cn(
                                                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                                                    isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                                )}>
                                                    {a.name || '-'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                                        ₹{a.basePrice || 0}
                                                    </p>
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full shrink-0 shadow-sm",
                                                        a.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                                    )} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Details */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-gray-900/40 p-3 h-full overflow-hidden">
                    <div className="flex-1 flex bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm relative">
                        <button
                            onClick={() => setSelectedAddon(null)}
                            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 rounded-md transition-all z-[60]"
                            title="Close details"
                        >
                            <X size={16} />
                        </button>

                        <Tabs
                            tabs={tabOptions}
                            activeTab={tab}
                            onTabChange={setTab}
                            variant="vertical"
                        />

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30 dark:bg-gray-900/10 relative">
                            <div className="max-w-4xl pt-2">
                                <AddonDetails
                                    addon={selectedAddon}
                                    updateAddon={updateAddon}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return selectedAddon ? renderSplitView() : renderFullTable();
};
