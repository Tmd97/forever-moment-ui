import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { DeleteModal } from '@/components/common/DeleteModal';
import { ImageUploadModal } from './ImageUploadModal';
import { ImageViewManager } from './ImageViewManager';
import * as types from '@/features/images/store/action-types';
import toast from 'react-hot-toast';
import '../../css/styles.scss';

interface ImagesProps {
    data: any[];
    currentMetadata: any;
    currentPreviewUrl: any;
    loading: boolean;
    error: string | null;
    status: string;
    getImages: () => void;
    uploadImage: (file: File, metadata: any) => Promise<any>;
    deleteImage: (id: string) => Promise<any>;
    downloadImage: (id: string, fileName: string) => void;
    getImageMetadata: (id: string) => void;
    resetStatus: () => void;
}

const Images = ({
    data,
    currentMetadata,
    currentPreviewUrl,
    loading,
    error,
    status,
    getImages,
    uploadImage,
    deleteImage,
    downloadImage,
    getImageMetadata,
    resetStatus
}: ImagesProps) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<any>(null);

    useEffect(() => {
        getImages();
    }, [getImages]);

    useEffect(() => {
        if (status === types.UPLOAD_IMAGE_SUCCESS) {
            setIsUploadModalOpen(false);
            resetStatus();
        } else if (status === types.DELETE_IMAGE_SUCCESS) {
            setIsDeleteModalOpen(false);
            setDeleteId(null);
            if (selectedImage?.id === deleteId) {
                setSelectedImage(null);
            }
            resetStatus();
        }
    }, [status, resetStatus, deleteId, selectedImage]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            resetStatus();
        }
    }, [error, resetStatus]);

    const handleUpload = async (file: File, metadata: any) => {
        try {
            await uploadImage(file, metadata);
        } catch (e) {
            console.error("Upload failed", e);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            await deleteImage(deleteId);
        }
    };

    return (
        <div className="images-page-container w-full h-full flex flex-col">
            <ImageViewManager
                images={data || []}
                handleOpenUploadModal={() => setIsUploadModalOpen(true)}
                handleDeleteClick={handleDeleteClick}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                loading={loading}
                downloadImage={downloadImage}
                getImageMetadata={getImageMetadata}
                currentMetadata={currentMetadata}
                currentPreviewUrl={currentPreviewUrl}
            />

            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Upload New Image"
                className="max-w-xl"
            >
                <ImageUploadModal
                    onUpload={handleUpload}
                    onCancel={() => setIsUploadModalOpen(false)}
                    isLoading={loading && status === types.UPLOAD_IMAGE}
                />
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Image"
                title="Delete Image"
                description="This will permanently delete this image from the server. Are you sure?"
            />
        </div>
    );
};

export default Images;
