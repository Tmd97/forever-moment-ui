import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from './Dialog';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    icon?: React.ElementType;
    className?: string;
    footer?: React.ReactNode;
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    icon: Icon,
    className,
    footer,
}: ModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={cn(Icon ? 'overflow-visible' : '', footer ? 'pb-2' : '', className || 'sm:max-w-xl')}>
                {Icon && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border-4 border-white bg-red-50 p-2 dark:border-gray-900 dark:bg-red-900/20">
                        <Icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                )}
                <DialogHeader className={Icon ? 'pt-6' : ''}>
                    <DialogTitle className={Icon ? 'text-left text-blue-700' : 'text-center'}>{title}</DialogTitle>
                    {description && <DialogDescription className={Icon ? 'text-left' : 'text-center'}>{description}</DialogDescription>}
                </DialogHeader>
                {children}
                {footer && <DialogFooter className="mt-6">{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    );
};
