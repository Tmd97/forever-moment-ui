import { useState, useEffect } from 'react';
import { AddonForm, type AddonPayload } from './AddonForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { AddonSplitView } from './AddonSplitView';
import toast from 'react-hot-toast';
import * as types from '@/features/addon/store/action-types';
import type { AddonType } from '@/features/addon/store/action-types';
import '../../css/styles.scss';

interface AddonProps {
    data: AddonType[] | null;
    loading: boolean;
    error: string | null;
    status: string;
    getAddonData: () => void;
    createAddon: (data: AddonPayload) => Promise<any>;
    updateAddon: (id: number, data: AddonPayload) => Promise<any>;
    deleteAddon: (id: number) => Promise<any>;
    resetStatus: () => void;
}

const Addon = ({
    data,
    loading,
    error,
    status,
    getAddonData,
    createAddon,
    updateAddon,
    deleteAddon,
    resetStatus,
}: AddonProps) => {

    const [addons, setAddons] = useState<AddonType[]>([]);
    const [selectedAddon, setSelectedAddon] = useState<AddonType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        getAddonData();
    }, [getAddonData]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setAddons(data);

            // Re-select if currently selected addon is still in list to update details
            if (selectedAddon) {
                const updatedSelected = data.find(a => String(a.id) === String(selectedAddon.id));
                if (updatedSelected) {
                    setSelectedAddon(updatedSelected);
                } else {
                    setSelectedAddon(null);
                }
            }
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            resetStatus();
        }

        if (status === types.ADD_ADDON_SUCCESS) {
            toast.success('Addon added successfully!');
            handleCloseModal();
            resetStatus();
        }

        if (status === types.UPDATE_ADDON_SUCCESS) {
            toast.success('Addon updated successfully!');
            handleCloseModal();
            resetStatus();
        }

        if (status === types.DELETE_ADDON_SUCCESS) {
            toast.success('Addon deleted successfully!');
            setIsDeleteModalOpen(false);
            setDeleteId(null);
            setSelectedAddon(null);
            resetStatus();
        }
    }, [error, status, resetStatus]);


    const handleOpenModal = (addon?: AddonType) => {
        if (addon) {
            setEditingId(addon.id);
        } else {
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (formData: AddonPayload) => {
        if (editingId) {
            await updateAddon(editingId, formData);
        } else {
            await createAddon(formData);
        }
    };

    const handleDeleteClick = (addon: AddonType) => {
        setDeleteId(addon.id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await deleteAddon(deleteId);
        }
    };

    const handleSelectAddon = (addon: AddonType | null) => {
        setSelectedAddon(addon);
    };

    return (
        <div className="addon-page-container w-full h-full flex flex-col">
            <AddonSplitView
                addons={addons}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedAddon={selectedAddon}
                setSelectedAddon={handleSelectAddon}
                loading={loading}
                updateAddon={updateAddon}
            />

            <AddonForm
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                initialData={editingId ? addons.find((a) => a.id === editingId) : null}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Addon"
            />
        </div>
    );
};

export default Addon;
