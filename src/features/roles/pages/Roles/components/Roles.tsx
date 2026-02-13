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
import toast from 'react-hot-toast';
import * as types from '@/features/roles/store/action-types';

interface RolesProps {
    data: any;
    loading: boolean;
    error: string | null;
    status: string;
    getRolesData: () => void;
    createRole: (data: any) => void;
    updateRole: (id: number, data: any) => void;
    deleteRole: (id: number) => void;
    resetStatus: () => void;
}

export interface RoleType {
    id: number;
    roleName: string;
    description: string;
    isActive: boolean;
    permissionLevel?: number;
    systemRole?: boolean;
}

const Roles = ({
    data,
    loading,
    error,
    status,
    getRolesData,
    createRole,
    updateRole,
    deleteRole,
    resetStatus
}: RolesProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ roleName: '', description: '', isActive: true });

    const [roles, setRoles] = useState<RoleType[]>([]);
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

    useEffect(() => {
        if (status === types.CREATE_ROLE_SUCCESS) {
            toast.success('Role created successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.UPDATE_ROLE_SUCCESS) {
            toast.success('Role updated successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.DELETE_ROLE_SUCCESS) {
            toast.success('Role deleted successfully');
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
            filtered = filtered.filter((role: RoleType) => {
                const isActiveString = role.isActive ? 'true' : 'false';
                return filters.status.includes(isActiveString);
            });
        }

        setRoles(filtered);
    };

    const handleOpenModal = (role: RoleType | null = null) => {
        if (role) {
            setEditingId(role.id);
            setFormData({
                roleName: role.roleName,
                description: role.description,
                isActive: role.isActive,
            });
        } else {
            setEditingId(null);
            setFormData({ roleName: '', description: '', isActive: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ roleName: '', description: '', isActive: true });
        setEditingId(null);
    };

    const handleFormSubmit = (submittedData: { roleName: string; description: string; isActive: boolean }) => {
        if (editingId) {
            const existingRole = roles.find(r => r.id === editingId);
            const payload = {
                ...submittedData,
                active: submittedData.isActive,
                permissionLevel: existingRole?.permissionLevel || 0,
                systemRole: existingRole?.systemRole || false
            };
            updateRole(editingId, payload);
        } else {
            const payload = {
                ...submittedData,
                active: submittedData.isActive,
                permissionLevel: 0,
                systemRole: true
            };
            createRole(payload);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            deleteRole(deleteId);
        }
    };



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
                        loading={loading && (!roles || roles.length === 0)}
                        columns={[
                            {
                                header: 'Role Name',
                                accessorKey: 'roleName' as const,
                                className: 'w-[30%] min-w-[200px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white whitespace-nowrap'
                            },
                            {
                                header: 'Description',
                                accessorKey: 'description' as const,
                                className: 'w-[40%] min-w-[200px] py-3 px-4 text-left text-gray-600 dark:text-gray-400',
                                render: (role) => (
                                    <div className="truncate max-w-[300px]" title={role.description}>
                                        {role.description || '-'}
                                    </div>
                                )
                            },
                            {
                                header: 'Status',
                                className: 'w-[20%] min-w-[100px] py-3 px-4 text-left',
                                render: (role) => (
                                    <span className={cn(
                                        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
                                        role.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    )}>
                                        {role.isActive ? 'Active' : 'Inactive'}
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
                    title={selectedRole?.roleName || 'Role Details'}
                    variant="inline"
                    className="border-l border-gray-200 dark:border-gray-800"
                >
                    {selectedRole && (
                        <div className="p-4">
                            <h3 className="text-lg font-bold">{selectedRole.roleName}</h3>
                            <p className="text-gray-600 mt-2">{selectedRole.description}</p>
                            <div className="mt-4">
                                <p><strong>Status:</strong> {selectedRole.isActive ? 'Active' : 'Inactive'}</p>
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
                    initialData={editingId ? {
                        roleName: formData.roleName,
                        description: formData.description,
                        isActive: formData.isActive
                    } : undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    submitLabel={editingId ? 'Save Changes' : 'Create Role'}
                    isLoading={loading}
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
