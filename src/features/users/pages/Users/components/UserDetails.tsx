import { useState, useRef, useEffect, useMemo } from 'react';
import { Dropdown } from '@/components/common/Dropdown';
import { Ban } from 'lucide-react';
import { TabFooter } from '@/components/common/TabFooter';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { cn } from '@/utils/cn';
import type { UserType } from './Users';

interface UserDetailsProps {
    user: UserType & { rolesData?: any[] };
    onEdit: () => void;
    updateUser: (id: number, data: any) => Promise<any>;
    onDirtyChange?: (isDirty: boolean, changes: any[]) => void;
}

export const UserDetails = ({ user, updateUser, onDirtyChange }: UserDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const consolidatedData = useMemo(() => ({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        preferredCity: user.preferredCity || '',
        roleId: user.roleIds && user.roleIds.length > 0 ? user.roleIds[0] : (user.roleId ?? null)
    }), [user]);

    const fieldMapping = useMemo(() => ({
        fullName: 'Full Name',
        email: 'Email',
        phoneNumber: 'Phone Number',
        preferredCity: 'City',
        roleId: 'Role'
    }), []);

    const {
        localData,
        updateField,
        isDirty,
        handleDiscard,
        changes
    } = useUnsavedChanges({
        originalData: consolidatedData,
        fieldMapping,
        onDirtyChange
    });

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleEditStart = (field: string, value: any) => {
        setEditingField(field);
        setEditValue(String(value));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setEditingField(null);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUser(user.id, localData);
        } catch (e) {
            console.error("Failed to update user", e);
        } finally {
            setIsSaving(false);
        }
    };

    const renderEditableField = (label: string, fieldKey: any, value: any, disabled = false) => {
        const isEditing = editingField === fieldKey;

        return (
            <div className={cn("flex flex-col gap-1 p-3 -mx-3 rounded-xl transition-colors", disabled ? "" : "group hover:bg-slate-50 dark:hover:bg-gray-800/50")}>
                <div className="text-sm font-medium text-slate-500 dark:text-gray-400">{label}</div>
                {isEditing && !disabled ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => {
                            setEditValue(e.target.value);
                            updateField(fieldKey, e.target.value);
                        }}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-white dark:bg-gray-900 border border-blue-500 rounded-lg px-3 py-2 text-[15px] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                    />
                ) : (
                    <div
                        className={cn("text-[15px] min-h-[24px] pr-8 relative", disabled ? "text-slate-500 dark:text-slate-400 group-hover:cursor-not-allowed" : "cursor-text text-slate-900 dark:text-white")}
                        onClick={() => !disabled && handleEditStart(fieldKey, value || '')}
                    >
                        {value || <span className="text-slate-400 italic font-normal">Not specified</span>}
                        {disabled ? (
                            <Ban className="w-3.5 h-3.5 absolute right-2 top-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <svg className="w-3.5 h-3.5 absolute right-2 top-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const roleOptions = user.rolesData ? user.rolesData.map(r => ({ label: r.roleName, value: String(r.id) })) : [];
    const activeRoleLabel = user.rolesData?.find(r => String(r.id) === String(localData.roleId))?.roleName || 'No Role';

    return (
        <div className="space-y-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderEditableField('Full Name', 'fullName', localData.fullName)}
                {renderEditableField('Email', 'email', localData.email, true)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group flex flex-col gap-1 p-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="text-sm font-medium text-slate-500 dark:text-gray-400">
                        Role
                    </div>
                    {editingField === 'roleId' ? (
                        <Dropdown
                            label=""
                            options={roleOptions}
                            value={String(localData.roleId)}
                            onChange={(val) => {
                                updateField('roleId', parseInt(val, 10));
                                setEditingField(null);
                            }}
                            placeholder="Select Role"
                            searchable={false}
                        />
                    ) : (
                        <div
                            className="text-[15px] min-h-[24px] pr-8 relative cursor-pointer w-max flex items-center"
                            onClick={() => setEditingField('roleId')}
                        >
                            <span className={cn(
                                'inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 -ml-2'
                            )}>
                                {activeRoleLabel}
                            </span>
                            <svg className="w-3.5 h-3.5 absolute right-2 top-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </div>
                    )}
                </div>

                {renderEditableField('Phone', 'phoneNumber', localData.phoneNumber)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderEditableField('City', 'preferredCity', localData.preferredCity)}
            </div>

            <TabFooter
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={handleSave}
                onDiscard={handleDiscard}
                changeCount={changes.length}
            />
        </div>
    );
};
