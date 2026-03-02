import { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { TabFooter } from '@/components/common/TabFooter';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';

export const LocationDetails = ({ location, updateLocation, onDirtyChange }: any) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const fieldMapping = useMemo(() => ({
        name: 'Location Name',
        city: 'City',
        state: 'State',
        country: 'Country',
        isActive: 'Status',
        address: 'Address'
    }), []);

    const {
        localData,
        updateField,
        isDirty,
        handleDiscard
    } = useUnsavedChanges({
        originalData: location,
        fieldMapping,
        onDirtyChange
    });

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleEditStart = (field: string, value: string) => {
        setEditingField(field);
        setEditValue(value || '');
    };

    const handleFieldUpdate = (field: string, value: any) => {
        setEditValue(value);
        updateField(field, value);
    };

    const handleFinalSave = async () => {
        setIsSaving(true);
        const payload = {
            name: localData.name,
            city: localData.city || '',
            state: localData.state || '',
            country: localData.country || '',
            isActive: localData.isActive,
            address: localData.address || "",
            latitude: localData.latitude || 0,
            longitude: localData.longitude || 0,
        };
        try {
            await updateLocation(location.id, payload);
        } catch (e) {
            console.error("Failed to save location changes", e);
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

    const renderCellField = (label: string, field: string, value: string) => {
        const isEditing = editingField === field;

        return (
            <div className="group relative">
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                        value={editValue}
                        onChange={(e) => handleFieldUpdate(field, e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                ) : (
                    <div
                        className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex gap-2 items-center"
                        onClick={() => handleEditStart(field, value)}
                    >
                        <span className={cn(!value && "text-slate-400 italic font-normal text-[12px]")}>{value || 'Empty'}</span>
                        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                )}
            </div>
        );
    };

    if (!location) return null;

    return (
        <div className="space-y-8" style={{ paddingBottom: isDirty ? '60px' : '0' }}>
            <SectionLabel>General Information</SectionLabel>
            <FieldGrid>
                <Cell>
                    {renderCellField('Location Name', 'name', localData.name)}
                </Cell>

                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <div className="mt-1 flex items-center">
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

                <Cell>
                    {renderCellField('City', 'city', localData.city)}
                </Cell>

                <Cell>
                    {renderCellField('State', 'state', localData.state)}
                </Cell>

                <Cell>
                    {renderCellField('Country', 'country', localData.country)}
                </Cell>

                <Cell />
            </FieldGrid>

            <SectionLabel>Address Details</SectionLabel>
            <div className="group bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3">
                <FieldLabel>Address</FieldLabel>
                {editingField === 'address' ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        className="w-full text-[13px] text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1.5 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                        value={editValue}
                        onChange={(e) => handleFieldUpdate('address', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                ) : (
                    <div
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={() => handleEditStart('address', localData.address || '')}
                    >
                        <p className={cn('text-[13px] leading-relaxed flex-1', localData.address ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 italic')}>
                            {localData.address || 'Empty'}
                        </p>
                        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                )}
            </div>
            <TabFooter
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={handleFinalSave}
                onDiscard={handleDiscard}
            />
        </div>
    );
};
