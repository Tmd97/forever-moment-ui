import React from 'react';

export type RowId = string | number;

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => RowId;
    onRowClick?: (item: T) => void;
    selectedId?: RowId | null;
    loading?: boolean;
    onReorder?: (newOrder: T[], activeId: RowId, overId: RowId) => void;
    draggable?: boolean;
    emptyMessage?: string;
}

export interface SortableRowProps extends Omit<React.HTMLAttributes<HTMLTableRowElement>, 'id'> {
    id: RowId;
    draggable?: boolean;
}
