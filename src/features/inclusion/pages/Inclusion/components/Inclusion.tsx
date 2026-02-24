import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { InclusionForm } from './InclusionForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { InclusionSplitView } from './InclusionSplitView';
import toast from 'react-hot-toast';
import * as types from '@/features/inclusion/store/action-types';
import '../../css/styles.scss';

interface InclusionProps {
    data: any;
    loading: boolean;
    error: string | null;
    status: string;
    getInclusionData: () => void;
    createInclusion: (data: any) => Promise<any>;
    deleteInclusion: (id: number) => Promise<any>;
    updateInclusion: (id: number, data: any) => Promise<any>;
    reorderInclusion: (data: { id: number; newPosition: number }) => Promise<any>;
    resetStatus: () => void;
}

export interface InclusionType {
    id: number;
    description: string;
    isIncluded: boolean;
    isActive: boolean;
    displayOrder?: number;
}

const Inclusion = ({
    data,
    loading,
    error,
    status,
    getInclusionData,
    createInclusion,
    deleteInclusion,
    updateInclusion,
    reorderInclusion,
    resetStatus
}: InclusionProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ description: '', isIncluded: true, isActive: true });

    const [inclusions, setInclusions] = useState<InclusionType[]>([]);
    const [selectedInclusion, setSelectedInclusion] = useState<InclusionType | null>(null);

    useEffect(() => {
        getInclusionData();
    }, [getInclusionData]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            const sortedData = [...data].sort((a: InclusionType, b: InclusionType) =>
                (a.displayOrder || 0) - (b.displayOrder || 0)
            );
            setInclusions(sortedData);
        }
    }, [data]);

    useEffect(() => {
        if (status === types.CREATE_INCLUSION_SUCCESS) {
            toast.success('Inclusion created successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.UPDATE_INCLUSION_SUCCESS) {
            toast.success('Inclusion updated successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.DELETE_INCLUSION_SUCCESS) {
            toast.success('Inclusion deleted successfully');
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

    const handleDragReorder = async (newOrder: InclusionType[], activeId: string | number, _overId: string | number) => {
        setInclusions(newOrder);

        const movedItem = inclusions.find(i => String(i.id) === String(activeId));

        if (!movedItem) {
            console.error('Could not find moved item');
            return;
        }

        const newIndex = newOrder.findIndex(i => String(i.id) === String(activeId));

        if (newIndex === -1) {
            console.error('Could not find item in new order');
            return;
        }

        try {
            await reorderInclusion({
                id: movedItem.id,
                newPosition: newIndex + 1
            });
            toast.success('Inclusion order updated');
        } catch (error) {
            console.error('Failed to reorder', error);
            toast.error('Failed to reorder inclusion');
            getInclusionData();
        }
    };

    // Filter handled in InclusionSplitView

    const handleOpenModal = (inclusion: InclusionType | null = null) => {
        if (inclusion) {
            setEditingId(inclusion.id);
            setFormData({ description: inclusion.description, isIncluded: inclusion.isIncluded, isActive: inclusion.isActive });
        } else {
            setEditingId(null);
            setFormData({ description: '', isIncluded: true, isActive: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ description: '', isIncluded: true, isActive: true });
        setEditingId(null);
    };

    const handleFormSubmit = async (submittedData: { description: string; isIncluded: boolean; isActive: boolean }) => {
        if (editingId) {
            const inclusionToUpdate = data?.find((i: InclusionType) => i.id === editingId);
            updateInclusion(editingId, {
                description: submittedData.description,
                isIncluded: submittedData.isIncluded,
                displayOrder: inclusionToUpdate?.displayOrder || 0,
                isActive: submittedData.isActive
            });
        } else {
            const maxOrder = data?.length > 0
                ? Math.max(...data.map((i: InclusionType) => i.displayOrder || 0))
                : 0;
            const nextOrder = maxOrder + 1;
            createInclusion({
                description: submittedData.description,
                isIncluded: submittedData.isIncluded,
                displayOrder: nextOrder,
                isActive: submittedData.isActive
            });
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            deleteInclusion(deleteId);
        }
    };

    return (
        <div className="inclusion-page-container w-full h-full flex flex-col">
            <InclusionSplitView
                inclusions={inclusions}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedInclusion={selectedInclusion}
                setSelectedInclusion={setSelectedInclusion}
                loading={loading}
                handleDragReorder={handleDragReorder}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit Inclusion' : 'Add Inclusion'}
            >
                <InclusionForm
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
                itemType="Inclusion"
                title='Delete Inclusion'
                description='This is will delete the inclusion from the system. Are you sure?'
            />
        </div>
    );
};

export default Inclusion;
