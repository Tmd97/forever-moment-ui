import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { PincodeForm } from './PincodeForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { connect } from 'react-redux';
import { getPincodeData, createPincode, updatePincode, deletePincode, resetStatus } from '@/features/location/store/actions';
import type { RootState } from '@/store/store';
import * as types from '@/features/location/store/action-types';

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

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Manage Pincodes</h3>
                <Button variant="default" onClick={() => handleOpenModal()} className="sm:w-auto">
                    <Plus size={16} className="mr-2" /> Add Pincode
                </Button>
            </div>

            <div className="flex-1 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <DataTable
                    data={pincodes}
                    columns={[
                        {
                            header: 'Code',
                            accessorKey: 'pincodeCode',
                            className: 'w-[20%] min-w-[100px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white',
                        },
                        {
                            header: 'Name',
                            accessorKey: 'name',
                            className: 'w-[25%] min-w-[120px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white',
                        },
                        {
                            header: 'Area',
                            accessorKey: 'areaName',
                            className: 'w-[30%] min-w-[120px] py-3 px-4 text-left text-gray-900 dark:text-white',
                        },
                        {
                            header: 'Status',
                            className: 'w-[15%] min-w-[100px] py-3 px-4 text-left',
                            render: (pin) => <StatusBadge isActive={pin.isActive} />
                        },
                        {
                            header: 'Actions',
                            className: 'w-[10%] min-w-[80px] py-3 px-4 text-right',
                            render: (pin) => (
                                <RowActions
                                    onEdit={() => handleOpenModal(pin)}
                                    onDelete={() => handleDeleteClick(pin.id)}
                                />
                            )
                        }
                    ]}
                    keyExtractor={(item) => item.id}
                    loading={loadingPincodes}
                    tableClassName="table-fixed min-w-[500px] w-full caption-bottom text-sm"
                />
            </div>

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
        </div>
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
