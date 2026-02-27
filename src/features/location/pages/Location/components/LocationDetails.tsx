import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';

export const LocationDetails = ({ location, updateLocation }: any) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleEditClick = (field: string, value: string) => {
        setEditingField(field);
        setEditValue(value || '');
    };

    const handleSave = async (field: string) => {
        if (editValue !== location[field]) {
            const payload = {
                name: location.name,
                city: location.city || '',
                state: location.state || '',
                country: location.country || '',
                isActive: location.isActive,
                address: location.address || "",
                latitude: location.latitude || 0,
                longitude: location.longitude || 0,
                [field]: editValue
            };
            try {
                await updateLocation(location.id, payload);
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

    const renderCellField = (label: string, field: string, value: string) => {
        const isEditing = editingField === field;

        return (
            <div className="group relative">
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(field)}
                        onKeyDown={(e) => handleKeyDown(e, field)}
                    />
                ) : (
                    <div
                        className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex gap-2 items-center"
                        onClick={() => handleEditClick(field, value)}
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
        <div>
            {/* ── GENERAL ─────────────────────────────── */}
            <SectionLabel>General Information</SectionLabel>
            <FieldGrid>
                {/* Name */}
                <Cell>
                    {renderCellField('Location Name', 'name', location.name)}
                </Cell>

                {/* Status */}
                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <div className="mt-1 flex items-center">
                        <EditableStatusBadge
                            status={location.isActive ? 'Active' : 'Inactive'}
                            options={['Active', 'Inactive']}
                            onChange={async (val) => {
                                const newStatus = val === 'Active';
                                if (newStatus === location.isActive) return;

                                const payload = {
                                    name: location.name,
                                    city: location.city || '',
                                    state: location.state || '',
                                    country: location.country || '',
                                    isActive: newStatus,
                                    address: location.address || "",
                                    latitude: location.latitude || 0,
                                    longitude: location.longitude || 0,
                                };
                                try {
                                    await updateLocation(location.id, payload);
                                } catch (e) {
                                    console.error("Failed to update status", e);
                                }
                            }}
                        />
                    </div>
                </Cell>

                {/* City */}
                <Cell>
                    {renderCellField('City', 'city', location.city)}
                </Cell>

                {/* State */}
                <Cell>
                    {renderCellField('State', 'state', location.state)}
                </Cell>

                {/* Country */}
                <Cell>
                    {renderCellField('Country', 'country', location.country)}
                </Cell>

                {/* Spacer */}
                <Cell />
            </FieldGrid>

            {/* ── ADDRESS ─────────────────────────────── */}
            <SectionLabel>Address Details</SectionLabel>
            <div className="group bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3">
                <FieldLabel>Address</FieldLabel>
                {editingField === 'address' ? (
                    <textarea
                        ref={inputRef as any}
                        className="w-full text-[13px] text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1.5 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave('address')}
                        onKeyDown={(e) => handleKeyDown(e, 'address')}
                    />
                ) : (
                    <div
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={() => handleEditClick('address', location.address || '')}
                    >
                        <p className={cn('text-[13px] leading-relaxed flex-1', location.address ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 italic')}>
                            {location.address || 'Empty'}
                        </p>
                        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                )}
            </div>
        </div>
    );
};
