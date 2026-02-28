import { Dialog, DialogContent } from './Dialog';
import { AlertTriangle, XCircle } from 'lucide-react';

interface ChangeDetail {
    field: string;
    original: any;
    current: any;
}

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
            <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden border-none bg-[#faf8f5] shadow-[0_32px_64px_rgba(0,0,0,0.14)] rounded-[20px]">
                <div className="relative p-10 pt-12 pb-8">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#ede9e3] text-[#6b6560] flex items-center justify-center transition-all hover:bg-[#e0dbd4] hover:scale-105"
                    >
                        <XCircle size={18} />
                    </button>

                    {/* Icon */}
                    <div className="w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] border-[1.5px] border-[#bfdbfe] flex items-center justify-center mb-5">
                        <AlertTriangle className="text-[#2563eb]" size={24} />
                    </div>

                    {/* Unsaved Badge with hover tooltip */}
                    {changeCount > 0 && (
                        <div className="group relative inline-flex">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 text-[12px] font-semibold text-[#b35c00] bg-[#fff3e0] border border-[#ffe0b2] rounded-full cursor-help whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#f57c00] animate-pulse" />
                                {changeCount} unsaved {changeCount === 1 ? 'change' : 'changes'}
                            </div>

                            {/* Hover Details Tooltip */}
                            {changes.length > 0 && (
                                <div className="absolute top-full left-0 mt-1 w-64 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-slate-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Change Details</div>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                                        {changes.map((change, idx) => (
                                            <div key={idx} className="text-[12px] leading-tight">
                                                <div className="font-semibold text-slate-700 dark:text-slate-200">{change.field}</div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-slate-400 line-through truncate max-w-[80px]">{String(change.original || 'Empty')}</span>
                                                    <span className="text-slate-300">→</span>
                                                    <span className="text-blue-600 font-medium truncate max-w-[80px]">{String(change.current || 'Empty')}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <h2 className="font-serif text-[22px] font-semibold text-[#1f1c18] leading-tight mb-2.5 tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                        {title}
                    </h2>

                    <p className="text-[14.5px] text-[#6b6560] leading-relaxed mb-7" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {description || (
                            <>
                                You have <strong className="text-[#3d3830] font-medium">unsaved changes</strong> in this {itemName}.
                                If you leave now, your edits will be permanently lost.
                            </>
                        )}
                    </p>

                    <div className="h-px bg-gradient-to-r from-transparent via-[#e0dbd4] to-transparent mb-6" />

                    <div className="flex gap-2.5">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-5 rounded-xl bg-[#ede9e3] border-[1.5px] border-[#d8d2ca] text-[14.5px] font-medium text-[#3d3830] transition-all hover:bg-[#e4dfd8] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:translate-y-0"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Stay & keep editing
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-br from-[#1d4ed8] to-[#2563eb] text-[14.5px] font-medium text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all hover:from-[#1e40af] hover:to-[#1d4ed8] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] active:translate-y-0"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Leave anyway
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
