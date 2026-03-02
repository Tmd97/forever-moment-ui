import { useCallback } from 'react';
import { SlotDetails } from './SlotDetails';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { Clock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';

const slotColors = [
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
];

const getColorForSlot = (id: number) => slotColors[(id || 0) % slotColors.length];

export const SlotSplitView = ({
    slots,
    handleOpenModal,
    handleDeleteClick,
    selectedSlot,
    setSelectedSlot,
    loading,
    updateSlot
}: any) => {

    const columns = [
        {
            header: 'Label',
            accessorKey: 'label',
            className: 'w-[25%] min-w-[200px] py-4 px-6 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
            render: (s: any) => {
                const colorInfo = getColorForSlot(s.id);
                return (
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm",
                            colorInfo.bg,
                            colorInfo.text
                        )}>
                            <Clock className="w-4 h-4" />
                        </div>
                        <span>{s.label}</span>
                    </div>
                );
            }
        },
        {
            header: 'Start Time',
            accessorKey: 'startTime',
            className: 'w-[20%] min-w-[150px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
            render: (s: any) => <span>{s.startTime || '-'}</span>
        },
        {
            header: 'End Time',
            accessorKey: 'endTime',
            className: 'w-[20%] min-w-[150px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
            render: (s: any) => <span>{s.endTime || '-'}</span>
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'w-[15%] min-w-[100px] py-4 px-6 text-left',
            render: (s: any) => (
                <EditableStatusBadge
                    status={s.isActive ? 'Active' : 'Inactive'}
                    options={['Active', 'Inactive']}
                    onChange={async (val) => {
                        const newStatus = val === 'Active';
                        if (newStatus === s.isActive) return;
                        try {
                            await updateSlot(s.id, {
                                label: s.label,
                                startTime: s.startTime,
                                endTime: s.endTime,
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
            className: 'w-[20%] min-w-[100px] py-4 px-6 text-right',
            render: (s: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(s)}
                        onDelete={() => handleDeleteClick(s.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((s: any, isSelected: boolean) => {
        const itemColor = getColorForSlot(s.id);
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
                    <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                        isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )}>{s.label}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{s.startTime || '??'} - {s.endTime || '??'}</div>
                </div>
                <div className={cn(
                    "w-2 h-2 rounded-full shrink-0 shadow-sm",
                    s.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                )} />
            </div>
        );
    }, []);

    const renderDetailsPanel = useCallback((slot: any, activeTab: string, _dirtyState: any) => {
        if (activeTab === "general") {
            return (
                <SlotDetails
                    slot={slot}
                    onEdit={() => handleOpenModal(slot)}
                    updateSlot={updateSlot}
                />
            );
        }
        return null;
    }, [handleOpenModal, updateSlot]);

    const customFilter = useCallback((s: any, activeFilters: Record<string, string[]>) => {
        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = s.isActive ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }
        return matchStatus;
    }, []);

    const customSearch = useCallback((s: any, search: string) => {
        return Boolean(s.label && s.label.toLowerCase().includes(search.toLowerCase()));
    }, []);

    // Wait, let's use the object itself or ID? Above the original code had:
    // `setSelectedSlot(s.id);` in `onRowClick` but wait! The data source passed to `SlotDetails` is `slot={selectedSlot}`. If it's an ID, `SlotDetails` wouldn't work if it expects a slot object! Wait, no, `handleOpenModal(selectedSlot)` - usually `handleOpenModal` takes the whole object!
    // So the original code must have had a bug `setSelectedSlot(s.id)` or `selectedSlot` in `Slot` state finds the object!
    // If we just pass `setSelectedSlot`, it's better to pass the object but wait, let's check `Slot.tsx`.

    // To be safe, I will pass the object to `setSelectedSlot`, because `selectedSlot` is expected to be `null` or the object for `CrudSplitViewLayout`'s `selectedItem`.
    // Wait, wait... "selectedItem" in `CrudSplitViewLayout` expects the same type as `data` element.
    // If the original `Slot.tsx` maintains an ID, passing the object from `CrudSplitViewLayout` might break `Slot.tsx` state or vice versa. Let's just pass the object, but we need to fetch it if it's just an ID.

    return (
        <CrudSplitViewLayout
            data={slots || []}
            loading={loading}
            resourceName="Time Slot"
            selectedItem={typeof selectedSlot === 'string' || typeof selectedSlot === 'number' ? slots?.find((s: any) => s.id === selectedSlot) : selectedSlot}
            onSelectItem={setSelectedSlot}
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
                }
            ]}
            customFilter={customFilter as any}
            customSearch={customSearch as any}
            onAdd={() => handleOpenModal()}
        />
    );
};
