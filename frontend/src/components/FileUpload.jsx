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
        <div className="p-6">
            <h3 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-indigo-600" />
                </div>
                Upload Dataset
            </h3>

            <div className="flex flex-col gap-4">
                <div className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center cursor-pointer group ${file ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                    }`}>
                    <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-3 pointer-events-none transition-transform group-hover:scale-105 duration-300">
                        {file ? (
                            <div className="p-3 bg-white rounded-full shadow-md">
                                <FileText className="w-8 h-8 text-indigo-500" />
                            </div>
                        ) : (
                            <div className="p-3 bg-white rounded-full shadow-sm">
                                <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />
                            </div>
                        )}
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-700">
                                {file ? file.name : "Click or drag file here"}
                            </p>
                            {!file && (
                                <p className="text-xs text-slate-500">Supports CSV & Excel</p>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="text-sm text-red-600 flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span className="leading-tight">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="text-sm text-emerald-600 flex items-center gap-2 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span className="font-medium">Uploaded & analyzed!</span>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform active:scale-[0.98] ${!file || uploading
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                        }`}
                >
                    {uploading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Processing...
                        </span>
                    ) : 'Upload & Process'}
                </button>
            </div>
        </div>
    );
};

export default FileUpload;
