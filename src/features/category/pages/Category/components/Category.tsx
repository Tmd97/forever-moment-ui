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
import { CATEGORIES_DATA } from '../../../../data/mockData';

interface CategoryProps {
    data: any;
    loading: boolean;
    error: string | null;
    getCategoryData: () => void;
}

export interface CategoryType {
    id: number;
    name: string;
    count: number;
    status: string;
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
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const handleRowClick = (category: CategoryType) => {
        setSelectedCategory(category);
    };

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
    useEffect(() => {
        // Use shared mock data if no prop data is provided
        if ((!data || data.length === 0) && !loading) {
            setCategories(CATEGORIES_DATA);
        }
    }, [data, loading]);

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
            id: 'count',
            name: 'Event Count',
            options: [
                { id: '1', label: '0-5 events', value: '0-5' },
                { id: '2', label: '6-10 events', value: '6-10' },
                { id: '3', label: '11+ events', value: '11+' },
            ]
        },
    ];

    const handleFilterChange = (filters: Record<string, string[]>) => {
        setActiveFilters(filters);
        // Apply filters to categories
        let filtered = CATEGORIES_DATA;

        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(cat => filters.status.includes(cat.status));
        }

        if (filters.count && filters.count.length > 0) {
            filtered = filtered.filter(cat => {
                const count = cat.count;
                return filters.count.some(range => {
                    if (range === '0-5') return count >= 0 && count <= 5;
                    if (range === '6-10') return count >= 6 && count <= 10;
                    if (range === '11+') return count >= 11;
                    return false;
                });
            });
        }

        setCategories(filtered);
    };

    const handleOpenModal = (category: CategoryType | null = null) => {
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


    return (
        <div className='category-page-container'>
            <div className='px-6 pt-4 pb-4 shrink-0'>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <Filter
                        categories={filterCategories}
                        onFilterChange={handleFilterChange}
                    />
                    <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                        <Plus size={16} className="mr-2" /> Add Category
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
                                        category.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    )}>
                                        {category.status}
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
        </div >
    );
};

export default Category;
