import { cn } from '@/utils/cn';

export const LocationDetails = ({ location }: any) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            {[
                { label: "City", value: location.city },
                { label: "State", value: location.state },
                { label: "Country", value: location.country },
            ].map((item) => (
                <div key={item.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700 shadow-sm shadow-slate-100/50 dark:shadow-none hover:shadow-md transition-shadow">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">{item.label}</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white truncate" title={item.value || '-'}>{item.value || '-'}</div>
                </div>
            ))}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700 shadow-sm shadow-slate-100/50 dark:shadow-none hover:shadow-md transition-shadow">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Status</div>
                <div className="flex items-center">
                    <span
                        className={cn(
                            "inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-bold tracking-wide",
                            location.isActive
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                : "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400"
                        )}
                    >
                        <span
                            className={cn(
                                "w-2 h-2 rounded-full mr-2",
                                location.isActive ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-500"
                            )}
                        />
                        {location.isActive ? "Active" : "Inactive"}
                    </span>
                </div>
            </div>
        </div>
    );
};
