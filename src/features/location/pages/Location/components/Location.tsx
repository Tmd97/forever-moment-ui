import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { LocationForm } from './LocationForm';
import { LocationDetails } from './LocationDetails';
import { Pincode } from './Pincode';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { CrudPageLayout } from '@/components/common/CrudPageLayout';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import * as types from '@/features/location/store/action-types';

interface LocationProps {
    data: any;
    loading: boolean;
    error: string | null;
    status: string;
    getLocationData: () => void;
    createLocation: (data: any) => Promise<any>;
    deleteLocation: (id: number) => Promise<any>;
    updateLocation: (id: number, data: any) => Promise<any>;
    resetStatus: () => void;
}

export interface LocationType {
    id: number;
    name: string;
    city: string;
    state: string;
    country: string;
    isActive: boolean;
}

type LocationFormData = {
    name: string;
    city: string;
    state: string;
    country: string;
    isActive: boolean;
};

const emptyForm: LocationFormData = { name: '', city: '', state: '', country: '', isActive: true };

const Location = ({
    data,
    loading,
    error,
    status,
    getLocationData,
    createLocation,
    deleteLocation,
    updateLocation,
    resetStatus,
}: LocationProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState<LocationFormData>(emptyForm);

    const [locations, setLocations] = useState<LocationType[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);

    useEffect(() => {
        getLocationData();
    }, [getLocationData]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setLocations(data);
        }
    }, [data]);

    useEffect(() => {
        if (status === types.CREATE_LOCATION_SUCCESS) {
            toast.success('Location created successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.UPDATE_LOCATION_SUCCESS) {
            toast.success('Location updated successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.DELETE_LOCATION_SUCCESS) {
            toast.success('Location deleted successfully');
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

    const filterCategories: FilterCategory[] = [
        {
            id: 'status',
            name: 'Status',
            options: [
                { id: '1', label: 'Active', value: 'true' },
                { id: '2', label: 'Inactive', value: 'false' },
            ]
        }
    ];

    const handleFilterChange = (filters: Record<string, string[]>) => {
        let filtered = data || [];
        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter((loc: LocationType) => {
                const isActiveString = loc.isActive ? 'true' : 'false';
                return filters.status.includes(isActiveString);
            });
        }
        setLocations(filtered);
    };

    const handleRowClick = (location: LocationType) => {
        setSelectedLocation(location);
    };

    const handleOpenModal = (location: LocationType | null = null) => {
        if (location) {
            setEditingId(location.id);
            setFormData({
                name: location.name,
                city: location.city || '',
                state: location.state || '',
                country: location.country || '',
                isActive: location.isActive,
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

    const handleFormSubmit = async (submittedData: LocationFormData) => {
        const payload = {
            ...submittedData,
            address: "",
            latitude: 0,
            longitude: 0,
        };

        if (editingId) {
            updateLocation(editingId, payload);
        } else {
            createLocation(payload);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            deleteLocation(deleteId);
        }
    };

    return (
        <CrudPageLayout
            className='location-page-container'
            filterSlot={
                <Filter
                    categories={filterCategories}
                    onFilterChange={handleFilterChange}
                />
            }
            addButton={
                <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                    <Plus size={16} />Add Location
                </Button>
            }
            tableSlot={
                <DataTable
                    data={locations}
                    columns={[
                        {
                            header: 'Name',
                            accessorKey: 'name',
                            className: 'w-[25%] min-w-[150px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white whitespace-nowrap'
                        },
                        {
                            header: 'City',
                            accessorKey: 'city',
                            className: 'w-[20%] min-w-[120px] py-3 px-4 text-left',
                            render: (loc) => <span>{loc.city || '-'}</span>
                        },
                        {
                            header: 'State',
                            accessorKey: 'state',
                            className: 'w-[20%] min-w-[120px] py-3 px-4 text-left',
                            render: (loc) => <span>{loc.state || '-'}</span>
                        },
                        {
                            header: 'Country',
                            accessorKey: 'country',
                            className: 'w-[15%] min-w-[100px] py-3 px-4 text-left',
                            render: (loc) => <span>{loc.country || '-'}</span>
                        },
                        {
                            header: 'Status',
                            className: 'w-[10%] min-w-[100px] py-3 px-4 text-left',
                            render: (loc) => <StatusBadge isActive={loc.isActive} />
                        },
                        {
                            header: 'Actions',
                            className: 'w-[10%] min-w-[80px] py-3 px-4 text-right',
                            render: (loc) => (
                                <RowActions
                                    onEdit={() => handleOpenModal(loc)}
                                    onDelete={() => handleDeleteClick(loc.id)}
                                />
                            )
                        }
                    ]}
                    keyExtractor={(item) => item.id}
                    onRowClick={handleRowClick}
                    selectedId={selectedLocation?.id}
                    loading={loading && (!locations || locations.length === 0)}
                />
            }
            sidePanelSlot={
                <SidePanel
                    isOpen={!!selectedLocation}
                    onClose={() => setSelectedLocation(null)}
                    title={selectedLocation?.name || 'Location Details'}
                    variant="inline"
                    className="w-full sm:w-[800px] border-l border-gray-200 dark:border-gray-800"
                    tabs={selectedLocation ? [
                        {
                            id: 'general',
                            label: 'General Information',
                            content: (
                                <LocationDetails
                                    location={selectedLocation}
                                    onEdit={() => handleOpenModal(selectedLocation)}
                                />
                            )
                        },
                        {
                            id: 'pincodes',
                            label: 'Pincodes',
                            content: (
                                <Pincode locationId={selectedLocation.id} />
                            )
                        }
                    ] : undefined}
                />
            }
            modalSlot={
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingId ? 'Edit Location' : 'Add Location'}
                >
                    <LocationForm
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
                    itemType="Location"
                    title='Delete Location'
                    description='This will permanently delete the location. Are you sure?'
                />
            }
        />
    );
};

export default Location;
