import { useState, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import { CategoryDetails } from './CategoryDetails';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { SearchBar } from '@/components/common/SearchBar';
import { Plus, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Filter } from '@/components/common/Filter';
import { Tabs } from '@/components/common/Tabs';

const categoryInitials = (name: string) => name ? name.slice(0, 2).toUpperCase() : 'CA';

const categoryColors = [
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
];

const getColorForCategory = (id: number) => categoryColors[(id || 0) % categoryColors.length];

export const CategorySplitView = ({
    categories,
    handleOpenModal,
    handleDeleteClick,
    selectedCategory,
    setSelectedCategory,
    loading,
    handleDragReorder,
    updateCategory
}: any) => {
    const [tab, setTab] = useState("general");
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const filtered = useMemo(() => (categories || []).filter((c: any) => {
        const matchSearch = c.name && c.name.toLowerCase().includes(search.toLowerCase());

        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = c.isActive ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }

        return matchSearch && matchStatus;
    }), [categories, search, activeFilters]);

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
                            placeholder="Search categories..."
                            value={search}
                            onChange={setSearch}
                        />
                        <Button onClick={() => handleOpenModal()} className="h-10 px-4 text-sm gap-2 shadow-sm shrink-0">
                            <Plus size={16} /> Add Category
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
                                accessorKey: 'name',
                                className: 'w-[25%] min-w-[150px] py-4 px-6 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
                                render: (cat: any) => {
                                    const colorInfo = getColorForCategory(cat.id);
                                    return (
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm",
                                                colorInfo.bg,
                                                colorInfo.text
                                            )}>
                                                {categoryInitials(cat.name)}
                                            </div>
                                            <span>{cat.name}</span>
                                        </div>
                                    );
                                }
                            },
                            {
                                header: 'Description',
                                accessorKey: 'description',
                                className: 'w-[30%] min-w-[200px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
                                render: (cat: any) => (
                                    <div className="truncate max-w-[300px]" title={cat.description}>
                                        {cat.description || '-'}
                                    </div>
                                )
                            },
                            {
                                header: 'Status',
                                className: 'w-[15%] min-w-[120px] py-4 px-6 text-left',
                                render: (cat: any) => (
                                    <StatusBadge isActive={cat.isActive} />
                                )
                            },
                            {
                                header: 'Actions',
                                className: 'w-[20%] min-w-[100px] py-4 px-6 text-right',
                                render: (cat: any) => (
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <RowActions
                                            onEdit={() => handleOpenModal(cat)}
                                            onDelete={() => handleDeleteClick(cat.id)}
                                        />
                                    </div>
                                )
                            }
                        ]}
                        keyExtractor={(item: any) => item.id}
                        onRowClick={(cat: any) => { setSelectedCategory(cat); setTab("general"); }}
                        loading={loading && (!categories || categories.length === 0)}
                        onReorder={handleDragReorder}
                        draggable={true}
                    />
                </div>
            </div>
        );
    };

    const renderSplitView = () => {

        return (
            <div className="flex flex-1 h-full overflow-hidden">
                {/* Left Panel */}
                <div className="w-[320px] min-w-[320px] bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between p-5 pb-3">
                        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Categories</span>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 mx-4 mb-3">
                        <SearchBar
                            className="flex-1"
                            inputClassName="bg-slate-50"
                            placeholder="Search categories..."
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
                            {filtered.length} categor{filtered.length !== 1 ? "ies" : "y"}
                        </span>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-10 px-5 text-slate-400">
                                <div className="text-4xl mb-2 opacity-50">📂</div>
                                <div className="text-sm font-medium">No categories found</div>
                            </div>
                        )}
                        {filtered.map((cat: any) => {
                            const isSelected = selectedCategory?.id === cat.id;
                            const itemColor = getColorForCategory(cat.id);
                            return (
                                <div
                                    key={cat.id}
                                    onClick={() => { setSelectedCategory(cat); setTab("general"); }}
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
                                        {categoryInitials(cat.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={cn(
                                            "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                                            isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                        )}>{cat.name}</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500 truncate">Events: {cat.count || 0}</div>
                                    </div>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full shrink-0 shadow-sm",
                                        cat.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                    )} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 flex bg-slate-50 dark:bg-gray-900/40 p-3 h-full overflow-hidden">
                    {selectedCategory ? (
                        <div className="flex-1 flex bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm relative">
                            {/* Vertical Tab Nav (Left) */}
                            <Tabs
                                tabs={[
                                    { id: "general", label: "General Info" }
                                ]}
                                activeTab={tab}
                                onTabChange={setTab}
                            />

                            {/* Detail Content (Right) */}
                            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                                {/* Close Button Only */}
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="absolute top-1 right-1 z-[60] p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-all"
                                    title="Close Detail View"
                                >
                                    <X size={14} />
                                </button>

                                {/* Tab Content Area */}
                                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30 dark:bg-gray-900/10 relative">
                                    <div className="max-w-4xl">
                                        {tab === "general" && (
                                            <CategoryDetails
                                                category={selectedCategory}
                                                updateCategory={updateCategory}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center flex-col text-slate-400 dark:text-gray-500 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl shadow-sm">
                            <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                                <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <p className="text-base font-medium text-slate-600 dark:text-gray-300">Select a category to view details</p>
                            <p className="text-sm mt-1">Or click Add to create a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return selectedCategory ? renderSplitView() : renderFullTable();
};
