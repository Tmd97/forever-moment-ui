import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { ExperienceForm, type ExperiencePayload } from './ExperienceForm';
import { getExperienceTabs } from './ExperienceDetails';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { CrudPageLayout } from '@/components/common/CrudPageLayout';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import * as types from '@/features/experience/store/action-types';

export interface ExperienceType extends ExperiencePayload {
    id: number;
    title?: string;
    category?: string;
    price?: string;
    status?: string;
}

interface ExperienceProps {
    data: ExperienceType[] | null;
    selectedExperienceDetail: any;
    loading: boolean;
    error: string | null;
    status: string;
    subCategories: any[];
    inclusions: any[];
    cancellationPolicies: any[];
    getExperienceData: () => void;
    getExperienceById: (id: number) => Promise<any>;
    getSubCategoryData: () => void;
    getInclusionData: () => void;
    getCancellationPolicyData: () => void;
    createExperience: (data: ExperiencePayload) => Promise<any>;
    updateExperience: (id: number, data: ExperiencePayload) => Promise<any>;
    deleteExperience: (id: number) => Promise<any>;
    resetStatus: () => void;
    toggleCancellationPolicy: (experienceId: number, policyId: number, isAssociate: boolean) => Promise<any>;
    toggleInclusion: (experienceId: number, inclusionId: number, isAssociate: boolean) => Promise<any>;
}

const Experience = ({
    data,
    selectedExperienceDetail,
    loading,
    error,
    status,
    subCategories,
    inclusions,
    cancellationPolicies,
    getExperienceData,
    getExperienceById,
    getSubCategoryData,
    getInclusionData,
    getCancellationPolicyData,
    createExperience,
    updateExperience,
    deleteExperience,
    resetStatus,
    toggleCancellationPolicy,
    toggleInclusion,
}: ExperienceProps) => {

    const [experiences, setExperiences] = useState<ExperienceType[]>([]);
    const [selectedExperience, setSelectedExperience] = useState<ExperienceType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    useEffect(() => {
        getExperienceData();
        getSubCategoryData();
        getInclusionData();
        getCancellationPolicyData();
    }, [getExperienceData, getSubCategoryData, getInclusionData, getCancellationPolicyData]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setExperiences(data);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            resetStatus();
        }
        if (status === types.CREATE_EXPERIENCE_SUCCESS) {
            toast.success('Experience created successfully');
            resetStatus();
            handleCloseModal();
        }
        if (status === types.UPDATE_EXPERIENCE_SUCCESS) {
            toast.success('Experience updated successfully');
            resetStatus();
            handleCloseModal();
        }
        if (status === types.DELETE_EXPERIENCE_SUCCESS) {
            toast.success('Experience deleted successfully');
            resetStatus();
            setIsDeleteModalOpen(false);
            if (selectedExperience?.id === deleteId) setSelectedExperience(null);
        }
    }, [error, status, resetStatus, selectedExperience, deleteId]);

    const handleRowClick = async (exp: ExperienceType) => {
        setSelectedExperience(exp);
        try {
            await getExperienceById(exp.id);
        } catch (err) {
            console.error("Failed to load full experience details", err);
        }
    };

    const handleOpenModal = async (exp: ExperienceType | null = null) => {
        if (exp) {
            setEditingId(exp.id);
            try {
                await getExperienceById(exp.id);
            } catch (err) {
                return;
            }
        } else {
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleFormSubmit = async (submitData: ExperiencePayload) => {
        if (editingId) {
            await updateExperience(editingId, submitData);
        } else {
            const maxOrder = experiences.length > 0
                ? Math.max(...experiences.map((e: ExperienceType) => e.displayOrder || 0))
                : -1;
            const newDisplayOrder = Math.max(0, maxOrder + 1);
            await createExperience({ ...submitData, displayOrder: newDisplayOrder });
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            deleteExperience(deleteId);
        }
    };

    // Filter configuration
    const filterCategories: FilterCategory[] = [
        {
            id: 'status',
            name: 'Status',
            options: [
                { id: '1', label: 'Active', value: 'Active' },
                { id: '2', label: 'Inactive', value: 'Inactive' },
            ]
        },
        {
            id: 'price',
            name: 'Price Range',
            options: [
                { id: '1', label: 'Under ₹10,000', value: '0-10000' },
                { id: '2', label: '₹10,000 - ₹25,000', value: '10000-25000' },
                { id: '3', label: 'Above ₹25,000', value: '25000+' },
            ]
        },
    ];

    const handleFilterChange = (filters: Record<string, string[]>) => {
        setActiveFilters(filters);
    };

    // Apply filters locally
    let filteredExperiences = experiences || [];
    if (activeFilters.status && activeFilters.status.length > 0) {
        filteredExperiences = filteredExperiences.filter((exp: ExperienceType) => {
            const expStatus = exp.isActive ? 'Active' : 'Inactive';
            return activeFilters.status.includes(expStatus);
        });
    }
    if (activeFilters.price && activeFilters.price.length > 0) {
        filteredExperiences = filteredExperiences.filter((exp: ExperienceType) => {
            const price = exp.basePrice || 0;
            return activeFilters.price.some(range => {
                if (range === '0-10000') return price < 10000;
                if (range === '10000-25000') return price >= 10000 && price <= 25000;
                if (range === '25000+') return price > 25000;
                return false;
            });
        });
    }

    return (
        <CrudPageLayout
            filterSlot={
                <Filter
                    categories={filterCategories}
                    onFilterChange={handleFilterChange}
                />
            }
            addButton={
                <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                    <Plus size={16} className="mr-2" /> Add Experience
                </Button>
            }
            tableSlot={
                <DataTable
                    data={filteredExperiences}
                    loading={loading && (!experiences || experiences.length === 0)}
                    columns={[
                        {
                            header: 'Title',
                            accessorKey: 'name' as const,
                        },
                        {
                            header: 'Price',
                            render: (exp) => `₹${exp.basePrice || 0}`
                        },
                        {
                            header: 'Status',
                            render: (exp) => (
                                <StatusBadge status={exp.isActive ? 'Active' : 'Inactive'} />
                            )
                        },
                        {
                            header: 'Actions',
                            render: (exp) => (
                                <RowActions
                                    onEdit={() => handleOpenModal(exp)}
                                    onDelete={() => handleDeleteClick(exp.id)}
                                />
                            )
                        }
                    ]}
                    keyExtractor={(item) => item.id}
                    onRowClick={handleRowClick}
                    selectedId={selectedExperience?.id}
                />
            }
            sidePanelSlot={
                <SidePanel
                    isOpen={!!selectedExperience}
                    onClose={() => setSelectedExperience(null)}
                    title={selectedExperience?.name || 'Experience Details'}
                    variant="inline"
                    className="border-l border-gray-200 dark:border-gray-800 w-[500px]"
                    tabs={selectedExperience ? getExperienceTabs({
                        experience: {
                            ...selectedExperience,
                            title: selectedExperience.name,
                            price: `₹${selectedExperience.basePrice}`,
                            status: selectedExperience.isActive ? 'Active' : 'Inactive'
                        },
                        experienceDetail: selectedExperienceDetail,
                        inclusions,
                        cancellationPolicies,
                        onEdit: () => handleOpenModal(selectedExperience),
                        onToggleCancellationPolicy: (policyId, isAssociate) => {
                            toggleCancellationPolicy(selectedExperience.id, policyId, isAssociate);
                        },
                        onToggleInclusion: (inclusionId, isAssociate) => {
                            toggleInclusion(selectedExperience.id, inclusionId, isAssociate);
                        }
                    }) : undefined}
                />
            }
            modalSlot={
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingId ? 'Edit Experience' : 'Add Experience'}
                    className="sm:max-w-5xl w-[95vw]"
                >
                    <ExperienceForm
                        initialData={editingId && selectedExperienceDetail ? {
                            name: selectedExperienceDetail.name || '',
                            slug: selectedExperienceDetail.slug || '',
                            tagName: selectedExperienceDetail.tagName || '',
                            basePrice: selectedExperienceDetail.basePrice || 0,
                            displayOrder: selectedExperienceDetail.displayOrder || 0,
                            isFeatured: selectedExperienceDetail.isFeatured || false,
                            isActive: selectedExperienceDetail.isActive ?? true,
                            subCategoryId: selectedExperienceDetail.subCategoryId || 0,
                            shortDescription: selectedExperienceDetail.detail?.shortDescription || '',
                            description: selectedExperienceDetail.detail?.description || '',
                            durationMinutes: selectedExperienceDetail.detail?.durationMinutes || 0,
                            maxCapacity: selectedExperienceDetail.detail?.maxCapacity || 0,
                            minAge: selectedExperienceDetail.detail?.minAge || 0,
                            completionTime: selectedExperienceDetail.detail?.completionTime || 0,
                            minHours: selectedExperienceDetail.detail?.minHours || 0,
                            termsConditions: selectedExperienceDetail.detail?.termsConditions || '',
                            whatToBring: selectedExperienceDetail.detail?.whatToBring || '',
                        } : undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCloseModal}
                        submitLabel={editingId ? 'Save Changes' : 'Create Experience'}
                        isLoading={loading}
                        subCategories={subCategories}
                    />
                </Modal>
            }
            deleteModalSlot={
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    itemType="Experience"
                />
            }
        />
    );
};

export default Experience;
