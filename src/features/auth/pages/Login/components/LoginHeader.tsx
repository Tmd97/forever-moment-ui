import { Lock } from 'lucide-react';

export const LoginHeader = () => {
    return (
        <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Sign in to access your admin dashboard
            </p>
        </div>
    );
};
