import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { InclusionForm } from './InclusionForm';
import { InclusionDetails } from './InclusionDetails';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { CrudPageLayout } from '@/components/common/CrudPageLayout';
import { Plus } from 'lucide-react';
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
    // const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const handleRowClick = (inclusion: InclusionType) => {
        setSelectedInclusion(inclusion);
    };

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
            filtered = filtered.filter((inc: InclusionType) => {
                const isActiveString = inc.isActive ? 'true' : 'false';
                return filters.status.includes(isActiveString);
            });
        }

        if (filters.isIncluded && filters.isIncluded.length > 0) {
            filtered = filtered.filter((inc: InclusionType) => {
                const isIncludedString = inc.isIncluded ? 'true' : 'false';
                return filters.isIncluded.includes(isIncludedString);
            });
        }

        setInclusions(filtered);
    };

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
        <CrudPageLayout
            className='inclusion-page-container'
            filterSlot={
                <Filter
                    categories={filterCategories}
                    onFilterChange={handleFilterChange}
                />
            }
            addButton={
                <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                    <Plus size={2} />Add Inclusion
                </Button>
            }
            tableSlot={
                <DataTable
                    data={inclusions}
                    columns={[
                        {
                            header: 'Description',
                            accessorKey: 'description',
                            className: 'w-[40%] min-w-[200px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white',
                            render: (inc) => (
                                <div className="truncate max-w-[300px]" title={inc.description}>
                                    {inc.description || '-'}
                                </div>
                            )
                        },
                        {
                            header: 'Is Included?',
                            className: 'w-[20%] min-w-[120px] py-3 px-4 text-left',
                            render: (inc) => (
                                <span className={
                                    inc.isIncluded ? 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                }>
                                    {inc.isIncluded ? 'Yes' : 'No'}
                                </span>
                            )
                        },
                        {
                            header: 'Status',
                            className: 'w-[15%] min-w-[120px] py-3 px-4 text-left',
                            render: (inc) => (
                                <StatusBadge isActive={inc.isActive} />
                            )
                        },
                        {
                            header: 'Actions',
                            className: 'w-[25%] min-w-[100px] py-3 px-4 text-right',
                            render: (inc) => (
                                <RowActions
                                    onEdit={() => handleOpenModal(inc)}
                                    onDelete={() => handleDeleteClick(inc.id)}
                                />
                            )
                        }
                    ]}
                    keyExtractor={(item) => item.id}
                    onRowClick={handleRowClick}
                    selectedId={selectedInclusion?.id}
                    loading={loading && (!inclusions || inclusions.length === 0)}
                    onReorder={handleDragReorder}
                    draggable={true}
                />
            }
            sidePanelSlot={
                <SidePanel
                    isOpen={!!selectedInclusion}
                    onClose={() => setSelectedInclusion(null)}
                    title="Inclusion Details"
                    variant="inline"
                    className="border-l border-gray-200 dark:border-gray-800"
                >
                    {selectedInclusion && (
                        <InclusionDetails
                            inclusion={selectedInclusion}
                            onEdit={() => handleOpenModal(selectedInclusion)}
                        />
                    )}
                </SidePanel>
            }
            modalSlot={
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
            }
            deleteModalSlot={
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    itemType="Inclusion"
                    title='Delete Inclusion'
                    description='This is will delete the inclusion from the system. Are you sure?'
                />
            }
        />
    );
};

export default Inclusion;
