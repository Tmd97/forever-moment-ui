import React, { useState } from 'react';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Trash2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { getMediaAssetUrl } from '@/features/images/store/api';
import { cn } from '@/utils/cn';

interface ExperienceImagesProps {
    experienceId: number;
    experienceMedia: any[];
    getExperienceMedia: (experienceId: number) => Promise<any>;
    availableImages: any[];
    getImages: () => void;
    bulkAttachMedia: (experienceId: number, data: { items: any[] }) => Promise<any>;
    disassociateMedia: (experienceId: number, mediaId: number) => Promise<any>;
}

export const ExperienceImages: React.FC<ExperienceImagesProps> = ({
    experienceId,
    experienceMedia,
    getExperienceMedia,
    availableImages,
    getImages,
    bulkAttachMedia,
    disassociateMedia
}) => {
    const [search, setSearch] = useState("");
    const [isAssocModalOpen, setIsAssocModalOpen] = useState(false);
    const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (experienceId) {
            getExperienceMedia(experienceId);
        }
    }, [experienceId, getExperienceMedia]);

    const filteredAssignedMedia = experienceMedia?.filter((em: any) => {
        if (!search) return true;
        return em.altText?.toLowerCase().includes(search.toLowerCase()) ||
            em.fileName?.toLowerCase().includes(search.toLowerCase()) ||
            em.mimeType?.toLowerCase().includes(search.toLowerCase());
    }) || [];

    const unassignedImages = availableImages.filter((img: any) =>
        !experienceMedia?.some((em: any) => em.mediaId === img.id)
    );

    const handleOpenAssocModal = () => {
        getImages();
        setSelectedImageIds([]);
        setIsAssocModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAssocModalOpen(false);
        setSelectedImageIds([]);
    };

    const toggleImageSelection = (id: number) => {
        setSelectedImageIds(prev =>
            prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (selectedImageIds.length === 0 || !experienceId) return;
        setIsSubmitting(true);

        const items = selectedImageIds.map((id, index) => ({
            mediaId: id,
            displayOrder: experienceMedia.length + index,
            isPrimary: experienceMedia.length === 0 && index === 0, // make first chosen primary if list empty
            altText: "",
            isActive: true
        }));

        try {
            await bulkAttachMedia(experienceId, { items });
            handleCloseModal();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
                <SearchBar
                    className="flex-1"
                    inputClassName="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    placeholder="Search attached images..."
                    value={search}
                    onChange={setSearch}
                />
                <Button onClick={handleOpenAssocModal} className="h-10 px-4 text-sm shrink-0">
                    Add Images
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-20">
                {filteredAssignedMedia.map((em: any) => (
                    <div key={em.id} className="group relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden aspect-[4/3] flex flex-col transition-all hover:border-blue-300">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 w-full flex-center relative overflow-hidden flex items-center justify-center">
                            {em.url ? (
                                <img
                                    src={getMediaAssetUrl(em.url)}
                                    alt={em.altText || 'Media'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            )}

                            {em.isPrimary && (
                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    Primary
                                </div>
                            )}

                            <button
                                onClick={() => disassociateMedia(experienceId, em.mediaId)}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-gray-900/90 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                title="Remove Image"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div className="p-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                                {em.altText || em.fileName || 'No Alt Text'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                                Order: {em.displayOrder}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredAssignedMedia.length === 0 && (
                    <div className="col-span-full text-center py-16 text-slate-400 dark:text-gray-500 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl">
                        <ImageIcon className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No images associated.</p>
                        <p className="text-xs mt-1">Click "Add Images" to link photos from the media library.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isAssocModalOpen}
                onClose={handleCloseModal}
                title="Select Images to Add"
                className="max-w-4xl w-[95vw]"
            >
                <div className="flex flex-col h-[70vh]">
                    <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/50">
                        {unassignedImages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <p>No more active images available in the library.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {unassignedImages.map((img: any) => {
                                    const isSelected = selectedImageIds.includes(img.id);
                                    return (
                                        <div
                                            key={img.id}
                                            onClick={() => toggleImageSelection(img.id)}
                                            className={cn(
                                                "relative rounded-lg overflow-hidden aspect-square border-2 cursor-pointer transition-all",
                                                isSelected ? "border-blue-500 ring-2 ring-blue-500/20" : "border-transparent hover:border-blue-300"
                                            )}
                                        >
                                            <img
                                                src={img.thumbnailUrl ? getMediaAssetUrl(img.thumbnailUrl) : (img.url ? getMediaAssetUrl(img.url) : '')}
                                                alt={img.altText || ''}
                                                className="w-full h-full object-cover bg-gray-200 dark:bg-gray-800"
                                            />
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-blue-500/20 flex items-start justify-end p-2">
                                                    <CheckCircle2 className="text-blue-600 bg-white rounded-full p-0.5" size={20} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-gray-800 shrink-0">
                        <div className="text-sm font-medium text-slate-500">
                            {selectedImageIds.length} image{selectedImageIds.length !== 1 ? 's' : ''} selected
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={selectedImageIds.length === 0 || isSubmitting}
                                isLoading={isSubmitting}
                            >
                                Associate Selected
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
