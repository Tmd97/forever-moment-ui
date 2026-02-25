import { useState, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import { Tabs } from '@/components/common/Tabs';
import { UserDetails } from './UserDetails';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { SearchBar } from '@/components/common/SearchBar';
import { Plus, X, Edit2, Trash2, User as UserIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Filter } from '@/components/common/Filter';
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
    loading
}: any) => {
    const [tab, setTab] = useState("general");
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const filtered = useMemo(() => (users || []).filter((u: UserType) => {
        const matchSearch = u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email && u.email.toLowerCase().includes(search.toLowerCase());

        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            matchStatus = u.status ? activeFilters.status.includes(u.status) : false;
        }

        let matchRole = true;
        if (activeFilters.role && activeFilters.role.length > 0) {
            matchRole = u.role ? activeFilters.role.includes(u.role) : false;
        }

        return matchSearch && matchStatus && matchRole;
    }), [users, search, activeFilters]);

    const activeRoleIds = selectedUser?.roleIds && selectedUser.roleIds.length > 0 ? selectedUser.roleIds : (selectedUser?.roleId != null ? [selectedUser.roleId] : []);
    const roleNames = activeRoleIds.map((id: number) => roles?.find((r: any) => r.id === id)?.roleName).filter(Boolean).join(', ');
    const selectedRoleNameStr = roleNames || selectedUser?.role || '-';


    const renderFullTable = () => {
        return (
            <div className="flex flex-col flex-1 h-full">
                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-800">
                    <Filter
                        categories={[
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
                        onFilterChange={setActiveFilters}
                    />

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <SearchBar
                            className="w-full sm:w-72"
                            inputClassName="py-2.5 pl-10 pr-4"
                            placeholder="Search users by name or email..."
                            value={search}
                            onChange={setSearch}
                        />
                        <Button onClick={() => handleOpenModal()} className="h-10 px-4 text-sm gap-2 shadow-sm shrink-0">
                            <Plus size={16} /> Add User
                        </Button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <DataTable
                        data={filtered}
                        columns={[
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
                                header: 'Status',
                                className: 'w-[10%] min-w-[100px] py-4 px-6 text-left',
                                render: (u: any) => (
                                    <StatusBadge status={u.status} activeValue="Active" />
                                )
                            },
                            {
                                header: 'Actions',
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
                        ]}
                        keyExtractor={(item: any) => item.id}
                        onRowClick={(u: any) => { setSelectedUser(u); setTab("general"); }}
                        loading={loading && (!users || users.length === 0)}
                    />
                </div>
            </div>
        );
    };

    const renderSplitView = () => {
        const colorInfo = getColorForUser(selectedUser.id);

        return (
            <div className="flex flex-1 h-full overflow-hidden">
                {/* Left Panel */}
                <div className="w-[320px] min-w-[320px] bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between p-5 pb-3">
                        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Users</span>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 mx-4 mb-3">
                        <SearchBar
                            className="flex-1"
                            inputClassName="bg-slate-50"
                            placeholder="Search users by name..."
                            value={search}
                            onChange={setSearch}
                        />
                        <Button onClick={() => handleOpenModal()} className="h-[38px] px-3 text-xs gap-1.5 shadow-sm shrink-0">
                            <Plus size={14} /> Add
                        </Button>
                    </div>

                    {/* Filter Pills */}
                    <div className="px-4 mb-3">
                        <Filter
                            categories={[
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
                            onFilterChange={setActiveFilters}
                        />
                    </div>

                    {/* Count Row */}
                    <div className="px-5 pb-2 border-b border-slate-100 dark:border-gray-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                            {filtered.length} user{filtered.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-10 px-5 text-slate-400">
                                <div className="text-4xl mb-2 opacity-50">👥</div>
                                <div className="text-sm font-medium">No users found</div>
                            </div>
                        )}
                        {filtered.map((u: any) => {
                            const isSelected = selectedUser?.id === u.id;
                            const itemColor = getColorForUser(u.id);

                            const uRoleIds = u.roleIds && u.roleIds.length > 0 ? u.roleIds : (u.roleId != null ? [u.roleId] : []);
                            const uRoleNames = uRoleIds.map((id: number) => roles?.find((r: any) => r.id === id)?.roleName).filter(Boolean).join(', ');
                            const uRoleNameStr = uRoleNames || u.role || '-';

                            return (
                                <div
                                    key={u.id}
                                    onClick={() => { setSelectedUser(u); setTab("general"); }}
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
                        })}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900">
                    {/* Detail Header */}
                    <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "w-[60px] h-[60px] rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm",
                                colorInfo.bg,
                                colorInfo.text
                            )}>
                                {userInitials(selectedUser.fullName)}
                            </div>
                            <div>
                                <div className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-2">
                                    {selectedUser.fullName}
                                </div>
                                <div className="text-[13px] text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                                    {selectedRoleNameStr} <span className="opacity-50 mx-1">•</span> ID #{selectedUser.id}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <button onClick={() => handleOpenModal(selectedUser)} className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border-none rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors">
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button onClick={() => handleDeleteClick(selectedUser.id)} className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border-none rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                            <div className="w-px h-6 bg-slate-200 dark:bg-gray-700 mx-1"></div>
                            <button onClick={() => setSelectedUser(null)} className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs
                        variant="horizontal"
                        tabs={[
                            { id: "general", label: "General Info" }
                        ]}
                        activeTab={tab}
                        onTabChange={setTab}
                    />

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-gray-900/50">
                        {tab === "general" && (
                            <UserDetails
                                user={{ ...selectedUser, role: selectedRoleNameStr }}
                                onEdit={() => handleOpenModal(selectedUser)}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return selectedUser ? renderSplitView() : renderFullTable();
};
