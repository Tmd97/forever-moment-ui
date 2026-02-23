import { useState, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import { getExperienceTabs } from './ExperienceDetails';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { Search, Plus, X, Edit2, Trash2, Tag } from 'lucide-react';
import { cn } from '@/utils/cn';

const expInitials = (name: string) => name ? name.slice(0, 2).toUpperCase() : 'EX';

const expColors = [
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
];

const getColorForExp = (id: number) => expColors[(id || 0) % expColors.length];

export const ExperienceSplitView = ({
    experiences,
    handleOpenModal,
    handleDeleteClick,
    selectedExperience,
    setSelectedExperience,
    loading,
    experienceDetail,
    inclusions,
    cancellationPolicies,
    toggleCancellationPolicy,
    toggleInclusion,
}: any) => {
    const [tab, setTab] = useState("general");
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const filtered = useMemo(() => (experiences || []).filter((e: any) => {
        const matchSearch = e.name && e.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "All" || (filterStatus === "Active" ? e.isActive : !e.isActive);
        return matchSearch && matchStatus;
    }), [experiences, search, filterStatus]);

    // Data for tabs
    const tabsData = useMemo(() => {
        if (!selectedExperience) return [];
        return getExperienceTabs({
            experience: {
                ...selectedExperience,
                title: selectedExperience.name,
                price: `₹${selectedExperience.basePrice || 0}`,
                status: selectedExperience.isActive ? 'Active' : 'Inactive'
            },
            experienceDetail,
            inclusions,
            cancellationPolicies,
            onEdit: () => handleOpenModal(selectedExperience),
            onToggleCancellationPolicy: (policyId: number, isAssociate: boolean) => {
                toggleCancellationPolicy(selectedExperience.id, policyId, isAssociate);
            },
            onToggleInclusion: (inclusionId: number, isAssociate: boolean) => {
                toggleInclusion(selectedExperience.id, inclusionId, isAssociate);
            }
        });
    }, [selectedExperience, experienceDetail, inclusions, cancellationPolicies, handleOpenModal, toggleCancellationPolicy, toggleInclusion]);

    const renderFullTable = () => {
        return (
            <div className="flex flex-col flex-1 h-full">
                {/* Top Bar */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-gray-800">
                    <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">Experiences</span>
                    <Button onClick={() => handleOpenModal()} className="h-10 px-4 text-sm gap-2 shadow-sm">
                        <Plus size={16} /> Add Experience
                    </Button>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-800">
                    <div className="flex gap-2">
                        {["All", "Active", "Inactive"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilterStatus(f)}
                                className={cn(
                                    "border-none rounded-full px-4 py-2 text-sm transition-all duration-200",
                                    filterStatus === f
                                        ? "bg-blue-600 text-white font-medium shadow-sm"
                                        : "bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 font-normal shadow-sm"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            className="w-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-sm"
                            placeholder="Search experiences..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <DataTable
                        data={filtered}
                        columns={[
                            {
                                header: 'Title',
                                accessorKey: 'name',
                                className: 'w-[40%] min-w-[200px] py-4 px-6 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
                                render: (exp: any) => {
                                    const colorInfo = getColorForExp(exp.id);
                                    return (
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm",
                                                colorInfo.bg,
                                                colorInfo.text
                                            )}>
                                                {expInitials(exp.name)}
                                            </div>
                                            <span>{exp.name}</span>
                                        </div>
                                    );
                                }
                            },
                            {
                                header: 'Price',
                                accessorKey: 'basePrice',
                                className: 'w-[20%] min-w-[120px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
                                render: (exp: any) => <span className="font-medium">₹{exp.basePrice || 0}</span>
                            },
                            {
                                header: 'Status',
                                className: 'w-[20%] min-w-[100px] py-4 px-6 text-left',
                                render: (exp: any) => <StatusBadge status={exp.isActive ? 'Active' : 'Inactive'} />
                            },
                            {
                                header: 'Actions',
                                className: 'w-[20%] min-w-[80px] py-4 px-6 text-right',
                                render: (exp: any) => (
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <RowActions
                                            onEdit={() => handleOpenModal(exp)}
                                            onDelete={() => handleDeleteClick(exp.id)}
                                        />
                                    </div>
                                )
                            }
                        ]}
                        keyExtractor={(item: any) => item.id}
                        onRowClick={(exp: any) => { setSelectedExperience(exp); setTab("general"); }}
                        loading={loading}
                    />
                </div>
            </div>
        );
    };

    const renderSplitView = () => {
        const activeTabContent = tabsData.find(t => t.id === tab)?.content;
        const colorInfo = getColorForExp(selectedExperience.id);

        return (
            <div className="flex flex-1 h-full overflow-hidden">
                {/* Left Panel */}
                <div className="w-[340px] min-w-[340px] bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between p-5 pb-3">
                        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Experiences</span>
                        <Button onClick={() => handleOpenModal()} className="h-8 px-3 text-xs gap-1.5 shadow-sm">
                            <Plus size={14} /> Add
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative mx-4 mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            placeholder="Search experiences..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-1.5 px-4 mb-3">
                        {["All", "Active", "Inactive"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilterStatus(f)}
                                className={cn(
                                    "border-none rounded-full px-3.5 py-1.5 text-xs transition-all duration-200",
                                    filterStatus === f
                                        ? "bg-blue-600 text-white font-medium shadow-sm"
                                        : "bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-700 font-normal"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Count Row */}
                    <div className="px-5 pb-2 border-b border-slate-100 dark:border-gray-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                            {filtered.length} experience{filtered.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-10 px-5 text-slate-400">
                                <div className="text-4xl mb-2 opacity-50">✨</div>
                                <div className="text-sm font-medium">No experiences found</div>
                            </div>
                        )}
                        {filtered.map((exp: any) => {
                            const isSelected = selectedExperience?.id === exp.id;
                            const itemColor = getColorForExp(exp.id);
                            return (
                                <div
                                    key={exp.id}
                                    onClick={() => { setSelectedExperience(exp); setTab("general"); }}
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
                                        {expInitials(exp.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={cn(
                                            "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                                            isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                        )}>{exp.name}</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500 truncate font-medium">₹{exp.basePrice || 0}</div>
                                    </div>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full shrink-0 shadow-sm",
                                        exp.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
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
                                {expInitials(selectedExperience.name)}
                            </div>
                            <div>
                                <div className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-2">
                                    {selectedExperience.name}
                                </div>
                                <div className="text-[13px] text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                                    ₹{selectedExperience.basePrice || 0} <span className="opacity-50 mx-1">•</span> ID #{selectedExperience.id}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <button onClick={() => handleOpenModal(selectedExperience)} className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border-none rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors">
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button onClick={() => handleDeleteClick(selectedExperience.id)} className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border-none rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                            <div className="w-px h-6 bg-slate-200 dark:bg-gray-700 mx-1"></div>
                            <button onClick={() => setSelectedExperience(null)} className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex px-8 gap-6 border-b border-slate-100 dark:border-gray-800">
                        {tabsData.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={cn(
                                    "bg-transparent border-none border-b-2 py-4 text-[13.5px] cursor-pointer transition-all tracking-wide -mb-[1px]",
                                    tab === t.id
                                        ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                                        : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-gray-900/50">
                        {activeTabContent}
                    </div>
                </div>
            </div>
        );
    };

    return selectedExperience ? renderSplitView() : renderFullTable();
};
