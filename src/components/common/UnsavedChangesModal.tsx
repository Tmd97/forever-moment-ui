import { Button } from '@/components/common/Button';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface UnsavedChangesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const UnsavedChangesModal = ({
    isOpen,
    onClose,
    onConfirm,
}: UnsavedChangesModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="You have unsaved changes in the work item"
            icon={AlertTriangle}
            className="sm:max-w-md"
            footer={
                <div className="flex justify-end gap-3 w-full">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="min-w-[100px] rounded-xl font-semibold text-slate-700"
                    >
                        Stay
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="min-w-[100px] rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-semibold"
                    >
                        Leave
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col items-center pt-2">
                <p className="text-gray-600 font-medium text-[15px]">Are you sure you want to leave?</p>
            </div>
        </Modal>
    );
};
