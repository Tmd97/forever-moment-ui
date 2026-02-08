import { LogOut } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

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
            icon={LogOut}
            footer={
                <div className="flex justify-end gap-3 w-full -mr-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        No
                    </Button>
                    <Button
                        variant="brand"
                        onClick={onConfirm}
                        className="w-full sm:w-auto"
                    >
                        Yes
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col pt-0">
                <p className="text-gray-500">This will logout you from the system. Are you sure?</p>
            </div>
        </Modal>
    );
};
