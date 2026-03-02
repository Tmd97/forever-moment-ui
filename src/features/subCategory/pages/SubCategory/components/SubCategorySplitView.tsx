import { useCallback, useMemo } from 'react';
import { SubCategoryDetails } from './SubCategoryDetails';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { TABS } from '@/config/constants';

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

    const columns = [
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
                            await updateSubCategory(sc.id, {
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
    ];

    const renderListItem = useCallback((sc: any, isSelected: boolean) => {
        const itemColor = getColorForSubCategory(sc.id);
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
    }, []);

    const renderDetailsPanel = useCallback((sc: any, activeTab: string, dirtyState: any) => {
        if (activeTab === TABS.GENERAL.id) {
            return (
                <SubCategoryDetails
                    subCategory={sc}
                    categories={categories}
                    updateSubCategory={updateSubCategory}
                    onDirtyChange={dirtyState.handleDirtyChange}
                />
            );
        }
        return null;
    }, [categories, updateSubCategory]);

    const customFilter = useCallback((sc: any, activeFilters: Record<string, string[]>) => {
        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = sc.isActive ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }

        let matchCategory = true;
        if (activeFilters.categoryId && activeFilters.categoryId.length > 0) {
            matchCategory = sc.categoryId && activeFilters.categoryId.includes(String(sc.categoryId));
        }

        return matchStatus && matchCategory;
    }, []);

    const customSearch = useCallback((sc: any, search: string) => {
        return sc.name && sc.name.toLowerCase().includes(search.toLowerCase());
    }, []);

    const categoryOptions = useMemo(() => {
        return categories?.map((cat: any) => ({
            id: String(cat.id),
            label: cat.name,
            value: String(cat.id)
        })) || [];
    }, [categories]);

    return (
        <CrudSplitViewLayout
            data={subCategories || []}
            loading={loading}
            resourceName="Sub Category"
            resourceNamePlural="Sub Categories"
            selectedItem={selectedSubCategory}
            onSelectItem={setSelectedSubCategory}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: TABS.GENERAL.id, label: TABS.GENERAL.labelShort }]}
            renderDetailsPanel={renderDetailsPanel}
            filterConfig={[
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
            ]}
            customFilter={customFilter}
            customSearch={customSearch}
            onAdd={() => handleOpenModal()}
        />
    );
};
