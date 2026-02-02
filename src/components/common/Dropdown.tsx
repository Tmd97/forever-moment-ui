import React, { forwardRef } from 'react';

interface Option {
    label: string;
    value: string | number;
}

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Option[];
    error?: string;
    placeholder?: string;
}

const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
    ({ label, options, error, placeholder, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={`
              w-full px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg shadow-sm appearance-none
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200
              disabled:opacity-60 disabled:bg-gray-100 dark:disabled:bg-gray-700
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'}
              ${className}
            `}
                        {...props}
                    >
                        {placeholder && <option value="" disabled selected>{placeholder}</option>}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {/* Custom Chevron Icon */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                        </svg>
                    </div>
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-600 animate-pulse">{error}</p>
                )}
            </div>
        );
    }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
