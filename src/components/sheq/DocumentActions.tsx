import React, { useRef, useState } from 'react';
import { Upload, Download, Loader } from 'lucide-react';
import { uploadFile } from '../../services/sheq/upload';

interface DocumentActionsProps {
  documentId: string;
  documentType: string;
  companyId: string;
  onUploadComplete: (fileUrl: string) => Promise<void>;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  documentId,
  documentType,
  companyId,
  onUploadComplete
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      // Simulated progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const fileUrl = await uploadFile(file, `sheq/companies/${companyId}/${documentType}`);
      
      // Clear interval and set to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      await onUploadComplete(fileUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx"
          id={`file-upload-${documentId}`}
        />
        <label
          htmlFor={`file-upload-${documentId}`}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {uploading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Upload New</span>
            </>
          )}
        </label>
        <button
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Download</span>
        </button>
      </div>

      {uploading && (
        <div className="w-full">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 text-right">{uploadProgress}%</p>
        </div>
      )}
    </div>
  );
};

export default DocumentActions;