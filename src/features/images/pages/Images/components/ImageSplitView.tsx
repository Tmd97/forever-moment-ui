import { Plus, X, Image as ImageIcon, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';
import { SearchBar } from '@/components/common/SearchBar';
import { Filter } from '@/components/common/Filter';
import { Tabs } from '@/components/common/Tabs';
import { ImageDetails } from './ImageDetails';
import { getImageUrl } from '@/features/images/store/api';

interface ImageSplitViewProps {
    images: any[];
    search: string;
    onSearchChange: (val: string) => void;
    onFilterChange: (filters: any) => void;
    onUploadClick: () => void;
    selectedImage: any;
    onSelectImage: (img: any) => void;
    onCloseDetail: () => void;
    onDownloadClick: (id: string, fileName: string) => void;
    tab: string;
    onTabChange: (tab: string) => void;
    currentMetadata: any;
    currentPreviewUrl: any;
    loading: boolean;
}

export const ImageSplitView = ({
    images,
    search,
    onSearchChange,
    onFilterChange,
    onUploadClick,
    selectedImage,
    onSelectImage,
    onCloseDetail,
    onDownloadClick,
    tab,
    onTabChange,
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

    return (
        <div className="flex flex-1 h-full overflow-hidden">
            <div className="w-[340px] min-w-[340px] bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-5 pb-3">
                    <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Gallery</span>
                </div>

                <div className="flex items-center gap-2 mx-4 mb-3">
                    <SearchBar
                        className="flex-1"
                        inputClassName="bg-slate-50"
                        placeholder="Search..."
                        value={search}
                        onChange={onSearchChange}
                    />
                    <Button onClick={onUploadClick} className="h-[38px] px-3 text-xs gap-1.5 shadow-sm shrink-0">
                        <Plus size={14} /> Upload
                    </Button>
                </div>

                <div className="px-4 mb-3">
                    <Filter
                        categories={[
                            {
                                id: 'type',
                                name: 'Type',
                                options: [
                                    { id: '1', label: 'PNG', value: 'png' },
                                    { id: '2', label: 'JPG', value: 'jpeg' },
                                    { id: '3', label: 'WebP', value: 'webp' },
                                ]
                            }
                        ]}
                        onFilterChange={onFilterChange}
                    />
                </div>

                <div className="px-5 pb-2 border-b border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                        {images.length} image{images.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                    {images.length === 0 && !loading && (
                        <div className="text-center py-10 px-5 text-slate-400">
                            <ImageIcon size={32} className="mx-auto mb-2 opacity-30" />
                            <div className="text-sm font-medium">No images found</div>
                        </div>
                    )}
                    {images.map((img: any) => {
                        const isSelected = selectedImage?.id === img.id;
                        return (
                            <div
                                key={img.id}
                                onClick={() => onSelectImage(img)}
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
                                        src={getImageUrl(img.id)}
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
                                        <span>{formatSize(img.size)}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                        <span className="uppercase">{img.contentType?.split('/')[1] || 'IMG'}</span>
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
                    })}
                </div>
            </div>

            <div className="flex-1 flex bg-slate-50 dark:bg-gray-900/40 p-3 h-full overflow-hidden">
                <div className="flex-1 flex bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm relative">
                    <Tabs
                        tabs={[
                            { id: "general", label: "Details" }
                        ]}
                        activeTab={tab}
                        onTabChange={onTabChange}
                    />

                    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                        <button
                            onClick={onCloseDetail}
                            className="absolute top-1 right-1 z-[60] p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-all"
                            title="Close"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex-1 overflow-y-auto p-8 pt-4">
                            <div className="max-w-4xl">
                                {tab === "general" && (
                                    <ImageDetails
                                        image={selectedImage}
                                        metadata={currentMetadata}
                                        previewUrl={currentPreviewUrl}
                                        onDownload={onDownloadClick}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
