import { getImageUrl } from '@/features/images/store/api';
import { SectionLabel } from '@/components/common/DetailsLayout';
import { ImagePreview } from './ImagePreview';
import { ImageMetadata } from './ImageMetadata';

interface ImageDetailsProps {
    image: any;
    metadata?: any;
    previewUrl?: string | null;
    onDownload?: (id: string, fileName: string) => void;
}

export const ImageDetails = ({ image, metadata, previewUrl, onDownload }: ImageDetailsProps) => {
    if (!image) return null;

    const displayMetadata = metadata || image.metadata || {};
    const fallbackUrl = getImageUrl(image.id);
    const displayUrl = previewUrl || fallbackUrl;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Image Preview Section */}
            <div>
                <SectionLabel>Preview</SectionLabel>
                <div className="mt-3">
                    <ImagePreview
                        src={displayUrl}
                        fileName={image.fileName}
                        contentType={image.contentType}
                        size={image.size}
                        fallbackUrl={fallbackUrl}
                        onDownload={onDownload ? () => onDownload(image.id, image.fileName) : undefined}
                    />
                </div>
            </div>

            {/* Metadata Section */}
            <ImageMetadata
                image={image}
                displayMetadata={displayMetadata}
                onDownload={onDownload}
            />
        </div>
    );
};
