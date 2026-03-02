import { LogOut } from 'lucide-react';
import { Modal } from '@/components/common/Modal';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Logout"
            description="This will logout you from the system. Are you sure?"
            icon={LogOut}
            variant="info"
            className="sm:max-w-lg"
            footer={
                <>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-5 rounded-xl bg-[#f1f5f9] text-[14px] font-bold text-[#475569] transition-all hover:bg-[#e2e8f0] active:scale-[0.98]"
                    >
                        No, stay
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-br from-[#1d4ed8] to-[#2563eb] text-[14px] font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all hover:from-[#1e40af] hover:to-[#1d4ed8] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] active:translate-y-0 active:scale-[0.98]"
                    >
                        Yes, logout
                    </button>
                </>
            }
        />
    );
};
