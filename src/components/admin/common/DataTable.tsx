import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './Table';

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
}

export const DataTable = <T,>({ data, columns, keyExtractor }: DataTableProps<T>) => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        {columns.map((col, index) => (
                            <TableHead key={index} className={col.className}>
                                {col.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length ? (
                        data.map((item) => (
                            <TableRow key={keyExtractor(item)}>
                                {columns.map((col, index) => (
                                    <TableCell key={index} className={col.className}>
                                        {col.render
                                            ? col.render(item)
                                            : col.accessorKey
                                                ? (item[col.accessorKey] as React.ReactNode)
                                                : null}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
