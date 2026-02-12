import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import type { SubCategoryType } from './SubCategory';

interface SubCategoryDetailsProps {
    subCategory: SubCategoryType;
    onEdit: () => void;
}

export const SubCategoryDetails = ({ subCategory, onEdit }: SubCategoryDetailsProps) => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{subCategory.description || '-'}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{subCategory.count}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <span className={cn(
                        'mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        subCategory.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    )}>
                        {subCategory.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">#{subCategory.id}</p>
                </div>
            </div>
            <div className="pt-4">
                <Button variant="default" className="w-full" onClick={onEdit}>
                    Edit Sub Category
                </Button>
            </div>
        </div>
    );
};
