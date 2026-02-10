import { useState, useEffect } from 'react';
// Modal is used in JSX
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { CategoryForm } from './CategoryForm';
import { CategoryDetails } from './CategoryDetails';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { cn } from '@/utils/cn';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface CategoryProps {
    data: any;
    loading: boolean;
    error: string | null;
    getCategoryData: () => void;
    createCategory: (data: any) => Promise<any>;
    deleteCategory: (id: number) => Promise<any>;
    updateCategory: (id: number, data: any) => Promise<any>;
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

const Category = ({ data, loading, error, getCategoryData, createCategory, deleteCategory, updateCategory }: CategoryProps) => {
    // Keep local UI state for modal/forms
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: '', isActive: true });

    // Use local state for immediate interaction, sync with redux in real app
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    // ... existing filter logic ...

    const handleRowClick = (category: CategoryType) => {
        setSelectedCategory(category);
    };

    useEffect(() => {
        getCategoryData();
    }, [getCategoryData]);

    // Use store data if available
    useEffect(() => {
        if (data && Array.isArray(data)) {
            setCategories(data);
        }
    }, [data]);

    // Filter configuration
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
        // Apply filters to categories
        let filtered = data || []; // Use API data as source

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
            setFormData({ name: category.name, isActive: category.isActive });
        } else {
            setEditingId(null);
            setFormData({ name: '', isActive: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', isActive: true });
        setEditingId(null);
    };

    const handleFormSubmit = async (data: { name: string; isActive: boolean }) => {
        if (editingId) {
            try {
                // Update API call
                await updateCategory(editingId, {
                    name: data.name,
                    description: selectedCategory?.description || "", // Preserve existing or default
                    slug: selectedCategory?.slug || "", // Preserve existing or default
                    icon: selectedCategory?.icon || "", // Preserve existing or default
                    displayOrder: selectedCategory?.displayOrder || 0, // Preserve existing or default
                    isActive: data.isActive
                });
                handleCloseModal();
            } catch (err) {
                console.error("Failed to update category", err);
            }
        } else {
            try {
                // Call create API
                await createCategory({
                    name: data.name,
                    description: "",
                    displayOrder: 0,
                    isActive: data.isActive
                });
                handleCloseModal();
            } catch (err) {
                console.error("Failed to create category", err);
                // Do not close modal on error
            }
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                await deleteCategory(deleteId);
                setDeleteId(null);
                setIsDeleteModalOpen(false);
            } catch (error) {
                console.error("Failed to delete category", error);
            }
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
                        <Plus size={12} />Add Category
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
                                accessorKey: 'name' as const,
                                className: 'w-[60%] min-w-[200px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white whitespace-nowrap'
                            },
                            {
                                header: 'Status',
                                className: 'w-[20%] min-w-[120px] py-3 px-4 text-left',
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
                        loading={loading}
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
            />
        </div >
    );
};

export default Category;
