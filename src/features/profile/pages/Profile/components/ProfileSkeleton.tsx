import React from 'react';
import '../../css/styles.scss';

export const ProfileSkeleton: React.FC = () => {
    return (
        <div className="relative animate-pulse">
            {/* Avatar Section Skeleton */}
            <div className="avatarSection mb-8 flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="h-24 w-24 rounded-[20px] bg-slate-200 dark:bg-gray-800 shrink-0"></div>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <div className="h-6 w-3/4 bg-slate-200 dark:bg-gray-800 rounded-md"></div>
                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-gray-800 rounded-md"></div>
                    <div className="h-8 w-1/3 bg-slate-200 dark:bg-gray-800 rounded-lg mt-2"></div>
                </div>
            </div>

            {/* Personal Info Skeleton */}
            <div className="section mb-8">
                <div className="h-5 w-32 bg-slate-200 dark:bg-gray-800 rounded-md mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="field">
                        <div className="h-4 w-20 bg-slate-200 dark:bg-gray-800 rounded-md mb-2"></div>
                        <div className="h-10 w-full bg-slate-100 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700"></div>
                    </div>
                    <div className="field">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-gray-800 rounded-md mb-2"></div>
                        <div className="h-10 w-full bg-slate-100 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700"></div>
                    </div>
                </div>
            </div>

            {/* Contact Info Skeleton */}
            <div className="section mb-8">
                <div className="h-5 w-40 bg-slate-200 dark:bg-gray-800 rounded-md mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="field">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-gray-800 rounded-md mb-2"></div>
                        <div className="h-10 w-full bg-slate-100 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700"></div>
                    </div>
                    <div className="field">
                        <div className="h-4 w-28 bg-slate-200 dark:bg-gray-800 rounded-md mb-2"></div>
                        <div className="h-10 w-full bg-slate-100 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700"></div>
                    </div>
                    <div className="field md:col-span-2">
                        <div className="h-4 w-32 bg-slate-200 dark:bg-gray-800 rounded-md mb-2"></div>
                        <div className="h-10 w-full bg-slate-100 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700"></div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 mt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="h-10 w-32 bg-slate-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
        </div>
    );
};
