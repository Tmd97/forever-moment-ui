import React from 'react';
import { cn } from '@/utils/cn';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import type { DataTableProps, Column, RowId } from './types';
import { SortableRow } from './SortableRow';
import { DragHandle } from './DragHandle';

const HEADER_CELL_CLASS = "text-slate-400 dark:text-gray-400 h-10 px-4 text-left align-middle font-bold text-[11.5px] uppercase tracking-wider whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]";
const BODY_CELL_CLASS = "p-4 align-middle whitespace-nowrap text-gray-700 dark:text-gray-300 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]";
const ROW_CLASS = "group hover:bg-[#fafbff] dark:hover:bg-slate-800/50 data-[state=selected]:bg-muted border-b transition-colors bg-white dark:bg-gray-900";

export const DataTable = <T,>({
    data,
    columns,
    keyExtractor,
    onRowClick,
    selectedId,
    loading,
    onReorder,
    draggable,
    emptyMessage = 'No Data available.',
    tableClassName = 'table-fixed min-w-[800px] w-full caption-bottom text-sm',
}: DataTableProps<T>) => {
    const isDragEnabled = Boolean(onReorder && draggable);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const getRowId = (item: T) => String(keyExtractor(item));
    const rowIds = data.map(getRowId);
    const selectedRowId = selectedId == null ? null : String(selectedId);

    const isRowSelected = (item: T) => {
        if (selectedRowId == null) {
            return false;
        }
        return selectedRowId === getRowId(item);
    };

    const getColumnKey = (index: number, column: Column<T>) => {
        const { header, accessorKey } = column;
        if (accessorKey) {
            return String(accessorKey);
        }
        return `${header}-${index}`;
    };

    const renderCellContent = (item: T, accessorKey?: keyof T, render?: (row: T) => React.ReactNode) => {
        if (render) {
            return render(item);
        }
        if (accessorKey) {
            return item[accessorKey] as React.ReactNode;
        }
        return null;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = rowIds.findIndex((id) => id === String(active.id));
            const newIndex = rowIds.findIndex((id) => id === String(over.id));

            if (oldIndex !== -1 && newIndex !== -1) {
                const newOrder = arrayMove(data, oldIndex, newIndex);
                onReorder?.(newOrder, active.id, over.id);
            }
        }
    };

    const renderTableHead = () => (
        <thead className="sticky top-0 z-10 bg-[#f8fafc] dark:bg-gray-800 shadow-sm [&_tr]:border-b border-b border-[#f1f5f9] dark:border-gray-700">
            <tr className="bg-[#f8fafc] dark:bg-gray-800 border-none">
                {columns.map((col, index) => (
                    <th
                        key={getColumnKey(index, col)}
                        className={cn(
                            HEADER_CELL_CLASS,
                            col.className
                        )}
                    >
                        {col.header}
                    </th>
                ))}
            </tr>
        </thead>
    );

    const renderRow = (item: T) => {
        const rowId = getRowId(item);
        const selected = isRowSelected(item);
        const rowClickHandler = onRowClick ? () => onRowClick(item) : undefined;
        const rowClassName = cn(
            ROW_CLASS,
            rowClickHandler ? 'cursor-pointer relative' : '',
            selected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
        );

        const rowCells = columns.map((col, index) => (
            <td
                key={getColumnKey(index, col)}
                className={cn(
                    BODY_CELL_CLASS,
                    col.className,
                    index === 0 ? 'relative' : ''
                )}
                onClick={col.preventRowClick ? (e) => e.stopPropagation() : undefined}
            >
                {index === 0 && selected ? (
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-blue-600 rounded-r-sm" />
                ) : null}

                <div className={cn("flex items-center gap-2", index === 0 && isDragEnabled ? '' : 'contents')}>
                    {index === 0 && isDragEnabled ? <DragHandle /> : null}
                    {renderCellContent(item, col.accessorKey, col.render)}
                </div>
            </td>
        ));

        if (!isDragEnabled) {
            return (
                <tr key={rowId} data-row-id={rowId} onClick={rowClickHandler} className={rowClassName}>
                    {rowCells}
                </tr>
            );
        }

        return (
            <SortableRow
                key={rowId}
                id={rowId as RowId}
                draggable={true}
                data-row-id={rowId}
                onClick={rowClickHandler}
                className={rowClassName}
            >
                {rowCells}
            </SortableRow>
        );
    };

    const renderSkeleton = () => {
        return Array.from({ length: 10 }).map((_, rowIndex) => (
            <tr key={`skeleton-${rowIndex}`} className={ROW_CLASS}>
                {columns.map((col, colIndex) => (
                    <td key={`skeleton-cell-${rowIndex}-${colIndex}`} className={cn(BODY_CELL_CLASS, col.className)}>
                        <div className="flex items-center">
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                        </div>
                    </td>
                ))}
            </tr>
        ));
    };

    const renderTableBody = () => (
        <tbody className="[&_tr:last-child]:border-0 divide-y divide-[#f1f5f9] dark:divide-gray-800">
            {loading ? (
                renderSkeleton()
            ) : data.length ? (
                data.map(renderRow)
            ) : (
                <tr>
                    <td colSpan={Math.max(columns.length, 1)} className="h-24 text-center p-2 align-middle text-gray-600 dark:text-gray-400">
                        {emptyMessage}
                    </td>
                </tr>
            )}
        </tbody>
    );

    const tableContent = (
        <table className={tableClassName}>
            {renderTableHead()}
            {isDragEnabled ? (
                <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
                    {renderTableBody()}
                </SortableContext>
            ) : (
                renderTableBody()
            )}
        </table>
    );

    return (
        <div className="flex-1 overflow-auto">
            {isDragEnabled ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    {tableContent}
                </DndContext>
            ) : (
                tableContent
            )}
        </div>
    );
};
