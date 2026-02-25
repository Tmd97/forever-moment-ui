import { cn } from '@/utils/cn';
import type { PincodeType } from './Pincode';
import { MapPin } from 'lucide-react';

interface PincodeCardProps {
    pincodes: PincodeType[];
    onEdit: (pin: PincodeType) => void;
    onDelete: (id: number) => void;
}

export const PincodeCardView = ({ pincodes, onEdit, onDelete }: PincodeCardProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
            {pincodes.map((pin) => (
                <div key={pin.id} className="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md hover:-translate-y-[2px] transition-all relative">
                    <div className="flex justify-between items-start mb-3.5">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", pin.isActive ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : "bg-slate-50 text-slate-400 dark:bg-gray-800/50 dark:text-slate-500")}>
                            <MapPin size={20} />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(pin); }} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(pin.id); }} className="p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                    </div>

                    <div className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{pin.pincodeCode}</div>
                    <div className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 mt-0.5 capitalize truncate">{pin.name || 'Unnamed'}</div>
                    <div className="text-[12px] text-slate-400 dark:text-slate-500 truncate">{pin.areaName || 'No area specified'}</div>

                    <div className="mt-4">
                        <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
                            pin.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-gray-800 dark:border-gray-700"
                        )}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", pin.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-500")} />
                            {pin.isActive ? "Active" : "Inactive"}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
