import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Upload, X } from 'lucide-react';

interface ImageUploadModalProps {
    onUpload: (files: File[], metadata: any) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ onUpload, onCancel, isLoading }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [metadata, setMetadata] = useState({
        altText: '',
        category: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (!selectedFiles.length) return;

        setFiles((prev) => [...prev, ...selectedFiles]);
        selectedFiles.forEach((selectedFile) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(selectedFile);
        });

        e.target.value = '';
    };

    const handleRemoveFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length > 0) {
            await onUpload(files, metadata);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:border-blue-500 transition-colors cursor-pointer relative">
                {previews.length > 0 ? (
                    <div className="w-full space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {previews.map((preview, index) => (
                                <div key={`${files[index]?.name || 'preview'}-${index}`} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(index)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <label className="flex flex-col items-center gap-2 cursor-pointer w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-700 py-3 hover:border-blue-500 transition-colors">
                            <Upload size={20} className="text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">Add more images</span>
                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                        </label>
                    </div>
                ) : (
                    <label className="flex flex-col items-center gap-3 cursor-pointer w-full">
                        <Upload size={32} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-400">PNG, JPG or WebP, multiple files supported</span>
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                    </label>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category (Optional)</label>
                    <input
                        type="text"
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white"
                        placeholder="e.g. Experiences, Venues"
                        value={metadata.category}
                        onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Text (Optional)</label>
                    <input
                        type="text"
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white"
                        placeholder="Describe the image"
                        value={metadata.altText}
                        onChange={(e) => setMetadata(prev => ({ ...prev, altText: e.target.value }))}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={files.length === 0 || isLoading} isLoading={isLoading}>
                    Upload {files.length > 0 ? `${files.length} Image${files.length > 1 ? 's' : ''}` : 'Image'}
                </Button>
            </div>
        </form>
    );
};
