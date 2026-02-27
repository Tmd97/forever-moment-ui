import { useState, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import { SubCategoryDetails } from './SubCategoryDetails';
import { Tabs } from '@/components/common/Tabs';
import { DataTable } from '@/components/common/DataTable';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { SearchBar } from '@/components/common/SearchBar';
import { Plus, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Filter } from '@/components/common/Filter';

const subCategoryInitials = (name: string) => name ? name.slice(0, 2).toUpperCase() : 'SC';

const subCategoryColors = [
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
];

const getColorForSubCategory = (id: number) => subCategoryColors[(id || 0) % subCategoryColors.length];

export const SubCategorySplitView = ({
    subCategories,
    categories,
    handleOpenModal,
    handleDeleteClick,
    selectedSubCategory,
    setSelectedSubCategory,
    loading,
    updateSubCategory
}: any) => {
    const [tab, setTab] = useState("general");
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const filtered = useMemo(() => (subCategories || []).filter((sc: any) => {
        const matchSearch = sc.name && sc.name.toLowerCase().includes(search.toLowerCase());

        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = sc.isActive ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }

        let matchCategory = true;
        if (activeFilters.categoryId && activeFilters.categoryId.length > 0) {
            matchCategory = sc.categoryId && activeFilters.categoryId.includes(String(sc.categoryId));
        }

        return matchSearch && matchStatus && matchCategory;
    }), [subCategories, search, activeFilters]);

    const categoryOptions = useMemo(() => {
        return categories?.map((cat: any) => ({
            id: String(cat.id),
            label: cat.name,
            value: String(cat.id)
        })) || [];
    }, [categories]);

    const filterCategoriesConfig = [
        {
            id: 'status',
            name: 'Status',
            options: [
                { id: '1', label: 'Active', value: 'true' },
                { id: '2', label: 'Inactive', value: 'false' },
            ]
        },
        {
            id: 'categoryId',
            name: 'Category',
            options: categoryOptions
        }
    ];

    const renderFullTable = () => {
        return (
            <div className="flex flex-col flex-1 h-full">
                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-800">
                    <Filter
                        categories={filterCategoriesConfig}
                        onFilterChange={setActiveFilters}
                    />

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <SearchBar
                            className="w-full sm:w-72"
                            inputClassName="py-2.5 pl-10 pr-4"
                            placeholder="Search sub categories..."
                            value={search}
                            onChange={setSearch}
                        />
                        <Button onClick={() => handleOpenModal()} className="h-10 px-4 text-sm gap-2 shadow-sm shrink-0">
                            <Plus size={16} /> Add Sub Category
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
                                className: 'w-[25%] min-w-[200px] py-4 px-6 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
                                render: (sc: any) => {
                                    const colorInfo = getColorForSubCategory(sc.id);
                                    return (
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm",
                                                colorInfo.bg,
                                                colorInfo.text
                                            )}>
                                                {subCategoryInitials(sc.name)}
                                            </div>
                                            <span>{sc.name}</span>
                                        </div>
                                    );
                                }
                            },
                            {
                                header: 'Category',
                                className: 'w-[20%] min-w-[150px] py-4 px-6 text-left',
                                render: (sc: any) => {
                                    const category = categories?.find((c: any) => c.id === sc.categoryId);
                                    return (
                                        <span className="text-slate-700 dark:text-slate-300">
                                            {category ? category.name : '-'}
                                        </span>
                                    );
                                }
                            },
                            {
                                header: 'Description',
                                accessorKey: 'description',
                                className: 'w-[25%] min-w-[200px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
                                render: (sc: any) => (
                                    <div className="truncate max-w-[250px]" title={sc.description}>
                                        {sc.description || '-'}
                                    </div>
                                )
                            },
                            {
                                header: 'Status',
                                preventRowClick: true,
                                className: 'w-[15%] min-w-[100px] py-4 px-6 text-left',
                                render: (sc: any) => (
                                    <EditableStatusBadge
                                        status={sc.isActive ? 'Active' : 'Inactive'}
                                        options={['Active', 'Inactive']}
                                        onChange={async (val) => {
                                            const newStatus = val === 'Active';
                                            if (newStatus === sc.isActive) return;
                                            try {
                                                await updateSubCategory({
                                                    id: sc.id,
                                                    name: sc.name,
                                                    description: sc.description || "",
                                                    categoryId: sc.categoryId,
                                                    isActive: newStatus
                                                });
                                            } catch (e) { console.error(e); }
                                        }}
                                    />
                                )
                            },
                            {
                                header: 'Actions',
                                preventRowClick: true,
                                className: 'w-[15%] min-w-[100px] py-4 px-6 text-right',
                                render: (sc: any) => (
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <RowActions
                                            onEdit={() => handleOpenModal(sc)}
                                            onDelete={() => handleDeleteClick(sc.id)}
                                        />
                                    </div>
                                )
                            }
                        ]}
                        keyExtractor={(item: any) => item.id}
                        onRowClick={(sc: any) => { setSelectedSubCategory(sc); setTab("general"); }}
                        loading={loading && (!subCategories || subCategories.length === 0)}
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
                        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Sub Categories</span>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 mx-4 mb-3">
                        <SearchBar
                            className="flex-1"
                            inputClassName="bg-slate-50"
                            placeholder="Search sub categories..."
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
                            categories={filterCategoriesConfig}
                            onFilterChange={setActiveFilters}
                        />
                    </div>

                    {/* Count Row */}
                    <div className="px-5 pb-2 border-b border-slate-100 dark:border-gray-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                            {filtered.length} sub categor{filtered.length !== 1 ? "ies" : "y"}
                        </span>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-10 px-5 text-slate-400">
                                <div className="text-4xl mb-2 opacity-50">📂</div>
                                <div className="text-sm font-medium">No sub categories found</div>
                            </div>
                        )}
                        {filtered.map((sc: any) => {
                            const isSelected = selectedSubCategory?.id === sc.id;
                            const itemColor = getColorForSubCategory(sc.id);
                            return (
                                <div
                                    key={sc.id}
                                    onClick={() => { setSelectedSubCategory(sc); setTab("general"); }}
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
                                        {subCategoryInitials(sc.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={cn(
                                            "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                                            isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                        )}>{sc.name}</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500 truncate">Events: {sc.count || 0}</div>
                                    </div>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full shrink-0 shadow-sm",
                                        sc.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
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
                            tabs={[{ id: "general", label: "General Info" }]}
                            activeTab={tab}
                            onTabChange={setTab}
                        />

                        {/* Detail Content (Right) */}
                        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                            {/* Close Button Only */}
                            <button
                                onClick={() => setSelectedSubCategory(null)}
                                className="absolute top-1 right-1 z-[60] p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-all"
                                title="Close Detail View"
                            >
                                <X size={14} />
                            </button>

                            {/* Tab Content Area */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30 dark:bg-gray-900/10 relative">
                                <div className="max-w-4xl">
                                    {tab === "general" && (
                                        <SubCategoryDetails
                                            subCategory={selectedSubCategory}
                                            categories={categories}
                                            updateSubCategory={updateSubCategory}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return selectedSubCategory ? renderSplitView() : renderFullTable();
};
