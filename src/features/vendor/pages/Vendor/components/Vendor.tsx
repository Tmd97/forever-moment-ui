import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { VendorForm } from './VendorForm';
import { VendorDetails } from './VendorDetails';
import { DeleteModal } from '@/components/common/DeleteModal';
import { cn } from '@/utils/cn';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { Trash2, Edit2, Plus, Eye } from 'lucide-react';
import type { Vendor } from '../../../store/types';
import { VENDORS_DATA } from '../../../../data/mockData';
import '../../css/styles.scss';

interface VendorProps {
    data: Vendor[] | null;
    loading: boolean;
    error: string | null;
    getVendors: () => void;
}

const VendorPage = ({ data, loading, error, getVendors }: VendorProps) => {
    // Console log to avoid unused warning for now if not used in JSX
    console.log(loading);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);

    // Local state for vendors to allow immediate UI updates (mocking API)
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

    // Edit form initialization
    const [editingVendorData, setEditingVendorData] = useState<Partial<Vendor> | undefined>(undefined);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    useEffect(() => {
        getVendors();
    }, [getVendors]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setVendors(data);
        } else if (!data && !loading) {
            // Fallback to mock data if no data and not loading (or initial render)
            // However, typically we want to show something while loading if possible, or just wait.
            // Given the requirement to "add mock data to show", ensuring it exists is key.
            // Since API also returns this mock data, we can just defer to store, but to be instant:
            setVendors(VENDORS_DATA as unknown as Vendor[]);
        }
    }, [data, loading]);

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
                id: vendors.length + 1, // Simple ID generation
                rating: 0,
                ...formData
            };
            setVendors([...vendors, newVendor]);
        }
        handleCloseModal();
        setIsModalOpen(false); // Ensure modal closes

        // If we were editing the selected vendor, update selection too
        if (selectedVendor && editingId === selectedVendor.id) {
            setSelectedVendor(prev => prev ? { ...prev, ...formData } : null);
        }
    };

    const handleDeleteClick = (id: string | number) => {
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
        let filtered = VENDORS_DATA as unknown as Vendor[];

        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(vendor => filters.status.includes(vendor.status));
        }

        if (filters.category && filters.category.length > 0) {
            filtered = filtered.filter(vendor => filters.category.includes(vendor.category));
        }

        setVendors(filtered);
    };

    if (error) {
        return (
            <div className='flex items-center justify-center h-64'>
                <p className='text-red-500'>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className='vendor-page-container'>
            <div className='px-6 pt-4 pb-4 shrink-0'>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <Filter
                        categories={filterCategories}
                        onFilterChange={handleFilterChange}
                    />
                    <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                        <Plus size={16} className="mr-2" /> Add Vendor
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    <DataTable
                        data={vendors}
                        columns={[
                            {
                                header: 'Business Name',
                                accessorKey: 'name' as const,
                                className: 'col-vendor-name py-3 px-4 text-left font-medium text-gray-900 dark:text-white'
                            },
                            {
                                header: 'Category',
                                accessorKey: 'category' as const,
                                className: 'col-vendor-category py-3 px-4 text-left text-gray-600 dark:text-gray-300'
                            },
                            {
                                header: 'Contact',
                                accessorKey: 'contactPerson' as const,
                                className: 'col-vendor-contact py-3 px-4 text-left text-gray-600 dark:text-gray-300'
                            },
                            {
                                header: 'Status',
                                className: 'col-vendor-status py-3 px-4 text-left',
                                render: (vendor) => (
                                    <span className={cn(
                                        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
                                        vendor.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            vendor.status === 'Inactive' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
                                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    )}>
                                        {vendor.status}
                                    </span>
                                )
                            },
                            {
                                header: 'Actions',
                                className: 'col-vendor-actions py-3 px-4 text-right',
                                render: (vendor) => (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleRowClick(vendor); }} className='p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors'>
                                            <Eye size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(vendor); }} className='p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors'>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(vendor.id); }} className='p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors'>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )
                            }
                        ]}
                        keyExtractor={(item) => item.id}
                        onRowClick={handleRowClick}
                        selectedId={selectedVendor?.id}
                    />
                </div>

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
            </div>

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
                />
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Vendor"
            />
        </div >
    );
};

export default VendorPage;
