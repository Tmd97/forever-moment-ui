import { cn } from '@/utils/cn';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import type { SlotType } from './Slot';

interface SlotDetailsProps {
    slot: SlotType;
    onEdit: () => void;
    updateSlot: (id: number, data: any) => Promise<any>;
}

export const SlotDetails = ({ slot, updateSlot }: SlotDetailsProps) => {
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
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                    <div className="flex items-center -mx-1 -mt-1">
                        <EditableStatusBadge
                            status={slot.isActive ? 'Active' : 'Inactive'}
                            options={['Active', 'Inactive']}
                            onChange={async (val) => {
                                const newStatus = val === 'Active';
                                if (newStatus === slot.isActive) return;
                                try {
                                    await updateSlot(slot.id, {
                                        name: slot.name,
                                        startTime: slot.startTime,
                                        endTime: slot.endTime,
                                        isActive: newStatus
                                    });
                                } catch (error) { console.error('Failed to update status', error); }
                            }}
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">#{slot.id}</p>
                </div>
            </div>
        </div>
    );
};
