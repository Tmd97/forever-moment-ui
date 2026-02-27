import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { SlotForm } from './SlotForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { SlotSplitView } from './SlotSplitView';
import toast from 'react-hot-toast';
import * as types from '@/features/slot/store/action-types';
import '../../css/styles.scss';

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
    name: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
}

type SlotFormData = {
    name: string;
    startTime: Date | null;
    endTime: Date | null;
    isActive: boolean;
};

const emptyForm: SlotFormData = { name: '', startTime: null, endTime: null, isActive: true };

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

    // Filter array logic Handle in SplitView

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
                name: slot.name,
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
        <div className="slot-page-container w-full h-full flex flex-col">
            <SlotSplitView
                slots={slots}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                loading={loading}
                updateSlot={updateSlot}
            />

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

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Time Slot"
                title='Delete Time Slot'
                description='This will permanently delete the time slot. Are you sure?'
            />
        </div>
    );
};

export default Slot;
