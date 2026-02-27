import React, { useState } from 'react';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Dropdown } from '@/components/common/Dropdown';
import { Edit2, MapPin, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface LocationTabProps {
    availableLocations: any[]; // All active locations in the system
    experienceLocations: any[]; // Locations already associated with this experience
    onAssociateLocation: (locationId: number, timeSlotId: number, data: any) => void;
    onUpdateLocation: (locationId: number, timeSlotId: number, data: any) => void;
    onDisassociateLocation: (locationId: number, timeSlotId: number) => void;
    slots: any[];
}

interface LocationFormData {
    priceOverride: number;
    maxCapacity: number;
    validFrom: string;
    validTo: string;
    isActive: boolean;
}

const emptyForm: LocationFormData = {
    priceOverride: 0,
    maxCapacity: 0,
    validFrom: '',
    validTo: '',
    isActive: true
};

export const LocationTab: React.FC<LocationTabProps> = ({
    availableLocations,
    experienceLocations,
    onAssociateLocation,
    onUpdateLocation,
    onDisassociateLocation,
    slots
}) => {
    const [search, setSearch] = useState("");
    const [isAssocModalOpen, setIsAssocModalOpen] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [formData, setFormData] = useState<LocationFormData>(emptyForm);
    const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const filteredAssignedLocations = experienceLocations?.filter((el: any) => {
        if (!search) return true;
        const nameMatch = el.locationName?.toLowerCase().includes(search.toLowerCase());
        const cityMatch = el.city?.toLowerCase().includes(search.toLowerCase());
        return nameMatch || cityMatch;
    }) || [];

    const handleOpenAssocModal = (existingData?: any) => {
        if (existingData) {
            setIsEditing(true);
            setSelectedLocationId(existingData.locationId);
            setFormData({
                priceOverride: existingData.priceOverride || 0,
                maxCapacity: existingData.maxCapacity || 0,
                validFrom: existingData.validFrom ? new Date(existingData.validFrom).toISOString().split('T')[0] : '',
                validTo: existingData.validTo ? new Date(existingData.validTo).toISOString().split('T')[0] : '',
                isActive: existingData.isActive ?? true,
            });
            setSelectedTimeSlotId(existingData.timeSlotId || null);
        } else {
            setIsEditing(false);
            setSelectedLocationId(null);
            setSelectedTimeSlotId(null);
            setFormData(emptyForm);
        }
        setIsAssocModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAssocModalOpen(false);
        setSelectedLocationId(null);
        setSelectedTimeSlotId(null);
        setFormData(emptyForm);
    };

    const handleSubmit = () => {
        if (!selectedLocationId || !selectedTimeSlotId) return;

        const payload = {
            priceOverride: Number(formData.priceOverride),
            maxCapacity: Number(formData.maxCapacity),
            validFrom: formData.validFrom || new Date().toISOString().split('T')[0],
            validTo: formData.validTo || new Date().toISOString().split('T')[0],
            isActive: formData.isActive
        };

        if (isEditing) {
            onUpdateLocation(selectedLocationId, selectedTimeSlotId, payload);
        } else {
            onAssociateLocation(selectedLocationId, selectedTimeSlotId, payload);
        }
        handleCloseModal();
    };

    // Filter available locations down to those that are active and not already assigned
    const unassignedLocations = availableLocations.filter((loc: any) =>
        loc.isActive && !experienceLocations?.some((el: any) => el.locationId === loc.id)
    );

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
                <SearchBar
                    className="flex-1"
                    inputClassName="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    placeholder="Search locations..."
                    value={search}
                    onChange={setSearch}
                />
                <Button onClick={() => handleOpenAssocModal()} className="h-10 px-4 text-sm shrink-0">
                    Associate Location
                </Button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 pb-20">
                {filteredAssignedLocations.map((el: any) => (
                    <div key={`${el.locationId}-${el.timeSlotId}`} className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all hover:border-blue-300">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <MapPin size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                        {el.locationName} {el.city ? `(${el.city})` : ''}
                                        {el.isActive ? (
                                            <span className="text-[10px] uppercase font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">Active</span>
                                        ) : (
                                            <span className="text-[10px] uppercase font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full">Inactive</span>
                                        )}
                                    </h4>
                                    <div className="flex items-center gap-4 mt-1">
                                        <p className="text-xs text-slate-500">
                                            Price: <span className="font-semibold text-slate-900 dark:text-slate-100">₹{el.priceOverride}</span>
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Capacity: <span className="font-semibold text-slate-900 dark:text-slate-100">{el.maxCapacity || 0}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    onClick={() => handleOpenAssocModal(el)}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => onDisassociateLocation(el.locationId, el.timeSlotId)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-gray-800 mt-1">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Validity</span>
                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                    {el.validFrom ? format(new Date(el.validFrom), 'MMM dd') : 'N/A'} - {el.validTo ? format(new Date(el.validTo), 'MMM dd, yyyy') : 'N/A'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Time Slot</span>
                                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">
                                    {el.timeSlotLabel || `ID: ${el.timeSlotId}`}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredAssignedLocations.length === 0 && (
                    <div className="text-center py-12 text-slate-400 dark:text-gray-500 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl">
                        <MapPin className="mx-auto h-8 w-8 opacity-20 mb-3" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No locations associated.</p>
                        <p className="text-xs mt-1">Click "Associate Location" to link one.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isAssocModalOpen}
                onClose={handleCloseModal}
                title={isEditing ? 'Update Location Details' : 'Associate New Location'}
                className="max-w-md w-[95vw]"
            >
                <div className="space-y-4">
                    {!isEditing && (
                        <div>
                            <Dropdown
                                label="Select Location"
                                options={unassignedLocations.map((loc: any) => ({
                                    id: loc.id.toString(),
                                    value: loc.id.toString(),
                                    label: `${loc.name} ${loc.city ? `(${loc.city})` : ''}`
                                }))}
                                value={selectedLocationId ? selectedLocationId.toString() : ''}
                                onChange={(value: string) => setSelectedLocationId(Number(value))}
                                placeholder="-- Select a Location --"
                                className="w-full"
                            />
                            {unassignedLocations.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1.5">No matching active locations available to assign.</p>
                            )}
                        </div>
                    )}

                    <div>
                        <Dropdown
                            label="Select Time Slot"
                            options={slots.map((s: any) => ({
                                id: s.id.toString(),
                                value: s.id.toString(),
                                label: s.label
                            }))}
                            value={selectedTimeSlotId ? selectedTimeSlotId.toString() : ''}
                            onChange={(value: string) => setSelectedTimeSlotId(Number(value))}
                            placeholder="-- Select a Time Slot --"
                            className="w-full"
                            disabled={isEditing}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Price Override (₹)
                            </label>
                            <input
                                type="number"
                                min="0"
                                className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-semibold"
                                value={formData.priceOverride}
                                onChange={(e) => setFormData(prev => ({ ...prev, priceOverride: Number(e.target.value) }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Max Capacity
                            </label>
                            <input
                                type="number"
                                min="0"
                                className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-semibold"
                                value={formData.maxCapacity}
                                onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: Number(e.target.value) }))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Valid From
                            </label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                                value={formData.validFrom}
                                onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Valid To
                            </label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                                value={formData.validTo}
                                onChange={(e) => setFormData(prev => ({ ...prev, validTo: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700">
                        <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">Active Status</div>
                            <div className="text-xs text-slate-500">Enable or disable this specific price/location rule</div>
                        </div>
                        <label className="flex items-center cursor-pointer relative">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-gray-800 mt-6">
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedLocationId || !selectedTimeSlotId || !formData.validFrom || !formData.validTo}
                        >
                            {isEditing ? 'Save Changes' : 'Associate'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
