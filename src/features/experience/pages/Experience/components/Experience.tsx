import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { ExperienceForm, type ExperiencePayload } from './ExperienceForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { ExperienceSplitView } from './ExperienceSplitView';
import toast from 'react-hot-toast';
import * as types from '@/features/experience/store/action-types';
import '../../css/styles.scss';

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
    locations: any[];
    getExperienceData: () => void;
    getExperienceById: (id: number) => Promise<any>;
    getSubCategoryData: () => void;
    getInclusionData: () => void;
    getCancellationPolicyData: () => void;
    getAddonData: () => void;
    createExperience: (data: ExperiencePayload) => Promise<any>;
    updateExperience: (id: number, data: ExperiencePayload) => Promise<any>;
    deleteExperience: (id: number) => Promise<any>;
    resetStatus: () => void;
    toggleCancellationPolicy: (experienceId: number, policyId: number, isAssociate: boolean) => Promise<any>;
    toggleInclusion: (experienceId: number, inclusionId: number, isAssociate: boolean) => Promise<any>;
    reorderExperience: (data: { id: number; newPosition: number }) => Promise<any>;
    getLocationData: () => void;
    associateLocation: (experienceId: number, locationId: number, timeSlotId: number, data: any) => Promise<any>;
    updateExperienceLocation: (experienceId: number, locationId: number, timeSlotId: number, data: any) => Promise<any>;
    disassociateLocation: (experienceId: number, locationId: number, timeSlotId: number) => Promise<any>;
    addons: any[];
    toggleAddon: (experienceId: number, addonId: number, isAssociate: boolean, data?: any) => Promise<any>;
    slots: any[];
    getSlotData: () => void;
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
    reorderExperience,
    locations,
    getLocationData,
    associateLocation,
    updateExperienceLocation,
    disassociateLocation,
    getAddonData,
    addons,
    toggleAddon,
    slots,
    getSlotData,
}: ExperienceProps) => {

    const [experiences, setExperiences] = useState<ExperienceType[]>([]);
    const [selectedExperience, setSelectedExperience] = useState<ExperienceType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        getExperienceData();
        getSubCategoryData();
        getInclusionData();
        getCancellationPolicyData();
        getLocationData();
        getAddonData();
        getSlotData();
    }, [getExperienceData, getSubCategoryData, getInclusionData, getCancellationPolicyData, getLocationData, getAddonData, getSlotData]);

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
            // Refresh currently selected experience details to reflect inline edits
            if (selectedExperience) {
                getExperienceById(selectedExperience.id).catch(err => console.error("Failed to refresh details", err));
            }
        }
        if (status === types.DELETE_EXPERIENCE_SUCCESS) {
            toast.success('Experience deleted successfully');
            resetStatus();
            setIsDeleteModalOpen(false);
            if (selectedExperience?.id === deleteId) setSelectedExperience(null);
        }
        if (status === types.TOGGLE_ADDON_SUCCESS) {
            toast.success('Add-on association updated');
            resetStatus();
        }
    }, [error, status, resetStatus, selectedExperience, deleteId]);

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

    const handleDragReorder = async (newOrder: ExperienceType[], activeId: string | number, _overId: string | number) => {
        setExperiences(newOrder);

        const movedItem = experiences.find(e => String(e.id) === String(activeId));

        if (!movedItem) {
            console.error('Could not find moved item');
            return;
        }

        const newIndex = newOrder.findIndex(e => String(e.id) === String(activeId));

        if (newIndex === -1) {
            console.error('Could not find item in new order');
            return;
        }

        try {
            await reorderExperience({
                id: movedItem.id,
                newPosition: newIndex + 1
            });
            toast.success('Experience reordered successfully');
        } catch (error) {
            console.error('Failed to reorder', error);
            toast.error('Failed to reorder experience');
            getExperienceData(); // Revert on failure
        }
    };

    return (
        <div className="experience-page-container w-full h-full flex flex-col">
            <ExperienceSplitView
                experiences={experiences}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedExperience={selectedExperience}
                setSelectedExperience={async (exp: ExperienceType | null) => {
                    setSelectedExperience(exp);
                    if (exp) {
                        try {
                            await getExperienceById(exp.id);
                        } catch (err) {
                            console.error("Failed to load details", err);
                        }
                    }
                }}
                loading={loading}
                experienceDetail={selectedExperienceDetail}
                inclusions={inclusions}
                cancellationPolicies={cancellationPolicies}
                subCategories={subCategories}
                toggleCancellationPolicy={toggleCancellationPolicy}
                toggleInclusion={toggleInclusion}
                updateExperience={updateExperience}
                handleDragReorder={handleDragReorder}
                locations={locations}
                associateLocation={associateLocation}
                updateExperienceLocation={updateExperienceLocation}
                disassociateLocation={disassociateLocation}
                addons={addons}
                toggleAddon={toggleAddon}
                slots={slots}
            />

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

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Experience"
                title='Delete Experience'
                description='This will permanently delete the experience. Are you sure?'
            />
        </div>
    );
};

export default Experience;
