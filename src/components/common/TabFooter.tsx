import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TabFooterProps {
    isDirty: boolean;
    isSaving: boolean;
    onSave: () => void;
    onDiscard: () => void;
    changeCount?: number;
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
    saveLabel = "Save",
    discardLabel = "Discard",
    statusLabel = "Unsaved changes",
    className
}: TabFooterProps) => {
    if (!isDirty) return null;

    return (
        <div className={cn(
            "sticky bottom-[-32px] -mx-8 -mb-8 mt-auto py-3 pl-8 pr-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-slate-200 dark:border-gray-800 flex items-center justify-between animate-in fade-in slide-in-from-bottom-5 duration-300 z-[70] shadow-[0_-8px_20px_rgba(0,0,0,0.06)]",
            className
        )}>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium leading-tight">{statusLabel}</span>
                    {changeCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-amber-500 rounded-full shadow-sm">
                            {changeCount}
                        </span>
                    )}
                </div>
            </div>

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
};
