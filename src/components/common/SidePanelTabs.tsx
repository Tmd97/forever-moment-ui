import React from 'react';
import { cn } from '@/utils/cn';

export interface SidePanelTab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface SidePanelTabsProps {
    tabs: SidePanelTab[];
    activeTabId: string;
    onTabChange: (id: string) => void;
}

export const SidePanelTabs = ({ tabs, activeTabId, onTabChange }: SidePanelTabsProps) => {
    return (
        <div className="w-48 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "px-6 py-3 text-sm font-medium text-left transition-colors relative",
                        activeTabId === tab.id
                            ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                    )}
                >
                    {activeTabId === tab.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600 dark:bg-blue-400" />
                    )}
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
