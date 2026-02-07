import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useEffect, useRef, useState } from 'react';

import { SidePanelTabs, type SidePanelTab } from './SidePanelTabs';

interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    tabs?: SidePanelTab[];
    className?: string;
    variant?: 'overlay' | 'inline';
    defaultTab?: string;
}

export const SidePanel = ({ isOpen, onClose, title, children, tabs, className, variant = 'inline', defaultTab }: SidePanelProps) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const [activeTabId, setActiveTabId] = useState<string>(defaultTab || (tabs?.[0]?.id || ''));

    // Reset active tab when tabs change or panel opens
    useEffect(() => {
        if (tabs && tabs.length > 0) {
            if (!activeTabId || !tabs.find(t => t.id === activeTabId)) {
                setActiveTabId(tabs[0].id);
            }
        }
    }, [tabs, isOpen, activeTabId]);

    const activeContent = tabs ? tabs.find(t => t.id === activeTabId)?.content : children;

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Only lock body scroll for overlay
            if (variant === 'overlay') {
                document.body.style.overflow = 'hidden';
            }
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, variant]);

    // Handle clicking outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    if (variant === 'inline') {
        return (
            <div
                className={cn(
                    "w-[400px] shrink-0 bg-transparent border-l border-gray-200 dark:border-gray-800 flex flex-col h-full",
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex min-h-0">
                    {tabs && tabs.length > 0 && (
                        <SidePanelTabs
                            tabs={tabs}
                            activeTabId={activeTabId}
                            onTabChange={setActiveTabId}
                        />
                    )}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeContent}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={handleBackdropClick}
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className={cn(
                    "relative w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-200 dark:border-gray-800",
                    isOpen ? "translate-x-0" : "translate-x-full",
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex min-h-0">
                    {tabs && tabs.length > 0 && (
                        <SidePanelTabs
                            tabs={tabs}
                            activeTabId={activeTabId}
                            onTabChange={setActiveTabId}
                        />
                    )}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeContent}
                    </div>
                </div>
            </div>
        </div>
    );
};
