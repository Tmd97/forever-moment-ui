import {
    Dialog,
    DialogContent,
} from './Dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export type ModalVariant = 'primary' | 'danger' | 'warning' | 'info';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: React.ReactNode;
    icon?: React.ElementType;
    variant?: ModalVariant;
    className?: string;
    footer?: React.ReactNode;
    showCloseButton?: boolean;
}

const variantStyles = {
    primary: {
        headerBg: 'bg-[#f0f7ff]',
        headerBorder: 'border-[#e0efff]',
        iconContainer: 'from-[#e0f2fe] to-[#bae6fd]',
        iconColor: 'text-[#0284c7]',
        iconShadow: 'shadow-[0_2px_8px_rgba(2,132,199,0.15)]',
    },
    danger: {
        headerBg: 'bg-[#fff5f5]',
        headerBorder: 'border-[#fee2e2]',
        iconContainer: 'from-[#fee2e2] to-[#fecaca]',
        iconColor: 'text-[#dc2626]',
        iconShadow: 'shadow-[0_2px_8px_rgba(220,38,38,0.15)]',
    },
    warning: {
        headerBg: 'bg-[#fff8ed]',
        headerBorder: 'border-[#fef3c7]',
        iconContainer: 'from-[#fef3c7] to-[#fde68a]',
        iconColor: 'text-[#d97706]',
        iconShadow: 'shadow-[0_2px_8px_rgba(217,119,6,0.15)]',
    },
    info: {
        headerBg: 'bg-[#f8fafc]',
        headerBorder: 'border-[#f1f5f9]',
        iconContainer: 'from-[#f1f5f9] to-[#e2e8f0]',
        iconColor: 'text-[#475569]',
        iconShadow: 'shadow-[0_2px_8px_rgba(71,85,105,0.1)]',
    }
};

export const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    icon: Icon,
    variant = 'info',
    className,
    footer,
    showCloseButton = false,
}: ModalProps) => {
    const styles = variantStyles[variant];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className={cn(
                    "p-0 overflow-hidden border-none bg-white shadow-[0_32px_80px_rgba(0,0,0,0.35)] rounded-[20px] w-[calc(100%-2rem)] mx-auto sm:w-full",
                    className || 'sm:max-w-md'
                )}
            >
                {/* Header Section */}
                <div className={cn("p-8 flex flex-col items-center text-center border-b", styles.headerBg, styles.headerBorder)}>
                    {Icon && (
                        <div className={cn(
                            "w-[52px] h-[52px] bg-gradient-to-br rounded-[14px] flex items-center justify-center mb-5",
                            styles.iconContainer,
                            styles.iconShadow
                        )}>
                            <Icon size={24} className={styles.iconColor} />
                        </div>
                    )}

                    <h2
                        className="text-[24px] font-bold text-[#1a1410] leading-tight mb-2"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                        {title}
                    </h2>

                    {description && (
                        <p className="text-[14px] text-[#64748b] leading-relaxed max-w-[280px]">
                            {description}
                        </p>
                    )}

                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Content Area */}
                {children && (
                    <div className="px-8 py-6">
                        {children}
                    </div>
                )}

                {/* Footer Section */}
                {footer ? (
                    <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
                        {footer}
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};
