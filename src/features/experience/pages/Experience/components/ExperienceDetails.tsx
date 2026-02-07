import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';

export interface ExperienceType {
    id: number;
    title: string;
    category: string;
    price: string;
    status: string;
}

interface ExperienceDetailsProps {
    experience: ExperienceType;
    onEdit: () => void;
}

export const ExperienceDetails = ({ experience, onEdit }: ExperienceDetailsProps) => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{experience.category}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{experience.price}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <span className={cn(
                        'mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        experience.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    )}>
                        {experience.status}
                    </span>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">#{experience.id}</p>
                </div>
            </div>
            <div className="pt-4">
                <Button variant="default" className="w-full" onClick={onEdit}>
                    Edit Experience
                </Button>
            </div>
        </div>
    );
};
