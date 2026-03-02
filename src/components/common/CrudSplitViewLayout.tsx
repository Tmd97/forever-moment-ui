import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { SearchBar } from '@/components/common/SearchBar';
import { Plus, X } from 'lucide-react';
import { Filter } from '@/components/common/Filter';
import type { FilterCategory } from '@/components/common/Filter';
import { Tabs } from '@/components/common/Tabs';
import { UnsavedChangesModal } from '@/components/common/UnsavedChangesModal';
import { useBlocker } from 'react-router-dom';

export interface CrudSplitViewLayoutProps<T> {
    data: T[];
    loading?: boolean;
    resourceName: string;
    resourceNamePlural?: string;

    // Selection Control
    selectedItem: T | null;
    onSelectItem: (item: T | null) => void;

    // Table Configuration
    columns: any[];
    keyExtractor: (item: T) => string | number;
    onDragReorder?: (data: T[]) => void;

    // Split List Item Configuration
    renderListItem: (item: T, isSelected: boolean) => React.ReactNode;

    // Split Details Configuration
    tabs?: { id: string; label: string }[];
    renderDetailsPanel: (
        item: T,
        activeTab: string,
        dirtyState: {
            isDirty: boolean;
            handleDirtyChange: (dirty: boolean, changesList: any[]) => void;
        }
    ) => React.ReactNode;

    // Search and Filters
    searchFields?: (keyof T)[];
    filterConfig?: FilterCategory[];
    customFilter?: (item: T, activeFilters: Record<string, string[]>) => boolean;
    customSearch?: (item: T, search: string) => boolean;

    // Actions
    onAdd?: () => void;
    emptyStateIcon?: React.ReactNode;
    renderCustomDetailsHeader?: (item: T) => React.ReactNode;
}

export function CrudSplitViewLayout<T>({
    data,
    loading,
    resourceName,
    resourceNamePlural,
    selectedItem,
    onSelectItem,
    columns,
    keyExtractor,
    onDragReorder,
    renderListItem,
    tabs = [],
    renderDetailsPanel,
    searchFields = [],
    filterConfig = [],
    customFilter,
    customSearch,
    onAdd,
    emptyStateIcon = "📝",
    renderCustomDetailsHeader
}: CrudSplitViewLayoutProps<T>) {
    const defaultTab = tabs.length > 0 ? tabs[0].id : "";
    const [tab, setTab] = useState(defaultTab);
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
    const [isDirty, setIsDirty] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<any[]>([]);
    const [pendingAction, setPendingAction] = useState<{ type: 'click' | 'close' | 'tab', data?: any } | null>(null);

    // Keep tab valid if tabs array changes
    useEffect(() => {
        if (tabs.length > 0 && !tabs.some(t => t.id === tab)) {
            setTab(tabs[0].id);
        }
    }, [tabs, tab]);

    // Block navigation via router
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isDirty && currentLocation.pathname !== nextLocation.pathname
    );

    const handleDirtyChange = useCallback((dirty: boolean, changesList: any[]) => {
        setIsDirty(dirty);
        setPendingChanges(changesList || []);
    }, []);

    const filtered = useMemo(() => (data || []).filter((item: T) => {
        let matchSearch = true;
        if (search) {
            if (customSearch) {
                matchSearch = customSearch(item, search);
            } else if (searchFields.length > 0) {
                const s = search.toLowerCase();
                matchSearch = searchFields.some(field => {
                    const val = item[field];
                    return typeof val === 'string' && val.toLowerCase().includes(s);
                });
            }
        }

        let matchStatus = true;
        if (customFilter) {
            matchStatus = customFilter(item, activeFilters);
        }

        return matchSearch && matchStatus;
    }), [data, search, activeFilters, searchFields, customSearch, customFilter]);

    const handleItemClick = (item: T) => {
        if (isDirty) {
            setPendingAction({ type: 'click', data: item });
        } else {
            onSelectItem(item);
            setTab(defaultTab);
        }
    };

    const handleTabChange = (newTab: string) => {
        if (isDirty) {
            setPendingAction({ type: 'tab', data: newTab });
        } else {
            setTab(newTab);
        }
    };

    const handleCloseProcess = () => {
        if (isDirty) {
            setPendingAction({ type: 'close' });
        } else {
            onSelectItem(null);
        }
    };

    const renderFullTable = () => {
        return (
            <div className="flex flex-col flex-1 h-full">
                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-800">
                    {filterConfig.length > 0 ? (
                        <Filter
                            categories={filterConfig}
                            onFilterChange={setActiveFilters}
                        />
                    ) : <div />}

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <SearchBar
                            className="w-full sm:w-72"
                            inputClassName="py-2.5 pl-10 pr-4"
                            placeholder={`Search ${resourceNamePlural || resourceName + 's'}...`}
                            value={search}
                            onChange={setSearch}
                        />
                        {onAdd && (
                            <Button onClick={() => onAdd()} className="h-10 px-4 text-sm gap-2 shadow-sm shrink-0">
                                <Plus size={16} /> Add {resourceName}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <DataTable
                        data={filtered}
                        columns={columns}
                        keyExtractor={keyExtractor}
                        onRowClick={handleItemClick}
                        loading={loading && (!data || data.length === 0)}
                        onReorder={(search === "" && Object.keys(activeFilters).length === 0) ? onDragReorder : undefined}
                        draggable={(search === "" && Object.keys(activeFilters).length === 0) && !!onDragReorder}
                    />
                </div>
            </div>
        );
    };

    const renderSplitView = () => {
        const pluralName = resourceNamePlural || resourceName + 's';
        const displayCount = filtered.length;
        return (
            <div className="flex flex-1 h-full overflow-hidden">
                {/* Left Panel */}
                <div className="w-[340px] min-w-[340px] bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between p-5 pb-3">
                        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">{pluralName}</span>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 mx-4 mb-3">
                        <SearchBar
                            className="flex-1"
                            inputClassName="bg-slate-50"
                            placeholder={`Search ${pluralName.toLowerCase()}...`}
                            value={search}
                            onChange={setSearch}
                        />
                        {onAdd && (
                            <Button onClick={() => onAdd()} className="h-[38px] px-3 text-xs gap-1.5 shadow-sm shrink-0">
                                <Plus size={14} /> Add
                            </Button>
                        )}
                    </div>

                    {/* Filter Pills */}
                    {filterConfig.length > 0 && (
                        <div className="px-4 mb-3">
                            <Filter
                                categories={filterConfig}
                                onFilterChange={setActiveFilters}
                            />
                        </div>
                    )}

                    {/* Count Row */}
                    <div className="px-5 pb-2 border-b border-slate-100 dark:border-gray-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                            {displayCount} {displayCount !== 1 ? pluralName.toLowerCase() : resourceName.toLowerCase()}
                        </span>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-10 px-5 text-slate-400">
                                <div className="text-4xl mb-2 opacity-50">{emptyStateIcon}</div>
                                <div className="text-sm font-medium">No {pluralName.toLowerCase()} found</div>
                            </div>
                        )}
                        {filtered.map((item: T) => {
                            const isSelected = selectedItem ? keyExtractor(selectedItem) === keyExtractor(item) : false;
                            return (
                                <div
                                    key={keyExtractor(item)}
                                    onClick={() => handleItemClick(item)}
                                >
                                    {renderListItem(item, isSelected)}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detail Panel Container */}
                <div className="flex-1 flex bg-slate-50 dark:bg-gray-900/40 p-3 h-full overflow-hidden">
                    <div className="flex-1 flex bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm relative">
                        {/* Vertical Tab Nav (Left) */}
                        {tabs.length > 0 && (
                            <Tabs
                                tabs={tabs}
                                activeTab={tab}
                                onTabChange={handleTabChange}
                            />
                        )}

                        {/* Detail Content (Right) */}
                        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                            {/* Close Button Only */}
                            <button
                                onClick={handleCloseProcess}
                                className="absolute top-1 right-1 z-[60] p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-all"
                                title="Close Detail View"
                            >
                                <X size={14} />
                            </button>
                            {renderCustomDetailsHeader && selectedItem && renderCustomDetailsHeader(selectedItem)}
                            {/* Tab Content Area */}
                            <div className="flex-1 overflow-y-auto p-8 pt-4 relative">
                                <div className="max-w-4xl">
                                    {selectedItem && renderDetailsPanel(selectedItem, tab, { isDirty, handleDirtyChange })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isDirty && (
                    <>
                        <UnsavedChangesModal
                            isOpen={pendingAction !== null}
                            onClose={() => setPendingAction(null)}
                            itemName={resourceName.toLowerCase()}
                            changeCount={pendingChanges.length}
                            changes={pendingChanges}
                            onConfirm={() => {
                                if (pendingAction?.type === 'click') {
                                    onSelectItem(pendingAction.data);
                                    setTab(defaultTab);
                                } else if (pendingAction?.type === 'close') {
                                    onSelectItem(null);
                                } else if (pendingAction?.type === 'tab') {
                                    setTab(pendingAction.data);
                                }
                                setIsDirty(false);
                                setPendingChanges([]);
                                setPendingAction(null);
                            }}
                        />
                        <UnsavedChangesModal
                            isOpen={blocker.state === "blocked"}
                            onClose={() => blocker.state === "blocked" && blocker.reset()}
                            itemName={resourceName.toLowerCase()}
                            changeCount={pendingChanges.length}
                            changes={pendingChanges}
                            onConfirm={() => {
                                blocker.state === "blocked" && blocker.proceed();
                                setIsDirty(false);
                                setPendingChanges([]);
                            }}
                        />
                    </>
                )}
            </div>
        );
    };

    return selectedItem ? renderSplitView() : renderFullTable();
}
