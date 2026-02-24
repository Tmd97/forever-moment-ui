import { StatusBadge } from '@/components/common/StatusBadge';
import type { ExperienceType } from './Experience';
import type { SidePanelTab } from '@/components/common/SidePanelTabs';

interface ExperienceDetailsProps {
    experience: ExperienceType;
    experienceDetail: any;
    inclusions: any[];
    cancellationPolicies: any[];
    onToggleCancellationPolicy: (policyId: number, isAssociate: boolean) => void;
    onToggleInclusion: (inclusionId: number, isAssociate: boolean) => void;
}

export const getExperienceTabs = ({ experience, experienceDetail, inclusions, cancellationPolicies, onToggleCancellationPolicy, onToggleInclusion }: ExperienceDetailsProps): SidePanelTab[] => {
    return [
        {
            id: 'general',
            label: 'General Information',
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{experience.name || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{experience.category || '-'}</p>
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
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Slug</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{experience.slug || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tag Name</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{experience.tagName || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Featured</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{experience.isFeatured ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration (Minutes)</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{experience.durationMinutes || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Capacity</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{experience.maxCapacity || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Min Age</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{experience.minAge || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Time</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{experience.completionTime || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Min Hours</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{experience.minHours || '-'}</p>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Short Description</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100 whitespace-pre-line">{experience.shortDescription || '-'}</p>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100 whitespace-pre-line">{experience.description || '-'}</p>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Terms & Conditions</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100 whitespace-pre-line">{experience.termsConditions || '-'}</p>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">What to Bring</h3>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100 whitespace-pre-line">{experience.whatToBring || '-'}</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'inclusions',
            label: 'Inclusions',
            content: (
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
            )
        },
        {
            id: 'policies',
            label: 'Cancellation Policy',
            content: (
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
            )
        }
    ];
};
