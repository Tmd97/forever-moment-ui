import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ChangesViewer } from './ChangesViewer';

interface TabFooterProps {
    isDirty: boolean;
    isSaving: boolean;
    onSave: () => void;
    onDiscard: () => void;
    changeCount?: number;
    changes?: any[];
    saveLabel?: string;
    discardLabel?: string;
    statusLabel?: string;
    className?: string;
}

export const TabFooter = ({
    isDirty,
    isSaving,
    onSave,
    onDiscard,
    changeCount = 0,
    changes,
    saveLabel = "Save",
    discardLabel = "Discard",
    statusLabel = "Unsaved changes",
    className
}: TabFooterProps) => {
    const [showChanges, setShowChanges] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const actualCount = changes ? changes.length : changeCount;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setShowChanges(false);
            }
        };

        if (showChanges) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showChanges]);

    if (!isDirty) return null;

    const footerContent = (
        <div className={cn(
            "py-3 pl-8 pr-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-slate-200 dark:border-gray-800 flex items-center justify-between animate-in fade-in slide-in-from-bottom-5 duration-300 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] relative",
            className
        )}>
            {/* Popover */}
            {showChanges && changes && changes.length > 0 && (
                <div
                    ref={popoverRef}
                    className="absolute bottom-full left-8 mb-4 w-[400px] bg-white rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#ede7dd] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-[80]"
                >
                    <ChangesViewer changes={changes} maxHeight="280px" />
                </div>
            )}

            <button
                type="button"
                onClick={() => setShowChanges(!showChanges)}
                className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors bg-transparent border-none appearance-none cursor-pointer p-1 -m-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium leading-tight">{statusLabel}</span>
                    {actualCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-amber-500 rounded-full shadow-sm">
                            {actualCount}
                        </span>
                    )}
                </div>
            </button>

            <div className="flex items-center gap-3">
                <button
                    onClick={onDiscard}
                    disabled={isSaving}
                    className="px-4 py-1.5 rounded-[8px] border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[12px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {discardLabel}
                </button>
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="px-4 py-1.5 rounded-[8px] bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold flex items-center gap-2 shadow-[0_4px_12px_rgba(37,99,235,0.2)] transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {isSaving ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Check size={14} strokeWidth={2.5} />
                    )}
                    {saveLabel}
                </button>
            </div>
        </div>
    );

    const portalTarget = document.getElementById('crud-tab-footer-portal');
    if (portalTarget) {
        return createPortal(footerContent, portalTarget);
    }

    return footerContent;
};
