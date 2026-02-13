import { useState, useEffect } from 'react';
// Modal is used in JSX
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable'; // Refactored import
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { CategoryForm } from './CategoryForm';
import { CategoryDetails } from './CategoryDetails';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { cn } from '@/utils/cn';
import { Trash2, Edit2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import * as types from '@/features/category/store/action-types';

interface CategoryProps {
    data: any;
    loading: boolean;
    error: string | null;
    status: string;
    getCategoryData: () => void;
    createCategory: (data: any) => Promise<any>;
    deleteCategory: (id: number) => Promise<any>;
    updateCategory: (id: number, data: any) => Promise<any>;
    reorderCategory: (data: { id: number; newPosition: number }) => Promise<any>;
    resetStatus: () => void;
}

export interface CategoryType {
    id: number;
    name: string;
    count: number;
    isActive: boolean;
    description?: string;
    slug?: string;
    icon?: string;
    displayOrder?: number;
}

const Category = ({
    data,
    loading,
    error,
    status,
    getCategoryData,
    createCategory,
    deleteCategory,
    updateCategory,
    reorderCategory,
    resetStatus
}: CategoryProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', isActive: true });

    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const handleRowClick = (category: CategoryType) => {
        setSelectedCategory(category);
    };

    useEffect(() => {
        getCategoryData();
    }, [getCategoryData]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            const sortedData = [...data].sort((a: CategoryType, b: CategoryType) =>
                (a.displayOrder || 0) - (b.displayOrder || 0)
            );
            setCategories(sortedData);
        }
    }, [data]);

    useEffect(() => {
        if (status === types.CREATE_CATEGORY_SUCCESS) {
            toast.success('Category created successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.UPDATE_CATEGORY_SUCCESS) {
            toast.success('Category updated successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.DELETE_CATEGORY_SUCCESS) {
            toast.success('Category deleted successfully');
            resetStatus();
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } else if (status === 'FAILURE' && error) {
            toast.error(error || 'An error occurred');
        }
    }, [status, error, resetStatus]);


    const handleDragReorder = async (newOrder: CategoryType[], activeId: string | number, _overId: string | number) => {
        // Optimistically update the state
        setCategories(newOrder);

        // Find the item that was dragged (activeId)
        const movedItem = categories.find(c => String(c.id) === String(activeId));

        if (!movedItem) {
            console.error('Could not find moved item');
            return;
        }

        // Find the new index of the moved item in the new order
        const newIndex = newOrder.findIndex(c => String(c.id) === String(activeId));

        if (newIndex === -1) {
            console.error('Could not find item in new order');
            return;
        }

        try {
            await reorderCategory({
                id: movedItem.id,
                // Assuming backend expects 1-based position or display order logic
                newPosition: newIndex + 1
            });
            toast.success('Category order updated');
        } catch (error) {
            console.error('Failed to reorder', error);
            toast.error('Failed to reorder category');
            // Revert state if needed or just refetch
            getCategoryData();
        }
    };

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
        setActiveFilters(filters);
        let filtered = data || [];

        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter((cat: CategoryType) => {
                const isActiveString = cat.isActive ? 'true' : 'false';
                return filters.status.includes(isActiveString);
            });
        }



        setCategories(filtered);
    };

    const handleOpenModal = (category: CategoryType | null = null) => {
        if (category) {
            setEditingId(category.id);
            setFormData({ name: category.name, description: category.description || '', isActive: category.isActive });
        } else {
            setEditingId(null);
            setFormData({ name: '', description: '', isActive: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', description: '', isActive: true });
        setEditingId(null);
    };

    const handleFormSubmit = async (submittedData: { name: string; description: string; isActive: boolean }) => {
        if (editingId) {
            const categoryToUpdate = data?.find((c: CategoryType) => c.id === editingId);
            updateCategory(editingId, {
                name: submittedData.name,
                description: submittedData.description,
                slug: categoryToUpdate?.slug || "",
                icon: categoryToUpdate?.icon || "",
                displayOrder: categoryToUpdate?.displayOrder || 0,
                isActive: submittedData.isActive
            });
        } else {
            const maxOrder = data?.length > 0
                ? Math.max(...data.map((c: CategoryType) => c.displayOrder || 0))
                : 0;
            const nextOrder = maxOrder + 1;
            createCategory({
                name: submittedData.name,
                description: submittedData.description,
                displayOrder: nextOrder,
                isActive: submittedData.isActive
            });
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            deleteCategory(deleteId);
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
        <div className='category-page-container'>
            <div className='px-6 pt-4 pb-4 shrink-0'>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <Filter
                        categories={filterCategories}
                        onFilterChange={handleFilterChange}
                    />
                    <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                        <Plus size={2} />Add Category
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    <DataTable
                        data={categories}
                        columns={[
                            {
                                header: 'Name',
                                accessorKey: 'name',
                                className: 'w-[25%] min-w-[150px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white whitespace-nowrap'
                            },
                            {
                                header: 'Description',
                                accessorKey: 'description',
                                className: 'w-[30%] min-w-[200px] py-3 px-4 text-left',
                                render: (category) => (
                                    <div className="truncate max-w-[300px]" title={category.description}>
                                        {category.description || '-'}
                                    </div>
                                )
                            },

                            {
                                header: 'Status',
                                className: 'w-[15%] min-w-[120px] py-3 px-4 text-left',
                                render: (category) => (
                                    <span className={cn(
                                        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
                                        category.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    )}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                )
                            },
                            {
                                header: 'Actions',
                                className: 'w-[20%] min-w-[100px] py-3 px-4 text-right',
                                render: (category) => (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(category); }} className='p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors'>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(category.id); }} className='p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors'>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )
                            }
                        ]}
                        keyExtractor={(item) => item.id}
                        onRowClick={handleRowClick}
                        selectedId={selectedCategory?.id}
                        loading={loading && (!categories || categories.length === 0)}
                        onReorder={handleDragReorder}
                        draggable={true}
                    />
                </div>

                <SidePanel
                    isOpen={!!selectedCategory}
                    onClose={() => setSelectedCategory(null)}
                    title={selectedCategory?.name || 'Category Details'}
                    variant="inline"
                    className="border-l border-gray-200 dark:border-gray-800"
                >
                    {selectedCategory && (
                        <CategoryDetails
                            category={selectedCategory}
                            onEdit={() => handleOpenModal(selectedCategory)}
                        />
                    )}
                </SidePanel>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit Category' : 'Add Category'}
            >
                <CategoryForm
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
                itemType="Category"
                title='Delete Category'
                description='This is will delete the category from the system.Are you sure?'
            />
        </div>
    );
};

export default Category;
