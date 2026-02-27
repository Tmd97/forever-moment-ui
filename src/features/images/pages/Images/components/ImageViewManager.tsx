import { useState, useMemo } from 'react';
import { ImageTableView } from './ImageTableView';
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
    const [tab, setTab] = useState("general");
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const filtered = useMemo(() => (images || []).filter((img: any) => {
        const matchSearch = img.fileName && img.fileName.toLowerCase().includes(search.toLowerCase());

        let matchType = true;
        if (activeFilters.type && activeFilters.type.length > 0) {
            const ext = img.contentType?.split('/')[1] || '';
            matchType = activeFilters.type.includes(ext.toLowerCase());
        }

        return matchSearch && matchType;
    }), [images, search, activeFilters]);

    const handleSelectImage = (img: any) => {
        setSelectedImage(img);
        setTab("general");
        getImageMetadata(img.id);
        downloadImage(img.id);
    };

    if (selectedImage) {
        return (
            <ImageSplitView
                images={filtered}
                search={search}
                onSearchChange={setSearch}
                onFilterChange={setActiveFilters}
                onUploadClick={handleOpenUploadModal}
                selectedImage={selectedImage}
                onSelectImage={handleSelectImage}
                onCloseDetail={() => setSelectedImage(null)}
                onDownloadClick={downloadImage}
                tab={tab}
                onTabChange={setTab}
                currentMetadata={currentMetadata}
                currentPreviewUrl={currentPreviewUrl}
                loading={loading}
            />
        );
    }

    return (
        <ImageTableView
            images={filtered}
            search={search}
            onSearchChange={setSearch}
            onFilterChange={setActiveFilters}
            onUploadClick={handleOpenUploadModal}
            onDeleteClick={handleDeleteClick}
            onDownloadClick={downloadImage}
            onRowClick={handleSelectImage}
            loading={loading}
        />
    );
};
