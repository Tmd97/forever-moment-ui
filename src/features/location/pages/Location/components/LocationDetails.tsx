import { useState, useRef, useEffect } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { cn } from '@/utils/cn';

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

    const renderEditableField = (label: string, field: string, value: string) => {
        const isEditing = editingField === field;

        return (
            <div className="group relative">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tight mb-1">{label}</h3>
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full text-base font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all -ml-2"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(field)}
                        onKeyDown={(e) => handleKeyDown(e, field)}
                    />
                ) : (
                    <div
                        className="text-base font-semibold text-gray-900 dark:text-gray-100 px-2 py-1 -ml-2 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-gray-700 relative flex items-center"
                        onClick={() => handleEditClick(field, value)}
                    >
                        <span className={cn(!value && "text-slate-400 italic font-normal")}>{value || 'Empty'}</span>
                        <svg className="w-3.5 h-3.5 ml-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                )}
            </div>
        );
    };

    if (!location) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {renderEditableField('Location Name', 'name', location.name)}

                <div className="group relative">
                    <div className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1 flex items-center gap-1.5 p-3 -mx-3 pb-0">
                        Status
                    </div>
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
                </div>

                {renderEditableField('City', 'city', location.city)}
                {renderEditableField('State', 'state', location.state)}
                {renderEditableField('Country', 'country', location.country)}
            </div>
        </div>
    );
};
