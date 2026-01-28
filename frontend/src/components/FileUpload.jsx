import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setError(null);
            setSuccess(false);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess(true);
            onUploadSuccess(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload Dataset
            </h3>

            <div className="flex flex-col gap-4">
                <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer">
                    <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                        {file ? (
                            <FileText className="w-8 h-8 text-blue-500" />
                        ) : (
                            <Upload className="w-8 h-8 text-slate-400" />
                        )}
                        <p className="text-sm text-slate-600 font-medium">
                            {file ? file.name : "Click or drag CSV or Excel here"}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded">
                        <XCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                {success && (
                    <div className="text-sm text-green-600 flex items-center gap-1 bg-green-50 p-2 rounded">
                        <CheckCircle className="w-4 h-4" /> Uploaded successfully!
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`w-full py-2.5 rounded-lg font-medium transition-all ${!file || uploading
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    {uploading ? 'Training Model...' : 'Upload & Train'}
                </button>
            </div>
        </div>
    );
};

export default FileUpload;
