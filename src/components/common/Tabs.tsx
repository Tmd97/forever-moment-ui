import { cn } from "@/utils/cn";

export interface TabItem {
    id: string;
    label: string;
}

export interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (id: string) => void;
    variant?: "vertical" | "horizontal";
    className?: string;
}

export const Tabs = ({ tabs, activeTab, onTabChange, variant = "vertical", className }: TabsProps) => {
    if (variant === "horizontal") {
        return (
            <div className={cn("flex px-8 gap-6 border-b border-slate-100 dark:border-gray-800", className)}>
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => onTabChange(t.id)}
                        className={cn(
                            "bg-transparent border-none border-b-2 py-4 text-[13.5px] cursor-pointer transition-all tracking-wide -mb-[1px]",
                            activeTab === t.id
                                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                        )}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className={cn("w-[180px] min-w-[180px] border-r border-slate-100 dark:border-gray-800 p-3 flex flex-col gap-1 bg-white dark:bg-gray-900/50", className)}>
            {tabs.map((t) => (
                <button
                    key={t.id}
                    onClick={() => onTabChange(t.id)}
                    className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all text-left w-full",
                        activeTab === t.id
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-semibold"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-gray-800/50 dark:hover:text-slate-300"
                    )}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
};
