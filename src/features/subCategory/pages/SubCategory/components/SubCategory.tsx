import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable'; // Refactored import
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { SubCategoryForm } from './SubCategoryForm';
import { SubCategoryDetails } from './SubCategoryDetails';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { cn } from '@/utils/cn';
import { Trash2, Edit2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import * as types from '@/features/subCategory/store/action-types';

interface SubCategoryProps {
    data: any;
    loading: boolean;
    error: string | null;
    status: string;
    getSubCategoryData: () => void;
    categories: any[];
    getCategoryData: () => void;
    createSubCategory: (data: any) => void;
    updateSubCategory: (id: number, data: any) => void;
    deleteSubCategory: (id: number) => void;
    resetStatus: () => void;
}

export interface SubCategoryType {
    id: number;
    name: string;
    description?: string;
    count: number;
    isActive: boolean;
    categoryId?: number;
}

const SubCategory = ({
    data,
    loading,
    error,
    status,
    getSubCategoryData,
    categories,
    getCategoryData,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    resetStatus
}: SubCategoryProps) => {
    // Keep loading for potential future use or debugging
    console.log(loading);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState<{ name: string; description: string; isActive: boolean; categoryId?: number }>({ name: '', description: '', isActive: true });

    // const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryType | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const handleRowClick = (subCategory: SubCategoryType) => {
        setSelectedSubCategory(subCategory);
    };

    useEffect(() => {
        getSubCategoryData();
        getCategoryData();
    }, [getSubCategoryData, getCategoryData]);

    useEffect(() => {
        if (status === types.CREATE_SUB_CATEGORY_SUCCESS) {
            toast.success('Sub Category created successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.UPDATE_SUB_CATEGORY_SUCCESS) {
            toast.success('Sub Category updated successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.DELETE_SUB_CATEGORY_SUCCESS) {
            toast.success('Sub Category deleted successfully');
            resetStatus();
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } else if (status === 'FAILURE' && error) {
            console.error(error);
        }
    }, [status, error, resetStatus]);



    // Filter configuration
    const categoryOptions = categories?.map(cat => ({
        id: String(cat.id),
        label: cat.name,
        value: String(cat.id)
    })) || [];

    const filterCategories: FilterCategory[] = [
        {
            id: 'categoryId',
            name: 'Category',
            options: categoryOptions
        },
        {
            id: 'status',
            name: 'Status',
            options: [
                { id: '1', label: 'Active', value: 'true' },
                { id: '2', label: 'Inactive', value: 'false' },
            ]
        },
    ];

    const handleFilterChange = (filters: Record<string, string[]>) => {
        console.log('Filters changed:', filters);
        setActiveFilters(filters);
    };

    // Apply filters to data
    let filteredSubCategories = Array.isArray(data) ? data : [];

    // Filter by Status
    if (activeFilters.status && activeFilters.status.length > 0) {
        filteredSubCategories = filteredSubCategories.filter((sub: SubCategoryType) => {
            const statusStr = sub.isActive ? 'true' : 'false';
            return activeFilters.status.includes(statusStr);
        });
    }

    // Filter by Category
    if (activeFilters.categoryId && activeFilters.categoryId.length > 0) {
        filteredSubCategories = filteredSubCategories.filter((sub: SubCategoryType) =>
            sub.categoryId && activeFilters.categoryId.includes(String(sub.categoryId))
        );
    }

    const handleOpenModal = (subCategory: SubCategoryType | null = null) => {
        if (subCategory) {
            setEditingId(subCategory.id);
            setFormData({
                name: subCategory.name,
                description: subCategory.description || '',
                isActive: subCategory.isActive,
                categoryId: subCategory.categoryId
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', description: '', isActive: true, categoryId: undefined });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', description: '', isActive: true, categoryId: undefined });
        setEditingId(null);
    };

    const handleFormSubmit = (submitData: { name: string; description: string; isActive: boolean; categoryId: number }) => {
        if (editingId) {
            updateSubCategory(editingId, submitData);
        } else {
            createSubCategory(submitData);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            deleteSubCategory(deleteId);
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
                        <Plus size={6} className="mr-2" />Add Sub Category
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    <DataTable
                        data={filteredSubCategories}
                        loading={loading && (!filteredSubCategories || filteredSubCategories.length === 0)}
                        columns={[
                            {
                                header: 'Name',
                                accessorKey: 'name' as const,
                                className: 'w-[25%] min-w-[200px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white whitespace-nowrap'
                            },
                            {
                                header: 'Description',
                                accessorKey: 'description' as const,
                                className: 'w-[30%] min-w-[200px] py-3 px-4 text-left text-gray-600 dark:text-gray-400',
                                render: (subCategory) => (
                                    <span className="truncate block max-w-[300px]" title={subCategory.description}>
                                        {subCategory.description || '-'}
                                    </span>
                                )
                            },
                            {
                                header: 'Category',
                                className: 'w-[20%] min-w-[150px] py-3 px-4 text-left',
                                render: (subCategory) => {
                                    const category = categories?.find(c => c.id === subCategory.categoryId);
                                    return (
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {category ? category.name : '-'}
                                        </span>
                                    );
                                }
                            },
                            {
                                header: 'Status',
                                className: 'w-[15%] min-w-[100px] py-3 px-4 text-left',
                                render: (subCategory) => (
                                    <span className={cn(
                                        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
                                        subCategory.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    )}>
                                        {subCategory.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                )
                            },
                            {
                                header: 'Actions',
                                className: 'w-[10%] min-w-[100px] py-3 px-4 text-right',
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
                    initialData={editingId ? {
                        name: formData.name,
                        description: formData.description,
                        isActive: formData.isActive,
                        categoryId: formData.categoryId
                    } : undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    submitLabel={editingId ? 'Update' : 'Save'}
                    categories={categories}
                    loading={loading}
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
