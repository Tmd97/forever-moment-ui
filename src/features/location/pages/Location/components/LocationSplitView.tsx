import { useCallback } from 'react';
import { LocationDetails } from './LocationDetails';
import { Pincode } from './Pincode';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { ITEM_ID_PREFIX } from '@/config/constants';

export const LocationSplitView = ({
    locations,
    handleOpenModal,
    handleDeleteClick,
    selectedLocation,
    setSelectedLocation,
    loading,
    updateLocation,
    handleDragReorder
}: any) => {

    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
            className: 'w-[25%] min-w-[150px] py-1.5 px-4 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
            render: (loc: any) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-7 px-2 min-w-[32px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0",
                        "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                    )}>
                        <span className="text-[12px] leading-none">📝</span>
                        {`${ITEM_ID_PREFIX}-${loc.id}`}
                    </div>
                    <span>{loc.name}</span>
                </div>
            )
        },
        {
            header: 'City',
            accessorKey: 'city',
            className: 'w-[20%] min-w-[120px] py-1.5 px-4 text-left text-slate-600 dark:text-slate-300',
            render: (loc: any) => <span>{loc.city || '-'}</span>
        },
        {
            header: 'State',
            accessorKey: 'state',
            className: 'w-[20%] min-w-[120px] py-1.5 px-4 text-left text-slate-600 dark:text-slate-300',
            render: (loc: any) => <span>{loc.state || '-'}</span>
        },
        {
            header: 'Country',
            accessorKey: 'country',
            className: 'w-[15%] min-w-[100px] py-1.5 px-4 text-left text-slate-600 dark:text-slate-300',
            render: (loc: any) => <span>{loc.country || '-'}</span>
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'w-[10%] min-w-[100px] py-1.5 px-4 text-left',
            render: (loc: any) => (
                <EditableStatusBadge
                    status={loc.isActive ? 'Active' : 'Inactive'}
                    options={['Active', 'Inactive']}
                    onChange={async (val) => {
                        const newStatus = val === 'Active';
                        if (newStatus === loc.isActive) return;
                        try {
                            await updateLocation(loc.id, {
                                name: loc.name,
                                city: loc.city || "",
                                state: loc.state || "",
                                country: loc.country || "",
                                address: loc.address || "",
                                latitude: loc.latitude || 0,
                                longitude: loc.longitude || 0,
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
            className: 'w-[10%] min-w-[80px] py-1.5 px-4 text-right',
            render: (loc: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(loc)}
                        onDelete={() => handleDeleteClick(loc.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((loc: any, isSelected: boolean) => (
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
                {`${ITEM_ID_PREFIX}-${loc.id}`}
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
    ), []);

    const renderDetailsPanel = useCallback((loc: any, activeTab: string, dirtyState: any) => {
        if (activeTab === "general") {
            return (
                <LocationDetails
                    location={loc}
                    updateLocation={updateLocation}
                    onDirtyChange={dirtyState.handleDirtyChange}
                />
            );
        }
        if (activeTab === "pincodes") {
            return (
                <div className="h-full">
                    <Pincode locationId={loc.id} />
                </div>
            );
        }
        return null;
    }, [updateLocation]);

    const customFilter = useCallback((loc: any, activeFilters: Record<string, string[]>) => {
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = loc.isActive ? 'true' : 'false';
            return activeFilters.status.includes(isActiveString);
        }
        return true;
    }, []);

    const customSearch = useCallback((loc: any, search: string) => {
        const query = search.toLowerCase();
        return loc.name.toLowerCase().includes(query) || (loc.city && loc.city.toLowerCase().includes(query));
    }, []);

    return (
        <CrudSplitViewLayout
            data={locations || []}
            loading={loading}
            resourceName="Location"
            resourceNamePlural="Locations"
            selectedItem={selectedLocation}
            onSelectItem={setSelectedLocation}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            onDragReorder={handleDragReorder}
            renderListItem={renderListItem}
            tabs={[
                { id: "general", label: "General Info" },
                { id: "pincodes", label: "Pincodes & Service Areas" }
            ]}
            renderDetailsPanel={renderDetailsPanel}
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
            customSearch={customSearch}
            onAdd={() => handleOpenModal()}
        />
    );
};
