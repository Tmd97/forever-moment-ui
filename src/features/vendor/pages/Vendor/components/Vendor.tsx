import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { VendorForm } from './VendorForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { VendorSplitView } from './VendorSplitView';
import toast from 'react-hot-toast';
import '../../css/styles.scss';

export interface Vendor {
    id: number;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    category: string;
    status: 'Active' | 'Inactive' | 'Pending';
    rating?: number;
}

interface VendorProps {
    data: Vendor[] | null;
    loading: boolean;
    error: string | null;
    getVendors: () => void;
}

const VendorPage = ({ data, loading, error, getVendors }: VendorProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // TODO: Remove mock data once real API is integrated
    const [vendors, setVendors] = useState<Vendor[]>([
        { id: 1, name: 'Memorable Clicks', contactPerson: 'Rahul Gupta', email: 'rahul@memorableclicks.com', phone: '+91 9876543210', category: 'Photography', status: 'Active', rating: 4.8 },
        { id: 2, name: 'Royal Catering Services', contactPerson: 'Amit Singh', email: 'info@royalcatering.com', phone: '+91 9988776655', category: 'Catering', status: 'Active', rating: 4.5 },
        { id: 3, name: 'Dream Decorators', contactPerson: 'Sneha Patel', email: 'sneha@dreamdecorators.in', phone: '+91 8877665544', category: 'Decoration', status: 'Pending', rating: 0 },
        { id: 4, name: 'City Venue Halls', contactPerson: 'Vikram Malhotra', email: 'vikram@cityvenues.com', phone: '+91 7766554433', category: 'Venue', status: 'Active', rating: 4.2 },
        { id: 5, name: 'DJ Max Events', contactPerson: 'Max DSouza', email: 'max@djevents.com', phone: '+91 6655443322', category: 'Music', status: 'Inactive', rating: 4.9 },
    ]);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [editingVendorData, setEditingVendorData] = useState<Partial<Vendor> | undefined>(undefined);

    useEffect(() => {
        getVendors();
    }, [getVendors]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setVendors(data);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleOpenModal = (vendor: Vendor | null = null) => {
        if (vendor) {
            setEditingId(vendor.id);
            setEditingVendorData(vendor);
        } else {
            setEditingId(null);
            setEditingVendorData(undefined);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setEditingVendorData(undefined);
    };

    const handleFormSubmit = (formData: Omit<Vendor, 'id' | 'rating'>) => {
        if (editingId) {
            setVendors(vendors.map(v => v.id === editingId ? { ...v, ...formData } : v));
        } else {
            const newVendor: Vendor = {
                id: vendors.length + 1,
                rating: 0,
                ...formData
            };
            setVendors([...vendors, newVendor]);
        }
        handleCloseModal();

        if (selectedVendor && editingId === selectedVendor.id) {
            setSelectedVendor(prev => prev ? { ...prev, ...formData } : null);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            setVendors(vendors.filter(v => v.id !== deleteId));
            if (selectedVendor?.id === deleteId) {
                setSelectedVendor(null);
            }
            setDeleteId(null);
        }
    };

    // Filter handles in VendorSplitView

    return (
        <div className="vendor-page-container w-full h-full flex flex-col">
            <VendorSplitView
                vendors={vendors}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedVendor={selectedVendor}
                setSelectedVendor={setSelectedVendor}
                loading={loading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit Vendor' : 'Add Vendor'}
            >
                <VendorForm
                    initialData={editingVendorData}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    submitLabel={editingId ? 'Save Changes' : 'Add Vendor'}
                    isLoading={loading}
                />
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Vendor"
            />
        </div>
    );
};

export default VendorPage;
