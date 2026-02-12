import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragHandleContext } from './DragHandleContext';
import type { SortableRowProps } from './types';

export const SortableRow = React.memo(({ id, children, draggable, ...props }: SortableRowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1, // Keep dragged item on top
        position: isDragging ? 'relative' : undefined,
        touchAction: 'pan-y',
        opacity: isDragging ? 0.8 : 1,
        boxShadow: isDragging ? '0px 4px 12px rgba(0, 0, 0, 0.1)' : undefined,
    };
    const rowListeners = draggable ? undefined : listeners;

    return (
        <DragHandleContext.Provider value={listeners}>
            <tr
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...rowListeners}
                {...props}
            >
                {children}
            </tr>
        </DragHandleContext.Provider>
    );
});

SortableRow.displayName = 'SortableRow';
