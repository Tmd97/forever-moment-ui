import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { SidePanel } from '@/components/common/SidePanel';
import { UserForm } from './UserForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Filter, type FilterCategory } from '@/components/common/Filter';
import { cn } from '@/utils/cn';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface UsersProps {
    data: any;
    loading: boolean;
    error: string | null;
    getUsersData: () => void;
}

export interface UserType {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

// Temporary mock data until store is fully connected/API exists
const USERS_DATA: UserType[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Inactive' },
];

const Users = ({ data, loading, error, getUsersData }: UsersProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'User', status: 'Active' });

    // Local state for immediate interaction
    const [users, setUsers] = useState<UserType[]>(USERS_DATA);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const handleRowClick = (user: UserType) => {
        setSelectedUser(user);
    };

    useEffect(() => {
        getUsersData();
    }, [getUsersData]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setUsers(data);
        }
    }, [data]);

    // Filter configuration
    const filterCategories: FilterCategory[] = [
        {
            id: 'role',
            name: 'Role',
            options: [
                { id: '1', label: 'Admin', value: 'Admin' },
                { id: '2', label: 'Manager', value: 'Manager' },
                { id: '3', label: 'User', value: 'User' },
            ]
        },
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
        // Apply filters to users
        let filtered = USERS_DATA;

        if (filters.role && filters.role.length > 0) {
            filtered = filtered.filter(user => filters.role.includes(user.role));
        }

        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(user => filters.status.includes(user.status));
        }

        setUsers(filtered);
    };

    const handleOpenModal = (user: UserType | null = null) => {
        if (user) {
            setEditingId(user.id);
            setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
        } else {
            setEditingId(null);
            setFormData({ name: '', email: '', role: 'User', status: 'Active' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', role: 'User', status: 'Active' });
        setEditingId(null);
    };

    const handleFormSubmit = (data: { name: string; email: string; role: string; status: string }) => {
        if (editingId) {
            setUsers(users.map(u => u.id === editingId ? { ...u, ...data } : u));
        } else {
            setUsers([...users, { id: users.length + 1, ...data }]);
        }
        handleCloseModal();
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            setUsers(users.filter(u => u.id !== deleteId));
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
        <div className='user-page-container'>
            <div className='px-6 pt-4 pb-4 shrink-0'>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <Filter
                        categories={filterCategories}
                        onFilterChange={handleFilterChange}
                    />
                    <Button variant='default' onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                        <Plus size={16} className="mr-2" /> Add User
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    <DataTable
                        data={users}
                        columns={[
                            {
                                header: 'Name',
                                accessorKey: 'name' as const,
                                className: 'w-[30%] min-w-[200px] py-3 px-4 text-left font-medium text-gray-900 dark:text-white whitespace-nowrap'
                            },
                            {
                                header: 'Email',
                                accessorKey: 'email' as const,
                                className: 'w-[30%] min-w-[200px] py-3 px-4 text-left text-gray-500 dark:text-gray-400'
                            },
                            {
                                header: 'Role',
                                accessorKey: 'role' as const,
                                className: 'w-[15%] min-w-[100px] py-3 px-4 text-left',
                                render: (user) => (
                                    <span className={cn(
                                        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                    )}>
                                        {user.role}
                                    </span>
                                )
                            },
                            {
                                header: 'Status',
                                className: 'w-[15%] min-w-[100px] py-3 px-4 text-left',
                                render: (user) => (
                                    <span className={cn(
                                        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
                                        user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    )}>
                                        {user.status}
                                    </span>
                                )
                            },
                            {
                                header: 'Actions',
                                className: 'w-[10%] min-w-[100px] py-3 px-4 text-right',
                                render: (user) => (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(user); }} className='p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors'>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(user.id); }} className='p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors'>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )
                            }
                        ]}
                        keyExtractor={(item) => item.id}
                        onRowClick={handleRowClick}
                        selectedId={selectedUser?.id}
                    />
                </div>

                {/* SidePanel can be expanded later with UserDetails if needed */}
                <SidePanel
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                    title={selectedUser?.name || 'User Details'}
                    variant="inline"
                    className="border-l border-gray-200 dark:border-gray-800"
                >
                    {selectedUser && (
                        <div className="p-4">
                            <h3 className="text-lg font-bold">{selectedUser.name}</h3>
                            <p className="text-gray-600">{selectedUser.email}</p>
                            <div className="mt-4">
                                <p><strong>Role:</strong> {selectedUser.role}</p>
                                <p><strong>Status:</strong> {selectedUser.status}</p>
                            </div>
                            <Button
                                variant="outline"
                                className="mt-4 w-full"
                                onClick={() => handleOpenModal(selectedUser)}
                            >
                                Edit User
                            </Button>
                        </div>
                    )}
                </SidePanel>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit User' : 'Add User'}
            >
                <UserForm
                    initialData={editingId ? { name: formData.name, email: formData.email, role: formData.role, status: formData.status } : undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    submitLabel={editingId ? 'Save Changes' : 'Create User'}
                />
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="User"
                description="Are you sure you want to delete this user? This action cannot be undone."
            />
        </div>
    );
};

export default Users;
