import { Edit2, Trash2 } from 'lucide-react';

interface RowActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export const RowActions = ({ onEdit, onDelete }: RowActionsProps) => {
    return (
        <div className="flex justify-end gap-2">
            <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className='p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors'
            >
                <Edit2 size={16} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className='p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors'
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};
