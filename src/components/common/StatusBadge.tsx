import { cn } from '@/utils/cn';

interface StatusBadgeProps {
    /** Boolean mode: pass isActive for true/false status */
    isActive?: boolean;
    /** String mode: pass status string value */
    status?: string;
    /** The value that should be considered "active" in string mode (default: "Active") */
    activeValue?: string;
    className?: string;
}

export const StatusBadge = ({ isActive, status, activeValue = 'Active', className }: StatusBadgeProps) => {
    // Determine active state from either boolean or string prop
    const active = isActive !== undefined ? isActive : status === activeValue;
    const label = isActive !== undefined ? (active ? 'Active' : 'Inactive') : (status || '-');

    return (
        <span className={cn(
            'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
            active
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
            className
        )}>
            {label}
        </span>
    );
};
