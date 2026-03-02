import { ImageSplitView } from './ImageSplitView';

export const ImageViewManager = ({
    images,
    handleOpenUploadModal,
    handleDeleteClick,
    selectedImage,
    setSelectedImage,
    loading,
    getImageMetadata,
    downloadImage,
    currentMetadata,
    currentPreviewUrl
}: any) => {
    const handleSelectImage = (img: any) => {
        setSelectedImage(img);
        if (img) {
            getImageMetadata(img.id);
            downloadImage(img.id);
        }
    };

    return (
        <ImageSplitView
            images={images}
            onUploadClick={handleOpenUploadModal}
            onDeleteClick={handleDeleteClick}
            selectedImage={selectedImage}
            onSelectImage={handleSelectImage}
            onDownloadClick={downloadImage}
            currentMetadata={currentMetadata}
            currentPreviewUrl={currentPreviewUrl}
            loading={loading}
        />
    );
};
