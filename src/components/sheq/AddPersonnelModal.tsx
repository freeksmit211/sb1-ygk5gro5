import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addPersonnel } from '../../services/sheqService';
import { DocumentUpload } from './DocumentUpload';

interface AddPersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onPersonnelAdded: () => void;
}

const DOCUMENT_TYPES = [
  'medicals',
  'inductions',
  'first_aid_training',
  'firefighting_training',
  'legal_liability',
  'safety_documents'
] as const;

type DocumentType = typeof DOCUMENT_TYPES[number];

const AddPersonnelModal: React.FC<AddPersonnelModalProps> = ({
  isOpen,
  onClose,
  companyId,
  onPersonnelAdded
}) => {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    position: '',
    contactNumber: ''
  });

  const [files, setFiles] = useState<Record<DocumentType, File | null>>({
    medicals: null,
    inductions: null,
    first_aid_training: null,
    firefighting_training: null,
    legal_liability: null,
    safety_documents: null
  });

  const [expiryDates, setExpiryDates] = useState<Record<DocumentType, string>>({
    medicals: '',
    inductions: '',
    first_aid_training: '',
    firefighting_training: '',
    legal_liability: '',
    safety_documents: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await addPersonnel(companyId, formData, files, expiryDates);
      onPersonnelAdded();
      onClose();
    } catch (error) {
      console.error('Error adding personnel:', error);
      setError('Failed to add personnel. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto py-4">
      <div className="relative bg-white rounded-lg w-full max-w-2xl my-auto">
        <div className="sticky top-0 px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg z-10">
          <h3 className="text-xl font-bold text-white">Add Site Personnel</h3>
          <button 
            onClick={onClose} 
            className="text-white hover:text-blue-100"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Number</label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Required Documents</h4>
              <div className="space-y-6">
                {DOCUMENT_TYPES.map((type) => (
                  <DocumentUpload
                    key={type}
                    type={type}
                    file={files[type]}
                    expiryDate={expiryDates[type]}
                    onFileChange={(file) => setFiles(prev => ({ ...prev, [type]: file }))}
                    onExpiryChange={(date) => setExpiryDates(prev => ({ ...prev, [type]: date }))}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Personnel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPersonnelModal;