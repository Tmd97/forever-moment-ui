import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        className={`
              w-full px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg shadow-sm placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200
              disabled:opacity-60 disabled:bg-gray-100 dark:disabled:bg-gray-700
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'}
              ${className}
            `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-600 animate-pulse">{error}</p>
                )}
                {!error && helperText && (
                    <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
