import { Button } from '@/components/common/Button';
import { Modal } from './Modal';
import { Trash2 } from 'lucide-react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemType?: string;
}

export const DeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    description,
    itemType = "item"
}: DeleteModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            icon={Trash2}
            footer={
                <div className="flex justify-end gap-3 w-full -mr-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="brand"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="w-full sm:w-auto"
                    >
                        Delete
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col pt-0">
                <p className="text-gray-500">{description || `Are you sure you want to delete this ${itemType}? This action cannot be undone.`}</p>
            </div>
        </Modal>
    );
};
