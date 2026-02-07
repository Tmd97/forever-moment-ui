// Table imports removed as we are using raw HTML tags to fix scrolling behavior
import { cn } from '@/utils/cn';

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    onRowClick?: (item: T) => void;
    selectedId?: string | number | null;
}

export const DataTable = <T,>({ data, columns, keyExtractor, onRowClick, selectedId }: DataTableProps<T>) => {
    return (
        <div className="flex-1 overflow-auto">
            <table className="table-fixed min-w-[800px] w-full caption-bottom text-sm">
                <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 shadow-sm [&_tr]:border-b">
                    <tr className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors border-none">
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={cn(
                                    "text-gray-900 dark:text-gray-100 h-10 px-2 text-left align-middle font-semibold whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                                    col.className
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {data.length ? (
                        data.map((item) => (
                            <tr
                                key={keyExtractor(item)}
                                onClick={() => onRowClick?.(item)}
                                className={cn(
                                    "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
                                    onRowClick ? 'cursor-pointer relative' : '',
                                    selectedId === keyExtractor(item)
                                        ? 'bg-blue-50/50 dark:bg-blue-900/10'
                                        : 'hover:bg-muted/50'
                                )}
                            >
                                {columns.map((col, index) => (
                                    <td
                                        key={index}
                                        className={cn(
                                            "p-2 align-middle whitespace-nowrap text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                                            col.className,
                                            index === 0 && "relative"
                                        )}
                                    >
                                        {index === 0 && selectedId === keyExtractor(item) && (
                                            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-blue-600 rounded-r-sm" />
                                        )}
                                        {col.render
                                            ? col.render(item)
                                            : col.accessorKey
                                                ? (item[col.accessorKey] as React.ReactNode)
                                                : null}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="h-24 text-center p-2 align-middle text-gray-600 dark:text-gray-400">
                                No results.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
