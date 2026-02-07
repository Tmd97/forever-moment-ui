import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { RoleForm } from './RoleForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { cn } from '@/utils/cn';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface RolesProps {
    data: any;
    loading: boolean;
    error: string | null;
    getRolesData: () => void;
}

export interface RoleType {
    id: number;
    name: string;
    description: string;
    status: string;
}

// Temporary mock data
const ROLES_DATA: RoleType[] = [
    { id: 1, name: 'Admin', description: 'Full system access', status: 'Active' },
    { id: 2, name: 'Manager', description: 'Limited management access', status: 'Active' },
    { id: 3, name: 'User', description: 'Standard user access', status: 'Active' },
];

const Roles = ({ data, loading, error, getRolesData }: RolesProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', status: 'Active' });

    // Local state
    const [roles, setRoles] = useState<RoleType[]>(ROLES_DATA);
    const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const handleRowClick = (role: RoleType) => {
        setSelectedRole(role);
    };

    useEffect(() => {
        getRolesData();
    }, [getRolesData]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setRoles(data);
        }
    }, [data]);

    const filterCategories: FilterCategory[] = [
        {
            id: 'status',
            name: 'Status',
            options: [
                { id: '1', label: 'Active', value: 'Active' },
                { id: '2', label: 'Inactive', value: 'Inactive' },
            ]
        }
    ];

    const handleFilterChange = (filters: Record<string, string[]>) => {
        setActiveFilters(filters);
        let filtered = ROLES_DATA;

        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(role => filters.status.includes(role.status));
        }

        setRoles(filtered);
    };

    const handleOpenModal = (role: RoleType | null = null) => {
        if (role) {
            setEditingId(role.id);
            setFormData({ name: role.name, description: role.description, status: role.status });
        } else {
            setEditingId(null);
            setFormData({ name: '', description: '', status: 'Active' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', description: '', status: 'Active' });
        setEditingId(null);
    };

    const handleFormSubmit = (data: { name: string; description: string; status: string }) => {
        if (editingId) {
            setRoles(roles.map(r => r.id === editingId ? { ...r, ...data } : r));
        } else {
            setRoles([...roles, { id: roles.length + 1, ...data }]);
        }
        handleCloseModal();
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            setRoles(roles.filter(r => r.id !== deleteId));
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
        <div className='role-page-container'>
            <div className='px-6 pt-4 pb-4 shrink-0'>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <Filter
                        categories={filterCategories}
                        onFilterChange={handleFilterChange}
                    />
                    <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                        <Plus size={16} className="mr-2" /> Add Role
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    <DataTable
                        data={roles}
                        columns={[
                            {
                                header: 'Role Name',
                                accessorKey: 'name' as const,
                                className: 'w-[30%] min-w-[200px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white whitespace-nowrap'
                            },
                            {
                                header: 'Description',
                                accessorKey: 'description' as const,
                                className: 'w-[40%] min-w-[200px] py-3 px-4 text-left text-gray-500 dark:text-gray-400'
                            },
                            {
                                header: 'Status',
                                className: 'w-[20%] min-w-[100px] py-3 px-4 text-left',
                                render: (role) => (
                                    <span className={cn(
                                        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
                                        role.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    )}>
                                        {role.status}
                                    </span>
                                )
                            },
                            {
                                header: 'Actions',
                                className: 'w-[10%] min-w-[100px] py-3 px-4 text-right',
                                render: (role) => (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(role); }} className='p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors'>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(role.id); }} className='p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors'>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )
                            }
                        ]}
                        keyExtractor={(item) => item.id}
                        onRowClick={handleRowClick}
                        selectedId={selectedRole?.id}
                    />
                </div>

                <SidePanel
                    isOpen={!!selectedRole}
                    onClose={() => setSelectedRole(null)}
                    title={selectedRole?.name || 'Role Details'}
                    variant="inline"
                    className="border-l border-gray-200 dark:border-gray-800"
                >
                    {selectedRole && (
                        <div className="p-4">
                            <h3 className="text-lg font-bold">{selectedRole.name}</h3>
                            <p className="text-gray-600 mt-2">{selectedRole.description}</p>
                            <div className="mt-4">
                                <p><strong>Status:</strong> {selectedRole.status}</p>
                            </div>
                            <Button
                                variant="outline"
                                className="mt-4 w-full"
                                onClick={() => handleOpenModal(selectedRole)}
                            >
                                Edit Role
                            </Button>
                        </div>
                    )}
                </SidePanel>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit Role' : 'Add Role'}
            >
                <RoleForm
                    initialData={editingId ? { name: formData.name, description: formData.description, status: formData.status } : undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    submitLabel={editingId ? 'Save Changes' : 'Create Role'}
                />
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Role"
                description="Are you sure you want to delete this role? This action cannot be undone."
            />
        </div>
    );
};

export default Roles;
