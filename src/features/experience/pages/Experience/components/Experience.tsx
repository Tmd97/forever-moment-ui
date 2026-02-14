import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { ExperienceForm } from './ExperienceForm';
import { ExperienceDetails } from './ExperienceDetails';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { CrudPageLayout } from '@/components/common/CrudPageLayout';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export interface ExperienceType {
    id: number;
    title: string;
    category: string;
    price: string;
    status: string;
}

interface ExperienceProps {
    data: ExperienceType[] | null;
    loading: boolean;
    error: string | null;
    getExperienceData: () => void;
}

const Experience = ({ data, loading, error, getExperienceData }: ExperienceProps) => {
    // TODO: Remove mock data once real API is integrated
    const [experiences, setExperiences] = useState<ExperienceType[]>([
        { id: 1, title: 'Luxury Wedding Package', category: 'Wedding', price: '₹5,000', status: 'Active' },
        { id: 2, title: 'Corporate Gala Setup', category: 'Corporate', price: '₹12,000', status: 'Active' },
        { id: 3, title: 'Intimate Birthday Bash', category: 'Birthday', price: '₹2,500', status: 'Active' },
        { id: 4, title: 'Anniversary Celebration', category: 'Anniversary', price: '₹8,000', status: 'Inactive' },
        { id: 5, title: 'Baby Shower Delight', category: 'Baby Shower', price: '₹4,500', status: 'Active' },
    ]);
    const [selectedExperience, setSelectedExperience] = useState<ExperienceType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ title: '', category: '', price: '', status: 'Active' });
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    useEffect(() => {
        getExperienceData();
    }, [getExperienceData]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setExperiences(data);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleRowClick = (exp: ExperienceType) => {
        setSelectedExperience(exp);
    };

    const handleOpenModal = (exp: ExperienceType | null = null) => {
        if (exp) {
            setEditingId(exp.id);
            setFormData({ title: exp.title, category: exp.category, price: exp.price, status: exp.status });
        } else {
            setEditingId(null);
            setFormData({ title: '', category: '', price: '', status: 'Active' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ title: '', category: '', price: '', status: 'Active' });
        setEditingId(null);
    };

    const handleFormSubmit = (submitData: { title: string; category: string; price: string; status: string }) => {
        if (editingId) {
            setExperiences(experiences.map(e => e.id === editingId ? { ...e, ...submitData } : e));
        } else {
            setExperiences([...experiences, { id: experiences.length + 1, ...submitData }]);
        }
        handleCloseModal();
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            setExperiences(experiences.filter(e => e.id !== deleteId));
            setDeleteId(null);
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
    let filteredExperiences = experiences;
    if (activeFilters.status && activeFilters.status.length > 0) {
        filteredExperiences = filteredExperiences.filter(exp => activeFilters.status.includes(exp.status));
    }
    if (activeFilters.price && activeFilters.price.length > 0) {
        filteredExperiences = filteredExperiences.filter(exp => {
            const price = parseFloat(exp.price.replace(/[^0-9.]/g, ''));
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
                            accessorKey: 'title' as const,
                        },
                        {
                            header: 'Category',
                            accessorKey: 'category' as const,
                        },
                        {
                            header: 'Price',
                            accessorKey: 'price' as const,
                        },
                        {
                            header: 'Status',
                            render: (exp) => (
                                <StatusBadge status={exp.status} />
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
                    title={selectedExperience?.title || 'Experience Details'}
                    variant="inline"
                    className="border-l border-gray-200 dark:border-gray-800"
                >
                    {selectedExperience && (
                        <ExperienceDetails
                            experience={selectedExperience}
                            onEdit={() => handleOpenModal(selectedExperience)}
                        />
                    )}
                </SidePanel>
            }
            modalSlot={
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingId ? 'Edit Experience' : 'Add Experience'}
                >
                    <ExperienceForm
                        initialData={editingId ? {
                            title: formData.title,
                            category: formData.category,
                            price: formData.price,
                            status: formData.status
                        } : undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCloseModal}
                        submitLabel={editingId ? 'Save Changes' : 'Create Experience'}
                        isLoading={loading}
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
