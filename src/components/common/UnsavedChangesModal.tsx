import { useState } from 'react';
import { Dialog, DialogContent } from './Dialog';
import { AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const ChangeContent = ({ value }: { value: any }) => {
    const valString = String(value || 'Empty');

    // Status badges rendering logic
    if (valString.toLowerCase() === 'active') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[11px] font-bold">
                <span className="w-1 h-1 rounded-full bg-green-600" /> Active
            </span>
        );
    }
    if (valString.toLowerCase() === 'inactive') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                <span className="w-1 h-1 rounded-full bg-slate-400" /> Inactive
            </span>
        );
    }

    return (
        <span className="truncate max-w-full" title={valString}>
            {valString}
        </span>
    );
};

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
    const [expandedFields, setExpandedFields] = useState<Record<number, boolean>>({});

    const toggleField = (idx: number) => {
        setExpandedFields(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const expandAll = () => {
        const newState: Record<number, boolean> = {};
        changes.forEach((_, i) => newState[i] = true);
        setExpandedFields(newState);
    };

    const collapseAll = () => {
        setExpandedFields({});
    };

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

                {/* Toolbar */}
                <div className="px-6 py-2.5 flex items-center justify-between border-b border-[#ede7dd] bg-[#faf9f7]">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#9e8e7e] uppercase tracking-wider">Changes</span>
                        <span className="bg-[#f0a500] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                            {changeCount}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={expandAll} className="text-[12px] font-medium text-[#7a6a5a] hover:text-[#1a1410] transition-colors font-sans">Expand all</button>
                        <span className="text-[#d0c8be] text-[12px]">·</span>
                        <button onClick={collapseAll} className="text-[12px] font-medium text-[#7a6a5a] hover:text-[#1a1410] transition-colors font-sans">Collapse all</button>
                    </div>
                </div>

                {/* Diff List */}
                <div className="max-h-[340px] overflow-y-auto px-5 py-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {changes.map((change, idx) => {
                        const isExpanded = expandedFields[idx];
                        return (
                            <div key={idx} className="bg-white border-[1.5px] border-[#e8e0d5] rounded-[11px] overflow-hidden transition-colors hover:border-[#c8bfb3]">
                                <button
                                    onClick={() => toggleField(idx)}
                                    className={cn(
                                        "w-full px-3.5 py-3 flex items-center gap-3 text-left transition-colors",
                                        isExpanded && "bg-[#f7f4f0]"
                                    )}
                                >
                                    <span className="text-[13px] font-bold text-[#2d2520] min-w-[90px]">{change.field}</span>

                                    {!isExpanded && (
                                        <div className="flex-1 flex items-center gap-2 overflow-hidden">
                                            <div className="max-w-[120px] px-2 py-0.5 rounded-md bg-red-50 border border-red-100 text-red-700 text-[11px] font-medium truncate">
                                                <ChangeContent value={change.original} />
                                            </div>
                                            <ChevronRight size={10} className="text-slate-300 shrink-0" strokeWidth={3} />
                                            <div className="max-w-[120px] px-2 py-0.5 rounded-md bg-green-50 border border-green-100 text-green-700 text-[11px] font-medium truncate">
                                                <ChangeContent value={change.current} />
                                            </div>
                                        </div>
                                    )}

                                    <ChevronDown
                                        size={14}
                                        className={cn("ml-auto text-[#b0a090] transition-transform duration-200", isExpanded && "rotate-180")}
                                        strokeWidth={2.5}
                                    />
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-[#f0ece6] animate-in slide-in-from-top-1 duration-200 bg-[#fdfcfb]">
                                        {/* WAS Row */}
                                        <div className="grid grid-cols-[40px_1fr] gap-3 px-3.5 py-3 border-b border-[#f5f0ea]">
                                            <span className="text-[9px] font-bold bg-[#fee2e2] text-[#b91c1c] px-1 py-0.5 rounded text-center self-start mt-0.5">WAS</span>
                                            <div className="text-[13px] text-[#5c544e] leading-relaxed overflow-hidden">
                                                <ChangeContent value={change.original} />
                                            </div>
                                        </div>
                                        {/* IS Row */}
                                        <div className="grid grid-cols-[40px_1fr] gap-3 px-3.5 py-3 bg-[#f0f9ff]/30">
                                            <span className="text-[9px] font-bold bg-[#dcfce7] text-[#15803d] px-1 py-0.5 rounded text-center self-start mt-0.5">IS</span>
                                            <div className="text-[13px] text-[#1e1b18] font-semibold leading-relaxed overflow-hidden">
                                                <ChangeContent value={change.current} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

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
