import React, { useState } from 'react';
import { Personnel } from '../../types/sheq';
import { User, Calendar, AlertTriangle, ExternalLink, Upload, Download } from 'lucide-react';
import { uploadFile } from '../../services/sheq/upload';
import { supabase } from '../../lib/supabase';

interface PersonnelListProps {
  personnel: Personnel[];
  companyId: string;
  onDocumentUploaded: () => void;
}

const PersonnelList: React.FC<PersonnelListProps> = ({ 
  personnel,
  companyId,
  onDocumentUploaded
}) => {
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDocumentStatusColor = (expiryDate: string) => {
    const days = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (days < 0) return 'bg-red-100 text-red-800';
    if (days <= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const handleFileUpload = async (
    personnelId: string,
    type: 'medicals' | 'inductions',
    file: File
  ) => {
    try {
      setUploading(prev => ({ ...prev, [personnelId + type]: true }));

      // Upload file to storage
      const filePath = `sheq/personnel/${personnelId}/${type}`;
      const fileUrl = await uploadFile(file, filePath);

      // Add document record
      const { error } = await supabase
        .from('sheq_personnel_documents')
        .insert({
          personnel_id: personnelId,
          file_name: file.name,
          file_url: fileUrl,
          type,
          expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        });

      if (error) throw error;

      onDocumentUploaded();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [personnelId + type]: false }));
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  if (personnel.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p>No personnel registered yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {personnel.map(person => (
        <div key={person.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-gray-500" />
              <div>
                <h3 className="font-semibold text-gray-900">{person.name}</h3>
                <p className="text-sm text-gray-500">{person.position}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>ID: {person.idNumber}</p>
              <p>Contact: {person.contactNumber}</p>
            </div>

            <div className="space-y-4">
              {['medicals', 'inductions'].map((type) => {
                const doc = person.documents.find(d => d.type === type);
                const isUploading = uploading[person.id + type];

                return (
                  <div key={type} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        {type === 'medicals' ? 'Medical Records' : 'Induction Documents'}
                      </h4>
                    </div>

                    {doc ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className={`px-2 py-1 rounded-full text-xs ${getDocumentStatusColor(doc.expiryDate)}`}>
                            Expires: {formatDate(doc.expiryDate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm">View</span>
                          </a>
                          <button
                            onClick={() => handleDownload(doc.fileUrl, doc.fileName)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                          >
                            <Download className="w-4 h-4" />
                            <span className="text-sm">Download</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id={`file-${person.id}-${type}`}
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(person.id, type as 'medicals' | 'inductions', file);
                            }
                          }}
                          disabled={isUploading}
                        />
                        <label
                          htmlFor={`file-${person.id}-${type}`}
                          className={`flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer ${
                            isUploading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">
                            {isUploading ? 'Uploading...' : 'Upload Document'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PersonnelList;