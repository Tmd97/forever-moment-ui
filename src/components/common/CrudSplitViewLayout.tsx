import React, { useState, useMemo, useCallback, useEffect } from 'react';

import { DataTable } from '@/components/common/DataTable';
import { SearchBar } from '@/components/common/SearchBar';
import { Plus, X, ChevronLeft } from 'lucide-react';
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
    renderStatsRow?: () => React.ReactNode;
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
    detailsPanelClassName,
    renderStatsRow
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
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-7 py-5 flex flex-col gap-4">
                    {/* Stats Row */}
                    {renderStatsRow && renderStatsRow()}

                    {/* Toolbar: Search + Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                        <div className="flex-1 relative w-full">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                            </svg>
                            <SearchBar
                                className="w-full"
                                inputClassName="pl-9 py-2.5 rounded-[10px] bg-white dark:bg-gray-900 border border-[#e8e6e0] dark:border-gray-700 text-[13.5px] focus:border-[#6c63ff] focus:ring-[3px] focus:ring-[rgba(108,99,255,0.12)] placeholder-[#b0b4be] shadow-sm"
                                placeholder={`Search ${pluralName.toLowerCase()} by name, category…`}
                                value={search}
                                onChange={setSearch}
                            />
                        </div>
                        {/* Filters button */}
                        {filterConfig.length > 0 && (
                            <button
                                className="flex items-center gap-1.5 text-[13.5px] font-medium px-4 py-[9px] rounded-[10px] whitespace-nowrap transition-all"
                                style={{ border: '1px solid #e8e6e0', background: '#fff', color: '#374151', cursor: 'pointer' }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6c63ff'; e.currentTarget.style.color = '#6c63ff'; e.currentTarget.style.background = '#ede9ff'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8e6e0'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#fff'; }}
                            >
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2" /></svg>
                                Filters
                            </button>
                        )}
                        {/* Sort button */}
                        <button
                            className="shrink-0 flex items-center gap-1.5 text-[13.5px] font-medium px-4 py-[9px] rounded-[10px] whitespace-nowrap transition-all"
                            style={{ border: '1px solid #e8e6e0', background: '#fff', color: '#374151', cursor: 'pointer' }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6c63ff'; e.currentTarget.style.color = '#6c63ff'; e.currentTarget.style.background = '#ede9ff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8e6e0'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#fff'; }}
                        >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                            Sort
                        </button>

                        {/* Action Button */}
                        {onAdd && (
                            <button
                                onClick={() => onAdd()}
                                className="shrink-0 flex items-center gap-2 text-white text-[13.5px] font-semibold px-[18px] py-[9px] rounded-[10px] transition-all h-[40px]"
                                style={{
                                    background: '#6c63ff',
                                    boxShadow: '0 2px 6px rgba(108,99,255,0.25)',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#5a52e8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#6c63ff'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <Plus size={15} strokeWidth={2.5} />
                                Add {resourceName}
                            </button>
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

                        {/* Table Footer with Pagination */}
                        {!loading && data && data.length > 0 && (
                            <div
                                className="flex flex-col sm:flex-row items-center justify-between px-[18px] py-[12px] text-[12.5px] gap-3"
                                style={{ borderTop: '1px solid #e8e6e0', background: '#fafaf8', color: '#6b7280' }}
                            >
                                <span>
                                    Showing <strong style={{ color: '#0f1117', fontWeight: 600 }}>{filtered.length}</strong> of <strong style={{ color: '#0f1117', fontWeight: 600 }}>{data.length}</strong> {pluralName.toLowerCase()}
                                </span>
                                <div className="flex items-center gap-1">
                                    {/* Prev */}
                                    <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e8e6e0', background: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>‹</button>
                                    {/* Page 1 */}
                                    <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #6c63ff', background: '#6c63ff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>1</button>
                                    {/* Next */}
                                    <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e8e6e0', background: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>›</button>
                                </div>
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

        // Show list on desktop OR on mobile when no item is selected
        const showList = !selectedItem || typeof window !== 'undefined' && window.innerWidth >= 768;
        // Show details on desktop (if selected) OR on mobile when an item IS selected
        const showDetails = !!selectedItem;

        return (
            <div className="flex flex-1 h-full overflow-hidden" style={{ background: '#ffffff' }}>

                {/* ── Left Panel (List) ── */}
                <div
                    className={cn(
                        "flex flex-col overflow-hidden transition-all duration-300",
                        showList ? "flex" : "hidden md:flex",
                        "w-full md:w-[280px] md:min-w-[280px]"
                    )}
                    style={{
                        background: '#fff',
                        borderRight: '1px solid #e8e6e0',
                        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid #f0ede8' }}>
                        <div>
                            <div className="font-bold text-[15px] text-slate-900 tracking-tight">{pluralName}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                    style={{ background: '#ede9ff', color: '#6c63ff' }}
                                >
                                    {displayCount}
                                </span>
                                <span className="text-[10.5px] uppercase tracking-wider font-medium text-slate-400">
                                    {displayCount === 1 ? resourceName : pluralName}
                                </span>
                            </div>
                        </div>
                        {onAdd && (
                            <button
                                onClick={() => onAdd()}
                                className="flex items-center gap-1.5 text-white text-[11.5px] font-semibold px-3 py-1.5 rounded-[8px] transition-all"
                                style={{ background: '#6c63ff', boxShadow: '0 2px 6px rgba(108,99,255,0.28)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#5a52e8'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#6c63ff'; }}
                            >
                                <Plus size={12} strokeWidth={2.5} />
                                <span>Add</span>
                            </button>
                        )}
                    </div>

                    {/* Search */}
                    <div className="px-3 py-3" style={{ borderBottom: '1px solid #ffffff' }}>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                            </svg>
                            <SearchBar
                                className="w-full"
                                inputClassName="pl-8 py-2 text-[13px] rounded-[8px] bg-[#ffffff] border-[#e8e6e0] focus:border-[#6c63ff] focus:ring-[2px] focus:ring-[rgba(108,99,255,0.12)] placeholder-[#b0b4be]"
                                placeholder={`Search ${pluralName.toLowerCase()}...`}
                                value={search}
                                onChange={setSearch}
                            />
                        </div>
                        {filterConfig.length > 0 && (
                            <div className="mt-2">
                                <Filter categories={filterConfig} onFilterChange={setActiveFilters} />
                            </div>
                        )}
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto py-2 px-2 scrollbar-thin">
                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-10 px-5 text-slate-400">
                                <div className="text-3xl mb-2 opacity-40">{emptyStateIcon}</div>
                                <div className="text-sm font-medium">No {pluralName.toLowerCase()} found</div>
                            </div>
                        )}
                        {filtered.map((item: T) => {
                            const isSelected = selectedItem ? keyExtractor(selectedItem) === keyExtractor(item) : false;
                            return (
                                <div key={keyExtractor(item)} onClick={() => handleItemClick(item)}>
                                    {renderListItem(item, isSelected)}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Detail Panel ── */}
                {showDetails && (
                    <div className={cn(
                        "flex-1 flex flex-col p-0 md:p-4 h-full overflow-hidden",
                        !showList && "w-full" // Take full width on mobile when list is hidden
                    )}>
                        <div
                            className={cn("flex-1 flex flex-col md:flex-row overflow-hidden relative", detailsPanelClassName)}
                            style={{
                                background: '#fff',
                                border: typeof window !== 'undefined' && window.innerWidth >= 768 ? '1px solid #e8e6e0' : 'none',
                                borderRadius: typeof window !== 'undefined' && window.innerWidth >= 768 ? 16 : 0,
                                boxShadow: typeof window !== 'undefined' && window.innerWidth >= 768 ? '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' : 'none',
                            }}
                        >
                            {/* Mobile Back Button & Header Area */}
                            <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                                <button
                                    onClick={handleCloseProcess}
                                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900"
                                >
                                    <ChevronLeft size={16} />
                                    <span className="text-sm font-medium">Back to {pluralName}</span>
                                </button>
                            </div>

                            {/* Vertical Tab Nav (Desktop) / Horizontal (Mobile) */}
                            {tabs.length > 0 && (
                                <Tabs
                                    tabs={tabs}
                                    activeTab={tab}
                                    onTabChange={handleTabChange}
                                />
                            )}

                            {/* Detail content */}
                            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                                {/* Close button (Desktop Only) */}
                                <button
                                    onClick={handleCloseProcess}
                                    className="hidden md:flex absolute top-2 right-2 z-[60] p-1.5 rounded-lg transition-all items-center justify-center"
                                    style={{ color: '#94a3b8' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f4f0'; e.currentTarget.style.color = '#475569'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                                    title="Close"
                                >
                                    <X size={14} />
                                </button>
                                {renderCustomDetailsHeader && selectedItem && renderCustomDetailsHeader(selectedItem)}
                                {/* Tab Content */}
                                <div className="flex-1 min-h-0 overflow-y-auto p-8 pt-4 relative">
                                    <div className="max-w-4xl flex flex-col w-full">
                                        {selectedItem && renderDetailsPanel(selectedItem, tab, { isDirty, handleDirtyChange })}
                                    </div>
                                </div>
                                <div id="crud-tab-footer-portal" className="shrink-0 w-full z-[70] pb-safe" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Unsaved Changes Modals */}
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
