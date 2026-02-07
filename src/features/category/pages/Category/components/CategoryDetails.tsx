import { cn } from '@/utils/cn';
import type { CategoryType } from './Category';

interface CategoryDetailsProps {
    category: CategoryType;
    onEdit: () => void;
}

export const CategoryDetails = ({ category, onEdit }: CategoryDetailsProps) => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{category.count}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <span className={cn(
                        'mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        category.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    )}>
                        {category.status}
                    </span>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">#{category.id}</p>
                </div>
            </div>

        </div>
    );
};
