import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/utils/cn';

interface DatePickerProps {
    label?: string;
    selected: Date | null;
    onChange: (date: Date | null) => void;
    showTimeSelect?: boolean;
    showTimeSelectOnly?: boolean;
    timeIntervals?: number;
    timeCaption?: string;
    dateFormat?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    placeholderText?: string;
    onBlur?: () => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    label,
    selected,
    onChange,
    showTimeSelect,
    showTimeSelectOnly,
    timeIntervals = 60,
    timeCaption = "Time",
    dateFormat = "h:mm aa",
    className,
    disabled,
    required,
    placeholderText,
    onBlur
}) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <ReactDatePicker
                selected={selected}
                onChange={onChange}
                showTimeSelect={showTimeSelect}
                showTimeSelectOnly={showTimeSelectOnly}
                timeIntervals={timeIntervals}
                timeCaption={timeCaption}
                dateFormat={dateFormat}
                disabled={disabled}
                required={required}
                placeholderText={placeholderText}
                onBlur={onBlur}
                className={cn(
                    "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
            />
        </div>
    );
};
