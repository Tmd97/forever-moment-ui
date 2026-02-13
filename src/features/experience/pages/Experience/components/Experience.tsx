import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable'; // Refactored import
import { Modal } from '@/components/common/Modal';
import { EXPERIENCES_DATA } from '@/features/data/mockData';
import { SidePanel } from '@/components/common/SidePanel';
import { ExperienceForm } from './ExperienceForm';
import { ExperienceDetails } from './ExperienceDetails';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { cn } from '@/utils/cn';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface ExperienceProps {
    data: any;
    loading: boolean;
    error: string | null;
    getExperienceData: () => void;
}

const Experience = ({ data, loading, error, getExperienceData }: ExperienceProps) => {
    // Silence unused vars for now
    console.log(data, loading, error, getExperienceData);

    // Local state
    const [experiences, setExperiences] = useState(EXPERIENCES_DATA);
    const [selectedExperience, setSelectedExperience] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ title: '', category: '', price: '', status: 'Active' });
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const handleRowClick = (exp: any) => {
        setSelectedExperience(exp);
    };

    const handleOpenModal = (exp: any = null) => {
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

    const handleFormSubmit = (data: { title: string; category: string; price: string; status: string }) => {
        if (editingId) {
            setExperiences(experiences.map(e => e.id === editingId ? { ...e, ...data } : e));
        } else {
            setExperiences([...experiences, { id: experiences.length + 1, ...data }]);
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
        let filtered = EXPERIENCES_DATA;

        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(exp => filters.status.includes(exp.status));
        }

        if (filters.price && filters.price.length > 0) {
            filtered = filtered.filter(exp => {
                const price = parseFloat(exp.price.replace(/[^0-9.]/g, ''));
                return filters.price.some(range => {
                    if (range === '0-10000') return price < 10000;
                    if (range === '10000-25000') return price >= 10000 && price <= 25000;
                    if (range === '25000+') return price > 25000;
                    return false;
                });
            });
        }

        setExperiences(filtered);
    };


    return (
        <div className='experience-page-container'>
            <div className='px-6 pt-4 pb-4 shrink-0'>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <Filter
                        categories={filterCategories}
                        onFilterChange={handleFilterChange}
                    />
                    <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                        <Plus size={16} className="mr-2" /> Add Experience
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex-1 min-w-0 overflow-hidden">
                    <DataTable
                        data={experiences}
                        loading={loading && (!experiences || experiences.length === 0)}
                        columns={[
                            {
                                header: 'Title',
                                accessorKey: 'title',
                                className: 'w-[40%] min-w-[200px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white whitespace-nowrap'
                            },
                            {
                                header: 'Category',
                                accessorKey: 'category',
                                className: 'w-[20%] min-w-[120px] py-3 px-4 text-left text-sm text-gray-700 dark:text-gray-300'
                            },
                            {
                                header: 'Price',
                                accessorKey: 'price',
                                className: 'w-[15%] min-w-[100px] py-3 px-4 text-left text-sm text-gray-700 dark:text-gray-300'
                            },
                            {
                                header: 'Status',
                                className: 'w-[15%] min-w-[100px] py-3 px-4 text-left',
                                render: (exp) => (
                                    <span className={cn(
                                        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
                                        exp.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    )}>
                                        {exp.status}
                                    </span>
                                )
                            },
                            {
                                header: 'Actions',
                                className: 'w-[10%] min-w-[100px] py-3 px-4 text-right',
                                render: (exp) => (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(exp); }} className='p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors'>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(exp.id); }} className='p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors'>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )
                            }
                        ]}
                        keyExtractor={(item) => item.id}
                        onRowClick={handleRowClick}
                        selectedId={selectedExperience?.id}
                    />
                </div>

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
            </div>

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

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Experience"
            />
        </div>
    );
};

export default Experience;
