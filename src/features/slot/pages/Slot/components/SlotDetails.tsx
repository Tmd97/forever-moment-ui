import { useState, useRef, useEffect, useMemo } from 'react';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { FieldGrid, Cell, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { cn } from '@/utils/cn';
import { DatePicker } from '@/components/common/DatePicker';
import { TabFooter } from '@/components/common/TabFooter';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import type { SlotType } from './Slot';

interface SlotDetailsProps {
    slot: SlotType;
    updateSlot: (id: number, data: any) => Promise<any>;
    onDirtyChange?: (isDirty: boolean, changes: any[]) => void;
}

export const SlotDetails = ({ slot, updateSlot, onDirtyChange }: SlotDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const consolidatedData = useMemo(() => ({
        label: slot.label || '',
        startTime: slot.startTime || '',
        endTime: slot.endTime || '',
        isActive: slot.isActive ?? true
    }), [slot]);

    const fieldMapping = useMemo(() => ({
        label: 'Label',
        startTime: 'Start Time',
        endTime: 'End Time',
        isActive: 'Status'
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
        if (editingField && inputRef.current && editingField === 'label') {
            inputRef.current.focus();
        }
    }, [editingField]);

    const parseTimeStr = (timeStr?: string) => {
        if (!timeStr) return null;
        try {
            const [hours, minutes] = timeStr.split(':');
            const d = new Date();
            d.setHours(parseInt(hours, 10));
            d.setMinutes(parseInt(minutes, 10));
            d.setSeconds(0);
            d.setMilliseconds(0);
            return d;
        } catch (e) {
            return null;
        }
    };

    const formatTimeStr = (d: Date | null) => {
        if (!d) return '';
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleEditClick = (field: string, value: any, isTime = false) => {
        setEditingField(field);
        if (isTime) {
            setEditValue(parseTimeStr(value));
        } else {
            setEditValue(value ? String(value) : '');
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSlot(slot.id, localData);
        } catch (e) {
            console.error("Failed to update slot", e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setEditingField(null);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const renderCellField = (label: string, field: any, value: any, isTime = false) => {
        const isEditing = editingField === field;
        return (
            <Cell>
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                    isTime ? (
                        <DatePicker
                            selected={editValue}
                            onChange={(date: Date | null) => {
                                setEditValue(date);
                                updateField(field, formatTimeStr(date));
                            }}
                            onBlur={() => setEditingField(null)}
                            showTimeSelect
                            showTimeSelectOnly
                            className="text-[13px] font-medium px-2 py-0.5 border border-blue-500 rounded-md outline-none"
                        />
                    ) : (
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-0.5 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={editValue}
                            onChange={(e) => {
                                setEditValue(e.target.value);
                                updateField(field, e.target.value);
                            }}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={handleKeyDown}
                        />
                    )
                ) : (
                    <div
                        className="group flex items-center gap-2 cursor-pointer"
                        onClick={() => handleEditClick(field, value, isTime)}
                    >
                        <span className={cn(
                            "text-[13px] font-semibold transition-colors",
                            value ? "text-slate-900 dark:text-white" : "text-slate-400 italic font-normal"
                        )}>
                            {value || 'Empty'}
                        </span>
                        <svg className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                )}
            </Cell>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
            <div>
                <SectionLabel>General Information</SectionLabel>
                <FieldGrid>
                    {renderCellField('Label', 'label', localData.label)}
                    <Cell>
                        <FieldLabel>Status</FieldLabel>
                        <div className="flex items-center -mx-1 mt-1">
                            <EditableStatusBadge
                                status={localData.isActive ? 'true' : 'false'}
                                options={[
                                    { label: 'Active', value: 'true' },
                                    { label: 'Inactive', value: 'false' }
                                ]}
                                onChange={(val) => updateField('isActive', val === 'true')}
                            />
                        </div>
                    </Cell>
                    {renderCellField('Start Time', 'startTime', localData.startTime, true)}
                    {renderCellField('End Time', 'endTime', localData.endTime, true)}
                </FieldGrid>
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
