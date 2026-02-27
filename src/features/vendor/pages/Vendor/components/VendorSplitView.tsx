import { useState, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import { VendorDetails } from './VendorDetails';
import { DataTable } from '@/components/common/DataTable';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { SearchBar } from '@/components/common/SearchBar';
import { Plus, X, Edit2, Trash2, Store } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Filter } from '@/components/common/Filter';
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
    const [tab, setTab] = useState("general");
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const filtered = useMemo(() => (vendors || []).filter((v: Vendor) => {
        const matchSearch = v.name && v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.contactPerson && v.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
            v.email && v.email.toLowerCase().includes(search.toLowerCase());

        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            matchStatus = v.status ? activeFilters.status.includes(v.status) : false;
        }

        let matchCategory = true;
        if (activeFilters.category && activeFilters.category.length > 0) {
            matchCategory = v.category ? activeFilters.category.includes(v.category) : false;
        }

        return matchSearch && matchStatus && matchCategory;
    }), [vendors, search, activeFilters]);


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
                        onFilterChange={setActiveFilters}
                    />

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <SearchBar
                            className="w-full sm:w-72"
                            inputClassName="py-2.5 pl-10 pr-4"
                            placeholder="Search vendors..."
                            value={search}
                            onChange={setSearch}
                        />
                        <Button onClick={() => handleOpenModal()} className="h-10 px-4 text-sm gap-2 shadow-sm shrink-0">
                            <Plus size={16} /> Add Vendor
                        </Button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <DataTable
                        data={filtered}
                        columns={[
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
                        ]}
                        keyExtractor={(item: any) => item.id}
                        onRowClick={(v: any) => { setSelectedVendor(v); setTab("general"); }}
                        loading={loading && (!vendors || vendors.length === 0)}
                    />
                </div>
            </div>
        );
    };

    const renderSplitView = () => {
        const colorInfo = getColorForVendor(selectedVendor.id);

        return (
            <div className="flex flex-1 h-full overflow-hidden">
                {/* Left Panel */}
                <div className="w-[320px] min-w-[320px] bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between p-5 pb-3">
                        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Vendors</span>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 mx-4 mb-3">
                        <SearchBar
                            className="flex-1"
                            inputClassName="bg-slate-50"
                            placeholder="Search vendors..."
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
                                        { id: '1', label: 'Active', value: 'Active' },
                                        { id: '2', label: 'Inactive', value: 'Inactive' },
                                        { id: '3', label: 'Pending', value: 'Pending' },
                                    ]
                                }
                            ]}
                            onFilterChange={setActiveFilters}
                        />
                    </div>

                    {/* Count Row */}
                    <div className="px-5 pb-2 border-b border-slate-100 dark:border-gray-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                            {filtered.length} vendor{filtered.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-10 px-5 text-slate-400">
                                <div className="text-4xl mb-2 opacity-50">🏪</div>
                                <div className="text-sm font-medium">No vendors found</div>
                            </div>
                        )}
                        {filtered.map((v: any) => {
                            const isSelected = selectedVendor?.id === v.id;
                            const itemColor = getColorForVendor(v.id);

                            return (
                                <div
                                    key={v.id}
                                    onClick={() => { setSelectedVendor(v); setTab("general"); }}
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
                        })}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900">
                    {/* Detail Header */}
                    <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "w-[60px] h-[60px] rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm",
                                colorInfo.bg,
                                colorInfo.text
                            )}>
                                {vendorInitials(selectedVendor.name)}
                            </div>
                            <div>
                                <div className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-2">
                                    {selectedVendor.name}
                                </div>
                                <div className="text-[13px] text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                                    <Store className="w-3.5 h-3.5 text-slate-400" />
                                    {selectedVendor.category} <span className="opacity-50 mx-1">•</span> ID #{selectedVendor.id}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <button onClick={() => handleOpenModal(selectedVendor)} className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border-none rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors">
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button onClick={() => handleDeleteClick(selectedVendor.id)} className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border-none rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                            <div className="w-px h-6 bg-slate-200 dark:bg-gray-700 mx-1"></div>
                            <button onClick={() => setSelectedVendor(null)} className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex px-8 gap-6 border-b border-slate-100 dark:border-gray-800">
                        {[
                            { id: "general", label: "General Info" }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={cn(
                                    "bg-transparent border-none border-b-2 py-4 text-[13.5px] cursor-pointer transition-all tracking-wide -mb-[1px]",
                                    tab === t.id
                                        ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                                        : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-gray-900/50">
                        {tab === "general" && (
                            <div className="max-w-3xl">
                                <VendorDetails
                                    vendor={selectedVendor}
                                    onEdit={() => handleOpenModal(selectedVendor)}
                                    onClose={() => setSelectedVendor(null)}
                                    updateVendor={updateVendor}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return selectedVendor ? renderSplitView() : renderFullTable();
};
