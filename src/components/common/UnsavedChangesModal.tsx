import { useState } from 'react';
import { Dialog, DialogContent } from './Dialog';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

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
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden border-none bg-[#faf8f5] shadow-[0_32px_64px_rgba(0,0,0,0.14)] rounded-[20px]">
                <div className="relative p-10 pt-12 pb-8">
                    {/* Icon */}
                    <div className="w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] border-[1.5px] border-[#bfdbfe] flex items-center justify-center mb-5">
                        <AlertTriangle className="text-[#2563eb]" size={24} />
                    </div>

                    {/* Unsaved Badge - Clickable for details */}
                    {changeCount > 0 && (
                        <div className="mb-4">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#b35c00] bg-[#fff3e0] border border-[#ffe0b2] rounded-full transition-all hover:bg-[#ffe0b2] active:scale-95 shadow-sm group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#f57c00] animate-pulse" />
                                {changeCount} unsaved {changeCount === 1 ? 'change' : 'changes'}
                                {isExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
                            </button>

                            {/* Details Panel - Expands on click */}
                            {isExpanded && changes.length > 0 && (
                                <div className="mt-3 bg-white/60 backdrop-blur-md rounded-2xl border border-[#ede9e3] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="px-5 py-3 border-b border-[#f0ede9] bg-[#fdfcfb]">
                                        <div className="text-[10px] font-bold text-[#a19992] uppercase tracking-[0.08em]">Detailed Changes</div>
                                    </div>
                                    <div className="p-4 space-y-3 max-h-[220px] overflow-y-auto scrollbar-thin">
                                        {changes.map((change, idx) => (
                                            <div key={idx} className="group/item">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[12px] font-bold text-[#3d3830]">{change.field}</span>
                                                </div>
                                                <div className="flex flex-col gap-1.5 ml-1">
                                                    <div className="flex items-center gap-2 group/val">
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#fef2f2] text-[#991b1b] font-bold uppercase tracking-wider min-w-[32px] text-center">Was</span>
                                                        <span
                                                            className="text-[13px] text-[#6b6560] truncate max-w-[380px] hover:text-[#3d3830] transition-colors cursor-help"
                                                            title={String(change.original || 'Empty')}
                                                        >
                                                            {String(change.original || 'Empty')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 group/val">
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#f0f9ff] text-[#075985] font-bold uppercase tracking-wider min-w-[32px] text-center">Is</span>
                                                        <span
                                                            className="text-[13px] text-[#0369a1] font-semibold truncate max-w-[380px] hover:text-[#0c4a6e] transition-colors cursor-help"
                                                            title={String(change.current || 'Empty')}
                                                        >
                                                            {String(change.current || 'Empty')}
                                                        </span>
                                                    </div>
                                                </div>
                                                {idx < changes.length - 1 && <div className="mt-3 border-b border-dashed border-[#ede9e3]" />}
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
