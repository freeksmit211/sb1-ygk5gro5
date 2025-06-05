import React from 'react';
import { Upload } from 'lucide-react';

interface DocumentUploadProps {
  label: string;
  file: File | null;
  expiryDate: string;
  onFileChange: (file: File | null) => void;
  onExpiryChange: (date: string) => void;
  disabled?: boolean;
  progress?: number;
  type: 'medicals' | 'inductions' | 'first_aid_training' | 'firefighting_training' | 'legal_liability' | 'safety_documents';
}

const DOCUMENT_LABELS = {
  medicals: 'Medical Records',
  inductions: 'Induction Documents',
  first_aid_training: 'First Aid Training',
  firefighting_training: 'Firefighting Training',
  legal_liability: 'Legal Liability',
  safety_documents: 'Other Safety Documents'
};

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  file,
  expiryDate,
  onFileChange,
  onExpiryChange,
  disabled = false,
  progress,
  type
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">{DOCUMENT_LABELS[type]}</label>
        <div className="mt-1 flex items-center">
          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <Upload className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {file ? file.name : 'Choose file'}
            </span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx"
              disabled={disabled}
            />
          </label>
        </div>
        {file && (
          <p className="mt-1 text-sm text-gray-500">
            Selected file: {file.name}
          </p>
        )}
        {typeof progress === 'number' && progress > 0 && progress < 100 && (
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 text-right">{progress}%</p>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => onExpiryChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
          required={!!file}
          disabled={disabled}
        />
      </div>
    </div>
  );
};