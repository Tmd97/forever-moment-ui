import { useCallback } from 'react';
import { RoleDetails } from './RoleDetails';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { Shield } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { TABS } from '@/config/constants';
import type { RoleType } from './Roles';

const roleColors = [
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
];

const getColorForRole = (id: number) => roleColors[(id || 0) % roleColors.length];

export const RolesSplitView = ({
    roles,
    handleOpenModal,
    handleDeleteClick,
    selectedRole,
    setSelectedRole,
    loading,
    updateRole
}: any) => {

    const columns = [
        {
            header: 'Role Name',
            accessorKey: 'roleName',
            className: 'w-[30%] min-w-[200px] py-4 px-6 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
            render: (r: any) => {
                const colorInfo = getColorForRole(r.id);
                return (
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm",
                            colorInfo.bg,
                            colorInfo.text
                        )}>
                            <Shield className="w-4 h-4" />
                        </div>
                        <span>{r.roleName}</span>
                    </div>
                );
            }
        },
        {
            header: 'Description',
            accessorKey: 'description',
            className: 'w-[40%] min-w-[300px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
            render: (r: any) => (
                <div className="truncate max-w-[400px]" title={r.description}>
                    {r.description || '-'}
                </div>
            )
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'w-[15%] min-w-[100px] py-4 px-6 text-left',
            render: (r: any) => (
                <EditableStatusBadge
                    status={r.active ? 'Active' : 'Inactive'}
                    options={['Active', 'Inactive']}
                    onChange={async (val) => {
                        const newStatus = val === 'Active';
                        if (newStatus === r.active) return;
                        try {
                            await updateRole(r.id, {
                                roleName: r.roleName,
                                description: r.description,
                                active: newStatus
                            });
                        } catch (e) { console.error(e); }
                    }}
                />
            )
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'w-[15%] min-w-[100px] py-4 px-6 text-right',
            render: (r: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(r)}
                        onDelete={() => handleDeleteClick(r.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((r: any, isSelected: boolean) => {
        const itemColor = getColorForRole(r.id);

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
                    <Shield className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                        isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )}>{r.roleName}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 truncate" title={r.description}>{r.description || 'No description'}</div>
                </div>
                <div className={cn(
                    "w-2 h-2 rounded-full shrink-0 shadow-sm",
                    r.active ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                )} />
            </div>
        );
    }, []);

    const renderDetailsPanel = useCallback((r: any, activeTab: string, dirtyState: any) => {
        if (activeTab === TABS.GENERAL.id) {
            return (
                <RoleDetails
                    role={r}
                    updateRole={updateRole}
                    onDirtyChange={dirtyState.handleDirtyChange}
                />
            );
        }
        return null;
    }, [updateRole]);

    const customFilter = useCallback((r: RoleType, activeFilters: Record<string, string[]>) => {
        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = r.active ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }

        return matchStatus;
    }, []);

    const customSearch = useCallback((r: RoleType, search: string) => {
        return Boolean(r.roleName && r.roleName.toLowerCase().includes(search.toLowerCase()));
    }, []);

    return (
        <CrudSplitViewLayout
            data={roles || []}
            loading={loading}
            resourceName="Role"
            resourceNamePlural="Roles"
            selectedItem={selectedRole}
            onSelectItem={setSelectedRole}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: TABS.GENERAL.id, label: TABS.GENERAL.labelShort }]}
            renderDetailsPanel={renderDetailsPanel}
            filterConfig={[
                {
                    id: 'status',
                    name: 'Status',
                    options: [
                        { id: '1', label: 'Active', value: 'true' },
                        { id: '2', label: 'Inactive', value: 'false' },
                    ]
                }
            ]}
            customFilter={customFilter as any}
            customSearch={customSearch as any}
            onAdd={() => handleOpenModal()}
        />
    );
};
