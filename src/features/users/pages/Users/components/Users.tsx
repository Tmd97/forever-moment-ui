import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { UserForm } from './UserForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { UsersSplitView } from './UsersSplitView';
import toast from 'react-hot-toast';
import * as types from '@/features/users/store/action-types';
import '../../css/styles.scss';

interface UsersProps {
    data: any;
    loading: boolean;
    error: string | null;
    status: string;
    roles: any;
    getUsersData: () => void;
    getRolesData: () => void;
    createUser: (data: any) => void;
    updateUser: (id: number, data: any) => void;
    deleteUser: (id: number) => void;
    resetStatus: () => void;
}

export interface UserType {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    profilePictureUrl: string;
    dateOfBirth: string;
    preferredCity: string;
    role?: string;
    roleId?: number;
    roleIds?: number[];
    status?: string;
}

const Users = ({
    data,
    loading,
    error,
    status,
    roles,
    getUsersData,
    getRolesData,
    createUser,
    updateUser,
    deleteUser,
    resetStatus
}: UsersProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phoneNumber: '', preferredCity: '', roleId: '', status: 'Active' });

    // Local state for immediate interaction
    const [users, setUsers] = useState<UserType[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    useEffect(() => {
        getUsersData();
        getRolesData();
    }, [getUsersData, getRolesData]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setUsers(data);
        }
    }, [data]);

    // Keep selectedUser up to date when data array changes
    useEffect(() => {
        if (selectedUser && data && Array.isArray(data)) {
            const updatedSelected = data.find((u: UserType) => u.id === selectedUser.id);
            if (updatedSelected) {
                setSelectedUser(updatedSelected);
            } else {
                setSelectedUser(null); // Deselect if deleted remotely
            }
        }
    }, [data, selectedUser]);

    useEffect(() => {
        if (status === types.CREATE_USER_SUCCESS) {
            toast.success('User created successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.UPDATE_USER_SUCCESS) {
            toast.success('User updated successfully');
            resetStatus();
            handleCloseModal();
        } else if (status === types.DELETE_USER_SUCCESS) {
            toast.success('User deleted successfully');
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

    // filter handles in UsersSplitView

    const handleOpenModal = (user: UserType | null = null) => {
        if (user) {
            setEditingId(user.id);
            const activeRoleIds = user.roleIds && user.roleIds.length > 0 ? user.roleIds : (user.roleId != null ? [user.roleId] : []);
            const firstRoleId = activeRoleIds.length > 0 ? String(activeRoleIds[0]) : '';

            setFormData({
                fullName: user.fullName,
                email: user.email,
                password: '', // Add empty password for type matching
                phoneNumber: user.phoneNumber || '',
                preferredCity: user.preferredCity || '',
                roleId: firstRoleId,
                status: user.status || 'Active'
            });
        } else {
            setEditingId(null);
            setFormData({ fullName: '', email: '', password: '', phoneNumber: '', preferredCity: '', roleId: '', status: 'Active' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ fullName: '', email: '', password: '', phoneNumber: '', preferredCity: '', roleId: '', status: 'Active' });
        setEditingId(null);
    };

    const handleFormSubmit = (submitData: { fullName: string; email: string; password?: string; phoneNumber: string; preferredCity: string; roleId: string; status: string }) => {
        if (editingId) {
            // Update existing user
            const payload = {
                fullName: submitData.fullName,
                email: submitData.email,
                phoneNumber: submitData.phoneNumber,
                preferredCity: submitData.preferredCity,
                profilePictureUrl: '',
                dateOfBirth: '',
            };
            updateUser(editingId, payload);
        } else {
            // Create new user via /admin/user/create
            const payload = {
                email: submitData.email,
                password: submitData.password || '',
                fullName: submitData.fullName,
                phoneNumber: submitData.phoneNumber,
                preferredCity: submitData.preferredCity,
                roleId: submitData.roleId ? Number(submitData.roleId) : 0,
            };
            createUser(payload);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            deleteUser(deleteId);
        }
    };

    // Roles list for dropdown
    const rolesData = (roles && Array.isArray(roles)) ? roles : [];

    return (
        <div className="user-page-container w-full h-full flex flex-col">
            <UsersSplitView
                users={users}
                roles={rolesData}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                loading={loading}
                updateUser={updateUser}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit User' : 'Add User'}
            >
                <UserForm
                    initialData={editingId ? {
                        fullName: formData.fullName,
                        email: formData.email,
                        phoneNumber: formData.phoneNumber,
                        preferredCity: formData.preferredCity,
                        roleId: formData.roleId,
                        status: formData.status
                    } : undefined}
                    roles={rolesData}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    submitLabel={editingId ? 'Save Changes' : 'Create User'}
                    isLoading={loading}
                    isEditing={!!editingId}
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
