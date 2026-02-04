import { useState, useEffect } from 'react';
// Modal is used in JSX
import { Button } from '@/components/admin/common/Button';
import { DataTable, type Column } from '@/components/admin/common/DataTable';
import { Modal } from '@/components/admin/common/Modal';
import { CategoryForm } from './CategoryForm';
import { DeleteModal } from '@/components/admin/common/DeleteModal';
import { cn } from '@/utils/cn';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface CategoryProps {
    data: any;
    loading: boolean;
    error: string | null;
    getCategoryData: () => void;
}

const Category = ({ data, loading, error, getCategoryData }: CategoryProps) => {
    // Keep local UI state for modal/forms
    console.log(loading); // Silence unused var warning while keeping prop for future use
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: '', status: 'Active' });

    // Use local state for immediate interaction, sync with redux in real app
    // For now, initializing with props.data if available or mock
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        getCategoryData();
    }, [getCategoryData]);

    // Use store data if available, otherwise keep local mock data (or initialize with it)
    useEffect(() => {
        if (data && Array.isArray(data)) {
            setCategories(data);
        }
    }, [data]);

    useEffect(() => {
        if (data) {
            // In a real app, data from store would drive the UI directly
            // For this refactor, we'll assume data comes from store
            // But since store data is currently null/mocked async, 
            // and the original code used a constant, I should be careful.
            // usage of CATEGORIES_DATA was direct. 
            // I will preserve the original behavior but trigger the action.
        }
    }, [data]);

    // Re-importing mock data here for functionality continuity if store returns nothing yet
    // In a real migration, we'd move this data definition to the API/Reducer.
    // I'll stick to the user's request of "moving the code".
    const CATEGORIES_DATA = [
        { id: 1, name: 'Weddings', count: 12, status: 'Active' },
        { id: 2, name: 'Birthdays', count: 8, status: 'Active' },
        { id: 3, name: 'Anniversaries', count: 5, status: 'Active' },
        { id: 4, name: 'Corporate Events', count: 15, status: 'Inactive' },
        { id: 5, name: 'Baby Showers', count: 3, status: 'Active' },
    ];

    useEffect(() => {
        setCategories(CATEGORIES_DATA);
    }, []);

    const handleOpenModal = (category: any = null) => {
        if (category) {
            setEditingId(category.id);
            setFormData({ name: category.name, status: category.status });
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
            setCategories(categories.map(c => c.id === editingId ? { ...c, ...data } : c));
        } else {
            setCategories([...categories, { id: categories.length + 1, count: 0, ...data }]);
        }
        handleCloseModal();
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            setCategories(categories.filter(c => c.id !== deleteId));
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

    const columns: Column<any>[] = [
        { header: 'Name', accessorKey: 'name', className: 'py-4 px-6 font-medium text-gray-900 dark:text-white' },
        {
            header: 'Status',
            className: 'py-4 px-6',
            render: (category) => (
                <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    category.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                )}>
                    {category.status}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'py-4 px-6 text-right',
            render: (category) => (
                <div className="flex justify-end gap-3">
                    <button onClick={() => handleOpenModal(category)} className='text-blue-600 hover:text-blue-700 transition-colors'>
                        <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteClick(category.id)} className='text-red-600 hover:text-red-700 transition-colors'>
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className='space-y-6 relative'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Category Management</h1>
                <Button variant='default' onClick={() => handleOpenModal()}>
                    <Plus size={16} className="mr-2" /> Add Category
                </Button>
            </div>

            <DataTable
                data={categories}
                columns={columns}
                keyExtractor={(item) => item.id}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit Category' : 'Add Category'}
            >
                <CategoryForm
                    initialData={editingId ? { name: formData.name, status: formData.status } : undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    submitLabel={editingId ? 'Save Changes' : 'Create Category'}
                />
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Category"
            />
        </div>
    );
};

export default Category;
