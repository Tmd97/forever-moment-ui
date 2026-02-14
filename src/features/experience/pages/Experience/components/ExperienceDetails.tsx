import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { ExperienceType } from './Experience';

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
                    <StatusBadge status={experience.status} className="mt-1" />
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
