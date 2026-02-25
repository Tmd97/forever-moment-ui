import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { DeleteModal } from '@/components/common/DeleteModal';
import { SearchBar } from '@/components/common/SearchBar';
import { PincodeForm } from './PincodeForm';
import { Plus, LayoutGrid, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { connect } from 'react-redux';
import { getPincodeData, createPincode, updatePincode, deletePincode, resetStatus } from '@/features/location/store/actions';
import type { RootState } from '@/store/store';
import * as types from '@/features/location/store/action-types';
import { cn } from '@/utils/cn';

export interface PincodeType {
    id: number;
    locationId: number;
    pincodeCode: string;
    name: string;
    areaName: string;
    latitude: number;
    longitude: number;
    isActive: boolean;
}

export type PincodeFormData = Omit<PincodeType, 'id' | 'locationId'>;

const emptyForm: PincodeFormData = {
    pincodeCode: '',
    name: '',
    areaName: '',
    latitude: 0,
    longitude: 0,
    isActive: true
};

interface PincodeProps {
    locationId: number;
    pincodes: PincodeType[];
    loadingPincodes: boolean;
    pincodeError: string | null;
    pincodeStatus: string;
    getPincodeData: (locationId: number) => void;
    createPincode: (data: any) => Promise<any>;
    updatePincode: (id: number, data: any) => Promise<any>;
    deletePincode: (id: number, locationId: number) => Promise<any>;
    resetStatus: () => void;
}

const PincodeComponent = ({
    locationId,
    pincodes,
    loadingPincodes,
    pincodeError,
    pincodeStatus,
    getPincodeData,
    createPincode,
    updatePincode,
    deletePincode,
    resetStatus
}: PincodeProps) => {

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState<PincodeFormData>(emptyForm);
    const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

    useEffect(() => {
        if (locationId) {
            getPincodeData(locationId);
        }
    }, [locationId, getPincodeData]);

    useEffect(() => {
        if (pincodeStatus === types.CREATE_PINCODE_SUCCESS) {
            toast.success('Pincode created successfully');
            resetStatus();
            handleCloseModal();
        } else if (pincodeStatus === types.UPDATE_PINCODE_SUCCESS) {
            toast.success('Pincode updated successfully');
            resetStatus();
            handleCloseModal();
        } else if (pincodeStatus === types.DELETE_PINCODE_SUCCESS) {
            toast.success('Pincode deleted successfully');
            resetStatus();
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        }
    }, [pincodeStatus, resetStatus]);

    useEffect(() => {
        if (pincodeError) {
            toast.error(pincodeError);
        }
    }, [pincodeError]);

    const handleOpenModal = (pincode: PincodeType | null = null) => {
        if (pincode) {
            setEditingId(pincode.id);
            setFormData({
                pincodeCode: pincode.pincodeCode,
                name: pincode.name,
                areaName: pincode.areaName,
                latitude: pincode.latitude || 0,
                longitude: pincode.longitude || 0,
                isActive: pincode.isActive,
            });
        } else {
            setEditingId(null);
            setFormData(emptyForm);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData(emptyForm);
        setEditingId(null);
    };

    const handleFormSubmit = async (submittedData: PincodeFormData) => {
        if (editingId) {
            updatePincode(editingId, {
                ...submittedData,
                locationId,
            });
        } else {
            createPincode({
                ...submittedData,
                locationId,
            });
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            deletePincode(deleteId, locationId);
        }
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredPincodes = useMemo(() => {
        if (!searchQuery.trim()) return pincodes;
        const query = searchQuery.toLowerCase();
        return pincodes.filter(pin =>
            (pin.pincodeCode && pin.pincodeCode.toLowerCase().includes(query)) ||
            (pin.name && pin.name.toLowerCase().includes(query)) ||
            (pin.areaName && pin.areaName.toLowerCase().includes(query))
        );
    }, [pincodes, searchQuery]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-max">
                    Service Areas ({filteredPincodes.length})
                </h3>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <SearchBar
                        className="w-full sm:w-64"
                        placeholder="Search pincodes or areas..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                    <Button variant="default" onClick={() => handleOpenModal()} className="h-9 px-3 text-xs gap-1.5 shadow-sm shrink-0">
                        <Plus size={14} /> Add Pincode
                    </Button>
                </div>
            </div>

            <div className="flex justify-end mb-4">
                <div className="flex bg-slate-100 dark:bg-gray-800 p-1 rounded-lg shrink-0">
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "p-1.5 rounded-md transition-all",
                            viewMode === 'list' ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                        title="List View"
                    >
                        <List size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('card')}
                        className={cn(
                            "p-1.5 rounded-md transition-all",
                            viewMode === 'card' ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                        title="Grid View"
                    >
                        <LayoutGrid size={16} />
                    </button>
                </div>
            </div>

            {
                loadingPincodes ? (
                    <div className="flex items-center justify-center p-10 text-slate-400">Loading...</div>
                ) : filteredPincodes.length === 0 ? (
                    <div className="bg-slate-50/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-gray-700 p-10 text-center flex flex-col items-center justify-center">
                        <div className="text-3xl mb-3 opacity-40">📮</div>
                        <div className="text-slate-500 font-medium text-sm">No pincodes found</div>
                        <div className="text-slate-400 text-xs mt-1">Try a different search query or add a new pincode</div>
                    </div>
                ) : viewMode === 'card' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                        {filteredPincodes.map((pin) => (
                            <div key={pin.id} className="relative group bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all flex flex-col justify-between min-h-[110px]">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg opacity-70">📮</span>
                                        <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">{pin.pincodeCode}</span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(pin); }} className="w-7 h-7 flex items-center justify-center rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(pin.id); }} className="w-7 h-7 flex items-center justify-center rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-end justify-between">
                                    <div className="min-w-0 pr-2">
                                        <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 truncate">{pin.name || 'Unnamed'}</div>
                                        <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{pin.areaName || 'No area specified'}</div>
                                    </div>
                                    <div className={cn(
                                        "shrink-0 w-2 h-2 rounded-full",
                                        pin.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-300 dark:bg-slate-600"
                                    )} title={pin.isActive ? "Active" : "Inactive"} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 pb-4">
                        {filteredPincodes.map((pin) => (
                            <div key={pin.id} className="group bg-white dark:bg-gray-800 rounded-lg p-3 border border-slate-200 dark:border-gray-700 shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className="flex items-center gap-3 w-[150px] shrink-0">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                                            <span className="text-lg">📮</span>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{pin.pincodeCode}</span>
                                    </div>

                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="flex-1 min-w-0 border-l border-slate-100 dark:border-gray-700 pl-4">
                                            <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 truncate">{pin.name || 'Unnamed'}</div>
                                            <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5 max-w-[200px]">{pin.areaName || 'No area specified'}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0 px-4 border-l border-slate-100 dark:border-gray-700">
                                        <div className="flex items-center gap-1.5 w-[80px]">
                                            <div className={cn(
                                                "shrink-0 w-2 h-2 rounded-full",
                                                pin.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-300 dark:bg-slate-600"
                                            )} />
                                            <span className="text-xs text-slate-500 font-medium">{pin.isActive ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2 relative z-10">
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenModal(pin); }} className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(pin.id); }} className="w-8 h-8 flex items-center justify-center rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit Pincode' : 'Add Pincode'}
            >
                <PincodeForm
                    initialData={editingId ? formData : undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    submitLabel={editingId ? 'Update' : 'Save'}
                />
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Pincode"
                title="Delete Pincode"
                description="This will permanently delete the pincode. Are you sure?"
            />
        </div >
    );
};

const mapStateToProps = (state: RootState) => ({
    pincodes: state.location.pincodes,
    loadingPincodes: state.location.loadingPincodes,
    pincodeError: state.location.pincodeError,
    pincodeStatus: state.location.pincodeStatus,
});

const mapDispatchToProps = {
    getPincodeData,
    createPincode,
    updatePincode,
    deletePincode,
    resetStatus,
};

export const Pincode = connect(mapStateToProps, mapDispatchToProps)(PincodeComponent);
