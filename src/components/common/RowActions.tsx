import { Edit2, Trash2 } from 'lucide-react';

interface RowActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export const RowActions = ({ onEdit, onDelete }: RowActionsProps) => {
    return (
        <div className="flex justify-end gap-1.5">
            <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                title="Edit"
                style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: '1px solid #e8e6e0', background: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#6b7280', transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6c63ff'; e.currentTarget.style.background = '#ede9ff'; e.currentTarget.style.color = '#6c63ff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8e6e0'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
            >
                <Edit2 size={14} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                title="Delete"
                style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: '1px solid #e8e6e0', background: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#6b7280', transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f04438'; e.currentTarget.style.background = '#fef3f2'; e.currentTarget.style.color = '#f04438'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8e6e0'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
};
