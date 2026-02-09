import { Lock } from 'lucide-react';

export const LoginHeader = () => {
    return (
        <div className="text-center space-y-3">
            <div className="mx-auto h-12 w-12 bg-indigo-100/80 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center shadow-sm">
                <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/80 dark:bg-slate-800/70 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">
                Secure access
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight font-display">
                Welcome back
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                Sign in to manage events, vendors, and staffing in one place.
            </p>
        </div>
    );
};
