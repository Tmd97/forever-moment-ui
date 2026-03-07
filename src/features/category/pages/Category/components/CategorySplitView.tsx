import { useCallback } from 'react';
import { CategoryDetails } from './CategoryDetails';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { TABS, ITEM_ID_PREFIX } from '@/config/constants';



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

    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
            className: 'w-[25%] min-w-[150px] py-1.5 px-4 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
            render: (cat: any) => {
                return (
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "h-7 px-2 min-w-[32px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0",
                            "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                        )}>
                            <span className="text-[12px] leading-none">📝</span>
                            {`${ITEM_ID_PREFIX}-${cat.id}`}
                        </div>
                        <span>{cat.name}</span>
                    </div>
                );
            }
        },
        {
            header: 'Description',
            accessorKey: 'description',
            className: 'w-[30%] min-w-[200px] py-1.5 px-4 text-left text-slate-600 dark:text-slate-300',
            render: (cat: any) => (
                <div className="truncate max-w-[300px]" title={cat.description}>
                    {cat.description || '-'}
                </div>
            )
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'w-[15%] min-w-[120px] py-1.5 px-4 text-left',
            render: (cat: any) => (
                <EditableStatusBadge
                    status={cat.isActive ? 'true' : 'false'}
                    options={[
                        { label: 'Active', value: 'true' },
                        { label: 'Inactive', value: 'false' }
                    ]}
                    onChange={async (val) => {
                        const newStatus = val === 'true';
                        if (newStatus === cat.isActive) return;
                        try {
                            await updateCategory(cat.id, {
                                name: cat.name,
                                description: cat.description || "",
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
            className: 'w-[20%] min-w-[100px] py-1.5 px-4 text-right',
            render: (cat: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(cat)}
                        onDelete={() => handleDeleteClick(cat.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((cat: any, isSelected: boolean) => {
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
                <div className={cn(
                    "h-7 px-2 min-w-[40px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0 ml-1",
                    "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                )}>
                    <span className="text-[12px] leading-none">📝</span>
                    {`${ITEM_ID_PREFIX}-${cat.id}`}
                </div>
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                        isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )}>{cat.name}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 truncate font-medium">Events: {cat.count || 0}</div>
                </div>
                <div className={cn(
                    "w-2 h-2 rounded-full shrink-0 shadow-sm",
                    cat.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                )} />
            </div>
        );
    }, []);

    const renderDetailsPanel = useCallback((cat: any, activeTab: string, dirtyState: any) => {
        if (activeTab === TABS.GENERAL.id) {
            return (
                <CategoryDetails
                    category={cat}
                    updateCategory={updateCategory}
                    onDirtyChange={dirtyState.handleDirtyChange}
                />
            );
        }
        return null;
    }, [updateCategory]);

    const customFilter = useCallback((cat: any, activeFilters: Record<string, string[]>) => {
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = cat.isActive ? 'true' : 'false';
            return activeFilters.status.includes(isActiveString);
        }
        return true;
    }, []);

    return (
        <CrudSplitViewLayout
            data={categories || []}
            loading={loading}
            resourceName="Category"
            resourceNamePlural="Categories"
            selectedItem={selectedCategory}
            onSelectItem={setSelectedCategory}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            onDragReorder={handleDragReorder}
            renderListItem={renderListItem}
            tabs={[{ id: TABS.GENERAL.id, label: TABS.GENERAL.labelShort }]}
            renderDetailsPanel={renderDetailsPanel}
            searchFields={['name']}
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
            onAdd={() => handleOpenModal()}
        />
    );
};
