import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addNotice } from '../../services/noticeService';

interface NewNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoticeAdded: () => void;
}

const NewNoticeModal: React.FC<NewNoticeModalProps> = ({ 
  isOpen, 
  onClose,
  onNoticeAdded 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addNotice(formData);
      onNoticeAdded();
      onClose();
    } catch (error) {
      console.error('Failed to add notice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">New Company Notice</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                rows={6}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewNoticeModal;