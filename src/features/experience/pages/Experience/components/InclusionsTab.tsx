import React, { useState } from 'react';
import { SearchBar } from '@/components/common/SearchBar';

interface InclusionsTabProps {
    inclusions: any[];
    experienceDetail: any;
    onToggleInclusion: (id: number, checked: boolean) => void;
}

export const InclusionsTab: React.FC<InclusionsTabProps> = ({ inclusions, experienceDetail, onToggleInclusion }) => {
    const [search, setSearch] = useState("");

    const filteredInclusions = inclusions.filter((inc: any) => {
        if (!inc.isActive) return false;
        if (!search) return true;
        return inc.description?.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="flex flex-col h-full space-y-4">
            <SearchBar
                className="w-full"
                inputClassName="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                placeholder="Search inclusions..."
                value={search}
                onChange={setSearch}
            />

            <div className="space-y-3">
                {filteredInclusions.map((inc: any) => {
                    const isAssigned = experienceDetail?.inclusions?.some((ei: any) => ei.id === inc.id) || false;
                    return (
                        <label key={inc.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                className="mt-1.5 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                checked={isAssigned}
                                onChange={(e) => onToggleInclusion(inc.id, e.target.checked)}
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight mb-1">{inc.description}</p>
                            </div>
                        </label>
                    );
                })}
                {filteredInclusions.length === 0 && (
                    <div className="text-center py-8 text-slate-400 dark:text-gray-500">
                        <p className="text-sm">No active inclusions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
