import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { DeleteModal } from '@/components/common/DeleteModal';
import { SearchBar } from '@/components/common/SearchBar';
import { PincodeForm } from './PincodeForm';
import { PincodeList } from './PincodeList';
import { PincodeCardView } from './PincodeCardView';
import { Plus, LayoutGrid, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { connect } from 'react-redux';
import { getPincodeData, createPincode, updatePincode, deletePincode, resetStatus } from '@/features/location/store/actions';
import type { RootState } from '@/store/store';
import * as types from '@/features/location/store/action-types';
import { cn } from '@/utils/cn';

export interface PincodeType {
    id: number;
    locationId: number;
    pincodeCode: string;
    name: string;
    areaName: string;
    latitude: number;
    longitude: number;
    isActive: boolean;
}

export type PincodeFormData = Omit<PincodeType, 'id' | 'locationId'>;

const emptyForm: PincodeFormData = {
    pincodeCode: '',
    name: '',
    areaName: '',
    latitude: 0,
    longitude: 0,
    isActive: true
};

interface PincodeProps {
    locationId: number;
    pincodes: PincodeType[];
    loadingPincodes: boolean;
    pincodeError: string | null;
    pincodeStatus: string;
    getPincodeData: (locationId: number) => void;
    createPincode: (data: any) => Promise<any>;
    updatePincode: (id: number, data: any) => Promise<any>;
    deletePincode: (id: number, locationId: number) => Promise<any>;
    resetStatus: () => void;
}

const PincodeComponent = ({
    locationId,
    pincodes,
    loadingPincodes,
    pincodeError,
    pincodeStatus,
    getPincodeData,
    createPincode,
    updatePincode,
    deletePincode,
    resetStatus
}: PincodeProps) => {

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState<PincodeFormData>(emptyForm);
    const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

    useEffect(() => {
        if (locationId) {
            getPincodeData(locationId);
        }
    }, [locationId, getPincodeData]);

    useEffect(() => {
        if (pincodeStatus === types.CREATE_PINCODE_SUCCESS) {
            toast.success('Pincode created successfully');
            resetStatus();
            handleCloseModal();
        } else if (pincodeStatus === types.UPDATE_PINCODE_SUCCESS) {
            toast.success('Pincode updated successfully');
            resetStatus();
            handleCloseModal();
        } else if (pincodeStatus === types.DELETE_PINCODE_SUCCESS) {
            toast.success('Pincode deleted successfully');
            resetStatus();
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        }
    }, [pincodeStatus, resetStatus]);

    useEffect(() => {
        if (pincodeError) {
            toast.error(pincodeError);
        }
    }, [pincodeError]);

    const handleOpenModal = (pincode: PincodeType | null = null) => {
        if (pincode) {
            setEditingId(pincode.id);
            setFormData({
                pincodeCode: pincode.pincodeCode,
                name: pincode.name,
                areaName: pincode.areaName,
                latitude: pincode.latitude || 0,
                longitude: pincode.longitude || 0,
                isActive: pincode.isActive,
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

    const handleFormSubmit = async (submittedData: PincodeFormData) => {
        if (editingId) {
            updatePincode(editingId, {
                ...submittedData,
                locationId,
            });
        } else {
            createPincode({
                ...submittedData,
                locationId,
            });
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            deletePincode(deleteId, locationId);
        }
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredPincodes = useMemo(() => {
        if (!searchQuery.trim()) return pincodes;
        const query = searchQuery.toLowerCase();
        return pincodes.filter(pin =>
            (pin.pincodeCode && pin.pincodeCode.toLowerCase().includes(query)) ||
            (pin.name && pin.name.toLowerCase().includes(query)) ||
            (pin.areaName && pin.areaName.toLowerCase().includes(query))
        );
    }, [pincodes, searchQuery]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-end mb-6">
                <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                    <SearchBar
                        className="w-full sm:w-64 min-w-[200px]"
                        placeholder="Search pincodes or areas..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />

                    <div className="flex bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 p-1 rounded-xl shrink-0 gap-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-1.5 rounded-lg transition-all flex items-center justify-center",
                                viewMode === 'list' ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-gray-800 dark:hover:text-slate-300"
                            )}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('card')}
                            className={cn(
                                "p-1.5 rounded-lg transition-all flex items-center justify-center",
                                viewMode === 'card' ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-gray-800 dark:hover:text-slate-300"
                            )}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>

                    <Button variant="default" onClick={() => handleOpenModal()} className="h-9 px-3 text-xs gap-1.5 shadow-sm shrink-0 whitespace-nowrap">
                        <Plus size={14} /> Add Pincode
                    </Button>
                </div>
            </div>

            {
                loadingPincodes ? (
                    <div className="flex items-center justify-center p-10 text-slate-400">Loading...</div>
                ) : filteredPincodes.length === 0 ? (
                    <div className="bg-slate-50/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-gray-700 p-10 text-center flex flex-col items-center justify-center">
                        <div className="text-3xl mb-3 opacity-40">📮</div>
                        <div className="text-slate-500 font-medium text-sm">No pincodes found</div>
                        <div className="text-slate-400 text-xs mt-1">Try a different search query or add a new pincode</div>
                    </div>
                ) : viewMode === 'card' ? (
                    <PincodeCardView
                        pincodes={filteredPincodes}
                        onEdit={handleOpenModal}
                        onDelete={handleDeleteClick}
                    />
                ) : (
                    <PincodeList
                        pincodes={filteredPincodes}
                        loading={loadingPincodes}
                        onEdit={handleOpenModal}
                        onDelete={handleDeleteClick}
                    />
                )
            }

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit Pincode' : 'Add Pincode'}
            >
                <PincodeForm
                    initialData={editingId ? formData : undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    submitLabel={editingId ? 'Update' : 'Save'}
                />
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Pincode"
                title="Delete Pincode"
                description="This will permanently delete the pincode. Are you sure?"
            />
        </div >
    );
};

const mapStateToProps = (state: RootState) => ({
    pincodes: state.location.pincodes,
    loadingPincodes: state.location.loadingPincodes,
    pincodeError: state.location.pincodeError,
    pincodeStatus: state.location.pincodeStatus,
});

const mapDispatchToProps = {
    getPincodeData,
    createPincode,
    updatePincode,
    deletePincode,
    resetStatus,
};

export const Pincode = connect(mapStateToProps, mapDispatchToProps)(PincodeComponent);
