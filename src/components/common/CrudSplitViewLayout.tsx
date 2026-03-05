import React, { useState, useMemo, useCallback, useEffect } from 'react';

import { DataTable } from '@/components/common/DataTable';
import { SearchBar } from '@/components/common/SearchBar';
import { Plus, X } from 'lucide-react';
import { Filter } from '@/components/common/Filter';
import type { FilterCategory } from '@/components/common/Filter';
import { Tabs } from '@/components/common/Tabs';
import { UnsavedChangesModal } from '@/components/common/UnsavedChangesModal';
import { useBlocker } from 'react-router-dom';
import { cn } from '@/utils/cn';

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
    detailsPanelClassName?: string;
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
    renderCustomDetailsHeader,
    detailsPanelClassName
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
        const pluralName = resourceNamePlural || resourceName + 's';
        return (
            <div className="flex flex-col flex-1 h-full overflow-hidden bg-[#f5f4f0] dark:bg-gray-950">
                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-5">
                    {/* Page Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-[26px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {pluralName}
                            </h1>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
                                Manage and organize all {pluralName.toLowerCase()}
                            </p>
                        </div>
                        {onAdd && (
                            <button
                                onClick={() => onAdd()}
                                className="flex items-center gap-2 text-white text-[13.5px] font-semibold px-[18px] py-[10px] rounded-[10px] transition-all"
                                style={{
                                    background: '#6c63ff',
                                    boxShadow: '0 2px 8px rgba(108,99,255,0.30)',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#5a52e8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#6c63ff'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <Plus size={15} strokeWidth={2.5} />
                                Add {resourceName}
                            </button>
                        )}
                    </div>

                    {/* Toolbar: Search + Filter */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                            </svg>
                            <SearchBar
                                className="w-full"
                                inputClassName="pl-9 py-2.5 rounded-[10px] bg-white dark:bg-gray-900 border border-[#e8e6e0] dark:border-gray-700 text-[13.5px] focus:border-[#6c63ff] focus:ring-[3px] focus:ring-[rgba(108,99,255,0.12)] placeholder-[#b0b4be] shadow-sm"
                                placeholder={`Search ${pluralName.toLowerCase()} by name…`}
                                value={search}
                                onChange={setSearch}
                            />
                        </div>
                        {filterConfig.length > 0 && (
                            <Filter categories={filterConfig} onFilterChange={setActiveFilters} />
                        )}
                    </div>

                    {/* Table Card */}
                    <div
                        className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex flex-col"
                        style={{ border: '1px solid #e8e6e0', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}
                    >
                        <DataTable
                            data={filtered}
                            columns={columns}
                            keyExtractor={keyExtractor}
                            onRowClick={handleItemClick}
                            loading={loading && (!data || data.length === 0)}
                            onReorder={(search === "" && Object.keys(activeFilters).length === 0) ? onDragReorder : undefined}
                            draggable={(search === "" && Object.keys(activeFilters).length === 0) && !!onDragReorder}
                        />

                        {/* Table Footer */}
                        {!loading && data && data.length > 0 && (
                            <div
                                className="flex items-center justify-between px-[18px] py-[13px] text-[12.5px] text-slate-500"
                                style={{ borderTop: '1px solid #e8e6e0', background: '#fafaf8' }}
                            >
                                <span>
                                    Showing <strong className="text-slate-700 dark:text-slate-200 font-semibold">{filtered.length}</strong> of <strong className="text-slate-700 dark:text-slate-200 font-semibold">{data.length}</strong> {pluralName.toLowerCase()}
                                </span>
                            </div>
                        )}
                    </div>
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
                <div className="w-[300px] min-w-[300px] bg-white dark:bg-gray-900 border-r border-slate-100 dark:border-gray-800 flex flex-col overflow-hidden shadow-sm">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-gray-800">
                        <div>
                            <span className="font-bold text-[15px] text-slate-900 dark:text-white tracking-tight">{pluralName}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="inline-flex items-center justify-center text-[10px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-full">
                                    {displayCount}
                                </span>
                                <span className="text-[10.5px] text-slate-400 uppercase tracking-wider font-medium">{displayCount === 1 ? resourceName : pluralName}</span>
                            </div>
                        </div>
                        {onAdd && (
                            <button
                                onClick={() => onAdd()}
                                className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all shadow-sm hover:shadow-md"
                            >
                                <Plus size={13} />
                                <span>Add</span>
                            </button>
                        )}
                    </div>

                    {/* Search + Filter */}
                    <div className="flex flex-col gap-2 px-3 py-3 border-b border-slate-50 dark:border-gray-800">
                        <SearchBar
                            className="w-full"
                            inputClassName="bg-slate-50 dark:bg-gray-800 text-[13px] rounded-xl"
                            placeholder={`Search ${pluralName.toLowerCase()}...`}
                            value={search}
                            onChange={setSearch}
                        />
                        {filterConfig.length > 0 && (
                            <Filter
                                categories={filterConfig}
                                onFilterChange={setActiveFilters}
                            />
                        )}
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
                    <div className={cn("flex-1 flex bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm relative", detailsPanelClassName)}>
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
                            <div className="flex-1 min-h-0 overflow-y-auto p-8 pt-4 relative">
                                <div className="max-w-4xl flex flex-col w-full">
                                    {selectedItem && renderDetailsPanel(selectedItem, tab, { isDirty, handleDirtyChange })}
                                </div>
                            </div>
                            <div id="crud-tab-footer-portal" className="shrink-0 w-full z-[70]" />
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
