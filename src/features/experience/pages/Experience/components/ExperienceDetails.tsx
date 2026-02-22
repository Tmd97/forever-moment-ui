import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { ExperienceType } from './Experience';
import type { SidePanelTab } from '@/components/common/SidePanelTabs';

interface ExperienceDetailsProps {
    experience: ExperienceType;
    experienceDetail: any;
    inclusions: any[];
    cancellationPolicies: any[];
    onEdit: () => void;
    onToggleCancellationPolicy: (policyId: number, isAssociate: boolean) => void;
    onToggleInclusion: (inclusionId: number, isAssociate: boolean) => void;
}

export const getExperienceTabs = ({ experience, experienceDetail, inclusions, cancellationPolicies, onEdit, onToggleCancellationPolicy, onToggleInclusion }: ExperienceDetailsProps): SidePanelTab[] => {
    return [
        {
            id: 'general',
            label: 'General Information',
            content: (
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
                            <StatusBadge status={experience.status || 'Active'} className="mt-1" />
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
            )
        },
        {
            id: 'inclusions',
            label: 'Inclusions',
            content: (
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Inclusions</h3>
                    </div>
                    <div className="space-y-3">
                        {inclusions.map((inc) => {
                            const isAssigned = experienceDetail?.inclusions?.some((ei: any) => ei.id === inc.id) || false;
                            return (
                                <label key={inc.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        checked={isAssigned}
                                        onChange={(e) => onToggleInclusion(inc.id, e.target.checked)}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{inc.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {inc.isIncluded ? 'Included' : 'Not Included'} • {inc.isActive ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                </label>
                            );
                        })}
                        {inclusions.length === 0 && (
                            <p className="text-sm text-gray-500">No inclusions available.</p>
                        )}
                    </div>
                </div>
            )
        },
        {
            id: 'policies',
            label: 'Cancellation Policy',
            content: (
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cancellation Policies</h3>
                    </div>
                    <div className="space-y-3">
                        {cancellationPolicies.map((pol) => {
                            const isAssigned = experienceDetail?.cancellationPolicies?.some((ep: any) => ep.id === pol.id) || false;
                            return (
                                <label key={pol.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        checked={isAssigned}
                                        onChange={(e) => onToggleCancellationPolicy(pol.id, e.target.checked)}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{pol.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {pol.isIncluded ? 'Included' : 'Not Included'} • {pol.isActive ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                </label>
                            );
                        })}
                        {cancellationPolicies.length === 0 && (
                            <p className="text-sm text-gray-500">No policies available.</p>
                        )}
                    </div>
                </div>
            )
        }
    ];
};
