import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, Maximize2, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ImagePreviewProps {
    src: string;
    fileName: string;
    contentType?: string;
    size?: number;
    fallbackUrl?: string;
    onDownload?: () => void;
}

export const ImagePreview = ({
    src,
    fileName,
    contentType,
    size,
    fallbackUrl,
    onDownload
}: ImagePreviewProps) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsFullScreen(false);
        };
        if (isFullScreen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
            setScale(1); // Reset scale on close
        };
    }, [isFullScreen]);

    useEffect(() => {
        setScale(1); // Reset scale when image changes
    }, [src]);

    const handleZoomIn = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(prev => Math.min(prev + 0.25, 4));
    };

    const handleZoomOut = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(prev => Math.max(prev - 0.25, 0.5));
    };

    const handleResetZoom = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(1);
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const displaySize = formatSize(size);

    return (
        <div className="w-full">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-950 flex items-center justify-center group shadow-inner">
                <img
                    src={src}
                    alt={fileName}
                    className="max-w-full max-h-full object-contain shadow-lg cursor-zoom-in"
                    onClick={() => setIsFullScreen(true)}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Load+Error';
                    }}
                />
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                        onClick={() => setIsFullScreen(true)}
                        className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-900 shadow-xl flex items-center gap-2"
                        title="Full Screen Preview"
                    >
                        <Maximize2 size={14} className="text-blue-500" />
                        Full Screen
                    </button>
                    {onDownload && (
                        <button
                            onClick={onDownload}
                            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-900 shadow-xl flex items-center gap-2"
                        >
                            <Download size={14} className="text-blue-500" />
                            Download
                        </button>
                    )}
                </div>
            </div>

            {/* Full Screen Lightbox */}
            {isFullScreen && createPortal(
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in duration-300 overflow-hidden"
                    onClick={() => setIsFullScreen(false)}
                >
                    {/* Controls Overlay */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 pointer-events-none">
                        <div className="flex flex-col items-start pointer-events-auto">
                            <h3 className="text-white font-semibold text-lg drop-shadow-md">{fileName}</h3>
                            <p className="text-white/60 text-sm mt-1 uppercase tracking-wider font-mono drop-shadow-md">
                                {displaySize} • {Math.round(scale * 100)}%
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pointer-events-auto">
                            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-1">
                                <button
                                    onClick={handleZoomOut}
                                    disabled={scale <= 0.5}
                                    className="p-2 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all"
                                    title="Zoom Out"
                                >
                                    <ZoomOut size={20} />
                                </button>
                                <button
                                    onClick={handleResetZoom}
                                    className="px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10 border-x border-white/10 transition-all flex items-center gap-1.5"
                                    title="Reset Zoom"
                                >
                                    <RotateCcw size={14} />
                                    {Math.round(scale * 100)}%
                                </button>
                                <button
                                    onClick={handleZoomIn}
                                    disabled={scale >= 4}
                                    className="p-2 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all"
                                    title="Zoom In"
                                >
                                    <ZoomIn size={20} />
                                </button>
                            </div>

                            <button
                                onClick={() => setIsFullScreen(false)}
                                className="p-2.5 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-white transition-all border border-white/10 backdrop-blur-md"
                                title="Close Preview"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Image Container */}
                    <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-auto scrollbar-hide">
                        <img
                            src={src}
                            alt={fileName}
                            className="shadow-2xl transition-transform duration-200 ease-out origin-center animate-in zoom-in-95"
                            style={{
                                transform: `scale(${scale})`,
                                maxWidth: '90%',
                                maxHeight: '90%',
                                objectFit: 'contain'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Bottom Actions */}
                    <div className="absolute bottom-10 flex gap-3 z-10">
                        {onDownload && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDownload(); }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-semibold flex items-center gap-2.5 transition-all shadow-xl hover:scale-105 active:scale-95"
                            >
                                <Download size={20} />
                                Download Original
                            </button>
                        )}
                        <button
                            onClick={() => setIsFullScreen(false)}
                            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-semibold transition-all border border-white/10 backdrop-blur-md active:scale-95"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
