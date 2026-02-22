import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { VendorForm } from './VendorForm';
import { VendorDetails } from './VendorDetails';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { CrudPageLayout } from '@/components/common/CrudPageLayout';
import { Plus } from 'lucide-react';
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
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

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

    const handleRowClick = (vendor: Vendor) => {
        setSelectedVendor(vendor);
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
            id: 'category',
            name: 'Category',
            options: [
                { id: '1', label: 'Photography', value: 'Photography' },
                { id: '2', label: 'Catering', value: 'Catering' },
                { id: '3', label: 'Decoration', value: 'Decoration' },
                { id: '4', label: 'Entertainment', value: 'Entertainment' },
            ]
        },
    ];

    const handleFilterChange = (filters: Record<string, string[]>) => {
        setActiveFilters(filters);
    };

    // Apply filters locally
    let filteredVendors = vendors;
    if (activeFilters.status && activeFilters.status.length > 0) {
        filteredVendors = filteredVendors.filter(vendor => activeFilters.status.includes(vendor.status));
    }
    if (activeFilters.category && activeFilters.category.length > 0) {
        filteredVendors = filteredVendors.filter(vendor => activeFilters.category.includes(vendor.category));
    }

    return (
        <CrudPageLayout
            className='vendor-page-container'
            filterSlot={
                <Filter
                    categories={filterCategories}
                    onFilterChange={handleFilterChange}
                />
            }
            addButton={
                <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                    <Plus size={16} className="mr-2" /> Add Vendor
                </Button>
            }
            tableSlot={
                <DataTable
                    data={filteredVendors}
                    loading={loading && (!vendors || vendors.length === 0)}
                    columns={[
                        {
                            header: 'Business Name',
                            accessorKey: 'name' as const,
                        },
                        {
                            header: 'Category',
                            accessorKey: 'category' as const,
                        },
                        {
                            header: 'Contact',
                            accessorKey: 'contactPerson' as const,
                        },
                        {
                            header: 'Status',
                            render: (vendor) => (
                                <StatusBadge status={vendor.status} />
                            )
                        },
                        {
                            header: 'Actions',
                            render: (vendor) => (
                                <RowActions
                                    onEdit={() => handleOpenModal(vendor)}
                                    onDelete={() => handleDeleteClick(vendor.id)}
                                />
                            )
                        }
                    ]}
                    keyExtractor={(item) => item.id}
                    onRowClick={handleRowClick}
                    selectedId={selectedVendor?.id}
                />
            }
            sidePanelSlot={
                <SidePanel
                    isOpen={!!selectedVendor}
                    onClose={() => setSelectedVendor(null)}
                    title="Vendor Details"
                    variant="inline"
                    className="border-l border-gray-200 dark:border-gray-800"
                >
                    {selectedVendor && (
                        <VendorDetails
                            vendor={selectedVendor}
                            onEdit={() => handleOpenModal(selectedVendor)}
                            onClose={() => setSelectedVendor(null)}
                        />
                    )}
                </SidePanel>
            }
            modalSlot={
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
            }
            deleteModalSlot={
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    itemType="Vendor"
                />
            }
        />
    );
};

export default VendorPage;
