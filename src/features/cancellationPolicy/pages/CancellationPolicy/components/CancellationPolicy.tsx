import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { CancellationPolicyForm } from './CancellationPolicyForm';
import { CancellationPolicyDetails } from './CancellationPolicyDetails';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { CrudPageLayout } from '@/components/common/CrudPageLayout';
import { Plus } from 'lucide-react';
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

    const handleRowClick = (policy: CancellationPolicyType) => {
        setSelectedCancellationPolicy(policy);
    };

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

    const filterCategories: FilterCategory[] = [
        {
            id: 'status',
            name: 'Status',
            options: [
                { id: '1', label: 'Active', value: 'true' },
                { id: '2', label: 'Inactive', value: 'false' },
            ]
        },
        {
            id: 'isIncluded',
            name: 'Included Types',
            options: [
                { id: '3', label: 'Yes', value: 'true' },
                { id: '4', label: 'No', value: 'false' },
            ]
        }
    ];

    const handleFilterChange = (filters: Record<string, string[]>) => {
        let filtered = data || [];

        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter((policy: CancellationPolicyType) => {
                const isActiveString = policy.isActive ? 'true' : 'false';
                return filters.status.includes(isActiveString);
            });
        }

        if (filters.isIncluded && filters.isIncluded.length > 0) {
            filtered = filtered.filter((policy: CancellationPolicyType) => {
                const isIncludedString = policy.isIncluded ? 'true' : 'false';
                return filters.isIncluded.includes(isIncludedString);
            });
        }

        setCancellationPolicies(filtered);
    };

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
        <CrudPageLayout
            className='cancellation-policy-page-container'
            filterSlot={
                <Filter
                    categories={filterCategories}
                    onFilterChange={handleFilterChange}
                />
            }
            addButton={
                <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                    <Plus size={2} />Add Policy
                </Button>
            }
            tableSlot={
                <DataTable
                    data={cancellationPolicies}
                    columns={[
                        {
                            header: 'Description',
                            accessorKey: 'description',
                            className: 'w-[40%] min-w-[200px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white',
                            render: (policy) => (
                                <div className="truncate max-w-[300px]" title={policy.description}>
                                    {policy.description || '-'}
                                </div>
                            )
                        },
                        {
                            header: 'Is Included?',
                            className: 'w-[20%] min-w-[120px] py-3 px-4 text-left',
                            render: (policy) => (
                                <span className={
                                    policy.isIncluded ? 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                }>
                                    {policy.isIncluded ? 'Yes' : 'No'}
                                </span>
                            )
                        },
                        {
                            header: 'Status',
                            className: 'w-[15%] min-w-[120px] py-3 px-4 text-left',
                            render: (policy) => (
                                <StatusBadge isActive={policy.isActive} />
                            )
                        },
                        {
                            header: 'Actions',
                            className: 'w-[25%] min-w-[100px] py-3 px-4 text-right',
                            render: (policy) => (
                                <RowActions
                                    onEdit={() => handleOpenModal(policy)}
                                    onDelete={() => handleDeleteClick(policy.id)}
                                />
                            )
                        }
                    ]}
                    keyExtractor={(item) => item.id}
                    onRowClick={handleRowClick}
                    selectedId={selectedCancellationPolicy?.id}
                    loading={loading && (!cancellationPolicies || cancellationPolicies.length === 0)}
                    onReorder={handleDragReorder}
                    draggable={true}
                />
            }
            sidePanelSlot={
                <SidePanel
                    isOpen={!!selectedCancellationPolicy}
                    onClose={() => setSelectedCancellationPolicy(null)}
                    title="Policy Details"
                    variant="inline"
                    className="border-l border-gray-200 dark:border-gray-800"
                >
                    {selectedCancellationPolicy && (
                        <CancellationPolicyDetails
                            cancellationPolicy={selectedCancellationPolicy}
                        />
                    )}
                </SidePanel>
            }
            modalSlot={
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
            }
            deleteModalSlot={
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    itemType="Policy"
                    title='Delete Policy'
                    description='This is will delete the policy from the system. Are you sure?'
                />
            }
        />
    );
};

export default CancellationPolicy;
