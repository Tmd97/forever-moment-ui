import { useCallback } from 'react';
import { InclusionDetails } from './InclusionDetails';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import type { InclusionType } from './Inclusion';

const inclusionColors = [
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
];

const getColorForInclusion = (id: number) => inclusionColors[(id || 0) % inclusionColors.length];

export const InclusionSplitView = ({
    inclusions,
    handleOpenModal,
    handleDeleteClick,
    selectedInclusion,
    setSelectedInclusion,
    loading,
    updateInclusion
}: any) => {

    const columns = [
        {
            header: 'Description',
            accessorKey: 'description',
            className: 'w-[40%] min-w-[200px] py-4 px-6 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
            render: (inc: any) => {
                const colorInfo = getColorForInclusion(inc.id);
                return (
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm",
                            colorInfo.bg,
                            colorInfo.text
                        )}>
                            <CheckCircle className="w-4 h-4" />
                        </div>
                        <div className="truncate max-w-[400px]" title={inc.description}>
                            {inc.description || '-'}
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Is Included?',
            className: 'w-[20%] min-w-[120px] py-4 px-6 text-left',
            render: (inc: any) => (
                <span className={
                    inc.isIncluded ? 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }>
                    {inc.isIncluded ? 'Yes' : 'No'}
                </span>
            )
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'w-[15%] min-w-[120px] py-4 px-6 text-left',
            render: (inc: any) => (
                <EditableStatusBadge
                    status={inc.isActive ? 'Active' : 'Inactive'}
                    options={['Active', 'Inactive']}
                    onChange={async (val) => {
                        const newStatus = val === 'Active';
                        if (newStatus === inc.isActive) return;
                        try {
                            await updateInclusion(inc.id, {
                                description: inc.description,
                                isIncluded: inc.isIncluded,
                                isActive: newStatus,
                                displayOrder: inc.displayOrder || 0
                            });
                        } catch (e) { console.error(e); }
                    }}
                />
            )
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'w-[25%] min-w-[100px] py-4 px-6 text-right',
            render: (inc: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(inc)}
                        onDelete={() => handleDeleteClick(inc.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((inc: InclusionType, isSelected: boolean) => {
        const itemColor = getColorForInclusion(inc.id);

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
                    <CheckCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                        isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )}>{inc.description || "No description"}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {inc.isIncluded ? 'Included' : 'Not Included'}
                    </div>
                </div>
                <div className={cn(
                    "w-2 h-2 rounded-full shrink-0 shadow-sm",
                    inc.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                )} />
            </div>
        );
    }, []);

    const renderDetailsPanel = useCallback((inclusion: any, activeTab: string, dirtyState: any) => {
        if (activeTab === "general") {
            return (
                <div className="pt-2">
                    <InclusionDetails
                        inclusion={inclusion}
                        updateInclusion={updateInclusion}
                        onDirtyChange={dirtyState.handleDirtyChange}
                    />
                </div>
            );
        }
        return null;
    }, [handleOpenModal, updateInclusion]);

    const customFilter = useCallback((i: InclusionType, activeFilters: Record<string, string[]>) => {
        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = i.isActive ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }

        let matchIncluded = true;
        if (activeFilters.isIncluded && activeFilters.isIncluded.length > 0) {
            const isIncludedString = i.isIncluded ? 'true' : 'false';
            matchIncluded = activeFilters.isIncluded.includes(isIncludedString);
        }

        return matchStatus && matchIncluded;
    }, []);

    const customSearch = useCallback((i: InclusionType, search: string) => {
        return Boolean(i.description && i.description.toLowerCase().includes(search.toLowerCase()));
    }, []);

    return (
        <CrudSplitViewLayout
            data={inclusions || []}
            loading={loading}
            resourceName="Inclusion"
            selectedItem={selectedInclusion}
            onSelectItem={setSelectedInclusion}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: "general", label: "General Info" }]}
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
                    id: 'isIncluded',
                    name: 'Included Types',
                    options: [
                        { id: '3', label: 'Yes', value: 'true' },
                        { id: '4', label: 'No', value: 'false' },
                    ]
                }
            ]}
            customFilter={customFilter as any}
            customSearch={customSearch as any}
            onAdd={() => handleOpenModal()}
        />
    );
};
