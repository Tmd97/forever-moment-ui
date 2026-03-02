import { Dialog, DialogContent } from './Dialog';
import { AlertTriangle } from 'lucide-react';
import { ChangesViewer } from './ChangesViewer';
import type { ChangeDetail } from './ChangesViewer';

interface UnsavedChangesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    itemName?: string;
    description?: string;
    changeCount?: number;
    changes?: ChangeDetail[];
}



export const UnsavedChangesModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Leave without saving?",
    itemName = "work item",
    description,
    changeCount = 0,
    changes = [],
}: UnsavedChangesModalProps) => {


    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden border-none bg-[#faf9f7] shadow-[0_32px_80px_rgba(0,0,0,0.5)] rounded-[20px]">
                {/* Header */}
                <div className="bg-[#fff8ed] border-b border-[#f0e8d8] p-6 pb-4 flex items-start gap-4">
                    <div className="w-[42px] h-[42px] bg-gradient-to-br from-[#fff3cd] to-[#ffd97d] rounded-[11px] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(255,180,0,0.25)]">
                        <AlertTriangle className="text-[#b45309]" size={20} />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-serif text-[20px] font-bold text-[#1a1410] leading-tight mb-0.5" style={{ fontFamily: "'Instrument Serif', serif" }}>
                            {title}
                        </h2>
                        <div className="text-[13px] text-[#6b6053] leading-relaxed">
                            {description || (
                                <>
                                    You have <strong className="text-[#1a1410] font-semibold">{changeCount} unsaved {changeCount === 1 ? 'change' : 'changes'}</strong> in this {itemName}.
                                    Leaving now will permanently discard your edits.
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <ChangesViewer changes={changes} maxHeight="340px" />

                {/* Footer Buttons */}
                <div className="p-6 pt-4 border-t-[1.5px] border-[#ede7dd] bg-[#faf9f7] flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 px-5 rounded-xl bg-[#ede7dd] text-[14px] font-bold text-[#4a3f35] transition-all hover:bg-[#e0d8cc] active:scale-[0.98]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Stay & keep editing
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-br from-[#1d4ed8] to-[#2563eb] text-[14px] font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all hover:from-[#1e40af] hover:to-[#1d4ed8] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] active:translate-y-0 active:scale-[0.98]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Discard & leave
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
