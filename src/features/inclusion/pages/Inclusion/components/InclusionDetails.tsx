import { cn } from '@/utils/cn';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import type { InclusionType } from './Inclusion';

interface InclusionDetailsProps {
    inclusion: InclusionType;
    onEdit: () => void;
    updateInclusion: (id: number, data: any) => Promise<any>;
}

export const InclusionDetails = ({ inclusion, onEdit, updateInclusion }: InclusionDetailsProps) => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{inclusion.description}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Is Included?</h3>
                    <span className={cn(
                        'mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        inclusion.isIncluded ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    )}>
                        {inclusion.isIncluded ? 'Yes' : 'No'}
                    </span>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                    <div className="flex items-center -ml-2">
                        <EditableStatusBadge
                            status={inclusion.isActive ? 'Active' : 'Inactive'}
                            options={['Active', 'Inactive']}
                            onChange={async (val) => {
                                const newStatus = val === 'Active';
                                if (newStatus === inclusion.isActive) return;
                                try {
                                    await updateInclusion(inclusion.id, {
                                        description: inclusion.description,
                                        isIncluded: inclusion.isIncluded,
                                        isActive: newStatus,
                                        displayOrder: inclusion.displayOrder || 0
                                    });
                                } catch (e) { console.error(e); }
                            }}
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">#{inclusion.id}</p>
                </div>
            </div>
        </div>
    );
};
