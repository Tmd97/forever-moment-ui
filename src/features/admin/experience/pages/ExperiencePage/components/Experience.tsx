import { useState } from 'react';
import { Button } from '@/components/admin/common/Button';
import { DataTable, type Column } from '@/components/admin/common/DataTable';
import { Modal } from '@/components/admin/common/Modal';
import { EXPERIENCES_DATA } from '@/features/admin/data/mockData';
import { ExperienceForm } from './ExperienceForm';
import { DeleteModal } from '@/components/admin/common/DeleteModal';
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ title: '', category: '', price: '', status: 'Active' });

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

    const columns: Column<any>[] = [
        { header: 'Title', accessorKey: 'title', className: 'py-4 px-6 font-medium text-gray-900 dark:text-white' },
        { header: 'Category', accessorKey: 'category', className: 'py-4 px-6 text-sm text-gray-700 dark:text-gray-300' },
        { header: 'Price', accessorKey: 'price', className: 'py-4 px-6 text-sm text-gray-700 dark:text-gray-300' },
        {
            header: 'Status',
            className: 'py-4 px-6',
            render: (exp) => (
                <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    exp.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                )}>
                    {exp.status}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'py-4 px-6 text-right',
            render: (exp) => (
                <div className="flex justify-end gap-3">
                    <button onClick={() => handleOpenModal(exp)} className='text-blue-600 hover:text-blue-700 transition-colors'>
                        <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteClick(exp.id)} className='text-red-600 hover:text-red-700 transition-colors'>
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className='space-y-6 relative'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Experience Management</h1>
                <Button variant='default' onClick={() => handleOpenModal()}>
                    <Plus size={16} className="mr-2" /> Add Experience
                </Button>
            </div>

            <DataTable
                data={experiences}
                columns={columns}
                keyExtractor={(item) => item.id}
            />

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
