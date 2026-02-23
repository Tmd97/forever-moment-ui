import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { LocationForm } from './LocationForm';
import { LocationDetails } from './LocationDetails';
import { Pincode } from './Pincode';
import { DeleteModal } from '@/components/common/DeleteModal';
import { LocationSplitView } from './LocationSplitView';
import type { FilterCategory } from '@/components/common/Filter';
import toast from 'react-hot-toast';
import * as types from '@/features/location/store/action-types';
import '../../css/styles.scss';

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
        <div className="location-page-container">
            <LocationSplitView
                locations={locations}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                loading={loading}
                filterCategories={filterCategories} // Added filterCategories
                onFilterChange={handleFilterChange} // Added onFilterChange
                handleRowClick={handleRowClick} // Added handleRowClick
                LocationDetails={LocationDetails} // Added LocationDetails
                Pincode={Pincode} // Added Pincode
            />

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

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Location"
                title='Delete Location'
                description='This will permanently delete the location. Are you sure?'
            />
        </div>
    );
};

export default Location;
