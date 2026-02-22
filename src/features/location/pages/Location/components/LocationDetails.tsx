import { cn } from '@/utils/cn';
import type { LocationType } from './Location';

interface LocationDetailsProps {
    location: LocationType;
    onEdit: () => void;
}

export const LocationDetails = ({ location }: LocationDetailsProps) => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {location.city && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">City</h3>
                        <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{location.city}</p>
                    </div>
                )}

                {location.state && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">State</h3>
                        <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{location.state}</p>
                    </div>
                )}
                {location.country && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</h3>
                        <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{location.country}</p>
                    </div>
                )}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <span className={cn(
                        'mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        location.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    )}>
                        {location.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">#{location.id}</p>
                </div>
            </div>
        </div>
    );
};
