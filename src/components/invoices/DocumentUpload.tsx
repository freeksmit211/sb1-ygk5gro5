import React, { useRef, useState } from 'react';
import { Upload, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DocumentUploadProps {
  invoiceId: string;
  onUploadComplete: (fileUrl: string) => Promise<void>;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ invoiceId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      // Upload file to Supabase Storage
      const filePath = `invoices/${invoiceId}/${Date.now()}_${file.name}`;
      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      await onUploadComplete(publicUrl);

      // Reset form
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx"
        id="document-upload"
        disabled={uploading}
      />
      <label
        htmlFor="document-upload"
        className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
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
            <span>Upload Document</span>
          </>
        )}
      </label>

      {uploading && uploadProgress > 0 && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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

export default DocumentUpload;