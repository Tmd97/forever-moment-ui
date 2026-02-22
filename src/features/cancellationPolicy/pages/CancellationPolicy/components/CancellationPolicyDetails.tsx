import { cn } from '@/utils/cn';
import type { CancellationPolicyType } from './CancellationPolicy';

interface CancellationPolicyDetailsProps {
    cancellationPolicy: CancellationPolicyType;
}

export const CancellationPolicyDetails = ({ cancellationPolicy }: CancellationPolicyDetailsProps) => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{cancellationPolicy.description}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Is Included?</h3>
                    <span className={cn(
                        'mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        cancellationPolicy.isIncluded ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    )}>
                        {cancellationPolicy.isIncluded ? 'Yes' : 'No'}
                    </span>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <span className={cn(
                        'mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        cancellationPolicy.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    )}>
                        {cancellationPolicy.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">#{cancellationPolicy.id}</p>
                </div>
            </div>
        </div>
    );
};
