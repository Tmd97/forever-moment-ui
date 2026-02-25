import { useState, useRef, useEffect } from 'react';
import { Dropdown } from '@/components/common/Dropdown';
import { Ban } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { UserType } from './Users';

interface UserDetailsProps {
    user: UserType & { rolesData?: any[] };
    onEdit: () => void;
    updateUser: (id: number, data: any) => Promise<any>;
}

export const UserDetails = ({ user, updateUser }: UserDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleEditStart = (field: string, value: string) => {
        setEditingField(field);
        setEditValue(value || '');
    };

    const handleSave = async (fieldKey: keyof UserType) => {
        if (editValue !== (user[fieldKey] as string)) {
            try {
                await updateUser(user.id, {
                    fullName: user.fullName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    preferredCity: user.preferredCity,
                    profilePictureUrl: user.profilePictureUrl || '',
                    dateOfBirth: user.dateOfBirth || '',
                    [fieldKey]: editValue
                });
            } catch (error) {
                console.error(`Failed to update ${fieldKey}`, error);
            }
        }
        setEditingField(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, fieldKey: keyof UserType) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave(fieldKey);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const handleRoleChange = async (newRoleIdStr: string) => {
        const newRoleId = parseInt(newRoleIdStr, 10);
        const currentRoleId = user.roleIds && user.roleIds.length > 0 ? user.roleIds[0] : user.roleId;

        if (currentRoleId !== newRoleId) {
            try {
                await updateUser(user.id, {
                    fullName: user.fullName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    preferredCity: user.preferredCity,
                    profilePictureUrl: user.profilePictureUrl || '',
                    dateOfBirth: user.dateOfBirth || '',
                    roleId: newRoleId
                });
            } catch (error) {
                console.error('Failed to update role', error);
            }
        }
    };

    const renderEditableField = (label: string, fieldKey: keyof UserType, value: any, disabled = false) => {
        const isEditing = editingField === fieldKey;

        return (
            <div className={cn("flex flex-col gap-1 p-3 -mx-3 rounded-xl transition-colors", disabled ? "" : "group hover:bg-slate-50 dark:hover:bg-gray-800/50")}>
                <div className="text-sm font-medium text-slate-500 dark:text-gray-400">{label}</div>
                {isEditing && !disabled ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(fieldKey)}
                        onKeyDown={(e) => handleKeyDown(e, fieldKey)}
                        className="w-full bg-white dark:bg-gray-900 border border-blue-500 rounded-lg px-3 py-2 text-[15px] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                    />
                ) : (
                    <div
                        className={cn("text-[15px] min-h-[24px] pr-8 relative", disabled ? "text-slate-500 dark:text-slate-400 group-hover:cursor-not-allowed" : "cursor-text text-slate-900 dark:text-white")}
                        onClick={() => !disabled && handleEditStart(String(fieldKey), value || '')}
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
    const activeRoleId = user.roleIds && user.roleIds.length > 0 ? String(user.roleIds[0]) : (user.roleId != null ? String(user.roleId) : '');

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderEditableField('Full Name', 'fullName', user.fullName)}
                {renderEditableField('Email', 'email', user.email, true)}
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
                            value={activeRoleId}
                            onChange={(val) => {
                                setEditingField(null);
                                handleRoleChange(val);
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
                                {user.role || 'No Role'}
                            </span>
                            <svg className="w-3.5 h-3.5 absolute right-2 top-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </div>
                    )}
                </div>

                {renderEditableField('Phone', 'phoneNumber', user.phoneNumber)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderEditableField('City', 'preferredCity', user.preferredCity)}
            </div>
        </div>
    );
};
