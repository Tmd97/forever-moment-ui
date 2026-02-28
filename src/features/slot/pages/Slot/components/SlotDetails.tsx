import { useState, useRef, useEffect } from 'react';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { FieldGrid, Cell, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { cn } from '@/utils/cn';
import { DatePicker } from '@/components/common/DatePicker';
import type { SlotType } from './Slot';

interface SlotDetailsProps {
    slot: SlotType;
    onEdit: () => void;
    updateSlot: (id: number, data: any) => Promise<any>;
}

export const SlotDetails = ({ slot, updateSlot }: SlotDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingField && inputRef.current && editingField === 'label') {
            inputRef.current.focus();
        }
    }, [editingField]);

    const parseTimeStr = (timeStr?: string) => {
        if (!timeStr) return null;
        const [hours, minutes] = timeStr.split(':');
        const d = new Date();
        d.setHours(parseInt(hours, 10));
        d.setMinutes(parseInt(minutes, 10));
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
    };

    const formatTimeStr = (d: Date | null) => {
        if (!d) return null;
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

    const handleSave = async (field: string, isTime = false) => {
        const newValue = isTime ? formatTimeStr(editValue) : editValue;
        const currentValue = String(slot[field as keyof SlotType] || '');

        if (newValue !== currentValue) {
            const payload = {
                label: slot.label,
                startTime: slot.startTime,
                endTime: slot.endTime,
                isActive: slot.isActive,
                [field]: newValue
            };

            try {
                await updateSlot(slot.id, payload);
            } catch (e) {
                console.error("Failed to update field", e);
            }
        }
        setEditingField(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
        if (e.key === 'Enter') {
            handleSave(field);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const renderCellField = (label: string, field: string, value: any, isTime = false) => {
        const isEditing = editingField === field;
        return (
            <Cell>
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                    isTime ? (
                        <DatePicker
                            selected={editValue}
                            onChange={(date: Date | null) => setEditValue(date)}
                            onBlur={() => handleSave(field, true)}
                            showTimeSelect
                            showTimeSelectOnly
                            className="text-[13px] font-medium px-2 py-0.5"
                        />
                    ) : (
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-0.5 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(field)}
                            onKeyDown={(e) => handleKeyDown(e, field)}
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <SectionLabel>General Information</SectionLabel>
                <FieldGrid>
                    {renderCellField('Label', 'label', slot.label)}
                    <Cell>
                        <FieldLabel>Status</FieldLabel>
                        <div className="flex items-center -mx-1 -mt-1">
                            <EditableStatusBadge
                                status={slot.isActive ? 'true' : 'false'}
                                options={[
                                    { label: 'Active', value: 'true' },
                                    { label: 'Inactive', value: 'false' }
                                ]}
                                onChange={async (val) => {
                                    const newStatus = val === 'true';
                                    if (newStatus === slot.isActive) return;
                                    try {
                                        await updateSlot(slot.id, {
                                            label: slot.label,
                                            startTime: slot.startTime,
                                            endTime: slot.endTime,
                                            isActive: newStatus
                                        });
                                    } catch (error) { console.error('Failed to update status', error); }
                                }}
                            />
                        </div>
                    </Cell>
                    {renderCellField('Start Time', 'startTime', slot.startTime, true)}
                    {renderCellField('End Time', 'endTime', slot.endTime, true)}
                </FieldGrid>
            </div>
        </div>
    );
};
