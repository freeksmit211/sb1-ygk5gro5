import React, { useRef, useState } from 'react';
import { Upload, Loader } from 'lucide-react';

interface DocumentUploadButtonProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  disabled?: boolean;
  label?: string;
}

const DocumentUploadButton: React.FC<DocumentUploadButtonProps> = ({
  onUpload,
  accept = ".pdf,.doc,.docx",
  disabled = false,
  label = "Upload Document"
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await onUpload(file);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
        disabled={disabled || uploading}
        id="document-upload"
      />
      <label
        htmlFor="document-upload"
        className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
          (disabled || uploading) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            <span>{label}</span>
          </>
        )}
      </label>
    </div>
  );
};

export default DocumentUploadButton;