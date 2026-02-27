import { cn } from '@/utils/cn';

interface CellProps {
    children?: React.ReactNode;
    full?: boolean;
    className?: string;
}

export const Cell = ({ children, full = false, className: cls = '' }: CellProps) => (
    <div className={cn('bg-white dark:bg-gray-900 px-4 py-3 transition-colors hover:bg-slate-50/60 dark:hover:bg-gray-800/40', full && 'col-span-2', cls)}>
        {children}
    </div>
);

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-semibold tracking-[0.09em] uppercase text-slate-400 dark:text-slate-500 mb-2 mt-5 first:mt-0">
        {children}
    </p>
);

export const FieldGrid = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("grid grid-cols-2 gap-px bg-slate-200 dark:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-xl overflow-hidden mb-1", className)}>
        {children}
    </div>
);

export const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-slate-400 dark:text-slate-500 mb-1">{children}</p>
);
