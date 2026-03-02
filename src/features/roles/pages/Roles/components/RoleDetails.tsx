import { useState, useRef, useEffect, useMemo } from 'react';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { TabFooter } from '@/components/common/TabFooter';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import type { RoleType } from './Roles';

interface RoleDetailsProps {
    role: RoleType;
    updateRole: (id: number, data: any) => Promise<any>;
    onDirtyChange?: (isDirty: boolean, changes: any[]) => void;
}

export const RoleDetails = ({ role, updateRole, onDirtyChange }: RoleDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const consolidatedData = useMemo(() => ({
        roleName: role.roleName || '',
        description: role.description || '',
        active: role.active ?? true
    }), [role]);

    const fieldMapping = useMemo(() => ({
        roleName: 'Role Name',
        description: 'Description',
        active: 'Status'
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
            await updateRole(role.id, localData);
        } catch (e) {
            console.error("Failed to update role", e);
        } finally {
            setIsSaving(false);
        }
    };

    const renderEditableField = (label: string, fieldKey: any, value: any, isTextArea = false) => {
        const isEditing = editingField === fieldKey;

        return (
            <div className="group flex flex-col gap-1 p-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="text-sm font-medium text-slate-500 dark:text-gray-400">{label}</div>
                {isEditing ? (
                    isTextArea ? (
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            value={editValue}
                            onChange={(e) => {
                                setEditValue(e.target.value);
                                updateField(fieldKey, e.target.value);
                            }}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-white dark:bg-gray-900 border border-blue-500 rounded-lg px-3 py-2 text-[15px] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm min-h-[100px] resize-y"
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
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
                    )
                ) : (
                    <div
                        className="text-[15px] text-slate-900 dark:text-white cursor-text min-h-[24px] pr-8 relative"
                        onClick={() => handleEditStart(fieldKey, value || '')}
                    >
                        {value || <span className="text-slate-400 italic font-normal">Not specified</span>}
                        <svg className="w-3.5 h-3.5 absolute right-2 top-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4 pb-20">
            <div className="flex flex-col md:flex-row md:items-start md:gap-8">
                <div className="flex-1">
                    {renderEditableField('Role Name', 'roleName', localData.roleName)}
                </div>

                <div className="group relative md:w-1/3 shrink-0">
                    <div className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1 flex items-center gap-1.5 p-3 -mx-3 pb-0">
                        Status
                    </div>
                    <div className="flex items-center -mx-1 mt-1">
                        <EditableStatusBadge
                            status={localData.active ? 'true' : 'false'}
                            options={[
                                { label: 'Active', value: 'true' },
                                { label: 'Inactive', value: 'false' }
                            ]}
                            onChange={(val) => updateField('active', val === 'true')}
                        />
                    </div>
                </div>
            </div>

            {renderEditableField('Description', 'description', localData.description, true)}

            <TabFooter
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={handleSave}
                onDiscard={handleDiscard}
                changes={changes}
            />
        </div>
    );
};
