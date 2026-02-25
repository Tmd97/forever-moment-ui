import { useState, useRef, useEffect } from 'react';
import { Dropdown } from '@/components/common/Dropdown';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { RoleType } from './Roles';

interface RoleDetailsProps {
    role: RoleType;
    updateRole: (id: number, data: any) => Promise<any>;
}

export const RoleDetails = ({ role, updateRole }: RoleDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleEditStart = (field: string, value: string) => {
        setEditingField(field);
        setEditValue(value || '');
    };

    const handleSave = async (fieldKey: keyof RoleType) => {
        if (editValue !== (role[fieldKey] as string)) {
            try {
                await updateRole(role.id, {
                    roleName: role.roleName,
                    description: role.description || '',
                    active: role.active,
                    [fieldKey]: editValue
                });
            } catch (error) {
                console.error(`Failed to update ${fieldKey}`, error);
            }
        }
        setEditingField(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, fieldKey: keyof RoleType) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave(fieldKey);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        const isActive = newStatus === 'true';
        if (role.active !== isActive) {
            try {
                await updateRole(role.id, {
                    roleName: role.roleName,
                    description: role.description || '',
                    active: isActive
                });
            } catch (error) {
                console.error('Failed to update status', error);
            }
        }
    };

    const renderEditableField = (label: string, fieldKey: keyof RoleType, value: any, isTextArea = false) => {
        const isEditing = editingField === fieldKey;

        return (
            <div className="group flex flex-col gap-1 p-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="text-sm font-medium text-slate-500 dark:text-gray-400">{label}</div>
                {isEditing ? (
                    isTextArea ? (
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(fieldKey)}
                            onKeyDown={(e) => handleKeyDown(e, fieldKey)}
                            className="w-full bg-white dark:bg-gray-900 border border-blue-500 rounded-lg px-3 py-2 text-[15px] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm min-h-[100px] resize-y"
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(fieldKey)}
                            onKeyDown={(e) => handleKeyDown(e, fieldKey)}
                            className="w-full bg-white dark:bg-gray-900 border border-blue-500 rounded-lg px-3 py-2 text-[15px] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                        />
                    )
                ) : (
                    <div
                        className="text-[15px] text-slate-900 dark:text-white cursor-text min-h-[24px] pr-8 relative"
                        onClick={() => handleEditStart(String(fieldKey), value || '')}
                    >
                        {value || <span className="text-slate-400 italic font-normal">Not specified</span>}
                        <svg className="w-3.5 h-3.5 absolute right-2 top-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:gap-8">
                <div className="flex-1">
                    {renderEditableField('Role Name', 'roleName', role.roleName)}
                </div>

                <div className="group relative md:w-1/3 shrink-0">
                    <div className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1 flex items-center gap-1.5 p-3 -mx-3 pb-0">
                        Status
                    </div>
                    {editingField === 'active' ? (
                        <div className="-ml-2">
                            <Dropdown
                                label=""
                                options={[
                                    { label: 'Active', value: 'true' },
                                    { label: 'Inactive', value: 'false' }
                                ]}
                                value={role.active ? 'true' : 'false'}
                                onChange={(val) => {
                                    setEditingField(null);
                                    handleStatusChange(val);
                                }}
                                placeholder="Select Status"
                                searchable={false}
                            />
                        </div>
                    ) : (
                        <div
                            className="mt-1 px-2 py-1 rounded-md cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-gray-700 w-max flex items-center"
                            onClick={() => setEditingField('active')}
                        >
                            <StatusBadge isActive={role.active} />
                            <svg className="w-3.5 h-3.5 ml-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </div>
                    )}
                </div>
            </div>

            {renderEditableField('Description', 'description', role.description, true)}
        </div>
    );
};
