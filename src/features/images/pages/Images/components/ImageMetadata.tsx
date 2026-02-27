import { SectionLabel, FieldGrid, Cell, FieldLabel } from '@/components/common/DetailsLayout';
import { format } from 'date-fns';
import { HardDrive, Calendar, Type, Tag, Download, Image as ImageIcon } from 'lucide-react';

interface ImageMetadataProps {
    image: any;
    displayMetadata: any;
    onDownload?: (id: string, fileName: string) => void;
}

export const ImageMetadata = ({ image, displayMetadata, onDownload }: ImageMetadataProps) => {
    const formatSize = (bytes: number) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <>
            {/* Metadata Section */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <SectionLabel>File Information</SectionLabel>
                    {onDownload && (
                        <button
                            onClick={() => onDownload(image.id, image.fileName)}
                            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all"
                        >
                            <Download size={12} />
                            Download Original
                        </button>
                    )}
                </div>
                <FieldGrid>
                    <Cell full>
                        <FieldLabel>File Name</FieldLabel>
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-blue-500" />
                            <span className="text-[13px] font-semibold text-slate-900 dark:text-white break-all">{image.fileName}</span>
                        </div>
                    </Cell>
                    <Cell>
                        <FieldLabel>Size</FieldLabel>
                        <div className="flex items-center gap-2">
                            <HardDrive className="w-4 h-4 text-slate-400" />
                            <span className="text-[13px] font-semibold text-slate-900 dark:text-white">{formatSize(image.size)}</span>
                        </div>
                    </Cell>
                    <Cell>
                        <FieldLabel>Upload Date</FieldLabel>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
                                {image.uploadDate ? format(new Date(image.uploadDate), 'MMM dd, yyyy HH:mm') : 'N/A'}
                            </span>
                        </div>
                    </Cell>
                    <Cell>
                        <FieldLabel>Content Type</FieldLabel>
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-slate-400" />
                            <span className="text-[13px] font-semibold text-slate-900 dark:text-white uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-[11px] font-mono">
                                {image.contentType || 'N/A'}
                            </span>
                        </div>
                    </Cell>
                    <Cell>
                        <FieldLabel>Unique ID</FieldLabel>
                        <div className="flex items-center gap-2">
                            <Type className="w-4 h-4 text-slate-400" />
                            <code className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-gray-800/50 px-2 py-0.5 rounded border border-slate-100 dark:border-gray-800">
                                {image.id}
                            </code>
                        </div>
                    </Cell>
                </FieldGrid>
            </div>

            {/* Metadata (if available) */}
            {(displayMetadata.altText || displayMetadata.category) && (
                <div>
                    <SectionLabel>Additional Metadata</SectionLabel>
                    <FieldGrid>
                        {displayMetadata.category && (
                            <Cell>
                                <FieldLabel>Category</FieldLabel>
                                <span className="text-[13px] font-semibold text-slate-900 dark:text-white">{displayMetadata.category}</span>
                            </Cell>
                        )}
                        {displayMetadata.altText && (
                            <Cell full>
                                <FieldLabel>Alt Text</FieldLabel>
                                <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300 italic">{displayMetadata.altText}</span>
                            </Cell>
                        )}
                    </FieldGrid>
                </div>
            )}
        </>
    );
};
