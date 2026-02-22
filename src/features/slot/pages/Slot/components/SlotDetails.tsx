import { cn } from '@/utils/cn';
import type { SlotType } from './Slot';

interface SlotDetailsProps {
    slot: SlotType;
    onEdit: () => void;
}

export const SlotDetails = ({ slot }: SlotDetailsProps) => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {slot.startTime && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Time</h3>
                        <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                            {slot.startTime}
                        </p>
                    </div>
                )}
                {slot.endTime && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">End Time</h3>
                        <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                            {slot.endTime}
                        </p>
                    </div>
                )}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <span className={cn(
                        'mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        slot.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    )}>
                        {slot.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">#{slot.id}</p>
                </div>
            </div>
        </div>
    );
};
