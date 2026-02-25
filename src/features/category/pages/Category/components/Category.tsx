import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { CategoryForm } from './CategoryForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { CategorySplitView } from './CategorySplitView';
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

    // Keep selectedCategory up to date when categories array changes
    useEffect(() => {
        if (selectedCategory) {
            const updated = categories.find(c => c.id === selectedCategory.id);
            if (updated && JSON.stringify(updated) !== JSON.stringify(selectedCategory)) {
                setSelectedCategory(updated);
            }
        }
    }, [categories, selectedCategory]);

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
        }
    }, [status, resetStatus]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);


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

    // Removed filter logic from parent as it is handled by the split view inline

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




    return (
        <div className="category-page-container w-full h-full flex flex-col">
            <CategorySplitView
                categories={categories}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                loading={loading}
                handleDragReorder={handleDragReorder}
                updateCategory={updateCategory}
            />

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
