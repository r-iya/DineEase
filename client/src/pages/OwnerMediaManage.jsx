import { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

const OwnerMediaManage = () => {
    const { id } = useParams();
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (files.length === 0) return toast.error('Please select images/videos');

        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('files', file));

        try {
            setIsUploading(true);
            await api.post(`/restaurants/${id}/media`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Media uploaded successfully!');
            setFiles([]);
            // Could fetch and show existing media here
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Restaurant Media</h1>
            <p className="text-gray-600 mb-8">Add high quality photos and videos of your establishment.</p>

            <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => setFiles(e.target.files)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 mb-6"
                />

                <button
                    type="submit"
                    disabled={isUploading || files.length === 0}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                >
                    {isUploading ? 'Uploading...' : <><Upload className="h-5 w-5" /> Upload Files</>}
                </button>
            </form>
        </div>
    );
};

export default OwnerMediaManage;
