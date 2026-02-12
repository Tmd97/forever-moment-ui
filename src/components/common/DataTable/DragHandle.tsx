import { useContext } from 'react';
import { GripVertical } from 'lucide-react';
import { DragHandleContext } from './DragHandleContext';

export const DragHandle = () => {
    const listeners = useContext(DragHandleContext);
    return (
        <button
            type="button"
            aria-label="Drag to reorder"
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <GripVertical size={16} />
        </button>
    );
};
