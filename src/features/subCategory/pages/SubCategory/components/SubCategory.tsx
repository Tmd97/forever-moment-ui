import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { SubCategoryForm } from './SubCategoryForm';
import { SubCategoryDetails } from './SubCategoryDetails';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { cn } from '@/utils/cn';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface SubCategoryProps {
    data: any;
    loading: boolean;
    error: string | null;
    getSubCategoryData: () => void;
}

export interface SubCategoryType {
    id: number;
    name: string;
    count: number;
    status: string;
}

const SubCategory = ({ data, loading, error, getSubCategoryData }: SubCategoryProps) => {
    console.log(loading);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: '', status: 'Active' });

    const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryType | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const handleRowClick = (subCategory: SubCategoryType) => {
        setSelectedSubCategory(subCategory);
    };

    useEffect(() => {
        getSubCategoryData();
    }, [getSubCategoryData]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setSubCategories(data);
        }
    }, [data]);

    const SUB_CATEGORIES_DATA = [
        { id: 1, name: 'Indian Wedding', count: 5, status: 'Active' },
        { id: 2, name: 'Kids Birthday', count: 3, status: 'Active' },
        { id: 3, name: 'Silver Jubilee', count: 2, status: 'Active' },
        { id: 4, name: 'Tech Conference', count: 10, status: 'Inactive' },
        { id: 5, name: 'Baby Shower Games', count: 1, status: 'Active' },
    ];

    useEffect(() => {
        setSubCategories(SUB_CATEGORIES_DATA);
    }, []);

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
    ];

    const handleFilterChange = (filters: Record<string, string[]>) => {
        setActiveFilters(filters);
        let filtered = SUB_CATEGORIES_DATA;

        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(sub => filters.status.includes(sub.status));
        }

        setSubCategories(filtered);
    };

    const handleOpenModal = (subCategory: SubCategoryType | null = null) => {
        if (subCategory) {
            setEditingId(subCategory.id);
            setFormData({ name: subCategory.name, status: subCategory.status });
        } else {
            setEditingId(null);
            setFormData({ name: '', status: 'Active' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', status: 'Active' });
        setEditingId(null);
    };

    const handleFormSubmit = (data: { name: string; status: string }) => {
        if (editingId) {
            setSubCategories(subCategories.map(c => c.id === editingId ? { ...c, ...data } : c));
        } else {
            setSubCategories([...subCategories, { id: subCategories.length + 1, count: 0, ...data }]);
        }
        handleCloseModal();
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            setSubCategories(subCategories.filter(c => c.id !== deleteId));
            setDeleteId(null);
        }
    };

    if (error) {
        return (
            <div className='flex items-center justify-center h-64'>
                <p className='text-red-500'>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className='subcategory-page-container'>
            <div className='px-6 pt-4 pb-4 shrink-0'>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <Filter
                        categories={filterCategories}
                        onFilterChange={handleFilterChange}
                    />
                    <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                        <Plus size={16} className="mr-2" /> Add Sub Category
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    <DataTable
                        data={subCategories}
                        columns={[
                            {
                                header: 'Name',
                                accessorKey: 'name' as const,
                                className: 'w-[60%] min-w-[200px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white whitespace-nowrap'
                            },
                            {
                                header: 'Status',
                                className: 'w-[20%] min-w-[120px] py-3 px-4 text-left',
                                render: (subCategory) => (
                                    <span className={cn(
                                        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
                                        subCategory.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    )}>
                                        {subCategory.status}
                                    </span>
                                )
                            },
                            {
                                header: 'Actions',
                                className: 'w-[20%] min-w-[100px] py-3 px-4 text-right',
                                render: (subCategory) => (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(subCategory); }} className='p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors'>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(subCategory.id); }} className='p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors'>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )
                            }
                        ]}
                        keyExtractor={(item) => item.id}
                        onRowClick={handleRowClick}
                        selectedId={selectedSubCategory?.id}
                    />
                </div>

                <SidePanel
                    isOpen={!!selectedSubCategory}
                    onClose={() => setSelectedSubCategory(null)}
                    title={selectedSubCategory?.name || 'Sub Category Details'}
                    variant="inline"
                    className="border-l border-gray-200 dark:border-gray-800"
                >
                    {selectedSubCategory && (
                        <SubCategoryDetails
                            subCategory={selectedSubCategory}
                            onEdit={() => handleOpenModal(selectedSubCategory)}
                        />
                    )}
                </SidePanel>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit Sub Category' : 'Add Sub Category'}
            >
                <SubCategoryForm
                    initialData={editingId ? { name: formData.name, status: formData.status } : undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    submitLabel={editingId ? 'Save Changes' : 'Create Sub Category'}
                />
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Sub Category"
            />
        </div>
    );
};

export default SubCategory;
