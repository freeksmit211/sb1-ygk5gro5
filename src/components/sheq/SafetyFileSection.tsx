import React, { useState } from 'react';
import { FileText, Calendar, AlertTriangle, Upload, Download } from 'lucide-react';
import { CompanyDocument } from '../../types/sheq';
import { supabase } from '../../lib/supabase';

interface SafetyFileSectionProps {
  companyId: string;
  document?: CompanyDocument;
  onDocumentUpdated: () => void;
}

const SafetyFileSection: React.FC<SafetyFileSectionProps> = ({
  companyId,
  document,
  onDocumentUpdated
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload file to Supabase Storage
      const filePath = `companies/${companyId}/safety-files/${Date.now()}_${file.name}`;
      const { error: uploadError, data } = await supabase.storage
        .from('sheq')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('sheq')
        .getPublicUrl(filePath);

      // Update company document in Supabase
      const { error: updateError } = await supabase
        .from('sheq_companies')
        .update({
          documents: document 
            ? [...(document?.id ? [] : []), {
                id: document?.id || crypto.randomUUID(),
                fileUrl: publicUrl,
                fileName: file.name,
                type: 'safetyFile',
                expiryDate: document?.expiryDate || new Date().toISOString(),
                uploadedAt: new Date().toISOString()
              }]
            : [{
                id: crypto.randomUUID(),
                fileUrl: publicUrl,
                fileName: file.name,
                type: 'safetyFile',
                expiryDate: new Date().toISOString(),
                uploadedAt: new Date().toISOString()
              }]
        })
        .eq('id', companyId);

      if (updateError) throw updateError;

      clearInterval(progressInterval);
      setUploadProgress(100);
      onDocumentUpdated();

    } catch (error) {
      console.error('Error uploading safety file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (days < 0) return { color: 'bg-red-100 text-red-800', text: 'Expired' };
    if (days <= 30) return { color: 'bg-yellow-100 text-yellow-800', text: `Expires in ${days} days` };
    return { color: 'bg-green-100 text-green-800', text: 'Valid' };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Safety File</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx"
            id="safety-file-upload"
            disabled={uploading}
          />
          <label
            htmlFor="safety-file-upload"
            className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{document ? 'Update File' : 'Upload File'}</span>
          </label>
          
          {document && (
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>

      {uploading && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 text-right">{uploadProgress}% uploaded</p>
        </div>
      )}

      {document ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current File</p>
              <p className="font-medium text-gray-900">{document.fileName}</p>
            </div>
            {document.expiryDate && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                getExpiryStatus(document.expiryDate).color
              }`}>
                {getExpiryStatus(document.expiryDate).text}
              </span>
            )}
          </div>

          {document.expiryDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Expires: {formatDate(document.expiryDate)}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <p>No safety file uploaded yet</p>
          <p className="text-sm mt-2">Upload a safety file to get started</p>
        </div>
      )}
    </div>
  );
};

export default SafetyFileSection;