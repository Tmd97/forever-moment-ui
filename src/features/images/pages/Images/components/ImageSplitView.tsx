import { useCallback } from 'react';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';
import { RowActions } from '@/components/common/RowActions';
import { ImageDetails } from './ImageDetails';
import { getImageUrl, getMediaAssetUrl } from '@/features/images/store/api';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { TABS } from '@/config/constants';

interface ImageSplitViewProps {
    images: any[];
    onUploadClick: () => void;
    onDeleteClick: (id: string) => void;
    selectedImage: any;
    onSelectImage: (img: any) => void;
    onDownloadClick: (id: string, fileName: string) => void;
    currentMetadata: any;
    currentPreviewUrl: any;
    loading: boolean;
}

export const ImageSplitView = ({
    images,
    onUploadClick,
    onDeleteClick,
    selectedImage,
    onSelectImage,
    onDownloadClick,
    currentMetadata,
    currentPreviewUrl,
    loading
}: ImageSplitViewProps) => {
    const formatSize = (bytes: number) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    const getImageType = (img: any) => img.mimeType || img.contentType || '';
    const getImageSize = (img: any) => img.fileSizeBytes || img.size || 0;
    const getThumbnailSrc = (img: any) => {
        if (!img) return '';
        // If we have an ID, we can fetch via the dedicated image endpoint which is often more reliable
        if (img.id) return getImageUrl(String(img.id));
        // Fallbacks
        if (img.thumbnailUrl) return getMediaAssetUrl(img.thumbnailUrl);
        if (img.mediaUrl) return getMediaAssetUrl(img.mediaUrl);
        return '';
    };

    const columns = [
        {
            header: 'Preview',
            accessorKey: 'id',
            className: 'w-[10%] min-w-[80px] py-4 px-6 text-center',
            render: (img: any) => (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm">
                    <img
                        src={getThumbnailSrc(img)}
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
            render: (img: any) => <span>{formatSize(getImageSize(img))}</span>
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
                    {getImageType(img)?.split('/')[1] || 'IMG'}
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
                        onEdit={() => { }} // Not needed for images
                        onDelete={() => onDeleteClick(img.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((img: any, isSelected: boolean) => {
        return (
            <div
                className={cn(
                    "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group",
                    isSelected
                        ? "bg-blue-50/80 dark:bg-blue-900/20"
                        : "hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent"
                )}
            >
                <div className={cn(
                    "absolute left-2 w-1 h-8 rounded-r-md transition-all duration-300",
                    isSelected ? "bg-blue-600 opacity-100" : "opacity-0"
                )} />
                <div className="w-11 h-11 rounded-lg bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 overflow-hidden shadow-sm shrink-0 ml-1">
                    <img
                        src={getThumbnailSrc(img)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=ERR'}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        "font-semibold text-[13px] truncate mb-0.5 transition-colors",
                        isSelected ? "text-blue-900 dark:text-blue-400" : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )}>{img.fileName}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                        <span>{formatSize(getImageSize(img))}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="uppercase">{getImageType(img)?.split('/')[1] || 'IMG'}</span>
                    </div>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onDownloadClick(img.id, img.fileName); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    title="Quick Download"
                >
                    <Download size={14} />
                </button>
            </div>
        );
    }, [onDownloadClick]);

    const renderDetailsPanel = useCallback((image: any, activeTab: string, _dirtyState: any) => {
        if (activeTab === "general") {
            return (
                <ImageDetails
                    image={image}
                    metadata={currentMetadata}
                    previewUrl={currentPreviewUrl}
                    onDownload={onDownloadClick}
                />
            );
        }
        return null;
    }, [currentMetadata, currentPreviewUrl, onDownloadClick]);

    const customFilter = useCallback((img: any, activeFilters: Record<string, string[]>) => {
        let matchType = true;
        if (activeFilters.type && activeFilters.type.length > 0) {
            const ext = getImageType(img)?.split('/')[1] || '';
            matchType = activeFilters.type.includes(ext.toLowerCase());
        }
        return matchType;
    }, []);

    const customSearch = useCallback((img: any, search: string) => {
        return Boolean(img.fileName && img.fileName.toLowerCase().includes(search.toLowerCase()));
    }, []);

    return (
        <CrudSplitViewLayout
            data={images || []}
            loading={loading}
            resourceName="Image"
            selectedItem={selectedImage}
            onSelectItem={onSelectImage}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: TABS.DETAILS.id, label: TABS.DETAILS.label }]}
            renderDetailsPanel={renderDetailsPanel}
            filterConfig={[
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
            customFilter={customFilter as any}
            customSearch={customSearch as any}
            onAdd={onUploadClick}
        />
    );
};
