import { format } from 'date-fns';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { RowActions } from '@/components/common/RowActions';
import { SearchBar } from '@/components/common/SearchBar';
import { Filter } from '@/components/common/Filter';
import { getImageUrl } from '@/features/images/store/api';

interface ImageTableViewProps {
    images: any[];
    search: string;
    onSearchChange: (val: string) => void;
    onFilterChange: (filters: any) => void;
    onUploadClick: () => void;
    onDeleteClick: (id: string) => void;
    onDownloadClick: (id: string, fileName: string) => void;
    onRowClick: (img: any) => void;
    loading: boolean;
}

export const ImageTableView = ({
    images,
    search,
    onSearchChange,
    onFilterChange,
    onUploadClick,
    onDeleteClick,
    onDownloadClick,
    onRowClick,
    loading
}: ImageTableViewProps) => {
    const formatSize = (bytes: number) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="flex flex-col flex-1 h-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-800">
                <Filter
                    categories={[
                        {
                            id: 'type',
                            name: 'File Type',
                            options: [
                                { id: '1', label: 'PNG', value: 'png' },
                                { id: '2', label: 'JPG/JPEG', value: 'jpeg' },
                                { id: '3', label: 'WebP', value: 'webp' },
                            ]
                        }
                    ]}
                    onFilterChange={onFilterChange}
                />

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <SearchBar
                        className="w-full sm:w-72"
                        inputClassName="py-2.5 pl-10 pr-4"
                        placeholder="Search images..."
                        value={search}
                        onChange={onSearchChange}
                    />
                    <Button onClick={onUploadClick} className="h-10 px-4 text-sm gap-2 shadow-sm shrink-0">
                        <Plus size={16} /> Upload Image
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                <DataTable
                    data={images}
                    columns={[
                        {
                            header: 'Preview',
                            accessorKey: 'id',
                            className: 'w-[10%] min-w-[80px] py-4 px-6 text-center',
                            render: (img: any) => (
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm">
                                    <img
                                        src={getImageUrl(img.id)}
                                        alt={img.fileName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Img';
                                        }}
                                    />
                                </div>
                            )
                        },
                        {
                            header: 'File Name',
                            accessorKey: 'fileName',
                            className: 'w-[30%] min-w-[200px] py-4 px-6 text-left font-semibold text-slate-900 dark:text-white',
                            render: (img: any) => <span>{img.fileName}</span>
                        },
                        {
                            header: 'Size',
                            accessorKey: 'size',
                            className: 'w-[15%] min-w-[100px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
                            render: (img: any) => <span>{formatSize(img.size)}</span>
                        },
                        {
                            header: 'Upload Date',
                            accessorKey: 'uploadDate',
                            className: 'w-[20%] min-w-[150px] py-4 px-6 text-left text-slate-600 dark:text-slate-300',
                            render: (img: any) => (
                                <span>{img.uploadDate ? format(new Date(img.uploadDate), 'MMM dd, yyyy') : '-'}</span>
                            )
                        },
                        {
                            header: 'Type',
                            accessorKey: 'contentType',
                            className: 'w-[10%] min-w-[100px] py-4 px-6 text-center',
                            render: (img: any) => (
                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-200 dark:border-gray-700">
                                    {img.contentType?.split('/')[1] || 'IMG'}
                                </span>
                            )
                        },
                        {
                            header: 'Actions',
                            preventRowClick: true,
                            className: 'w-[15%] min-w-[100px] py-4 px-6 text-right',
                            render: (img: any) => (
                                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => onDownloadClick(img.id, img.fileName)}
                                        className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                        title="Download Image"
                                    >
                                        <Download size={16} />
                                    </button>
                                    <RowActions
                                        onEdit={() => { }} // Not needed for images currently
                                        onDelete={() => onDeleteClick(img.id)}
                                    />
                                </div>
                            )
                        }
                    ]}
                    keyExtractor={(item: any) => item.id}
                    onRowClick={onRowClick}
                    loading={loading && (!images || images.length === 0)}
                />
            </div>
        </div>
    );
};
