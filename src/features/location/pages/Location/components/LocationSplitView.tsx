import { useState, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import { Tabs } from '@/components/common/Tabs';
import { LocationDetails } from './LocationDetails';
import { Pincode } from './Pincode';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { SearchBar } from '@/components/common/SearchBar';
import { Plus, MapPin } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Filter } from '@/components/common/Filter';

const cityInitials = (name: string) => name ? name.slice(0, 2).toUpperCase() : 'LO';

const cityColors: Record<string, { bg: string; text: string }> = {
    Delhi: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    Bangalore: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    Mumbai: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
    Chennai: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
};

export const LocationSplitView = ({
    locations,
    handleOpenModal,
    handleDeleteClick,
    selectedLocation,
    setSelectedLocation,
    loading
}: any) => {
    const [tab, setTab] = useState("general");
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const filtered = useMemo(() => locations.filter((l: any) => {
        const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
            (l.city && l.city.toLowerCase().includes(search.toLowerCase()));

        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = l.isActive ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }

        return matchSearch && matchStatus;
    }), [locations, search, activeFilters]);

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
                                    { id: '1', label: 'Active', value: 'true' },
                                    { id: '2', label: 'Inactive', value: 'false' },
                                ]
                            }
                        ]}
                        onFilterChange={setActiveFilters}
                    />

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <SearchBar
                            className="w-full sm:w-72"
                            inputClassName="py-2.5 pl-10 pr-4"
                            placeholder="Search locations..."
                            value={search}
                            onChange={setSearch}
                        />
                        <Button onClick={() => handleOpenModal()} className="h-10 px-4 text-sm gap-2 shadow-sm shrink-0">
                            <Plus size={16} /> Add Location
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
                                className: 'w-[25%] min-w-[150px] py-4 px-6 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
                                render: (loc: any) => (
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm",
                                            (cityColors[loc.name] || { bg: "bg-slate-100 dark:bg-gray-800", text: "text-slate-700 dark:text-gray-300" }).bg,
                                            (cityColors[loc.name] || { text: "text-slate-700 dark:text-gray-300", bg: "bg-slate-100" }).text
                                        )}>
                                            {cityInitials(loc.name)}
                                        </div>
                                        <span>{loc.name}</span>
                                    </div>
                                )
                            },
                            {
                                header: 'City',
                                accessorKey: 'city',
                                className: 'w-[20%] min-w-[120px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
                                render: (loc: any) => <span>{loc.city || '-'}</span>
                            },
                            {
                                header: 'State',
                                accessorKey: 'state',
                                className: 'w-[20%] min-w-[120px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
                                render: (loc: any) => <span>{loc.state || '-'}</span>
                            },
                            {
                                header: 'Country',
                                accessorKey: 'country',
                                className: 'w-[15%] min-w-[100px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
                                render: (loc: any) => <span>{loc.country || '-'}</span>
                            },
                            {
                                header: 'Status',
                                className: 'w-[10%] min-w-[100px] py-4 px-6 text-left',
                                render: (loc: any) => <StatusBadge isActive={loc.isActive} />
                            },
                            {
                                header: 'Actions',
                                className: 'w-[10%] min-w-[80px] py-4 px-6 text-right',
                                render: (loc: any) => (
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <RowActions
                                            onEdit={() => handleOpenModal(loc)}
                                            onDelete={() => handleDeleteClick(loc.id)}
                                        />
                                    </div>
                                )
                            }
                        ]}
                        keyExtractor={(item: any) => item.id}
                        onRowClick={(loc: any) => { setSelectedLocation(loc); setTab("general"); }}
                        loading={loading}
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
                        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Locations</span>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 mx-4 mb-3">
                        <SearchBar
                            className="flex-1"
                            inputClassName="bg-slate-50"
                            placeholder="Search locations..."
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
                                        { id: '1', label: 'Active', value: 'true' },
                                        { id: '2', label: 'Inactive', value: 'false' },
                                    ]
                                }
                            ]}
                            onFilterChange={setActiveFilters}
                        />
                    </div>

                    {/* Count Row */}
                    <div className="px-5 pb-2 border-b border-slate-100 dark:border-gray-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                            {filtered.length} location{filtered.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-10 px-5 text-slate-400">
                                <div className="text-4xl mb-2 opacity-50">📍</div>
                                <div className="text-sm font-medium">No locations found</div>
                            </div>
                        )}
                        {filtered.map((loc: any) => {
                            const colorInfo = cityColors[loc.name] || { bg: "bg-slate-100 dark:bg-gray-800", text: "text-slate-700 dark:text-gray-300" };
                            const isSelected = selectedLocation?.id === loc.id;
                            return (
                                <div
                                    key={loc.id}
                                    onClick={() => { setSelectedLocation(loc); setTab("general"); }}
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
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ml-1 shadow-sm", colorInfo.bg, colorInfo.text)}>
                                        {cityInitials(loc.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={cn(
                                            "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                                            isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                        )}>{loc.name}</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{loc.state || 'Unknown State'}, {loc.country || 'Unknown'}</div>
                                    </div>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full shrink-0 shadow-sm",
                                        loc.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                    )} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-gray-900/40 p-3 h-full overflow-hidden">
                    {selectedLocation ? (
                        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl shadow-sm relative overflow-hidden">
                            {/* Tabs */}
                            <div className="flex-1 flex min-h-0">
                                {/* Vertical Tabs Navi */}
                                <Tabs
                                    variant="vertical"
                                    tabs={[
                                        { id: "general", label: "General Info" },
                                        { id: "pincodes", label: "Pincodes & Service Areas" }
                                    ]}
                                    activeTab={tab}
                                    onTabChange={setTab}
                                />

                                {/* Tab Content */}
                                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30 dark:bg-gray-900/10">
                                    <div className="max-w-4xl">
                                        {tab === "general" && (
                                            <LocationDetails location={selectedLocation} />
                                        )}
                                        {tab === "pincodes" && (
                                            <div className="h-full">
                                                <Pincode locationId={selectedLocation.id} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-gray-700 mb-6">
                                <MapPin className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            </div>
                            <div className="text-xl font-bold text-slate-600 dark:text-slate-300 tracking-tight">Select a location</div>
                            <div className="text-[13.5px] mt-2 max-w-xs text-center">Choose a location from the sidebar to view its details and manage serviceable pincodes.</div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return selectedLocation ? renderSplitView() : renderFullTable();
};
