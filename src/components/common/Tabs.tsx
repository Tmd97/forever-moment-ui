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
        <div className={cn("w-[160px] min-w-[160px] border-r border-slate-100 dark:border-gray-800 py-4 px-2 flex flex-col gap-0.5 bg-slate-50/50 dark:bg-gray-900/50", className)}>
            {tabs.map((t) => (
                <button
                    key={t.id}
                    onClick={() => onTabChange(t.id)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12.5px] font-medium transition-all text-left w-full relative",
                        activeTab === t.id
                            ? "bg-white dark:bg-gray-800 text-violet-700 dark:text-violet-400 font-semibold shadow-sm"
                            : "text-slate-500 hover:bg-white/70 dark:hover:bg-gray-800/50 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    {activeTab === t.id && (
                        <span className="absolute left-1.5 w-0.5 h-4 bg-violet-600 dark:bg-violet-500 rounded-full" />
                    )}
                    <span className={activeTab === t.id ? "ml-2" : ""}>{t.label}</span>
                </button>
            ))}
        </div>
    );
};
