import { Button } from '@/components/admin/common/Button';
import { Modal } from './Modal';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemType?: string; // e.g. "Category", "Item"
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
            description={description || `Are you sure you want to delete this ${itemType}? This action cannot be undone.`}
        >
            <div className="flex justify-end gap-3 pt-6">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={() => {
                    onConfirm();
                    onClose();
                }}>
                    Delete
                </Button>
            </div>
        </Modal>
    );
};
