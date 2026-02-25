import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { SubCategoryForm } from './SubCategoryForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { SubCategorySplitView } from './SubCategorySplitView';
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState<{ name: string; description: string; isActive: boolean; categoryId?: number }>({ name: '', description: '', isActive: true });

    // const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryType | null>(null);

    useEffect(() => {
        getSubCategoryData();
        getCategoryData();
    }, [getSubCategoryData, getCategoryData]);

    // Keep selectedSubCategory up to date when data array changes
    useEffect(() => {
        if (selectedSubCategory && data) {
            const updated = data.find((sc: SubCategoryType) => sc.id === selectedSubCategory.id);
            if (updated && JSON.stringify(updated) !== JSON.stringify(selectedSubCategory)) {
                setSelectedSubCategory(updated);
            }
        }
    }, [data, selectedSubCategory]);

    useEffect(() => {
        if (status === types.CREATE_SUB_CATEGORY_SUCCESS) {
            toast.success('Sub Category created successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.UPDATE_SUB_CATEGORY_SUCCESS) {
            toast.success('Sub Category updated successfully');
            resetStatus();
            getSubCategoryData();
            handleCloseModal();
        } else if (status === types.DELETE_SUB_CATEGORY_SUCCESS) {
            toast.success('Sub Category deleted successfully');
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



    // Filter configuration
    // Filter array logic moved to SubCategorySplitView

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



    return (
        <div className="subcategory-page-container w-full h-full flex flex-col">
            <SubCategorySplitView
                subCategories={data}
                categories={categories}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedSubCategory={selectedSubCategory}
                setSelectedSubCategory={setSelectedSubCategory}
                loading={loading}
                updateSubCategory={updateSubCategory}
            />

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
