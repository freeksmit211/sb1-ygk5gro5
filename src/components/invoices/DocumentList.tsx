import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
  file_size: number;
}

interface DocumentListProps {
  invoiceId: string;
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ invoiceId, documents }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);

      if (error) throw error;

      // Create download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">No documents attached</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{doc.file_name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(doc.uploaded_at)}</span>
                <span>•</span>
                <span>{formatFileSize(doc.file_size)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleDownload(doc)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;