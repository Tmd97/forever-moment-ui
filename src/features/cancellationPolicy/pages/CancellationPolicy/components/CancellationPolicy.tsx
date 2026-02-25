import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { CancellationPolicyForm } from './CancellationPolicyForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { CancellationPolicySplitView } from './CancellationPolicySplitView';
import toast from 'react-hot-toast';
import * as types from '@/features/cancellationPolicy/store/action-types';
import '../../css/styles.scss';

interface CancellationPolicyProps {
    data: any;
    loading: boolean;
    error: string | null;
    status: string;
    getCancellationPolicyData: () => void;
    createCancellationPolicy: (data: any) => Promise<any>;
    deleteCancellationPolicy: (id: number) => Promise<any>;
    updateCancellationPolicy: (id: number, data: any) => Promise<any>;
    reorderCancellationPolicy: (data: { id: number; newPosition: number }) => Promise<any>;
    resetStatus: () => void;
}

export interface CancellationPolicyType {
    id: number;
    description: string;
    isIncluded: boolean;
    isActive: boolean;
    displayOrder?: number;
}

const CancellationPolicy = ({
    data,
    loading,
    error,
    status,
    getCancellationPolicyData,
    createCancellationPolicy,
    deleteCancellationPolicy,
    updateCancellationPolicy,
    reorderCancellationPolicy,
    resetStatus
}: CancellationPolicyProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ description: '', isIncluded: true, isActive: true });

    const [cancellationPolicies, setCancellationPolicies] = useState<CancellationPolicyType[]>([]);
    const [selectedCancellationPolicy, setSelectedCancellationPolicy] = useState<CancellationPolicyType | null>(null);

    useEffect(() => {
        getCancellationPolicyData();
    }, [getCancellationPolicyData]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            const sortedData = [...data].sort((a: CancellationPolicyType, b: CancellationPolicyType) =>
                (a.displayOrder || 0) - (b.displayOrder || 0)
            );
            setCancellationPolicies(sortedData);
        }
    }, [data]);

    // Keep selectedCancellationPolicy up to date when data array changes
    useEffect(() => {
        if (selectedCancellationPolicy && data && Array.isArray(data)) {
            const updatedSelected = data.find((p: CancellationPolicyType) => p.id === selectedCancellationPolicy.id);
            if (updatedSelected) {
                setSelectedCancellationPolicy(updatedSelected);
            } else {
                setSelectedCancellationPolicy(null); // Deselect if deleted remotely
            }
        }
    }, [data, selectedCancellationPolicy]);

    useEffect(() => {
        if (status === types.CREATE_CANCELLATION_POLICY_SUCCESS) {
            toast.success('Cancellation policy created successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.UPDATE_CANCELLATION_POLICY_SUCCESS) {
            toast.success('Cancellation policy updated successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.DELETE_CANCELLATION_POLICY_SUCCESS) {
            toast.success('Cancellation policy deleted successfully');
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

    const handleDragReorder = async (newOrder: CancellationPolicyType[], activeId: string | number, _overId: string | number) => {
        setCancellationPolicies(newOrder);

        const movedItem = cancellationPolicies.find(p => String(p.id) === String(activeId));

        if (!movedItem) {
            console.error('Could not find moved item');
            return;
        }

        const newIndex = newOrder.findIndex(p => String(p.id) === String(activeId));

        if (newIndex === -1) {
            console.error('Could not find item in new order');
            return;
        }

        try {
            await reorderCancellationPolicy({
                id: movedItem.id,
                newPosition: newIndex + 1
            });
            toast.success('Cancellation policy order updated');
        } catch (error) {
            console.error('Failed to reorder', error);
            toast.error('Failed to reorder cancellation policy');
            getCancellationPolicyData();
        }
    };

    // Filter handles in CancellationPolicySplitView

    const handleOpenModal = (policy: CancellationPolicyType | null = null) => {
        if (policy) {
            setEditingId(policy.id);
            setFormData({ description: policy.description, isIncluded: policy.isIncluded, isActive: policy.isActive });
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
            const policyToUpdate = data?.find((p: CancellationPolicyType) => p.id === editingId);
            updateCancellationPolicy(editingId, {
                description: submittedData.description,
                isIncluded: submittedData.isIncluded,
                displayOrder: policyToUpdate?.displayOrder || 0,
                isActive: submittedData.isActive
            });
        } else {
            const maxOrder = data?.length > 0
                ? Math.max(...data.map((p: CancellationPolicyType) => p.displayOrder || 0))
                : 0;
            const nextOrder = maxOrder + 1;
            createCancellationPolicy({
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
            deleteCancellationPolicy(deleteId);
        }
    };

    return (
        <div className="cancellation-policy-page-container w-full h-full flex flex-col">
            <CancellationPolicySplitView
                policies={cancellationPolicies}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedPolicy={selectedCancellationPolicy}
                setSelectedPolicy={setSelectedCancellationPolicy}
                loading={loading}
                handleDragReorder={handleDragReorder}
                updateCancellationPolicy={updateCancellationPolicy}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit Policy' : 'Add Policy'}
            >
                <CancellationPolicyForm
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
                itemType="Policy"
                title='Delete Policy'
                description='This is will delete the policy from the system. Are you sure?'
            />
        </div>
    );
};

export default CancellationPolicy;
