import { useCallback } from 'react';
import { VendorDetails } from './VendorDetails';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { Store } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { TABS, ITEM_ID_PREFIX } from '@/config/constants';
import type { Vendor } from './Vendor';

export const VendorSplitView = ({
    vendors,
    handleOpenModal,
    handleDeleteClick,
    selectedVendor,
    setSelectedVendor,
    loading,
    updateVendor
}: any) => {

    const columns = [
        {
            header: 'Business Name',
            accessorKey: 'name',
            className: 'w-[25%] min-w-[200px] py-1.5 px-4 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
            render: (v: any) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-7 px-2 min-w-[32px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0",
                        "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                    )}>
                        <span className="text-[12px] leading-none">📝</span>
                        {`${ITEM_ID_PREFIX}-${v.id}`}
                    </div>
                    <span>{v.name}</span>
                </div>
            )
        },
        {
            header: 'Category',
            accessorKey: 'category',
            className: 'w-[20%] min-w-[150px] py-1.5 px-4 text-left text-slate-600 dark:text-slate-300',
        },
        {
            header: 'Contact',
            accessorKey: 'contactPerson',
            className: 'w-[25%] min-w-[200px] py-1.5 px-4 text-left text-slate-600 dark:text-slate-300',
            render: (v: any) => (
                <div className="flex flex-col">
                    <span>{v.contactPerson}</span>
                    <span className="text-xs text-slate-400">{v.email}</span>
                </div>
            )
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'w-[15%] min-w-[100px] py-1.5 px-4 text-left',
            render: (v: any) => (
                <EditableStatusBadge
                    status={v.status}
                    options={['Active', 'Inactive', 'Pending']}
                    onChange={async (val) => {
                        if (val === v.status) return;
                        try {
                            await updateVendor(v.id, { status: val });
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
            className: 'w-[15%] min-w-[100px] py-1.5 px-4 text-right',
            render: (v: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(v)}
                        onDelete={() => handleDeleteClick(v.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((v: any, isSelected: boolean) => (
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
                {`${ITEM_ID_PREFIX}-${v.id}`}
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                    isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                )}>{v.name}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{v.category}</div>
            </div>
            <div className={cn(
                "w-2 h-2 rounded-full shrink-0 shadow-sm",
                v.status === 'Active' ? "bg-emerald-500" : (v.status === 'Pending' ? "bg-amber-400" : "bg-slate-300 dark:bg-slate-600")
            )} />
        </div>
    ), []);

    const renderDetailsPanel = useCallback((v: any, activeTab: string, dirtyState: any) => {
        if (activeTab === TABS.GENERAL.id) {
            return (
                <VendorDetails
                    vendor={v}
                    onEdit={() => handleOpenModal(v)}
                    onClose={() => setSelectedVendor(null)}
                    updateVendor={updateVendor}
                    onDirtyChange={dirtyState.handleDirtyChange}
                />
            );
        }
        return null;
    }, [handleOpenModal, setSelectedVendor, updateVendor]);

    const customFilter = useCallback((v: Vendor, activeFilters: Record<string, string[]>) => {
        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            matchStatus = v.status ? activeFilters.status.includes(v.status) : false;
        }

        let matchCategory = true;
        if (activeFilters.category && activeFilters.category.length > 0) {
            matchCategory = v.category ? activeFilters.category.includes(v.category) : false;
        }

        return matchStatus && matchCategory;
    }, []);

    const customSearch = useCallback((v: Vendor, search: string) => {
        const lowerSearch = search.toLowerCase();
        return (v.name && v.name.toLowerCase().includes(lowerSearch)) ||
            (v.contactPerson && v.contactPerson.toLowerCase().includes(lowerSearch)) ||
            (v.email && v.email.toLowerCase().includes(lowerSearch));
    }, []);

    const renderCustomDetailsHeader = useCallback((vendor: any) => (
        <div className="flex items-center gap-5">
            <div className={cn(
                "h-12 px-3 w-auto rounded-xl flex items-center gap-2 font-bold text-[14px]",
                "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
            )}>
                <span className="text-[16px] leading-none">📝</span>
                {`${ITEM_ID_PREFIX}-${vendor.id}`}
            </div>
            <div>
                <div className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-2">
                    {vendor.name}
                </div>
                <div className="text-[13px] text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    {vendor.category} <span className="opacity-50 mx-1">•</span> ID #{vendor.id}
                </div>
            </div>
        </div>
    ), []);

    return (
        <CrudSplitViewLayout
            data={vendors || []}
            loading={loading}
            resourceName="Vendor"
            resourceNamePlural="Vendors"
            selectedItem={selectedVendor}
            onSelectItem={setSelectedVendor}
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
                        { id: '1', label: 'Active', value: 'Active' },
                        { id: '2', label: 'Inactive', value: 'Inactive' },
                        { id: '3', label: 'Pending', value: 'Pending' },
                    ]
                },
                {
                    id: 'category',
                    name: 'Category',
                    options: [
                        { id: '1', label: 'Photography', value: 'Photography' },
                        { id: '2', label: 'Catering', value: 'Catering' },
                        { id: '3', label: 'Decoration', value: 'Decoration' },
                        { id: '4', label: 'Entertainment', value: 'Entertainment' },
                    ]
                }
            ]}
            customFilter={customFilter as any}
            customSearch={customSearch as any}
            onAdd={() => handleOpenModal()}
            renderCustomDetailsHeader={renderCustomDetailsHeader}
            detailsPanelClassName="bg-slate-50/50 dark:bg-gray-900/50" // Need this to match original VendorSplitView
        />
    );
};
