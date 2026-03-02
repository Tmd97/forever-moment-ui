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
            description={description || `Are you sure you want to delete this ${itemType}? This action cannot be undone.`}
            icon={Trash2}
            variant="danger"
            className="sm:max-w-lg"
            footer={
                <>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-5 rounded-xl bg-[#f1f5f9] text-[14px] font-bold text-[#475569] transition-all hover:bg-[#e2e8f0] active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-br from-[#dc2626] to-[#ef4444] text-[14px] font-bold text-white shadow-[0_4px_14px_rgba(220,38,38,0.25)] transition-all hover:from-[#b91c1c] hover:to-[#dc2626] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(220,38,38,0.35)] active:translate-y-0 active:scale-[0.98]"
                    >
                        Delete
                    </button>
                </>
            }
        />
    );
};
