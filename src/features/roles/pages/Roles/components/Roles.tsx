import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { RoleForm } from './RoleForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { RolesSplitView } from './RolesSplitView';
import toast from 'react-hot-toast';
import * as types from '@/features/roles/store/action-types';
import '../../css/styles.scss';

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
    active: boolean;
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
    const [formData, setFormData] = useState({ roleName: '', description: '', active: true });

    const [roles, setRoles] = useState<RoleType[]>([]);
    const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

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

    // Filters handled in RolesSplitView
    const handleOpenModal = (role: RoleType | null = null) => {
        if (role) {
            setEditingId(role.id);
            setFormData({
                roleName: role.roleName,
                description: role.description,
                active: role.active,
            });
        } else {
            setEditingId(null);
            setFormData({ roleName: '', description: '', active: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ roleName: '', description: '', active: true });
        setEditingId(null);
    };

    const handleFormSubmit = (submittedData: { roleName: string; description: string; active: boolean }) => {
        if (editingId) {
            const existingRole = roles.find(r => r.id === editingId);
            const payload = {
                ...submittedData,
                permissionLevel: existingRole?.permissionLevel || 0,
                systemRole: existingRole?.systemRole || false
            };
            updateRole(editingId, payload);
        } else {
            const payload = {
                ...submittedData,
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
        <div className="role-page-container w-full h-full flex flex-col">
            <RolesSplitView
                roles={roles}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                loading={loading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit Role' : 'Add Role'}
            >
                <RoleForm
                    initialData={editingId ? {
                        roleName: formData.roleName,
                        description: formData.description,
                        active: formData.active
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
