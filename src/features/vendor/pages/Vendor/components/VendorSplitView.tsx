import { useCallback } from 'react';
import { VendorDetails } from './VendorDetails';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { Store } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { TABS } from '@/config/constants';
import type { Vendor } from './Vendor';

const vendorInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'VD';

const vendorColors = [
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
];

const getColorForVendor = (id: number) => vendorColors[(id || 0) % vendorColors.length];

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
            className: 'w-[25%] min-w-[200px] py-4 px-6 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
            render: (v: any) => {
                const colorInfo = getColorForVendor(v.id);
                return (
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm",
                            colorInfo.bg,
                            colorInfo.text
                        )}>
                            {vendorInitials(v.name)}
                        </div>
                        <span>{v.name}</span>
                    </div>
                );
            }
        },
        {
            header: 'Category',
            accessorKey: 'category',
            className: 'w-[20%] min-w-[150px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
        },
        {
            header: 'Contact',
            accessorKey: 'contactPerson',
            className: 'w-[25%] min-w-[200px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
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
            className: 'w-[15%] min-w-[100px] py-4 px-6 text-left',
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
            className: 'w-[15%] min-w-[100px] py-4 px-6 text-right',
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

    const renderListItem = useCallback((v: any, isSelected: boolean) => {
        const itemColor = getColorForVendor(v.id);

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
                    {vendorInitials(v.name)}
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
        );
    }, []);

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

    const renderCustomDetailsHeader = useCallback((vendor: any) => {
        const colorInfo = getColorForVendor(vendor.id);
        return (
            <div className="flex items-center gap-5">
                <div className={cn(
                    "w-[60px] h-[60px] rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm",
                    colorInfo.bg,
                    colorInfo.text
                )}>
                    {vendorInitials(vendor.name)}
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
        );
    }, []);

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
