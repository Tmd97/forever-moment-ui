import { useCallback } from 'react';
import { UserDetails } from './UserDetails';
import { RowActions } from '@/components/common/RowActions';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { TABS } from '@/config/constants';
import type { UserType } from './Users';

const userInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'US';

const userColors = [
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
];

const getColorForUser = (id: number) => userColors[(id || 0) % userColors.length];

export const UsersSplitView = ({
    users,
    roles,
    handleOpenModal,
    handleDeleteClick,
    selectedUser,
    setSelectedUser,
    loading,
    updateUser
}: any) => {

    const columns = [
        {
            header: 'Name',
            accessorKey: 'fullName',
            className: 'w-[25%] min-w-[200px] py-4 px-6 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
            render: (u: any) => {
                const colorInfo = getColorForUser(u.id);
                return (
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm",
                            colorInfo.bg,
                            colorInfo.text
                        )}>
                            {userInitials(u.fullName)}
                        </div>
                        <span>{u.fullName}</span>
                    </div>
                );
            }
        },
        {
            header: 'Email',
            accessorKey: 'email',
            className: 'w-[25%] min-w-[200px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
        },
        {
            header: 'Phone',
            accessorKey: 'phoneNumber',
            className: 'w-[15%] min-w-[130px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
        },
        {
            header: 'Role',
            className: 'w-[15%] min-w-[100px] py-4 px-6 text-left',
            render: (user: any) => {
                const activeRoleIds = user.roleIds && user.roleIds.length > 0 ? user.roleIds : (user.roleId != null ? [user.roleId] : []);
                const roleNames = activeRoleIds.map((id: number) => roles?.find((r: any) => r.id === id)?.roleName).filter(Boolean).join(', ');
                const roleNameStr = roleNames || user.role || '-';
                return (
                    <span className='inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'>
                        {roleNameStr}
                    </span>
                );
            }
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'w-[10%] min-w-[80px] py-4 px-6 text-right',
            render: (u: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(u)}
                        onDelete={() => handleDeleteClick(u.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((u: UserType, isSelected: boolean) => {
        const itemColor = getColorForUser(u.id);
        const uRoleIds = u.roleIds && u.roleIds.length > 0 ? u.roleIds : (u.roleId != null ? [u.roleId] : []);
        const uRoleNames = uRoleIds.map((id: number) => roles?.find((r: any) => r.id === id)?.roleName).filter(Boolean).join(', ');
        const uRoleNameStr = uRoleNames || u.role || '-';

        return (
            <div
                className={cn(
                    "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group",
                    isSelected
                        ? "bg-blue-50/80 dark:bg-blue-900/20"
                        : "hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent"
                )}
            >
                <div className={cn(
                    "absolute left-2 w-1 h-8 rounded-r-md transition-all duration-300",
                    isSelected ? "bg-blue-600 opacity-100" : "opacity-0"
                )} />
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ml-1 shadow-sm", itemColor.bg, itemColor.text)}>
                    {userInitials(u.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                        isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )}>{u.fullName}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{uRoleNameStr}</div>
                </div>
                <div className={cn(
                    "w-2 h-2 rounded-full shrink-0 shadow-sm",
                    u.status === 'Active' ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                )} />
            </div>
        );
    }, [roles]);

    const renderDetailsPanel = useCallback((user: any, activeTab: string, dirtyState: any) => {
        if (activeTab === TABS.GENERAL.id) {
            const activeRoleIds = user?.roleIds && user.roleIds.length > 0 ? user.roleIds : (user?.roleId != null ? [user.roleId] : []);
            const roleNames = activeRoleIds.map((id: number) => roles?.find((r: any) => r.id === id)?.roleName).filter(Boolean).join(', ');
            const selectedRoleNameStr = roleNames || user?.role || '-';

            return (
                <UserDetails
                    user={{ ...user, role: selectedRoleNameStr, rolesData: roles }}
                    onEdit={() => handleOpenModal(user)}
                    updateUser={updateUser}
                    onDirtyChange={dirtyState.handleDirtyChange}
                />
            );
        }
        return null;
    }, [handleOpenModal, updateUser, roles]);

    const customFilter = useCallback((u: UserType, activeFilters: Record<string, string[]>) => {
        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            matchStatus = u.status ? activeFilters.status.includes(u.status) : false;
        }

        let matchRole = true;
        if (activeFilters.role && activeFilters.role.length > 0) {
            matchRole = u.role ? activeFilters.role.includes(u.role) : false;
        }

        return matchStatus && matchRole;
    }, []);

    const customSearch = useCallback((u: UserType, search: string) => {
        return Boolean(u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email && u.email.toLowerCase().includes(search.toLowerCase()));
    }, []);

    return (
        <CrudSplitViewLayout
            data={users || []}
            loading={loading}
            resourceName="User"
            selectedItem={selectedUser}
            onSelectItem={setSelectedUser}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem as any}
            tabs={[{ id: TABS.GENERAL.id, label: TABS.GENERAL.labelShort }]}
            renderDetailsPanel={renderDetailsPanel}
            filterConfig={[
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
            ]}
            customFilter={customFilter as any}
            customSearch={customSearch as any}
            onAdd={() => handleOpenModal()}
        />
    );
};
