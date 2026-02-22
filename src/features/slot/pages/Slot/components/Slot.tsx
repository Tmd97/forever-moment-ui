import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { SlotForm } from './SlotForm';
import { SlotDetails } from './SlotDetails';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { CrudPageLayout } from '@/components/common/CrudPageLayout';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import * as types from '@/features/slot/store/action-types';

interface SlotProps {
    data: any;
    loading: boolean;
    error: string | null;
    status: string;
    getSlotData: () => void;
    createSlot: (data: any) => Promise<any>;
    deleteSlot: (id: number) => Promise<any>;
    updateSlot: (id: number, data: any) => Promise<any>;
    resetStatus: () => void;
}

export interface SlotType {
    id: number;
    label: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
}

type SlotFormData = {
    label: string;
    startTime: Date | null;
    endTime: Date | null;
    isActive: boolean;
};

const emptyForm: SlotFormData = { label: '', startTime: null, endTime: null, isActive: true };

const Slot = ({
    data,
    loading,
    error,
    status,
    getSlotData,
    createSlot,
    deleteSlot,
    updateSlot,
    resetStatus,
}: SlotProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState<SlotFormData>(emptyForm);

    const [slots, setSlots] = useState<SlotType[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null);

    useEffect(() => {
        getSlotData();
    }, [getSlotData]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setSlots(data);
        }
    }, [data]);

    useEffect(() => {
        if (status === types.CREATE_SLOT_SUCCESS) {
            toast.success('Time Slot created successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.UPDATE_SLOT_SUCCESS) {
            toast.success('Time Slot updated successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.DELETE_SLOT_SUCCESS) {
            toast.success('Time Slot deleted successfully');
            resetStatus();
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        }
    }, [status, resetStatus]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const filterCategories: FilterCategory[] = [
        {
            id: 'status',
            name: 'Status',
            options: [
                { id: '1', label: 'Active', value: 'true' },
                { id: '2', label: 'Inactive', value: 'false' },
            ]
        }
    ];

    const handleFilterChange = (filters: Record<string, string[]>) => {
        let filtered = data || [];
        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter((loc: SlotType) => {
                const isActiveString = loc.isActive ? 'true' : 'false';
                return filters.status.includes(isActiveString);
            });
        }
        setSlots(filtered);
    };

    const handleRowClick = (slot: SlotType) => {
        setSelectedSlot(slot);
    };

    // Helper to parse "HH:mm" straight into today's Date for React-Timepicker
    const parseTimeStr = (timeStr?: string) => {
        if (!timeStr) return null;
        const [hours, minutes] = timeStr.split(':');
        const d = new Date();
        d.setHours(parseInt(hours, 10));
        d.setMinutes(parseInt(minutes, 10));
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
    };

    const handleOpenModal = (slot: SlotType | null = null) => {
        if (slot) {
            setEditingId(slot.id);
            setFormData({
                label: slot.label,
                startTime: parseTimeStr(slot.startTime),
                endTime: parseTimeStr(slot.endTime),
                isActive: slot.isActive,
            });
        } else {
            setEditingId(null);
            setFormData(emptyForm);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData(emptyForm);
        setEditingId(null);
    };

    // Helper to extract format like "HH:mm" strings back out of local time Date objects
    const formatTimeStr = (d: Date | null) => {
        if (!d) return null;
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleFormSubmit = async (submittedData: SlotFormData) => {
        const payload = {
            ...submittedData,
            startTime: formatTimeStr(submittedData.startTime),
            endTime: formatTimeStr(submittedData.endTime),
        };

        if (editingId) {
            updateSlot(editingId, payload);
        } else {
            createSlot(payload);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            deleteSlot(deleteId);
        }
    };

    return (
        <CrudPageLayout
            className='slot-page-container'
            filterSlot={
                <Filter
                    categories={filterCategories}
                    onFilterChange={handleFilterChange}
                />
            }
            addButton={
                <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                    <Plus size={16} />Add Time Slot
                </Button>
            }
            tableSlot={
                <DataTable
                    data={slots}
                    columns={[
                        {
                            header: 'Label',
                            accessorKey: 'label',
                            className: 'w-[25%] min-w-[150px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white whitespace-nowrap'
                        },
                        {
                            header: 'Start Time',
                            accessorKey: 'startTime',
                            className: 'w-[25%] min-w-[150px] py-3 px-4 text-left',
                            render: (loc) => <span>{loc.startTime || '-'}</span>
                        },
                        {
                            header: 'End Time',
                            accessorKey: 'endTime',
                            className: 'w-[25%] min-w-[150px] py-3 px-4 text-left',
                            render: (loc) => <span>{loc.endTime || '-'}</span>
                        },
                        {
                            header: 'Status',
                            className: 'w-[15%] min-w-[100px] py-3 px-4 text-left',
                            render: (loc) => <StatusBadge isActive={loc.isActive} />
                        },
                        {
                            header: 'Actions',
                            className: 'w-[10%] min-w-[80px] py-3 px-4 text-right',
                            render: (loc) => (
                                <RowActions
                                    onEdit={() => handleOpenModal(loc)}
                                    onDelete={() => handleDeleteClick(loc.id)}
                                />
                            )
                        }
                    ]}
                    keyExtractor={(item) => item.id}
                    onRowClick={handleRowClick}
                    selectedId={selectedSlot?.id}
                    loading={loading && (!slots || slots.length === 0)}
                />
            }
            sidePanelSlot={
                <SidePanel
                    isOpen={!!selectedSlot}
                    onClose={() => setSelectedSlot(null)}
                    title={selectedSlot?.label || 'Time Slot Details'}
                    variant="inline"
                    className="border-l border-gray-200 dark:border-gray-800"
                >
                    {selectedSlot && (
                        <SlotDetails
                            slot={selectedSlot}
                            onEdit={() => handleOpenModal(selectedSlot)}
                        />
                    )}
                </SidePanel>
            }
            modalSlot={
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingId ? 'Edit Time Slot' : 'Add Time Slot'}
                >
                    <SlotForm
                        initialData={editingId ? formData : undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCloseModal}
                        submitLabel={editingId ? 'Update' : 'Save'}
                        isLoading={loading}
                    />
                </Modal>
            }
            deleteModalSlot={
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    itemType="Time Slot"
                    title='Delete Time Slot'
                    description='This will permanently delete the time slot. Are you sure?'
                />
            }
        />
    );
};

export default Slot;
